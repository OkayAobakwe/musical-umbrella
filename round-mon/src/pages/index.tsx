import { useState } from 'react'
import { getOptionsToVote } from '@/utils/getRandomPokemon'
import { trpc } from '@/utils/trpc'
import type { NextPage } from 'next'

const Home: NextPage = () => {
  const [ids, setIds] = useState(() => getOptionsToVote())
  const [firstId, secondId] = ids
  const firstPokemon = trpc.useQuery(["get-pokemon-by-id", {
    id: firstId
  }])
  const secondPokemon = trpc.useQuery(["get-pokemon-by-id", {
    id: secondId
  }])

  if(firstPokemon.isLoading || secondPokemon.isLoading) return null;

  console.log(firstPokemon.data)
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center">Which Pokemon is Hotter?</div>
      <div className="p-3"/>
      <div className="p-8 flex justify-between items-center max-w-2xl">
        <div className="w-44 h-44 flex flex-col">
          <img className="w-full"src={firstPokemon.data?.sprites.front_default || undefined} />
          <div className="text-xl text-center capitalize">{firstPokemon.data?.name}</div>
        </div>
        <div className="p-8">vs</div>
        <div className="w-44 h-44 flex flex-col">
          <img src={secondPokemon.data?.sprites.front_default || undefined} className="w-full"/>
          <div className="text-xl text-center capitalize">{secondPokemon.data?.name}</div>
        </div>
        <div className="p-4"/>
      </div>
    </div>
  )
}

export default Home
