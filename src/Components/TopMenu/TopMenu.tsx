import React from 'react'
import { Menu, MenuItemProps, Icon } from 'semantic-ui-react';

interface Iprops {

}



const TopMenu: React.FC<Iprops> = (props: Iprops) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, data: MenuItemProps) => {
        // setActiveItem(data.name)
    }

    return (
        <header>
            <Menu color="blue" inverted pointing secondary>
                <Menu.Item name='new_puzzle' onClick={handleClick}>
                    <Icon name="plus circle" />
                New Puzzle
            </Menu.Item>

            </Menu>
        </header>
    )

}

export default TopMenu;