import { Row } from "antd";
import React, { useMemo } from "react";
import { ClueList, PuzCell } from "..";
import ReturnData from "../../../../functions/src/returnData";
import {Puzzle, Word} from '../../../Classes'
import {AxiosError} from 'axios'

interface IProps {
    data: ReturnData    
    words: Word[]
    showFill: boolean
    loading: boolean
    error: AxiosError<any> | undefined
    selectedWord?: Word
}


const PuzContainer: React.FC<IProps> = (props: IProps) => {
    const {data, words, showFill, loading, error, selectedWord} = props

    let puzzle = useMemo(() => {
        if (data && data.puzzle && data.lettersUsed && data.status === "success") {
          return new Puzzle(data.puzzle, data.lettersUsed);
        }
      }, [data]);

      if (loading) { return <p>Loading!</p>}
  return (
  <>
  <Row>
  {words.length > 0 ? (
    <table className="puzTable">
      <tbody>
        {puzzle?.board
          .slice(1, puzzle.board.length - 1)
          .map((row, i) => (
            <tr key={`row${i}`}>
              {row.slice(1, row.length - 1).map((cell) => (
                <PuzCell
                  key={cell.id}
                  cell={cell}
                  showFill={showFill}
                  selectedWordId={selectedWord?.id}
                />
              ))}
            </tr>
          ))}
      </tbody>
    </table>
  ) : (
    "Add some words!"
  )}
</Row>
<Row className="only-print">
  <ClueList words={words} />
</Row>
</>)
};

export default PuzContainer;
