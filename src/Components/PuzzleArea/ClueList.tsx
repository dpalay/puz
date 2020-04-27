import React from 'react'
import { List } from 'semantic-ui-react';
import {Word} from '../../Classes'

interface Iprops {
    words: Word[]
}

const ClueList: React.FC<Iprops> = (props: Iprops) => {
    const {words} = props
    return(
        <List horizontal>
            {words.sort().map(word => (
                <List.Item>{word.word}</List.Item>
            ))}
        </List>
    )

}

export default ClueList;