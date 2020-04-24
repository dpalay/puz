import React from 'react'
import { List } from 'semantic-ui-react'
import Word from '../../Type/word';

interface Iprops {
    words: Word[]
    setSelectedWordId: React.Dispatch<React.SetStateAction<string>>
}

const WordList: React.FC<Iprops> = (props: Iprops) => {
    const {words,setSelectedWordId} = props
    return(
        <List>
            {words.map(word => (
                <List.Item key={word.id} onClick={()=>setSelectedWordId(word.id)}>{word.toString()}</List.Item>
            ))}
        </List>
    )

}

export default WordList;