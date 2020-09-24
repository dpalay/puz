import {atom, selector} from 'recoil'
import { Word } from '../Classes'


export const wordList = atom<Word[]>({
    key: 'wordList',
    default: []
})