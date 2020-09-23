import Word from "./Word";
import Puzzle from './Puzzle'
import Direction from "./Direction";

class Cell {
    row: number;
    col: number;
    value: string;
    words: Word[]; //ID of the words this cell contains
  
    constructor(value: string, [row, col]: [number, number]) {
      this.row = row;
      this.col = col;
      this.value = value;
      this.words = [];
    }
    move = (direction: Direction): [number, number] => {
      return [this.row + Puzzle.dy[direction], this.col + Puzzle.dx[direction]];
    };
    pos = (): [number, number] => [this.row, this.col];
  }
export default Cell