import React, { useState, useMemo } from 'react'
import Word from '../../Type/word';
import WordList from './WordList';
import WordEntry from './WordEntry';
import { Grid, Table, TableRow, TableCell, Icon, Button } from 'semantic-ui-react';
import Puzzle from './GenPuzzle'

interface Iprops {

}


const PuzzleArea: React.FC<Iprops> = (props: Iprops) => {
    const [words, setWords] = useState<Word[]>([])
    const [showFill, setShowFill] = useState<boolean>(true)
    const [selectedWordId, setSelectedWordId] = useState<string>("")
    const puzzle = useMemo(() => new Puzzle(words, 4), [words])

    const cellsForWord = puzzle.cells().filter(cell => cell.words.some(id => id === selectedWordId))

    const computeStyle = (cell: {id: string}) => {
        
        if (cellsForWord.some(cellforword => cellforword.id === cell.id)){
            return {background: '#E60'}
        }
        return { background: '#CCC' }
    }
    return (
        <Grid divided padded={"vertically"} relaxed style={{ height: '95vh' }}>
            <Grid.Row color="blue" >
                <Grid.Column width={3}>
                    <Button onClick={() => setShowFill(!showFill)} content="Toggle Filler" />
                    <WordEntry setWords={setWords} words={words}></WordEntry>
                    <WordList words={words} setSelectedWordId={setSelectedWordId}></WordList>
                </Grid.Column>
                <Grid.Column width={10}>
                    {words.length > 0 ? (
                        <Table celled>
                            <Table.Body>
                                {puzzle.board.map(row => (
                                    <TableRow>
                                        {row.map(cell => (
                                            <TableCell textAlign="center" verticalAlign="middle" style={computeStyle(cell)} key={cell.id}>
                                                {cell.garbage ? (showFill ? cell.value : <Icon name="trash" size="tiny" />) : cell.value}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </Table.Body>
                        </Table>) : "Add some words!"}
                </Grid.Column>
            </Grid.Row>
        </Grid>

    )

}

export default PuzzleArea;