import logo from './logo.svg'
import dropdown_icon from './dropdown_icon.svg'
import arrow_icon from './arrow_icon.svg'
import cross_icon from './cross_icon.png'
import board_game_icon from './board_game_icon.png'
import hotdrink from './hotdrink.png'
import softdrink from './softdrink.png'
import beer from './beer.png'

export const assets = {
    logo,
    dropdown_icon,
    arrow_icon,
    cross_icon
}

export const menuNavbarData = [
    {
        menuType: 'Gaming fee',
        image: board_game_icon
    },
    {
        menuType: 'Hot drinks',
        image: hotdrink
    },
    {
        menuType: 'Soft drinks',
        image: softdrink
    },
    {
        menuType: 'Beers & Ciders',
        image: beer
    },

    {
        menuType: 'own brand',
        image: logo
    }

]