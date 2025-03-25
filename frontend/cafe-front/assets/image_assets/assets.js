import logo from './logo.svg'
import up_icon from './up_icon.svg'
import down_icon from './down_icon.svg'
import arrow_icon from './arrow_icon.svg'
import cross_icon from './cross_icon.png'
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

export const steps = [
	{
		label: 'home.steps.How to find us',
		image: location_dot_icon,
		details: {
			process: {
				step1: 'home.steps.Visit us at'
			},
			marks: {
				mark1: 'home.steps.Accessibility',
				mark2: 'home.steps.Pets'
			},
		},
	},
	{
		label: 'home.steps.Ordering process',
		image: cashRegister_icon,
		details: {
			process: {
				step1: 'home.steps.Go to counter',
				step2: 'home.steps.Pay first',
				step3: 'home.steps.Ask menu'
			},
			marks: {
				mark1: 'home.steps.No outside food',
				mark2: 'home.steps.Use our menu'
			},
		},
	},
	{
		label: 'home.steps.Need Help?',
		image: circleInfo_icon,
		details: {
			process: {
				step1: 'home.steps.Staff help',
				step2: 'home.steps.Tutorial offer'
			},
			marks: {
				mark1: 'home.steps.Safe place',
				mark2: 'home.steps.Respect games'
			},
		},
	},
];


export const aboutMenu = [
	{ title: "home.aboutMenu.How it works", text: "home.aboutMenu.Understand process", link: "/faq", img: chest_box_close },
	{ title: "home.aboutMenu.Menu", text: "home.aboutMenu.Explore pricing", link: "/pricing", img: chest_box_close },
	{ title: "home.aboutMenu.Service", text: "home.aboutMenu.Staff help", link: "/service", img: chest_box_close }
];

export const serviceMenu = [
	{
		_id: "s-food",
		title: "home.serviceMenu.RESTAURANT/CAFE/BAR",
		detail: "home.serviceMenu.Restaurant detail",
		img: [p_S1_1, p_S1_2, p_S1_3, p_S1_4, p_S1_5, p_S1_6, p_S1_7, p_S1_8]
	},
	{
		_id: "s-private",
		title: "home.serviceMenu.PRIVATE ROOMS",
		detail: "home.serviceMenu.Private detail",
		img: [p_S2_1, p_S2_2, p_S2_3, p_S2_4]
	},
	{
		_id: "s-coprate_event",
		title: "home.serviceMenu.CORPORATE EVENTS",
		detail: "home.serviceMenu.Corporate detail",
		img: [p_S3_1, p_S3_2, p_S3_3, p_S3_4]
	},
	{
		_id: "s-community",
		title: "home.serviceMenu.COMMUNITY",
		detail: "home.serviceMenu.Community detail",
		img: [p_S4_1, p_S4_2, p_S4_3]
	}
];
