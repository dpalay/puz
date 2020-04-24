import { v4 as uuidv4 } from 'uuid';
export default class Word {
word: string
length: number
id: string

constructor(word: string){
    this.word = word.toUpperCase()
    this.length = word.length
    this.id = uuidv4();
}

toString = () => this.word
}
