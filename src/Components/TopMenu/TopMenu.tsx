import React, { useState } from 'react'
import { Menu, MenuItemProps, Icon } from 'semantic-ui-react';

interface Iprops {
    
}



const TopMenu: React.FC<Iprops> = (props: Iprops) => {
    const [activeItem, setActiveItem] = useState<string | undefined>()

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, data: MenuItemProps) => {
        setActiveItem(data.name)
    }
    

    return(
        <header>
        <Menu>
            <Menu.Item name='new_puzzle' active={activeItem==="new_puzzle"} onClick={handleClick}>
                <Icon name="plus circle"/>
                New Puzzle
            </Menu.Item>

        </Menu>
      </header>
    )

}

export default TopMenu;