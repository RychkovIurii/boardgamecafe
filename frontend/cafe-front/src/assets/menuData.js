export const menuData = [
    {
        menuType: 'Gaming Fee',
        image: 'board_game_icon.png',
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
        image: 'hotdrink.png',
        details: {
            description: '',
            pricing: [
                { item: '4Noppamokka', price: '3,90€' },
                { item: 'Coffees', options: ['Cappuccino', 'Latte', 'Americano', 'Espresso'], price: '4,90€' },
                { item: 'Teapot + cookie', price: '6,90€' },
                { item: 'Hot Chocolate', options: ['White', 'Latte', 'Milk', 'Dark'], price: '4,90€' },
                { item: 'Extras', options: ['Whipped Cream', 'Chili Syrup', 'Salty Caramel Syrup', 'Marshmallows'], price: '0,50€' }
            ]
        }
    },
    {
        menuType: 'Cold Drinks',
        image: 'softdrink.png',
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
        image: 'beer.png',
        details: {
            description: 'Big selection from local breweries and Ciders and Long Drinks etc. from the tap.',
            pricing: [{ item: 'Karhu lll', price: '8,90€' },
            { item: 'Crowmoor', price: '8,90€' },
            { item: 'Fat Lizard', price: '9,90€' }]
        }
    },
    {
        menuType: 'Food',
        image: 'pizza.png',
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
        image: 'logo.png',
        details: {
            description: 'Together with the small roastery Charlotta, we have developed a tasty and gentle coffee blend! NoppaMokka can also be bought at home, even as a gift. Together with NoppaMokka, you can taste our wonderful pastries. Dark roast now available. Also we have our own beer, too',
            pricing: [{ item: 'NoppaMokka', price: '5,90€' },
            { item: '3diceBrewery', price: '8,90€' }
            ]
        }
    }
];
