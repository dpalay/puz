import React, { useState, useMemo, useCallback } from 'react'
import { Puzzle, Word } from '../../Classes'
import WordList from './WordList';
import WordEntry from './WordEntry';
import { Grid, Table, TableRow, TableCell, Icon, Button } from 'semantic-ui-react';
import { useDropzone } from 'react-dropzone'


interface Iprops {

}


const PuzzleArea: React.FC<Iprops> = (props: Iprops) => {
    const minLength = 4
    const [showFill, setShowFill] = useState<boolean>(true)
    const [words, setWords] = useState<Word[]>([new Word("Test"), new Word("Hello there"), new Word("General Kenobi")])
    const [selectedWord, setSelectedWord] = useState<Word | null>(null)
    const puzzle = useMemo(() => new Puzzle(words, 4), [words])
    const addWord = (word: Word | string | Word[]) => {
        if (typeof word === 'string') {
            setWords([...words, new Word(word)].sort((a, b) => b.length - a.length))
        }
        else if (word instanceof Array) {
            setWords([...words, ...word].sort((a, b) => b.length - a.length))
        }
        else {
            setWords([...words, word].sort((a, b) => b.length - a.length))
        }
    }

    const onDrop = useCallback(acceptedFiles => {
        acceptedFiles.forEach((file: File) => {
            const reader = new FileReader()

            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = () => {
                // Do whatever you want with the file contents
                const text = reader.result
                console.log(text)
                console.log(typeof text)
                let matches: Word[] = []
                if (typeof text === 'string') {
                    text
                        .split("\n")
                        .map(line => line.trim().toUpperCase())
                          .filter(line => !line.match(/[^A-Z ]/g))
                          .filter(line => !(line.length < minLength))
                          .filter(line => !words.map(word => word.word).includes(line))
                        .forEach(word => { 
                            console.log(`adding word ${word} with length: ${word.length}`); 
                            matches.push(new Word(word)) })
                }
                if (matches.length > 0) { addWord(matches) }
            }
            reader.readAsText(file)
        })
    }, [])
    const { getRootProps, getInputProps } = useDropzone({ onDrop, noClick:true, noKeyboard:true })

    const removeWord = (wordToRemove: Word) => {
        setWords(words.filter(word => word !== wordToRemove))
    }

    const handleSelect = (wordToSelect: Word) => {
        if (selectedWord === wordToSelect) { setSelectedWord(null) }
        else { setSelectedWord(wordToSelect) }
    }


    const cellsForWord = puzzle.cells().filter(cell => { if (selectedWord) { return cell.words.includes(selectedWord) } else return false })
    const computeStyle = (cell: { id: string }) => {
        if (cellsForWord.some(cellforword => cellforword.id === cell.id)) {
            return { background: '#E60' }
        }
        return { background: '#CCC' }
    }
    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            <Grid divided padded={"vertically"} relaxed style={{ height: '95vh' }}>
                <Grid.Row color="blue" >
                    <Grid.Column width={3} className={"no-print"}>
                        <Button onClick={() => setShowFill(!showFill)} content="Toggle Filler" />
                        <WordEntry setWords={setWords} words={words} setSelectedWord={setSelectedWord} minLength={minLength} />
                        <WordList words={words} selectedWord={selectedWord} handleSelect={handleSelect} removeWord={removeWord} />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        {words.length > 0 ? (
                            <Table celled>
                                <Table.Body>
                                    {puzzle.board.slice(1,puzzle.board.length-1).map((row, i) => (
                                        <TableRow key={`row${i}`}>
                                            {row.slice(1,row.length-1).map(cell => (
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
        </div>

    )

}

export default PuzzleArea;