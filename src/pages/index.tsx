import { useState, FC } from 'react'
import { getOptionsToVote } from '@/utils/getRandomPokemon'
import { trpc } from '@/utils/trpc'
import type { NextPage } from 'next'
import { inferQueryResponse } from './api/trpc/[trpc]'

import Image from 'next/image'
import Link from 'next/link'

const btn =
  "text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-gray-600 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-800"

const Home: NextPage = () => {
  const [ids, setIds] = useState(() => getOptionsToVote())
  const [firstId, secondId] = ids
  const firstPokemon = trpc.useQuery(["get-pokemon-by-id", {
    id: firstId
  }])
  const secondPokemon = trpc.useQuery(["get-pokemon-by-id", {
    id: secondId
  }])
  const voteMutation = trpc.useMutation(["cast-vote"])

  const voteForHottest = ( selected: number) => {
    //todo fire mutation to persist changes
    selected === firstId ? 
      voteMutation.mutate({ votedFor: firstId, votedAgainst: secondId}) :
      voteMutation.mutate({ votedFor: secondId, votedAgainst: firstId})
     
    setIds(getOptionsToVote())
  }

  const dataLoaded = 
    !firstPokemon.isLoading &&
    firstPokemon.data && 
    !secondPokemon.isLoading &&
    secondPokemon.data

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center relative">
      <div className="text-2xl text-center">Which Pokemon is Hotter?</div>
      <div className="p-3"/>
      <div className="p-8 flex justify-between items-center max-w-2xl flex-col md:flex-row">
        {dataLoaded &&(
          <>
            <PokemonListing
              pokemon={firstPokemon.data}
              vote={() => voteForHottest(firstId)}
            />
            <div className="p-8 text-xl">vs</div>
            <PokemonListing 
              pokemon={secondPokemon.data}
              vote={() => voteForHottest(secondId)}
              />
          </>
        )}
        <div className="p-4"/>
      </div>
      {!dataLoaded && (<img src="/circles.svg" className="w-48"/>)}
      <div className='absolute bottom-0 w-full text-xl text-center'>
        <a href="https://github.com/OkayAobakwe/musical-umbrella">Github</a> {" | "}
        <Link href="/results"><a>Results</a></Link>
      </div>
    </div>
  )
}

type PokemonFromServer = inferQueryResponse<"get-pokemon-by-id">

const PokemonListing: FC<{pokemon: PokemonFromServer, vote: () => void}> = (props) => {

  return(
    <div className="flex flex-col items-center">
      <Image 
        className="w-full" 
        src={props.pokemon.spriteUrl} 
        width={156} 
        height={156}
        layout="fixed"
      />
      <div className="text-xl text-center capitalize">{props?.pokemon.name}</div>
      <button className={btn} onClick={() => props.vote()}>hotter</button>
    </div>
  )
}
export default Home
