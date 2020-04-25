import React, { useState } from 'react'
import { Word } from '../../Classes';
import { Input, Form, FormProps } from 'semantic-ui-react';

interface Iprops {
    words: Word[],
    setWords: React.Dispatch<React.SetStateAction<Word[]>>
    setSelectedWord: React.Dispatch<React.SetStateAction<Word | null>>
    minLength: number
}

interface wordError {
    errorText: string
    errored: boolean
}

const WordEntry: React.FC<Iprops> = (props: Iprops) => {
    const { words, setWords, setSelectedWord, minLength } = props
    const [inputContent, setInputContent] = useState<string>("")
    const [error, setError] = useState<wordError>({ errorText: "", errored: false })

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>, data: FormProps) => {
        let word = inputContent.trim().toUpperCase();
        //validate content
        if (word.length < minLength) {
            setError({ errored: true, errorText: `Too short! Minimum length is ${minLength}` })
        }
        else if (word.match(/[^A-Z ]/g)) {
            setError({ errored: true, errorText: `Can only contain letters A-Z and a space` })
        }
        else if (words.map(word => word.word).includes(word)) {
            setError({ errored: true, errorText: `${word} is already included!` })
        }
        else {


            //check for the word in words

            // if it already exists, return error message

            // if it doesn't, add it
            setError({ errored: false, errorText: ``})
            setWords([...words, new Word(inputContent.trim())].sort((a, b) => b.length - a.length))
            setSelectedWord(null)
            setInputContent("")
        }
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
                        }}
                        error={error.errored} />
                </Form.Field>
            </Form>
            {error.errored && (<div className="ErrorFlash">
                {error.errorText}
            </div>)}
        </div>
    )
}

export default WordEntry;