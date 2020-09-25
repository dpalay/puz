import React from "react";
import "./App.css";
import TopMenu from "../TopMenu";
import { PuzzleArea } from "../PuzzleArea";
import { useRecoilValue } from "recoil";
import { hasWords as hasWordSelector } from "../../Recoil";

const App: React.FC = () => {
  const hasWords = useRecoilValue(hasWordSelector);

  return (
    <div className="App">
      <TopMenu hasWords={hasWords} />
      <main style={{ background: "lightblue" }}>
        <PuzzleArea />
      </main>
    </div>
  );
};

export default App;
