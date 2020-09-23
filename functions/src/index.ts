import * as functions from "firebase-functions";
import * as cors from "cors";
import Puzzle from "./Puzzle";
import Word from "./Word";
import ReturnData from "./returnData";


const  corsHandler = cors({origin: true})


export const makePuzzle = functions.https.onRequest( 
  (request, response: functions.Response<ReturnData>) => {
    corsHandler(request, response, () => {
      functions.logger.info("Puzzle creation!", request.body.wordList);
      let wordList: Word[] = request.body.wordList || [];

      functions.logger.info("wordList", wordList);
      //TODO:  Validate word list, reply with error if not proper

      if (wordList.length === 0) {
        response.send({ status: "empty" });
      } else {
        wordList = wordList.map((word) => {
          return { ...word, word: word.word.toUpperCase() };
        });
        functions.logger.info("wordList after map", wordList);
        let puzzle = new Puzzle(wordList, 3);
        response.send({
          puzzle: puzzle.board.map((row) =>
            row.map((cell) => {
              return { value: cell.value, words: cell.words };
            })
          ),
          lettersUsed: puzzle.lettersUsed,
          status: "success",
        });
      }
    });
  }
);
