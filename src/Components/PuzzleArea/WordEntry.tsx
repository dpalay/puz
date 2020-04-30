import React, { useState } from 'react'
import { Word } from '../../Classes';
import { Input as SuiInput, Form as SuiForm, FormProps as SuiFormProps } from 'semantic-ui-react';
import { Form, Input, Button, Tooltip } from 'antd';
import { Store } from 'antd/lib/form/interface';
import { QuestionCircleOutlined } from '@ant-design/icons';

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
    const [form] = Form.useForm();

    const onFinish = (values: Store) => {
        let { word } = values
        word = word.trim().toUpperCase();
        setWords([...words, new Word(word)].sort((a, b) => b.length - a.length))
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
                        { min: 4, message: `Too short! Minimum length is ${minLength}` },
                        { pattern: /^[A-Za-z][A-Za-z\s]*$/g, message: "Only A-Z or spaces allowed" },
                        { validator: (rule, value) => words.map(wordInList => wordInList.word).includes(value.trim().toUpperCase()) ? Promise.reject(`${value.trim().toUpperCase()} is already included!`) : Promise.resolve() }
                        ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default WordEntry;