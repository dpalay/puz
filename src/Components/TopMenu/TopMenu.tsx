import React from 'react'
import { puzzles } from '../../Constants'
import { Word } from '../../Classes';
import {Menu} from 'antd'
import { PlusCircleTwoTone, PrinterFilled} from '@ant-design/icons'

interface Iprops {
    setWords: React.Dispatch<React.SetStateAction<Word[]>>
    hasWords: boolean
}



const TopMenu: React.FC<Iprops> = (props: Iprops) => {
    const { setWords, hasWords } = props;
    const {SubMenu} = Menu;
    return (
        <header className={"no-print"}>
            <Menu mode="horizontal"  style={{background: "lightblue"}}>
                <Menu.Item key='new_puzzle' onClick={() => setWords([])}>
                <PlusCircleTwoTone />
                    New Puzzle
                </Menu.Item>
                

                    <SubMenu title="Use Premade Puzzle">
                        <Menu>
                            {puzzles.map((puzzle,i )=> (
                                <Menu.Item
                                    key={`premade_${i}`}
                                    onClick={() => setWords(puzzle.words.map(word => new Word(word)).sort())}
                                >
                                    {puzzle.name}
                                </Menu.Item>
                            )
                            )}
                        </Menu>
                    </SubMenu>
                <Menu.Item disabled={!hasWords} onClick={() => window.print()}>
                    <PrinterFilled/>
                    Print Puzzle
                </Menu.Item>
                <Menu.Item disabled style={{cursor: "default"}}>
                    v.1.2.0
                </Menu.Item>
            </Menu>
        </header>
    )

}

export default TopMenu;