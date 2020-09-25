import React, { useState } from "react";
import { Word } from "../../Classes";
import { WordEntry, WordList, PuzContainer } from "./";
import { Row, Col, Button, Affix } from "antd";
import { useDropzone } from "react-dropzone";
import useAxios from "axios-hooks";
import ReturnData from "../../../functions/src/returnData";
import "./PuzzleArea.css";
import {
  wordList,
  selectedWord as selectedWordAtom,
  hasWords as hasWordSelector,
} from "../../Recoil";
import { useRecoilState, useRecoilValue } from "recoil";

interface Iprops {}

const PuzzleArea: React.FC<Iprops> = (props: Iprops) => {
  const [showFill, setShowFill] = useState<boolean>(true);
  const [selectedWord] = useRecoilState(selectedWordAtom);
  const [words, setWords] = useRecoilState(wordList);
  const hasWords = useRecoilValue(hasWordSelector);

  const [{ data, loading, error }, refetch] = useAxios<ReturnData>(
    {
      url:
        "https://us-central1-puzzlesearch-d0f54.cloudfunctions.net/makePuzzle",
      method: "POST",
      data: { wordList: words },
    },
    { manual: true }
  );

  const minLength = 3;

  const addWord = (word: Word | string | Word[]) => {
    if (typeof word === "string") {
      setWords([...words, new Word(word)].sort((a, b) => b.length - a.length));
    } else if (word instanceof Array) {
      setWords([...words, ...word].sort((a, b) => b.length - a.length));
    } else {
      setWords([...words, word].sort((a, b) => b.length - a.length));
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    acceptedFiles.forEach((file: File) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        // Do whatever you want with the file contents
        const text = reader.result;
        console.log(text);
        console.log(typeof text);
        let matches: Word[] = [];
        if (typeof text === "string") {
          text
            .split("\n")
            .map((line) => line.trim().toUpperCase())
            .filter((line) => !line.match(/[^A-Z ]/g))
            .filter((line) => !(line.length < minLength))
            .filter((line) => !words.map((word) => word.word).includes(line))
            .forEach((word) => {
              console.log(`adding word ${word} with length: ${word.length}`);
              matches.push(new Word(word));
            });
        }
        if (matches.length > 0) {
          addWord(matches);
        }
      };
      reader.readAsText(file);
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  });

  //const cellsForWord = puzzle ? puzzle.cells().filter(cell => { if (selectedWord) { return cell.words.includes(selectedWord) } else return false }) : []
  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Row gutter={16}>
        <Col span={18} order={2}>
          {data && data?.status === "success" ? (
            <PuzContainer
              showFill={showFill}
              words={words}
              data={data}
              loading={loading}
              error={error}
              selectedWord={selectedWord}
            />
          ) : data?.status === "empty" ? (
            <p>
              No words yet! Use the form to the left to add words and click
              "Generate Puzzle"
            </p>
          ) : (
            <p>
              <em>Something went wrong!</em>
            </p>
          )}
        </Col>
        <Col span={4} order={1} className={"no-print"}>
          <Affix offsetTop={10}>
            <Button
              onClick={() => setShowFill(!showFill)}
              type="primary"
              disabled={!hasWords}
            >
              Toggle Filler
            </Button>
            <WordEntry refetch={refetch} minLength={minLength} />
            <WordList />
          </Affix>
        </Col>
      </Row>
    </div>
  );
};

export default PuzzleArea;
