import { useState, FC } from 'react'
import { getOptionsToVote } from '@/utils/getRandomPokemon'
import { trpc } from '@/utils/trpc'
import type { NextPage } from 'next'
import { inferQueryResponse } from './api/trpc/[trpc]'

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

  const voteForHottest = ( selected: number) => {
    //todo fire mutation to persist changes

    setIds(getOptionsToVote())
  }

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center">Which Pokemon is Hotter?</div>
      <div className="p-3"/>
      <div className="p-8 flex justify-between items-center max-w-2xl">
        {!firstPokemon.isLoading && firstPokemon.data
          && !secondPokemon.isLoading && secondPokemon.data
          && (
            <>
              <PokemonListing
                pokemon={firstPokemon.data}
                vote={() => voteForHottest(firstId)}
              />
              <div className="p-8">vs</div>
              <PokemonListing 
                pokemon={secondPokemon.data}
                vote={() => voteForHottest(secondId)}
                />
            </>
          )
        }
        <div className="p-4"/>
      </div>
    </div>
  )
}

type PokemonFromServer = inferQueryResponse<"get-pokemon-by-id">

const PokemonListing: FC<{pokemon: PokemonFromServer, vote: () => void}> = (props) => {

  return(
    <div className="w-44 h-44 flex flex-col items-center">
      <img className="w-full"src={props.pokemon.sprites.front_default || undefined} />
      <div className="text-xl text-center capitalize">{props?.pokemon.name}</div>
      <button className={btn} onClick={() => props.vote()}>hotter</button>
    </div>
  )
}
export default Home
