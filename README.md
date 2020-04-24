- [Wordpuzzle](#wordpuzzle)
  - [Initial documentation](#initial-documentation)
  - [Playground](#playground)
  - [Basic Structure](#basic-structure)
    - [Classes and Enums](#classes-and-enums)
      - [Word](#word)
      - [Cell](#cell)
      - [Puzzle](#puzzle)
      - [Directions](#directions)
    - [Word Placement in the Puzzle](#word-placement-in-the-puzzle)
    - [Algorithm to generate puzzle board](#algorithm-to-generate-puzzle-board)
  - [Learn More](#learn-more)

# Wordpuzzle  

## Initial documentation
This is yet another rendition of a hidden word puzzle program. The intent is to create a program that reads words given as text and then creates a **compact**, **square** hidden word puzzle that contains all of the given words. 

The actual algorithm was developed in the 1980s in FORTRAN by Roger Palay. Since then it has been redeveopled and coded in various languages including PASCAL, ALGOL, and [Perl](https://github.com/dpalay/puz/blob/master/puzzle.pl). 

In this case, the program is being written as a single page web application in typescript with a React frontend. The code was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Playground
This code is deployed via [Firebase Hosting](https://firebase.google.com/) and is available for use [here](https://puzzlesearch-d0f54.web.app)

## Basic Structure

### Classes and Enums
#### Word
Represents a word. Mostly a container so that we can attach an Id to the word.  Also provides a shortcut to its length.

#### Cell
This represents a cell in the 2D puzzle.  Each cell has an id, knows its own row and column, has a single-character value, and a list of IDs of the words that use this cell, and whether or not the contents is garbage (filler) or not.

#### Puzzle
The game board. A 2D array of Cells created by using a list of Words.

#### Directions
An Enum representing the eight directions given as:
```
                  7         8         1
                    \       ^       /
                      \     |     /
                        \   |   /
                          \ | /
                 6 <--------o--------> 2
                          / | \
                        /   |   \
                      /     |     \
                    /       V       \
                  5         4         3
```
### Word Placement in the Puzzle
The goal is to place the words into the puzzle in the most compact manner with the greatest overlap of words and with the broadest use of all eight directions.  The algorithm employed  does not do any backtracking to improve efficiency, but it does take steps to build in brevity, unlike these comments.

The longest word is always placed first.  Thereafter the words are placed longest to shortest into the puzzle such that for any placement we maximize the overlap of new letters with letters that are already in the puzzle.  If there are two or more places with equal overlap, then the overlap that uses a less frequently used direction is used.  If there is an equal overlap and the placements have equally used frequency, then the selection is random (using the Palay progressive randomization selection algorithm).

In order to find possible locations for a word, we want to look at places where the letters of the word already exist.  Rather than scan through the puzzle looking for matches to each letter of the word, we will keep track of the location of each of the 26 different letters within the puzzle.  

We will do this with an array of arrays of Cells of length 27, each progressive index representing the next letter in the alphabet. That is, any Cell stored at index 1 should contain an "A". Thus, for each word to be added to the puzzle, we can look at each letter of the word and find all occurances of that letter already in the puzzle.

### Algorithm to generate puzzle board
1. Get some user supplied data.  This is handled via the front-end, but could easily come from a file.
    - This should already be sanitized data.  The Puzzle generator is not designed to do any sort of validation of data.
2. Sort the words into descending length order.
3. Build a string of the letters from the words. We will randomly pick letters from this list to fill the puzzle. The results will be weighted to letters that appear more often in the words.
4. Determine the minimum size of the puzzle and initialize the Cells.
5. Loop through the list of words
   - Loop: 
     - Start with one of the longest words and place it diagonally in the puzzle.
     - For each of the other words, find the spot that gives the "best" overlap in the existing game board.
     - If there is no overlap, find an empty space to put the word
     - If there is no overlap and no empty space to fit the word, grow the puzzle and try again. This only needs to happen once, as the word is guaranteed to fit into an existing empty space now (along one of the edges).
   - When the word is placed
      1. Mark the Cell as not garbage
      2. Give the Cell a value
      3. Add the Word's id to the Cell's list of words.
6. Fill in the blanks using the random selection from the string of characters from the input words.  

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
