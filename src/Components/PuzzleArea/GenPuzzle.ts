import Word from "../../Type/word"

const GeneratePuzzle = (words: Word[] = [new Word("test"), new Word("TheBiggestWord"), new Word("Word")]) => {

    words.forEach(word => console.log(word))

}

GeneratePuzzle()
export default GeneratePuzzle