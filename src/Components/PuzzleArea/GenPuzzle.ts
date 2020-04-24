import Word from "../../Type/word";

enum Direction {
  upRight = 1,
  right,
  downRight,
  down,
  downLeft,
  left,
  upLeft,
  up,
}
class Cell {
  row: number;
  col: number;
  value: string;
  constructor(value: string, [row, col]: [number, number]) {
    this.row = row;
    this.col = col;
    this.value = value;
  }
  move = (direction: Direction): [number, number] => {
    return [this.row + Puzzle.dy[direction], this.col + Puzzle.dx[direction]];
  };
  pos = (): [number, number] => [this.row, this.col];
}

class Puzzle {
  static alpha = "_ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  static dx = [0, 1, 1, 1, 0, -1, -1, -1, 0];
  static dy = [0, -1, 0, 1, 1, 1, 0, -1, -1];
  words: Word[];
  numWords: number;
  numLetters: number;
  minWordSize: number;
  maxSize: number;
  puzSize: number;
  maxWordLength: number;
  lettersUsed: Array<number>;
  board: Cell[][];
  directionUsage: number[];
  cellsWithLetter: Cell[][];

  constructor(words: Word[], minWordSize: number) {
    this.minWordSize = minWordSize;
    this.board = [];
    this.cellsWithLetter = Puzzle.alpha.split("").map((x) => []);
    this.maxSize = 1;
    this.puzSize = 1;
    this.words = [...words];
    this.lettersUsed = [];
    this.numWords = words.length;
    this.numLetters = 0;
    this.maxWordLength = Math.max(...words.map((word) => word.length));
    this.directionUsage = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    // Go through the list of words
    words.forEach((word) => {
      // Add the letters of each word to the lettersUsed object
      word.word.split("").forEach((letter) => {
        let index = Puzzle.alpha.indexOf(letter);
        if (this.lettersUsed[index]) {
          this.lettersUsed[index] = this.lettersUsed[index] + 1;
        } else {
          this.lettersUsed[index] = 1;
        }
      });
      // add the length of the word to the total number of letters
      this.numLetters += word.length;
      //add the word to the list of words by length
    });

    // set the size of the puzzle
    this.puzSize = Math.max(
      Math.floor(Math.sqrt(this.numLetters - this.numWords) + 1),
      this.maxWordLength
    );
    this.maxSize = this.puzSize + 10;

    // init the puzzle with blanks
    for (let row = 0; row < this.maxSize; row++) {
      this.board[row] = [];
      for (let col = 0; col < this.maxSize; col++) {
        this.board[row][col] = new Cell(" ", [row, col]);
      }
    }

    this.surroundDash();

    let wordsInPuzzle = 0;
    words
      .sort((a, b) => b.length - a.length)
      .forEach((word) => {
        wordsInPuzzle++;
        // 1st word is special case
        if (wordsInPuzzle === 1) {
          this.addWord(word, this.getCell([this.puzSize, this.puzSize]), 7);
        } else {
          // try an overlap
          let { found, cell, direction } = this.overlap(word);
          if (found && cell && direction) {
            this.addWord(word, cell, direction);
          } else {
            let { found, cell, direction } = this.insertWord(word);
            if (found && cell && direction) {
              this.addWord(word, cell, direction);
            } else {
              this.increasePuzzleSize();
              let { found, cell, direction } = this.overlap(word);
              if (found && cell && direction) {
                this.addWord(word, cell, direction);
              } else {
                let { found, cell, direction } = this.insertWord(word);
                if (found && cell && direction) {
                  this.addWord(word, cell, direction);
                }
              }
            }
          }
          this.print();
        }
      });
  }

  getCell = ([row, col]: [number, number]): Cell => {
    if (row < 0 || row > this.puzSize || col < 0 || col > this.puzSize) {return new Cell("-",[0,0])}
    return this.board[row][col];
  };

  setCell(v: string, [row, col]: [number, number]) {
    this.board[row][col].value = v;
  }

  print = () => {
    console.log("Printing [");
    this.board.forEach((row) =>
      console.log(row.map((col) => col.value).join("|"))
    );
    console.log("]");
  };

  surroundDash = () => {
    for (let diag = 0; diag <= this.puzSize; diag++) {
      this.setCell("-", [diag, 0]);
      this.setCell("-", [0, diag]);
      this.setCell("-", [this.puzSize + 1, diag]);
      this.setCell("-", [diag, this.puzSize + 1]);
    }
    this.setCell("-", [this.puzSize + 1, this.puzSize + 1]);
  };

  increasePuzzleSize = () => {
    this.puzSize++;
    for (let j = 1; j < this.puzSize; j++) {
      this.setCell(" ", [this.puzSize, j]);
      this.setCell(" ", [j, this.puzSize]);
    }
    this.setCell(" ", [this.puzSize, this.puzSize])
    this.surroundDash();
  };

  addWord = (newWord: Word, startingCell: Cell, direction: Direction) => {
    this.directionUsage[direction]++;
    let curCell = startingCell;
    newWord.word.split("").forEach((letter) => {
      if (letter !== " ") {
        if (curCell.value === " ") {
          this.setCell(letter, curCell.pos());
          this.cellsWithLetter[Puzzle.alpha.indexOf(letter)].unshift(curCell);
        }
      }
      switch (direction) {
        case Direction.up:
          curCell = this.getCell(curCell.move(Direction.up));
          break;
        case Direction.down:
          curCell = this.getCell(curCell.move(Direction.down));
          break;
        case Direction.left:
          curCell = this.getCell(curCell.move(Direction.left));
          break;
        case Direction.right:
          curCell = this.getCell(curCell.move(Direction.right));
          break;
        case Direction.upLeft:
          curCell = this.getCell(curCell.move(Direction.upLeft));
          break;
        case Direction.upRight:
          curCell = this.getCell(curCell.move(Direction.upRight));
          break;
        case Direction.downLeft:
          curCell = this.getCell(curCell.move(Direction.downLeft));
          break;
        case Direction.downRight:
          curCell = this.getCell(curCell.move(Direction.downRight));
          break;
      }
    });
  };

  insertWord = (
    newWord: Word
  ): { found: boolean; cell?: Cell; direction?: Direction } => {
    let result: { found: boolean; cell?: Cell; direction: Direction } = {
      found: false,
      direction: 0,
    };
    let lowFreqDirectionCount = Math.min(...this.directionUsage.slice(1));
    let numFound = 0;
    let smallestDirectionUseFound = Infinity;
    //loop through the board
    this.board.slice(1,this.puzSize).forEach((row) => {
      row.slice(1,this.puzSize).forEach((cell) => {
        // if the cell is blank, we have a starting spot to check to see if we can fit the word
        if (cell.value === " ") {
          for (let direction = 1; direction <= 4; direction++) {
            let dx = Puzzle.dx[direction];
            let dy = Puzzle.dy[direction];
            let emptyCount = 1;
            while (
              emptyCount < newWord.length &&
              this.getCell([
                cell.row + emptyCount * dy,
                cell.col + emptyCount * dx,
              ]).value === " "
            ) {
              emptyCount++;
            }
            numFound++;
            if (emptyCount === newWord.length) {
              result.found = true;
              if (this.directionUsage[direction] === lowFreqDirectionCount) {
                numFound = 1;
                return { found: true, cell, direction };
              } else if (
                this.directionUsage[direction + 4] === lowFreqDirectionCount
              ) {
                numFound = 1;
                return {
                  found: true,
                  direction: direction + 4,
                  cell: this.getCell([
                    cell.row + (newWord.length - 1) * dy,
                    cell.col + (newWord.length - 1) * dy,
                  ]),
                };
              } else {
                if (
                  this.directionUsage[direction] < smallestDirectionUseFound
                ) {
                  smallestDirectionUseFound = this.directionUsage[direction];
                  result = { found: true, cell, direction };
                  numFound = 1;
                } else if (
                  this.directionUsage[direction + 4] < smallestDirectionUseFound
                ) {
                  smallestDirectionUseFound = this.directionUsage[
                    direction + 4
                  ];
                  result = {
                    found: true,
                    direction: direction + 4,
                    cell: this.getCell([
                      cell.row + (newWord.length - 1) * dy,
                      cell.col + (newWord.length - 1) * dy,
                    ]),
                  };
                  numFound = 1;
                } else {
                  if (
                    this.directionUsage[direction] === smallestDirectionUseFound
                  ) {
                    if (Math.random() <= 1.0 / numFound) {
                      result = { cell, direction, ...result };
                    }
                  } else if (
                    this.directionUsage[direction + 4] ===
                    smallestDirectionUseFound
                  ) {
                    if (Math.random() <= 1.0 / numFound) {
                      result = {
                        cell: this.getCell([
                          cell.row + (newWord.length - 1) * dy,
                          cell.col + (newWord.length - 1) * dy,
                        ]),
                        direction: direction + 4,
                        ...result,
                      };
                    }
                  }
                }
              }
            }
          }
        }
      });
    });
    return result;
  };

  overlap = (
    newWord: Word
  ): { found: boolean; cell?: Cell; direction?: Direction } => {
    let result: { found: boolean; cell?: Cell; direction: Direction } = {
      found: false,
      direction: 0,
    };
    let { length, word } = newWord;
    let bestOverlap = 0;
    let numEquals = 0;
    word.split("").forEach((letter, index) => {
      if (letter !== " ") {
        let lettersBefore = index;
        let lettersAfter = length - index - 1;

        //Find all the cells that have this letter
        let cells = [...this.cellsWithLetter[Puzzle.alpha.indexOf(letter)]];
        while (cells.length > 0) {
          let tmpCell: Cell = cells.shift() as Cell;
          for (let direction = 1; direction <= 8; direction++) {
            let [row, col] = tmpCell.pos();
            let dx = Puzzle.dx[direction];
            let dy = Puzzle.dy[direction];
            let startCol = col - dx * lettersBefore;
            let startRow = row - dy * lettersBefore;
            let endCol = col + dx * lettersAfter;
            let endRow = row + dy * lettersAfter;

            if (
              startCol > 0 &&
              startRow > 0 &&
              startCol <= this.puzSize &&
              startRow <= this.puzSize &&
              endCol > 0 &&
              endRow > 0 &&
              endCol <= this.puzSize &&
              endRow <= this.puzSize
            ) {
              let curOverlap = 0;
              let fits = true;
              word.split("").forEach((letter, index) => {
                if (
                  fits &&
                  (letter === " " ||
                    this.getCell([startRow + index * dy, startCol + index * dx])
                      .value === " ")
                ) {
                } else if (
                  letter ===
                  this.getCell([startRow + index * dy, startCol + index * dx])
                    .value
                ) {
                  curOverlap++;
                } else {
                  fits = false;
                  // TODO: efficiency improvement.  It could stop checking at this point
                }
              });
              if (fits) {
                if (curOverlap > bestOverlap) {
                  bestOverlap = curOverlap;
                  result = {
                    found: true,
                    cell: this.getCell([startRow, startCol]),
                    direction: direction,
                  };
                  numEquals = 1;
                } else if (
                  curOverlap === bestOverlap &&
                  this.directionUsage[direction] <
                    this.directionUsage[result.direction]
                ) {
                  result = {
                    found: true,
                    cell: this.getCell([startRow, startCol]),
                    direction: direction,
                  };
                  numEquals = 1;
                } else if (
                  curOverlap === bestOverlap &&
                  this.directionUsage[direction] ===
                    this.directionUsage[result.direction]
                ) {
                  numEquals++;
                  if (Math.random() <= 1.0 / numEquals) {
                    result = {
                      found: true,
                      cell: this.getCell([startRow, startCol]),
                      direction: direction,
                    };
                  }
                } else {
                }
              }
            }
          }
        }
      }
    });
    return result;
  };
}

export default Puzzle;
