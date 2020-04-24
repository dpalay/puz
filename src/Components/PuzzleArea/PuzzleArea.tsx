import React, { useState } from 'react'
import Word from '../../Type/word';
import WordList from './WordList';
import WordEntry from './WordEntry';
import { Grid, Table, TableRow, TableCell } from 'semantic-ui-react';
import Puzzle from './GenPuzzle'

interface Iprops {

}

const PuzzleArea: React.FC<Iprops> = (props: Iprops) => {
    const [words, setWords] = useState<Word[]>([])
    const puzzle = new Puzzle(words,4)
    return (
        <Grid divided padded={"vertically"} relaxed style={{height: '95vh'}}>
            <Grid.Row color="blue" >
                <Grid.Column width={3}>
                    <WordEntry setWords={setWords} words={words}></WordEntry>
                    <WordList words={words}></WordList>
                </Grid.Column>
                <Grid.Column width={10}>
                    {words.length > 0 ? (<Table celled>    
                    {puzzle.board.map(row => (
                        <TableRow>
                            {row.map(cell => (
                                <TableCell textAlign="center" verticalAlign="middle">
                                    {cell.value}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                    </Table>) : "Add some words!"}
                    </Grid.Column> 
            </Grid.Row>
        </Grid>

    )

}

export default PuzzleArea;