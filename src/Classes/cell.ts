import {Direction} from '../Structures/'
import {v4 as uuidv4} from 'uuid'
import Puzzle from './puzzle'

class Cell {
    id: string;
    row: number;
    col: number;
    value: string;
    words: string[]; //ID of the words this cell contains
    garbage: boolean; // is this just filler?
  
    constructor(value: string, [row, col]: [number, number]) {
        this.id = uuidv4()
      this.row = row;
      this.col = col;
      this.value = value;
      this.words = [];
      this.garbage = true;
    }
    move = (direction: Direction): [number, number] => {
      return [this.row + Puzzle.dy[direction], this.col + Puzzle.dx[direction]];
    };
    pos = (): [number, number] => [this.row, this.col];
  }
export default Cell