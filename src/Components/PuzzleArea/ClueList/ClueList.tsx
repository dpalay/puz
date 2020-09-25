import React from "react";
import { useRecoilState } from "recoil";
import { wordList } from "../../../Recoil";

interface Iprops {}

const ClueList: React.FC<Iprops> = (props: Iprops) => {
  const [words] = useRecoilState(wordList);
  //let wordStrings = words.sort().map(word => word.word) -- Error
  let wordStrings = words.map((word) => word.word).sort(); // totally okay
  let wordString = wordStrings.join(" | ");
  return <p>{wordString}</p>;
};

export default ClueList;
