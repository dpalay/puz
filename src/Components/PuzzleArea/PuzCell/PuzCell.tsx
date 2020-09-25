import React, { useState } from "react";
import { Cell } from "../../../Classes";

interface Iprops {
  cell: Cell;
  showFill: boolean;
  selectedWordId?: string;
}

const PuzCell: React.FC<Iprops> = (props: Iprops) => {
  const [filledIn, setFilledIn] = useState<boolean>(false);
  const { cell, showFill, selectedWordId } = props;
  const computeStyle = (cell: Cell): React.CSSProperties => {
    let styleValue: React.CSSProperties = { background: "#CCC" };

    // if the cell is part of the selected word
    if (selectedWordId && cell.words.includes(selectedWordId)) {
      styleValue.border = "0px 1px 1px 0px black solid";
    }

    // for cells that have been clicked on
    if (filledIn) {
      if (cell.garbage) {
        styleValue.background = "#ef4646"; // red
      } //not garbage
      else {
        styleValue.background = "#4477EE"; // blue
      }
    }

    // for cells that are part of a completed word?

    return styleValue;
  };
  return (
    <td
      style={{ cursor: "default", fontSize: "medium", ...computeStyle(cell) }}
      onClick={() => {
        setFilledIn(!filledIn);
      }}
    >
      {cell.garbage ? (showFill ? cell.value : " ") : cell.value}
    </td>
  );
};

export default PuzCell;
