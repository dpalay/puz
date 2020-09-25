import { atom, selector } from "recoil";
import { Word } from "../Classes";

export const wordList = atom<Word[]>({
  key: "wordList",
  default: [],
});

export const selectedWord = atom<Word | undefined>({
  key: "selectedWord",
  default: undefined,
});

export const hasWords = selector<boolean>({
  key: "hasWords",
  get: ({ get }) => {
    const hasWords = get(wordList);
    return hasWords.length > 0;
  },
});
