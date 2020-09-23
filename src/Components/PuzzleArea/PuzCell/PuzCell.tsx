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
    const computeStyle = (cell: { id: string }) => {
        if (cellsForWord.some(cellforword => cellforword.id === cell.id)) {
            return { background: '#E60' }
        }
        return filledIn ? {background: '#4477EE'} : { background: '#CCC' }
    }
    return (
        <td style={{cursor: "default", fontSize:"medium", ...computeStyle(cell)}}  onClick={() => {setFilledIn(!filledIn)}}>
            {cell.garbage ? (showFill ? cell.value : " ") : cell.value}
        </td>
    )

}

export default PuzCell;