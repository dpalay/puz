import React from 'react'
import { List, Tooltip } from 'antd'
import { Word } from '../../../Classes';
import { CloseCircleOutlined } from '@ant-design/icons';
import {wordList, selectedWord as selectedWordAtom} from '../../../Recoil'
import {useRecoilState} from 'recoil'
import './WordList.css'



interface Iprops {
}



const WordList: React.FC<Iprops> = (props: Iprops) => {
    const [words, setWords] = useRecoilState(wordList)
    const [selectedWord, setSelectedWord] = useRecoilState(selectedWordAtom)
    const computeStyle = (word: Word) => {
        if (word === selectedWord) {
            return { background: "green" }
        }
    }
    const removeWord = (wordToRemove: Word) => {
        setWords(words.filter(word => word !== wordToRemove))
    }
    const handleSelect = (wordToSelect: Word) => {
        if (selectedWord === wordToSelect) { setSelectedWord(undefined) }
        else { setSelectedWord(wordToSelect) }
    }

    return (
        <List className="word_list" size="small" dataSource={words} renderItem={word => (
            <List.Item key={word.id} onClick={() => handleSelect(word)} style={{ cursor: "default", ...computeStyle(word) }} onContextMenu={(e: React.SyntheticEvent) => { e.preventDefault(); removeWord(word) }}>
                <Tooltip title="Remove">
                    <CloseCircleOutlined onClick={() => removeWord(word) } style={{ color: "red" }} />
                </Tooltip>
                {word.word}
            </List.Item>)} />


    )

}

export default WordList;