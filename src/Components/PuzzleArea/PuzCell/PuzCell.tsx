import React, { useState } from 'react'
import { Cell } from '../../../Classes';

interface Iprops {
    cell: Cell
    showFill: boolean
    cellsForWord: Cell[]
}



const PuzCell: React.FC<Iprops> = (props: Iprops) => {
    const [filledIn, setFilledIn] = useState<boolean>(false)
    
    const {cell, showFill, cellsForWord} = props
    const computeStyle = (cell: Cell) => {
        if (cellsForWord.some(cellforword => cellforword.id === cell.id)) {
            return { background: '#E60' }
        }
        if (filledIn){
            if (cell.garbage) {
                return  {background: '#ef4646'} // red
            }
            else //not garbage
            {
                return {background: '#4477EE'} // blue
            }
        }
        return { background: '#CCC' }
    }
    return (
        <td style={{cursor: "default", fontSize:"medium", ...computeStyle(cell)}}  onClick={() => {setFilledIn(!filledIn)}}>
            {cell.garbage ? (showFill ? cell.value : " ") : cell.value}
        </td>
    )

}

export default PuzCell;