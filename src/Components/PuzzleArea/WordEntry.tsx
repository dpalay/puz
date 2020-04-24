import React, { useState } from 'react'
import {Word} from '../../Classes';
import { Input, Form, FormProps } from 'semantic-ui-react';

interface Iprops {
    words: Word[],
    setWords: React.Dispatch<React.SetStateAction<Word[]>>
}

const WordEntry: React.FC<Iprops> = (props: Iprops) => {
    const { words, setWords } = props
    const [inputContent, setInputContent] = useState<string>("")

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>, data: FormProps) => {
        //validate content

        //check for the word in words

        // if it already exists, return error message

        // if it doesn't, add it
        setWords([...words, new Word(inputContent.trim())].sort((a,b) => b.length - a.length))
        setInputContent("")
    }


    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Form.Field>
                    <label>Enter {words.length > 0 ? "additional" : ""} words</label>
                    <Input placeholder="Enter word"
                        type=""
                        value={inputContent}
                        onChange={(e, data) => setInputContent(data.value)}
                        action={{
                            positive: true,
                            content: "Submit",
                        }} />
                </Form.Field>

            </Form>
            <div className="ErrorFlash">

            </div>
        </div>
    )
}

export default WordEntry;