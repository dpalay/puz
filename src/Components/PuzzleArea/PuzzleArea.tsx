import React, { useState } from 'react'
import Word from '../../Type/word';
import WordList from './WordList';
import WordEntry from './WordEntry';
import { Grid } from 'semantic-ui-react';

interface Iprops {

}

const PuzzleArea: React.FC<Iprops> = (props: Iprops) => {
    const [words, setWords] = useState<Word[]>([])
    return (
        <Grid divided padded={"vertically"} stretched relaxed style={{height: '95vh'}}>
            <Grid.Row color="blue" >
                <Grid.Column width={3}>
                    <WordEntry setWords={setWords} words={words}></WordEntry>
                    <WordList words={words}></WordList>
                </Grid.Column>
                <Grid.Column width={13}>
                    PUZZLE GOES HERE
                    </Grid.Column> 
            </Grid.Row>
        </Grid>

    )

}

export default PuzzleArea;