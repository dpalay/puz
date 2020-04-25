import React from 'react'
import { List } from 'semantic-ui-react'
import { Word } from '../../Classes';

interface Iprops {
    handleSelect: (word: Word) => void
    words: Word[]
    removeWord: (word: Word) => void
    selectedWord: Word | null
}



const WordList: React.FC<Iprops> = (props: Iprops) => {
    const { words,  handleSelect, removeWord, selectedWord } = props
    const computeStyle = (word: Word) => {
        if (word === selectedWord){
            return {background: "green"}
        }
    }
    
    return (
        <List>
            {words.map(word => (
                <List.Item key={word.id} >
                    <List.Icon color="red" className="Icon" name="x" onClick={(e:any,i:any) => {console.log(e);console.log(i); removeWord(word)}}/>
                    <List.Content onClick={() => handleSelect(word)} style={computeStyle(word)}>
                        {word.toString()}
                    </List.Content>
                </List.Item>
            ))}
        </List>
    )

}

export default WordList;