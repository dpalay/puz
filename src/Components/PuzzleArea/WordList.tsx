import React from 'react'
import { List, Tooltip } from 'antd'
import { Word } from '../../Classes';
import { CloseCircleOutlined } from '@ant-design/icons';

interface Iprops {
    handleSelect: (word: Word) => void
    words: Word[]
    removeWord: (word: Word) => void
    selectedWord: Word | null
}



const WordList: React.FC<Iprops> = (props: Iprops) => {
    const { words, handleSelect, removeWord, selectedWord } = props
    const computeStyle = (word: Word) => {
        if (word === selectedWord) {
            return { background: "green" }
        }
    }

    return (
        <List size="small" dataSource={words} style={{maxHeight: "60vh", overflow:"auto", scrollBehavior: "smooth"}} renderItem={word => (
            <List.Item key={word.id} onClick={() => handleSelect(word)} style={{ cursor: "default", ...computeStyle(word) }} onContextMenu={(e: React.SyntheticEvent) => { e.preventDefault(); removeWord(word) }}>
                <Tooltip title="Remove">
                    <CloseCircleOutlined onClick={() => { removeWord(word) }} style={{ color: "red" }} />
                </Tooltip>
                {word.toString()}
            </List.Item>)} />


    )

}

export default WordList;