import Cell from "./cell";

class DebugPuz {
  board: Cell[][];
  cells(): Cell[] {
      return this.board.flat();
  }
  constructor() {
    this.board = [
      [
        new Cell("x", [1, 1]),
        new Cell("x", [1, 2]),
        new Cell("x", [1, 3]),
        new Cell("x", [1, 4]),
      ],
      [
        new Cell("x", [2, 1]),
        new Cell("x", [2, 2]),
        new Cell("x", [2, 3]),
        new Cell("x", [2, 4]),
      ],
      [
        new Cell("x", [3, 1]),
        new Cell("x", [3, 2]),
        new Cell("x", [3, 3]),
        new Cell("x", [3, 4]),
      ],
      [
        new Cell("x", [4, 1]),
        new Cell("x", [4, 2]),
        new Cell("x", [4, 3]),
        new Cell("x", [4, 4]),
      ],
    ];
  }
}

export default DebugPuz;
