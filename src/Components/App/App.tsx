import React, { useState } from 'react';
import './App.css';
import TopMenu from '../TopMenu';
import {PuzzleArea} from '../PuzzleArea';
import { Word } from '../../Classes';

const App: React.FC = () => {

  const [words, setWords] = useState<Word[]>([])

  return (
    <div className="App">
      <TopMenu setWords={setWords} />
      <main style={{background: "lightblue"}}>
        <PuzzleArea words={words} setWords={setWords} />
      </main>
    </div>
  );
}

export default App;
