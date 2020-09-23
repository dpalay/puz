import {v4 as uuidv4} from 'uuid'

class Cell {
    id: string;
    row: number;
    col: number;
    value: string;
    words: string[]; //ID of the words this cell contains
    garbage: boolean; // is this just filler?
  
    constructor(value: string, [row, col]: [number, number], wordIDs?: string[]){
      this.id = uuidv4()
      this.row = row;
      this.col = col;
      this.value = value;
      this.words = [];
      this.garbage = value===" ";
      this.words = wordIDs ? [...wordIDs] : []
    }
    
    pos = (): [number, number] => [this.row, this.col];
  }
export default Cell