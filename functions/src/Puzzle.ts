import Cell from "./Cell";
import Direction from "./Direction";
import Word from "./Word";

class Puzzle {
  cells(): Cell[] {
    return this.board.flat(1);
  }

  getCell([row, col]: [number, number]): Cell {
    if (row < 0 || row > this.puzSize || col < 0 || col > this.puzSize) {
      return new Cell("-", [0, 0]);
    }
    return this.board[row][col];
  }

  setCell(v: string, [row, col]: [number, number]) {
    this.board[row][col].value = v;
  }

  print(): void {
    console.log("Printing [");
    this.board.forEach((row) =>
      console.log(row.map((col) => col.value).join("|"))
    );
    console.log("]");
  }

  surroundDash(): void {
    //console.log("surrounding in dashes"))
    for (let diag = 0; diag <= this.puzSize; diag++) {
      this.setCell("-", [diag, 0]);
      this.setCell("-", [0, diag]);
      this.setCell("-", [this.puzSize + 1, diag]);
      this.setCell("-", [diag, this.puzSize + 1]);
    }
    //console.log("putting in corner"))
    this.setCell("-", [this.puzSize + 1, this.puzSize + 1]);
  }

  increasePuzzleSize(): void {
    this.puzSize++;
    //console.log(`Puzzle is now [${this.puzSize}x${this.puzSize}]`))
    if (!this.board[this.puzSize + 1]) {
      this.board[this.puzSize + 1] = [];
      for (let i = 0; i <= this.puzSize + 1; i++) {
        this.board[this.puzSize + 1][i] = new Cell(" ", [this.puzSize + 1, i]);
        this.board[i][this.puzSize + 1] = new Cell(" ", [i, this.puzSize + 1]);
      }
    }
    for (let j = 1; j <= this.puzSize; j++) {
      this.setCell(" ", [this.puzSize, j]);
      this.setCell(" ", [j, this.puzSize]);
    }
    this.surroundDash();
    // set this.justIncreased = true
  }

  addWord(newWord: Word, startingCell: Cell, direction: Direction) {
    /*console.log(
      `Adding ${newWord.word} @ [row,col]:${startingCell
        .pos()
        .join(", ")} going ${Direction[direction]}`
    );*/
    this.directionUsage[direction]++;
    let curCell = startingCell;
    //console.log(`For each letter in ${newWord.word}:`));
    newWord.word.split("").forEach((letter) => {
      if (letter !== " ") {
        //console.log(`${letter} is not " "`));
        if (curCell.value === " ") {
          //console.log(`Current Cell @ ${curCell.pos()} is blank.  adding ${letter}`);
          this.setCell(letter, curCell.pos());
          curCell.words = [newWord, ...curCell.words];
          this.cellsWithLetter[this.alphabet.indexOf(letter)].unshift(curCell);
          //console.log(`currentCell:`));
          //console.log(curCell));
        } else {
          //console.log(`Current Cell @ ${curCell.pos()} is ${curCell.value}. new letter is ${letter}`);
          curCell.words = [newWord, ...curCell.words];
          //console.log(`currentCell:`));
          //console.log(curCell));
        }
      }
      //console.log(`Moving ${Direction[direction]}`));
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
  }

  insertWord(
    newWord: Word
  ): { found: boolean; cell?: Cell; direction?: Direction } {
    let result: { found: boolean; cell?: Cell; direction: Direction } = {
      found: false,
      direction: 0,
    };
    let lowFreqDirectionCount = Math.min(...this.directionUsage.slice(1));
    let numFound = 0;
    let smallestDirectionUseFound = Infinity;
    //console.log(`trying to find a space to fit ${newWord.word}`));
    //loop through the board
    //TODO:  make it randomized so that it is less predictable where it puts the word
    // Check for this.justIncreased.  if true, only test the new edge
    for (let row of this.board.slice(1, this.puzSize + 1)) {
      //console.log(`moving to next row`))
      for (let cell of row.slice(1, this.puzSize + 1)) {
        //console.log(`moving to cell [${cell.row},${cell.col}]`))
        // if the cell is blank, we have a starting spot to check to see if we can fit the word
        if (cell.value === " ") {
          //console.log(`Cell [${cell.row},${cell.col}] is blank. Test each of the 4 directions`))
          for (let direction = 1; direction <= 4; direction++) {
            //console.log(Direction[direction]))
            let dx = Puzzle.dx[direction];
            let dy = Puzzle.dy[direction];
            let emptyCount = 1;
            let testCell = this.getCell([
              cell.row + emptyCount * dy,
              cell.col + emptyCount * dx,
            ]);
            //console.log(`Testing Cell [${testCell.pos().join(",")}] which has value ${testCell.value}`))
            while (emptyCount < newWord.word.length && testCell.value === " ") {
              emptyCount++;
              //console.log(`cell is empty.  Emptycount=${emptyCount}`))
              //console.log(`Testing Cell [${testCell.pos().join(",")}] which has value ${testCell.value}`))
              testCell = this.getCell([
                cell.row + emptyCount * dy,
                cell.col + emptyCount * dx,
              ]);
            }
            numFound++;
            //console.log(`${Direction[direction]} works. # of found positions: ${numFound}`))
            //console.table({emptyCount, length: newWord.length})
            if (emptyCount === newWord.word.length) {
              //console.log(`${newWord.word} fits! result.found=true`))
              result.found = true;
              if (this.directionUsage[direction] === lowFreqDirectionCount) {
                //console.log("Minimum usage direction"))
                numFound = 1;
                return { found: true, cell, direction };
              } else if (
                this.directionUsage[direction + 4] === lowFreqDirectionCount
              ) {
                //console.log("Minimum usage direction (reverse order)"))
                //console.log(`setting ${newWord.word} @ [${cell.row + (newWord.length - 1) * dy},${cell.col + (newWord.length - 1) * dx}] going ${Direction[direction]}`))
                numFound = 1;
                return {
                  found: true,
                  direction: direction + 4,
                  cell: this.getCell([
                    cell.row + (newWord.word.length - 1) * dy,
                    cell.col + (newWord.word.length - 1) * dx,
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
                      cell.row + (newWord.word.length - 1) * dy,
                      cell.col + (newWord.word.length - 1) * dy,
                    ]),
                  };
                  numFound = 1;
                } else {
                  if (
                    this.directionUsage[direction] === smallestDirectionUseFound
                  ) {
                    if (Math.random() <= 1.0 / numFound) {
                        //@ts-ignore
                      result = { cell, direction, ...result };
                    }
                  } else if (
                    this.directionUsage[direction + 4] ===
                    smallestDirectionUseFound
                  ) {
                    if (Math.random() <= 1.0 / numFound) {
                      result = {
                        cell: this.getCell([
                          cell.row + (newWord.word.length - 1) * dy,
                          cell.col + (newWord.word.length - 1) * dy,
                        ]),
                        //@ts-ignore
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
      }
    }
    return result;
  }

  overlap(
    newWord: Word
  ): { found: boolean; cell?: Cell; direction?: Direction } {
    let result: { found: boolean; cell?: Cell; direction: Direction } = {
      found: false,
      direction: 0,
    };
    let { word } = newWord;
    let bestOverlap = 0;
    let numEquals = 0;
    //console.log(`trying to find an overlap for ${word}`));
    word.split("").forEach((letter, index) => {
      if (letter !== " ") {
        let lettersBefore = index;
        let lettersAfter = word.length - index - 1;
        /*console.log(
          `in ${word}, "${letter}" is the ${
            index + 1
          } letter.  There are ${lettersBefore} letters before and ${lettersAfter} after`
        );*/
        //Find all the cells that have this letter
        let cells = [...this.cellsWithLetter[this.alphabet.indexOf(letter)]];
        //console.log(`All the cells with this letter:`));
        /*console.log(
          `${cells.map((cell) => `[${cell.pos().join(", ")}]`).join(" ")}`
        );*/
        while (cells.length > 0) {
          let tmpCell: Cell = cells.shift() as Cell;
          //console.log(`Checking ${`[${tmpCell.pos().join(", ")}]`}`));
          for (let direction = 1; direction <= 8; direction++) {
            //console.log(`in direction ${Direction[direction]}`));
            let [row, col] = tmpCell.pos();
            let dx = Puzzle.dx[direction];
            let dy = Puzzle.dy[direction];
            let startCol = col - dx * lettersBefore;
            let startRow = row - dy * lettersBefore;
            let endCol = col + dx * lettersAfter;
            let endRow = row + dy * lettersAfter;
            //console.table({dx, dy, startCol, startRow, endCol, endRow});

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
              //console.log(`${word} is in bounds starting at [${startRow},${startCol}] in ${Direction[direction]}`))
              //console.log(`Checking to see how good a position this is`))
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
                  //console.log(`"${letter}" overlaps at [${startRow + index * dy}, ${startCol + index * dx}]`))
                  curOverlap++;
                } else {
                  fits = false;
                  //console.log("Overlap with a different letter, setting fits=false"))
                  // TODO: efficiency improvement.  It could stop checking at this point
                }
              });
              //console.log(`${curOverlap} overlaps`))
              if (fits) {
                //console.log("We found a place for it to overlap"));
                //console.log(`numEquals: ${numEquals}`));
                //console.log(`best overlap so far: ${bestOverlap}`))
                if (curOverlap > bestOverlap) {
                  //console.log(`This is the new best overlap, so set it`));
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
                  //console.log(`equal to the best overlap, but in a direction less frequently used.  set it.`))
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
                  //console.log(`equal to the best overlap, equal in highest direction.  we have a 1/${numEquals} chance to set it to this new one.`))
                  numEquals++;
                  if (Math.random() <= 1.0 / numEquals) {
                    //console.log(`it's a hit! updating result to be [${startRow}, ${startCol}]`))
                    result = {
                      found: true,
                      cell: this.getCell([startRow, startCol]),
                      direction: direction,
                    };
                  }
                } else {
                  //console.log(`Missed out the random chance.`))
                }
              }
            } else {
              //console.log("doesn't fit, out of bounds"))
            }
          }
        }
      }
    });
    return result;
  }

  static defaultAlphabet = "_ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  static dx = [0, 1, 1, 1, 0, -1, -1, -1, 0];
  static dy = [0, -1, 0, 1, 1, 1, 0, -1, -1];
  alphabet: string;
  words: Word[];
  numWords: number;
  numLetters: number;
  minWordSize: number;
  maxSize: number;
  puzSize: number;
  maxWordLength: number;
  lettersUsed: string;
  board: Cell[][];
  directionUsage: number[];
  cellsWithLetter: Cell[][];

  constructor(words: Word[], minWordSize: number, alphabet?: string) {
    this.alphabet = alphabet || Puzzle.defaultAlphabet;
    this.minWordSize = minWordSize;
    this.board = [];
    this.cellsWithLetter = this.alphabet.split("").map((x) => []);
    this.maxSize = 1;
    this.puzSize = 1;
    this.words = [...words];
    this.lettersUsed = "";
    this.numWords = words.length;
    this.numLetters = 0;
    this.maxWordLength = Math.max(...words.map((word) => word.word.length));
    this.directionUsage = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    // Go through the list of words
    this.lettersUsed = words
      .map((word) => word.word)
      .join("")
      .split(" ")
      .join("");
    this.numLetters = this.lettersUsed.length;

    // set the size of the puzzle
    this.puzSize = Math.max(
      Math.floor(Math.sqrt(this.numLetters - this.numWords) + 1),
      this.maxWordLength
    );
    this.maxSize = this.puzSize + 2;

    //this.print()
    // init the puzzle with blanks
    for (let row = 0; row < this.maxSize; row++) {
      this.board[row] = [];
      for (let col = 0; col < this.maxSize; col++) {
        this.board[row][col] = new Cell(" ", [row, col]);
      }
    }

    this.surroundDash();

    let wordsInPuzzle = 0;
    this.words
      .sort((a, b) => b.word.length - a.word.length)
      .forEach((word) => {
        //console.log(`starting with new word: ${word.word}`))
        //this.print()
        wordsInPuzzle++;

        // 1st word is special case
        if (wordsInPuzzle === 1) {
          //console.log("adding first word on the diagonal"))
          this.addWord(word, this.getCell([this.puzSize, this.puzSize]), 7);
        } else {
          // try an overlap
          //console.log(`Can ${word.word} overlap?`))
          let { found, cell, direction } = this.overlap(word);
          if (found && cell && direction) {
            //console.log(`Yes!  Adding ${word.word} @ row:${cell.row} and col:${cell.col} heading in ${Direction[direction]}`))
            this.addWord(word, cell, direction);
          } else {
            //console.log(`No. Can ${word.word} fit?`))
            let { found, cell, direction } = this.insertWord(word);
            if (found && cell && direction) {
              //console.log(`Yes!  Adding ${word.word} @ row:${cell.row} and col:${cell.col} heading in ${Direction[direction]}`))
              this.addWord(word, cell, direction);
            } else {
              //console.log(`No. Increasing puzzle size`))
              this.increasePuzzleSize();
              //console.log(`Can ${word.word} overlap?`))
              let { found, cell, direction } = this.overlap(word);
              if (found && cell && direction) {
                //console.log(`Yes!  Adding ${word.word} @ row:${cell.row} and col:${cell.col} heading in ${Direction[direction]}`))
                this.addWord(word, cell, direction);
              } else {
                let { found, cell, direction } = this.insertWord(word);
                if (found && cell && direction) {
                  //console.log(`Yes!  Adding ${word.word} @ row:${cell.row} and col:${cell.col} heading in ${Direction[direction]}`))
                  this.addWord(word, cell, direction);
                }
              }
            }
          }
        }
      });
  }
}

export default Puzzle;
