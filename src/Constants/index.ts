import alpha from './alpha'
import states from './stateList'
import countries from './countryList'
import golarianDieties from './golarianDieties'
import commonWords from './commonWords'

const puzzles: {name: string, words: string[]}[] = [
    {name: "Most common English Words", words: commonWords},
    {name: "states", words: states}, 
    {name: "countries", words: countries},
    {name: "Pathfinder Deities", words: golarianDieties}

]
export {alpha, puzzles}