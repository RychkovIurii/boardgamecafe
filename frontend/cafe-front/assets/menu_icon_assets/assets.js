import logo from './logo.svg'
import up_icon from './up_icon.svg'
import down_icon from './down_icon.svg'
import arrow_icon from './arrow_icon.svg'
import cross_icon from './cross_icon.png'
import board_game_icon from './board_game_icon.png'
import hotdrink from './hotdrink.png'
import softdrink from './softdrink.png'
import beer from './beer.png'
import pizza from './pizza.png'
import cashRegister_icon from './cashRegister_icon.svg'
import circleInfo_icon from './circleInfo_icon.svg'
import face_grin_stars_icon from './face_grin_stars_icon.svg'
import location_dot_icon from './location_dot_icon.svg'



export const assets = {
    logo,
    up_icon,
    down_icon,
    arrow_icon,
    cross_icon,
    face_grin_stars_icon
}


export const menuData = [
    {
        menuType: 'Gaming Fee',
        image: board_game_icon,
        details: {
            description: `Our café works with a Gaming fee, which you only need to pay to play (also with own games). The gaming fee does not need to be paid if you only come in for the snacks and drinks!`,
            pricing: [
                { item: 'Whole day (gaming fee only)', options: ['(Purchase discount: fee halves)'], price: '11€/6€' },
                { item: 'Cabinet with Theme', options: ['(table 7 on Reservation system)'], price: '+1€/player' },
                { item: '1 year gamepass for enthusiasts', price: '170€' },
                { item: '10x gamepass (includes a fun game)', options: ['(minimum purchase 3.90€/fee)'], price: '50€' }
            ]
        }
    },
    {
        menuType: 'Hot Drinks',
        image: hotdrink,
        details: {
            description: '',
            pricing: [
                { item: '4Noppamokka', price: '3,90€' },
                { item: 'Coffees', options: ['Cappuccino', 'Latte', 'Americano', 'Espresso'], price: '4,90€' },
                { item: 'Teapot + cookie', price: '6,90€' },
                { item: 'Hot Chocolate', options: ['White', 'Latte', 'Milk', 'Dark'], price: '4,90€' },
                { item: 'Extras', options: ['Whipped Cream', 'Chili Syrup', 'Salty Caramel Syrup', 'Marshmallows'], price: '0,50€' },
            ]
        }
    },
    {
        menuType: 'Cold Drinks',
        image: softdrink,
        details: {
            description: 'Refreshing soft drinks available.',
            pricing: [
                { item: 'Carbonated drinks', options: ['Coca-Cola', 'Coca-Cola Zero', 'Smurffi', 'Vichy', 'Bonaqua lemon & lime'], price: '4.90€ to 6.90€' },
                {
                    item: 'Milkshake', options: ['Vanilla', 'Chocholate', 'Raspberry', 'Passion fruit'], price: '6.90€'
                }
            ]
        }
    },
    {
        menuType: 'Beers & Ciders',
        image: beer,
        details: {
            description: 'Big selection from local breweries and Ciders and Long Drinks etc. from the tap.',
            pricing: [{ item: 'Karhu lll', price: '8,90€' },
            { item: 'Crowmoor', price: '8,90€' },
            { item: 'Fat Lizard', price: '9,90€' }]
        }
    },
    {
        menuType: 'Food',
        image: pizza,
        details: {
            description: '',
            pricing: [
                { item: 'Italian Pizza', price: '14,90€' },
                { item: 'Big Toast - Salami-Mozzarella', options: ['Salami-Mozzarella', 'Chicken-Mozzarella', 'Mozzarella', 'Vegan'], price: '7,90€' },
                { item: 'Potatoes', price: '5,90€' },
                { item: 'Sausage and Fries', price: '7,90€' },
                { item: 'Snack Plate (Carrot, paprika, cucumber, nachos, chips + 3 dips)', price: '9,90€' },
                { item: 'Chips Platter + dip', price: '8,90€' },
                { item: 'Nacho Bowl - Normal + dip', price: '7,90€' },
                { item: 'Popcorn', price: '5,90€' },
                { item: 'Nutella Panini', price: '5,90€' },
                { item: 'Chocolate bar', price: '2,90€' }
            ]
        }
    },
    {
        menuType: 'Own Brand',
        image: logo,
        details: {
            description: 'Together with the small roastery Charlotta, we have developed a tasty and gentle coffee blend! NoppaMokka can also be bought at home, even as a gift. Together with NoppaMokka, you can taste our wonderful pastries. Dark roast now available. Also we have our own beer, too',
            pricing: [{ item: 'NoppaMokka', price: '5,90€' },
            { item: '3diceBrewery', price: '8,90€' }
            ]
        }
    }
];

export const steps = [
    {
        label: 'How to find us',
        image: location_dot_icon,
        details: {
            process: {
                step1: `Visit us at Eerikinkatu 14, 00100 Helsinki, right after the tunnel.`
            },
            marks: {
                mark1: `Accessibility is limited due to stairs and narrow corridors. Our toilet facilities do not accommodate reduced mobility.`,
                mark2: `Our cafe is allergy-free, so Pets are not allowed indoors, except guide dogs.`
            },
        },
    },
    {
        label: 'Ordering process',
        image: cashRegister_icon,
        details: {
            process: {
                step1: `Head to the counter for guidance through the system.`,
                step2: `First, pay the gaming fee at the cashier before heading to your table, even if your group has already arrived.`,
                step3: `Feel free to ask about our menu.`
            },
            marks: {
                mark1: 'Outside food and drinks are not allowed.',
                mark2: `We hope you will use our extensive food and drink menu. We will update the list according to wishes.`,
            },
        },
    },
    {
        label: 'Need Help?',
        image: circleInfo_icon,
        details: {
            process: {
                step1: `Our staff is here to help with games, drinks, and creating a fun experience. `,
                step2: `If we have time, we can even give a short tutorial on the game or even play with your party if there's a player missing.`,

            },
            marks: {
                mark1: 'Our establishment is a safe and fun place for everyone.',
                mark2: `Our operations are based on trust. Treat the board games respectfully and return them properly.`,
            },
        },
    },
];