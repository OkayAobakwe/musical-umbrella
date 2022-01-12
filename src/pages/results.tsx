import { FC } from "react"

import { GetServerSideProps } from "next"
import { prisma } from "@/backend/utils/prisma"
import { AsyncReturnType } from "@/utils/ts-bs"
import Image from "next/image"


const getPokemonInOrder = async () => {
  return await prisma.pokemon.findMany({
    orderBy: {
      votedFor: { _count: "desc"}
    },
    select: {
      id: true,
      name: true,
      spriteUrl: true,
      _count: {
        select: {
          votedFor: true,
          votedAgainst: true
        }
      }
    }
  })
}

type PokemonQueryType = AsyncReturnType<typeof getPokemonInOrder>

const generateCountPercentage = (pokemon: PokemonQueryType[number]) => {
  const {votedFor, votedAgainst} = pokemon._count
  if(votedFor + votedAgainst === 0){
    return 0
  }
  return (votedFor / (votedFor + votedAgainst)) * 100
}

const PokemonListing: FC<{pokemon: PokemonQueryType[number]}> = (props) => {
  return(
    <div className="flex items-center border-b p-1 justify-between">
      <div className="flex items-center">
        <Image 
          className="w-full" 
          src={props.pokemon.spriteUrl} 
          width={156} 
          height={156}
          layout="fixed"
        />
        <div className="capitalize">{props.pokemon.name}</div>
      </div>
      <div className="pr-3">{generateCountPercentage(props.pokemon) + "%"} </div>
    </div>
  )
}
const ResultsPage: FC<{
  pokemon: PokemonQueryType
}> = (props) => {
  return(
    <div className="flex flex-col items-center">
      <h2 className="text-2xl p-3">Result</h2>
      <div className="flex flex-col w-full max-w-2xl border">
        {props.pokemon.map((currentPokemon, index) => (
          <PokemonListing pokemon={currentPokemon} key={index}/>
        ))}
      </div>
    </div>
  )
}

export const getStaticProps: GetServerSideProps = async () => {
  const pokemonOrdered = await getPokemonInOrder()

  return { props: { pokemon: pokemonOrdered }, revalidate: 60}
}

export default ResultsPage