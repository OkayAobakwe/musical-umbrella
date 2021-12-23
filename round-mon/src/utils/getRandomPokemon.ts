
const MAX_DEX_ID = 493
export const getRandomPokemon: (notThisOne?: number) => number = (notThisOne) => {
  const pokedexNum = Math.floor(Math.random() * MAX_DEX_ID) + 1
  if(pokedexNum !== notThisOne) return pokedexNum

  return getRandomPokemon(notThisOne)
}

export const getOptionsToVote = () => {
  const firstId = getRandomPokemon();
  const secondId = getRandomPokemon(firstId)
  
  return [firstId, secondId]
}