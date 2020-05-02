import React, { useState } from 'react'
import { Cell } from '../../../Classes';
import { FireFilled } from '@ant-design/icons';

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
        <td style={{cursor: "default", fontSize:"medium", ...computeStyle(cell)}}  onClick={() => {setFilledIn(!filledIn);console.log(cell)}}>
            {cell.garbage ? (showFill ? cell.value : <FireFilled/>) : cell.value}
        </td>
    )

}

export default PuzCell;