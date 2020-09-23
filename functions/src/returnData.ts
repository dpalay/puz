
type ReturnData = {
    puzzle?: {
      value: string;
      words: {
        word: string;
        id: string;
      }[];
    }[][];
    lettersUsed?: string;
    status: "success" | "error" | "empty";
  };


  export default ReturnData