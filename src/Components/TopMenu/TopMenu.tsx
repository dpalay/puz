import React from 'react'
import { Menu, MenuItemProps, Icon } from 'semantic-ui-react';
import {puzzles} from '../../Constants'
import { Word } from '../../Classes';

interface Iprops {
    words: Word[]
    setWords: React.Dispatch<React.SetStateAction<Word[]>>
}



const TopMenu: React.FC<Iprops> = (props: Iprops) => {
    const {words, setWords} = props;


    const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, data: MenuItemProps) => {
        console.log(e)
        console.log(data)
        setWords([])
    }

    return (
        <header className={"no-print"}>
            <Menu color="blue" inverted pointing secondary>
                <Menu.Item name='new_puzzle' onClick={handleClick}>
                    <Icon name="plus circle" />
                New Puzzle
            </Menu.Item>
            <Menu.Item name="use_premade_puzzles">
                Use Premade Puzzle
            </Menu.Item>
            <Menu.Item>
                v.1.0.3
            </Menu.Item>

            </Menu>
        </header>
    )

}

export default TopMenu;