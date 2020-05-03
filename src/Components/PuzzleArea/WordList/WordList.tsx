import React from 'react'
import { List, Tooltip } from 'antd'
import { Word } from '../../../Classes';
import { CloseCircleOutlined } from '@ant-design/icons';
import './WordList.css'

interface Iprops {
    words: Word[]
    selectedWord: Word | null
    setWords: React.Dispatch<React.SetStateAction<Word[]>>
    setSelectedWord: React.Dispatch<React.SetStateAction<Word | null>>
}



const WordList: React.FC<Iprops> = (props: Iprops) => {
    const { words, setSelectedWord,  selectedWord, setWords } = props
    const computeStyle = (word: Word) => {
        if (word === selectedWord) {
            return { background: "green" }
        }
    }
    const removeWord = (wordToRemove: Word) => {
        setWords(words.filter(word => word !== wordToRemove))
    }
    const handleSelect = (wordToSelect: Word) => {
        if (selectedWord === wordToSelect) { setSelectedWord(null) }
        else { setSelectedWord(wordToSelect) }
    }

    return (
        <List className="word_list" size="small" dataSource={words} renderItem={word => (
            <List.Item key={word.id} onClick={() => handleSelect(word)} style={{ cursor: "default", ...computeStyle(word) }} onContextMenu={(e: React.SyntheticEvent) => { e.preventDefault(); removeWord(word) }}>
                <Tooltip title="Remove">
                    <CloseCircleOutlined onClick={() => removeWord(word) } style={{ color: "red" }} />
                </Tooltip>
                {word.toString()}
            </List.Item>)} />


    )

}

export default WordList;