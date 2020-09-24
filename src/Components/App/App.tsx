import React, { useState } from "react";
import "./App.css";
import TopMenu from "../TopMenu";
import { PuzzleArea } from "../PuzzleArea";
import { Word } from "../../Classes";
import { RecoilRoot, useRecoilState, useRecoilValue } from "recoil";
import { wordList } from "../../Recoil";

const App: React.FC = () => {
  //const [words, setWords] = useState<Word[]>([]);
  const [words, setWords] = useRecoilState(wordList)


  return (
    <RecoilRoot>
      <div className="App">
        <TopMenu setWords={setWords} hasWords={words.length > 0} />
        <main style={{ background: "lightblue" }}>
          <PuzzleArea words={words} setWords={setWords} />
        </main>
      </div>
    </RecoilRoot>
  );
};

export default App;
