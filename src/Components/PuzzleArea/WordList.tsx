import React from 'react'
import { List } from 'semantic-ui-react'
import { Word } from '../../Classes';

interface Iprops {
    setSelectedWordId: React.Dispatch<React.SetStateAction<Word|null>>
    words: Word[]
    removeWord: (word: Word) => void
}



const WordList: React.FC<Iprops> = (props: Iprops) => {
    const { words,  setSelectedWordId, removeWord } = props
    
    return (
        <List>
            {words.map(word => (
                <List.Item key={word.id} >
                    <List.Icon className="Icon" name="x" onClick={(e:any,i:any) => {console.log(e);console.log(i); removeWord(word)}}/>
                    <List.Content onClick={() => setSelectedWordId(word)}>
                        {word.toString()}
                    </List.Content>
                </List.Item>
            ))}
        </List>
    )

}

export default WordList;