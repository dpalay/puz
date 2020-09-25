import React from "react";
import "./App.css";
import TopMenu from "../TopMenu";
import { PuzzleArea } from "../PuzzleArea";
import {useRecoilState} from "recoil";
import { wordList } from "../../Recoil";

const App: React.FC = () => {
  const [words] = useRecoilState(wordList)


  return (
      <div className="App">
        <TopMenu hasWords={words.length > 0} />
        <main style={{ background: "lightblue" }}>
          <PuzzleArea/>
        </main>
      </div>
  );
};

export default App;
