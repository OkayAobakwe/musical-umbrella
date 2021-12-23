
import { getOptionsToVote } from '@/utils/getRandomPokemon'
import type { NextPage } from 'next'

const Home: NextPage = () => {
  const [firstId, secondId] = getOptionsToVote()
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center">Which Pokemon is Hotter?</div>
      <div className="p-3"/>
      <div className="border rounded p-8 flex justify-between items-center max-w-2xl">
        <div className="w-16 h-16">{firstId}</div>
        <div className="p-8">vs</div>
        <div className="w-16 h-16">{secondId}</div>
      </div>
    </div>
  )
}

export default Home
