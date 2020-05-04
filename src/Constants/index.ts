import alpha from './alpha'
import states from './stateList'
import countries from './countryList'
import golarianDieties from './golarianDieties'
import commonWords from './commonWords'
import finalfantasy7 from './finalfantasyvii'

const puzzles: {name: string, words: string[]}[] = [
    {name: "States", words: states}, 
    {name: "Countries", words: countries},
    {name: "Pathfinder Deities", words: golarianDieties},
    {name: "Final Fantasy 7", words: finalfantasy7},
    {name: "Most common English Words", words: commonWords},

]
export {alpha, puzzles}