import React from 'react'
import { Word } from '../../../Classes';
import { Form, Input, Button, Tooltip } from 'antd';
import { Store } from 'antd/lib/form/interface';
import { QuestionCircleOutlined } from '@ant-design/icons';
import ReturnData  from '../../../../functions/src/returnData';
import {AxiosPromise, AxiosRequestConfig} from 'axios'
import {RefetchOptions} from 'axios-hooks'

interface Iprops {
    words: Word[],
    setWords: React.Dispatch<React.SetStateAction<Word[]>>
    setSelectedWord: React.Dispatch<React.SetStateAction<Word | null>>
    minLength: number
    refetch: (config?: AxiosRequestConfig | undefined, options?: RefetchOptions | undefined) => AxiosPromise<ReturnData>
}

interface wordError {
    errorText: string
    errored: boolean
}


const WordEntry: React.FC<Iprops> = (props: Iprops) => {
  
    const { words, setWords, setSelectedWord, minLength, refetch } = props
    const handleClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => 
    {
        e.preventDefault()
        console.log(`Asking for puzzle with ${words.map(word => word.word).join(", ")}`)
        refetch(
            {
                url: "https://us-central1-puzzlesearch-d0f54.cloudfunctions.net/makePuzzle",
                method: "POST",
                data: {wordList: words},
            }
            )
    }
    const [form] = Form.useForm();

    const onFinish = (values: Store) => {
        let { word } = values
        word = word.trim().toUpperCase();
        setWords([...words, new Word(word)].sort())
        setSelectedWord(null)
        form.setFieldsValue({ word: "" })
    }

    return (
        <div>
            <Form form={form} onFinish={onFinish}>
                <Form.Item
                    label={<span>
                        Enter word&nbsp;
                        <Tooltip title="Enter a word to add to the puzzle">
                            <QuestionCircleOutlined />
                        </Tooltip>
                    </span>}
                    validateTrigger="onSubmit"
                    name="word"
                    rules={
                        [{ required: true, message: "Enter a word to add to the puzzle" },
                        { min: minLength, message: `Too short! Minimum length is ${minLength}` },
                        { pattern: /^[A-Za-z][A-Za-z\s]*$/g, message: "Only A-Z or spaces allowed" },
                        { validator: (rule, value) => words.map(wordInList => wordInList.word).includes(value.trim().toUpperCase()) ? Promise.reject(`${value.trim().toUpperCase()} is already included!`) : Promise.resolve() }
                        ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Submit</Button>
                    <Button type="primary" onClick={handleClick}>Generate Puzzle</Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default WordEntry;