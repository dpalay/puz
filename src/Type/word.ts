import uuidv4 from 'uuid/v4'
export default class Word {
word: string
length: number
id: string

constructor(word: string){
    this.word = word
    this.length = word.length
    this.id = uuidv4();
}

toString = () => this.word
}
