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
    a: Position[];
    b: Position[];
    c: Position[];
    d: Position[];
    e: Position[];
    f: Position[];
    g: Position[];
    h: Position[];
    i: Position[];
    j: Position[];
    k: Position[];
    l: Position[];
    m: Position[];
    n: Position[];
    o: Position[];
    p: Position[];
    q: Position[];
    r: Position[];
    s: Position[];
    t: Position[];
    u: Position[];
    v: Position[];
    w: Position[];
    x: Position[];
    y: Position[];
    z: Position[];
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
      a: [],
      b: [],
      c: [],
      d: [],
      e: [],
      f: [],
      g: [],
      h: [],
      i: [],
      j: [],
      k: [],
      l: [],
      m: [],
      n: [],
      o: [],
      p: [],
      q: [],
      r: [],
      s: [],
      t: [],
      u: [],
      v: [],
      w: [],
      x: [],
      y: [],
      z: [],
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
