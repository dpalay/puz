import React, { useState } from 'react'
import { puzzles } from '../../Constants'
import { Word } from '../../Classes';
import {Menu} from 'antd'
import { PlusCircleTwoTone} from '@ant-design/icons'

interface Iprops {
    setWords: React.Dispatch<React.SetStateAction<Word[]>>
}



const TopMenu: React.FC<Iprops> = (props: Iprops) => {
    const { setWords } = props;
    const {SubMenu} = Menu;
    return (
        <header className={"no-print"}>
            <Menu mode="horizontal"  >
                <Menu.Item key='new_puzzle' onClick={() => setWords([])}>
                <PlusCircleTwoTone />
                    New Puzzle
                </Menu.Item>
                

                    <SubMenu title="Use Premade Puzzle">
                        <Menu>
                            {puzzles.map((puzzle,i )=> (
                                <Menu.Item
                                    key={`premade_${i}`}
                                    onClick={() => setWords(puzzle.words.map(word => new Word(word)).sort((a, b) => b.length - a.length))}
                                >
                                    {puzzle.name}
                                </Menu.Item>
                            )
                            )}
                        </Menu>
                    </SubMenu>
                
                <Menu.Item disabled style={{cursor: "default"}}>
                    v.1.0.4
                </Menu.Item>
            </Menu>
        </header>
    )

}

export default TopMenu;