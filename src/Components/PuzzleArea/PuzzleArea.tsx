import React, { useState, useMemo } from 'react'
import { Puzzle, Word } from '../../Classes'
import WordList from './WordList';
import WordEntry from './WordEntry';
import { Grid, Table, TableRow, TableCell, Icon, Button } from 'semantic-ui-react';

interface Iprops {

}


const PuzzleArea: React.FC<Iprops> = (props: Iprops) => {

    const [showFill, setShowFill] = useState<boolean>(true)
    const [words, setWords] = useState<Word[]>([new Word("Test"), new Word("Hello there"), new Word("General Kenobi")])
    const [selectedWord, setSelectedWord] = useState<Word|null>(null)
    const puzzle = useMemo(() => new Puzzle(words, 4), [words])

    const removeWord = (wordToRemove: Word) => {
        setWords(words.filter(word => word !== wordToRemove))
    }


    const cellsForWord = puzzle.cells().filter(cell => {if (selectedWord) {return cell.words.includes(selectedWord)} else return false})
    const computeStyle = (cell: { id: string }) => {
        
        if (cellsForWord.some(cellforword => cellforword.id === cell.id)) {
            return { background: '#E60' }
        }
        return { background: '#CCC' }
    }
    return (
        <Grid divided padded={"vertically"} relaxed style={{ height: '95vh' }}>
            <Grid.Row color="blue" >
                <Grid.Column width={3}>
                    <Button onClick={() => setShowFill(!showFill)} content="Toggle Filler" />
                    <WordEntry setWords={setWords} words={words}></WordEntry>
                    <WordList words={words} setSelectedWordId={setSelectedWord} removeWord={removeWord}></WordList>
                </Grid.Column>
                <Grid.Column width={10}>
                    {words.length > 0 ? (
                        <Table celled>
                            <Table.Body>
                                {puzzle.board.map((row, i) => (
                                    <TableRow key={`row${i}`}>
                                        {row.map(cell => (
                                            <TableCell textAlign="center" verticalAlign="middle" style={computeStyle(cell)} key={cell.id} onClick={() => console.log(cell)}>
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