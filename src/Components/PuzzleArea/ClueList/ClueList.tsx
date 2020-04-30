import React from 'react'
import {Word} from '../../../Classes'

interface Iprops {
    words: Word[]
}

const ClueList: React.FC<Iprops> = (props: Iprops) => {
    const {words} = props
    return(
        <p>
            {words.sort().map(word => word.word).join(" | ")}
        </p>
    )
}

export default ClueList;