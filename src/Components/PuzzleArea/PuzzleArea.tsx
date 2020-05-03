import React, { useState } from 'react'
import { Puzzle, Word } from '../../Classes'
import {PuzCell, WordEntry, WordList, ClueList} from './'
import { Row, Col, Button, Affix } from 'antd'
import { useDropzone } from 'react-dropzone'
import usePromise from 'react-use-promise'
import './PuzzleArea.css'
import DebugPuz from '../../Classes/debugPuz'



interface Iprops {
    words: Word[]
    setWords: React.Dispatch<React.SetStateAction<Word[]>>
}


const PuzzleArea: React.FC<Iprops> = (props: Iprops) => {
    const { words, setWords } = props;
    const minLength = 4
    const [showFill, setShowFill] = useState<boolean>(true)
    const [selectedWord, setSelectedWord] = useState<Word | null>(null)
    const newPuz = (words: Word[]): Promise<Puzzle> => new Promise<Puzzle>((res,rej) => {
        let puz = new Puzzle(words,minLength)
        res(puz);
    })

    const [puzzle, , status] = usePromise<Puzzle>(newPuz(words),[words])

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

    const onDrop = (acceptedFiles: File[]) => {
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
                            matches.push(new Word(word))
                        })
                }
                if (matches.length > 0) { addWord(matches) }
            }
            reader.readAsText(file)
        })
    }

    const { getRootProps, getInputProps } = useDropzone({ onDrop, noClick: true, noKeyboard: true })

    const cellsForWord = puzzle ? puzzle.cells().filter(cell => { if (selectedWord) { return cell.words.includes(selectedWord) } else return false }) : []
    console.log(status)
    return ( status === "resolved" ? (
        <div {...getRootProps()} >
            <input {...getInputProps()} />
            <Row  gutter={16} >
                <Col span={18}  order={2}>
                    <Row>
                        {words.length > 0 ? (
                            <table className="puzTable">
                                <tbody>
                                    {puzzle?.board.slice(1, puzzle.board.length - 1).map((row, i) => (
                                        <tr key={`row${i}`}>
                                            {row.slice(1, row.length - 1).map(cell => (
                                                <PuzCell key={cell.id} cell={cell} showFill={showFill} cellsForWord={cellsForWord} />
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : "Add some words!"}
                    </Row>
                    <Row className="only-print">
                        <ClueList words={words} />
                    </Row>
                </Col>
                <Col span={4} order={1} className={"no-print"}>
                <Affix offsetTop={10}>
                    <Button onClick={() => setShowFill(!showFill)} type="primary" disabled={words.length === 0}>Toggle Filler</Button>
                    <WordEntry setWords={setWords} words={words} setSelectedWord={setSelectedWord} minLength={minLength} />
                    <WordList setWords={setWords} words={words} selectedWord={selectedWord} setSelectedWord={setSelectedWord}  />
                </Affix>
                </Col>
            </Row>
        </div>) : 
        <div>Loading!</div>
    )

}

export default PuzzleArea;