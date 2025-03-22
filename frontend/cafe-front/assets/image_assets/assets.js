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
import property_photo_4 from './property_photo_4.jpeg'
import property_photo_5 from './property_photo_5.jpg'
import property_photo_6 from './property_photo_6.jpg'
import property_photo_7 from './property_photo_7.jpg'
import property_photo_9 from './property_photo_9.jpeg'
import property_photo_10 from './property_photo_10.jpeg'
import property_photo_11 from './property_photo_11.jpeg'
import property_photo_13 from './property_photo_13.jpeg'
import drinks_photo_1 from './drinks_photo_1.jpg'
import rotated_scroll from './rotated_scroll.png'
import footer_background from '../footer-background.png'
import chest_box_close from './chest_box_close.png'
import rolling_dices from './rolling_dices.svg'
import p_S1_1 from './property_S1_1.jpg'
import p_S1_2 from './property_S1_2.jpg'
import p_S1_3 from './property_S1_3.jpg'
import p_S1_4 from './property_S1_4.jpg'
import p_S1_5 from './property_S1_5.jpg'
import p_S1_6 from './property_S1_6.jpg'
import p_S1_7 from './property_S1_7.jpg'
import p_S1_8 from './property_S1_8.png'
import p_S2_1 from './property_S2_1.jpeg'
import p_S2_2 from './property_S2_2.jpeg'
import p_S2_3 from './property_S2_3.jpg'
import p_S2_4 from './property_S2_4.jpeg'
import p_S3_1 from './property_S3_1.jpg'
import p_S3_2 from './property_S3_2.jpg'
import p_S3_3 from './property_S3_3.jpg'
import p_S3_4 from './property_S3_4.jpg'
import p_S4_1 from './property_S4_1.png'
import p_S4_2 from './property_S4_2.jpeg'
import p_S4_3 from './property_S4_3.jpeg'



export const assets = {
    logo,
    up_icon,
    down_icon,
    arrow_icon,
    cross_icon,
    face_grin_stars_icon,
    property_photo_4,
    property_photo_5,
    property_photo_6,
    property_photo_7,
    property_photo_9,
    property_photo_10,
    property_photo_11,
    property_photo_13,
    drinks_photo_1,
    footer_background,
    rotated_scroll,
    chest_box_close,
    rolling_dices

}

/* 
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
 */

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


export const aboutMenu = [
    { title: "How it works", text: "Understand the ordering process and get all the key details.", link: "/faq", img: chest_box_close },
    { title: "Menu", text: "Explore our gaming fees and enjoy delicious food & drinks!", link: "/pricing", img: chest_box_close },
    { title: "Service", text: "Let our friendly staff assist you for the best board game experience.", link: "/service", img: chest_box_close }]

export const serviceMenu = [
    { _id: "s-food", title: "RESTAURANT/CAFE/BAR", detail: " A well-equipped kitchen prepares delicious treats for all players, and private rooms offer a touch of luxury for those looking for a special experience.", img: [p_S1_1, p_S1_2, p_S1_3, p_S1_4, p_S1_5, p_S1_6, p_S1_7, p_S1_8] },
    { _id: "s-private", title: "PRIVATE ROOMS", detail: "Celebrate your birthday, family reunion or any other private event. We offer semi-private and private rooms. Seats up to 12 guests.", img: [p_S2_1, p_S2_2, p_S2_3, p_S2_4] },
    { _id: "s-coprate_event", title: "CORPORATE EVENTs", detail: "We provide excellent facilities for corporate events, including meetings, team-building days, and recreational events. Ready-made packages include murder mystery lunches, role-playing dinners, private karaoke nights, and '90s discos with a dedicated DJ.", img: [p_S3_1, p_S3_2, p_S3_3, p_S3_4] },
    { _id: "s-community", title: "COMMUNITY", detail: "Discord channel has over 1,500 active members, and games are often hosted by Finnish game developers.", img: [p_S4_1, p_S4_2, p_S4_3] }]
