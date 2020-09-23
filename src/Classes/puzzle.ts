import { Cell } from "./";

type Position = { row: number; col: number };
class Puzzle {
  cells(): Cell[] {
    return this.board.flat(1);
  }

  fillPuzzle() {
    let cells = this.cells().filter((cell) => cell.garbage);
    cells.forEach((cell) => {
      cell.value = this.lettersUsed.charAt(
        Math.floor(Math.random() * this.lettersUsed.length)
      );
    });
  }

  lettersUsed: string;
  board: Cell[][];
  cellsWithLetter: {
    A: Position[];
    B: Position[];
    C: Position[];
    D: Position[];
    E: Position[];
    F: Position[];
    G: Position[];
    H: Position[];
    I: Position[];
    J: Position[];
    K: Position[];
    L: Position[];
    M: Position[];
    N: Position[];
    O: Position[];
    P: Position[];
    Q: Position[];
    R: Position[];
    S: Position[];
    T: Position[];
    U: Position[];
    V: Position[];
    W: Position[];
    X: Position[];
    Y: Position[];
    Z: Position[];
  };

  constructor(
    basis: {
      value: string;
      words: {
        word: string;
        id: string;
      }[];
    }[][],
    letterList: string
  ) {
    this.board = basis.map((row, r) =>
      row.map((cell, c) => {
        return new Cell(
          cell.value,
          [r, c],
          cell.words.map((word) => word.id)
        );
      })
    );
    this.lettersUsed = letterList;
    this.cellsWithLetter = {
      A: [],
      B: [],
      C: [],
      D: [],
      E: [],
      F: [],
      G: [],
      H: [],
      I: [],
      J: [],
      K: [],
      L: [],
      M: [],
      N: [],
      O: [],
      P: [],
      Q: [],
      R: [],
      S: [],
      T: [],
      U: [],
      V: [],
      W: [],
      X: [],
      Y: [],
      Z: [],
    };
    basis.forEach((r, row) => {
      r.forEach((c, col) => {
        if (Object.keys(this.cellsWithLetter).some((key) => c.value === key)) {
          //@ts-ignore
          this.cellsWithLetter[c.value].push({ row: row, col: col });
        }
      });
    });

    this.fillPuzzle();
  }
}

export default Puzzle;
