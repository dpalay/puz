import React from 'react'
import { TableCell, Icon } from 'semantic-ui-react';
import { Cell } from '../../Classes';

interface Iprops {
    cell: Cell
    showFill: boolean
    cellsForWord: Cell[]
}



const Letter: React.FC<Iprops> = (props: Iprops) => {
    const {cell, showFill, cellsForWord} = props
    const computeStyle = (cell: { id: string }) => {
        if (cellsForWord.some(cellforword => cellforword.id === cell.id)) {
            return { background: '#E60' }
        }
        return { background: '#CCC' }
    }
    return (
        <TableCell textAlign="center" verticalAlign="middle" style={computeStyle(cell)} key={cell.id} onClick={() => console.log(cell)}>
            {cell.garbage ? (showFill ? cell.value : <Icon name="trash" size="tiny" />) : cell.value}
        </TableCell>
    )

}

export default Letter;