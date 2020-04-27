import React from 'react'
import { Menu, Icon, Dropdown } from 'semantic-ui-react';
import { puzzles } from '../../Constants'
import { Word } from '../../Classes';

interface Iprops {
    setWords: React.Dispatch<React.SetStateAction<Word[]>>
}



const TopMenu: React.FC<Iprops> = (props: Iprops) => {
    const { setWords } = props;
    return (
        <header className={"no-print"}>
            <Menu color="blue" inverted pointing secondary>
                <Menu.Item name='new_puzzle' onClick={() => setWords([])}>
                    <Icon name="plus circle" />
                    New Puzzle
                </Menu.Item>
                <Menu.Item>

                    <Dropdown text="Use Premade Puzzle">
                        <Dropdown.Menu>
                            {puzzles.map(puzzle => (
                                <Dropdown.Item
                                    onClick={() => setWords(puzzle.words.map(word => new Word(word)).sort((a, b) => b.length - a.length))}
                                >
                                    {puzzle.name}
                                </Dropdown.Item>
                            )
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Item>
                <Menu.Item>
                    v.1.0.3
                </Menu.Item>
            </Menu>
        </header>
    )

}

export default TopMenu;