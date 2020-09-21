import * as functions from 'firebase-functions';
import Puzzle from './Puzzle';
import Word from './Word'

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const makePuzzle = functions.https.onRequest((request, response) => {

functions.logger.info("Puzzle creation!", request.body.wordList)

let wordList: string[] = request.body.wordList
wordList = wordList.map((word) => word.toUpperCase())
let puzzle = new Puzzle(wordList.map((word) => new Word(word)),3)

response.send(puzzle.board.map(row => row.map(cell => {return {value: cell.value, words: cell.words}})))
})