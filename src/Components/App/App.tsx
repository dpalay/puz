import React from 'react';
import './App.css';
import TopMenu from '../TopMenu';
import PuzzleArea from '../PuzzleArea';

const App: React.FC = () =>  {

  return (
    <div className="App">
      <TopMenu/>
      <main>
        <PuzzleArea/>
      </main>
    </div>
  );
}

export default App;
