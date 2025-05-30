import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import about from './assets/about.mp4';
import bacon from './assets/bacon.jpg';
import buffalo from './assets/buffalo.webp';
import burger from './assets/burger.jpg';
import classic from './assets/classic.avif';
import french from './assets/french.jpg';
import hashbrowns from './assets/hashbrowns.jpg';
import salad from './assets/salad.jpg';
import sandwich from './assets/sandwich.avif';
import waffles from './assets/waffles.webp';

const currencyFormat = new Intl.NumberFormat("en-us", { style: "currency", currency: "USD" });

function add(...k: [string, boolean][]) {
	const o = new Array<string>();

	for (const [str, should] of k) {
		if (should) o.push(str);
	}

	return o.join(" ");
}

function BurgerItem({ icon, name, description, price, calories, offset, offsetThird }: { icon: string, name: string, description: string, price: number, calories: number, offset: boolean, offsetThird: boolean }) {
	return <div id={name} className={add(["burger-item", true], ["offset", offset], ["offset-third", offsetThird])}>
		<img src={icon} className='burger-icon'></img>
		<div className='burger-info'>
			<a href={`#${name}`}><h1>{name}</h1></a>
			<p>{description}</p>
			<div className='filler'></div>
			<div className='fields'>
				<span className='price'>{currencyFormat.format(price)}</span>
				<span className='calories'>{calories} kcal</span>
			</div>
		</div>
	</div>
}

const AUTO_CAROUSEL_TIME = 5000;
const ANIMATION_LENGTH = 1000;

function lerp(start: number, end: number, amt: number) {
	return (1 - amt) * start + amt * end;
}

function clamp(x: number, min: number, max: number) {
	return Math.max(Math.min(x, max), min);
}

function doAnimation(element: HTMLDivElement, start: number, goal: number) {
	let startTime: number;

	const callback = (timestamp: number) => {
		if (startTime !== undefined) {
			const elapsed = timestamp - startTime;

			if (elapsed > ANIMATION_LENGTH) {
				return
			}

			const shift = lerp(start, goal, clamp(elapsed / ANIMATION_LENGTH, 0, 1));

			element.style.paddingRight = `${shift * 200}vw`;
		} else {
			startTime = timestamp;
		}

		window.requestAnimationFrame(callback);
	}

	window.requestAnimationFrame(callback);
}

function Carousel() {
	const images = useMemo(() => [burger, classic, bacon, sandwich], []);
	const [state, setState] = useState(0);
	const carouselRef = useRef<HTMLDivElement>(null);

	const changeState = useCallback((newState: number) => {
		const oldState = state;

		doAnimation(carouselRef.current!, oldState, newState);

		setState(newState);
	}, [state]);

	useEffect(() => {
		setTimeout(() => {
			changeState(state == images.length - 1 ? 0 : state + 1);
		}, AUTO_CAROUSEL_TIME);
	}, [state, changeState, images])

	return <div className='carousel' ref={carouselRef}>
		{images.map(img => <img src={img} />)}
	</div>
}

function AboutPage() {
	return <>
		<SectionHeader text='ABOUT US' />
		<div className='about'>
			<video autoPlay muted loop>
				<source src={about} />
			</video>
			<h1>
				Welcome to John's Burgers.
			</h1>
			<p>
				John Burger (inventor of the burger) always wanted to make people happy with his food. Thanks to the hard work of our staff, we're able to fulfill his legacy.
				<br />
				<br />
				In case you're unsure about whether John's Burgers is worth going to, explore our menu below.
			</p>
		</div>
	</>;
}

function RestaurantHero() {
	return <div className='hero'>
		<Carousel />
		<h1>JOHN'S BURGERS</h1>
	</div>;
}

function SectionHeader({ text }: { text: string }) {
	return <div className='section-header' id={text}>
		<a href={`#${text.toLowerCase()}`}><h1>{text}</h1></a>
	</div>;
}

type Course = {
	title: string;
	offset: boolean;
	items: {
		name: string;
		description: string;
		icon: string;
		price: number;
		calories: number;
	}[];
};

const courses = [
	{
		title: "BREAKFAST",
		offset: false,
		items: [
			{
				name: "Deluxe Pancakes",
				description: "There are rumors that John discovered his famous pancake formula when he got stuck in the Alps for a month. Rumor or not, his deluxe pancakes are all you need to live a good life.",
				icon: waffles,
				price: 12.99,
				calories: 400
			},
			{
				name: "Hashbrowns and Eggs",
				description: "John's hashbrowns have been considered the very best by 90% of Americans in the years 1850-1920. Don't believe us? Prove us wrong by trying them yourself.",
				icon: hashbrowns,
				price: 8.99,
				calories: 600
			},
			{
				name: "Classic Breakfast Sandwich",
				description: "Before John finalized his invention of the burger, he prototyped a sandwich which was perfect for eating in the morning. Bruce Lee used to have one everyday.*",
				icon: sandwich,
				price: 14.99,
				calories: 1150
			}
		]
	},
	{
		title: "GREENS & SIDES",
		offset: true,
		items: [
			{
				name: "Malaysian Salad",
				description: "When John got stuck in Malaysia for a week due to passport problems, he spent that time creating the best salad ever experienced by mankind.",
				icon: salad,
				price: 13.99,
				calories: 700
			},
			{
				name: "Buffalo Wings",
				description: "John invented the Buffalo Wing when he discovered winged buffalos in North Dakota during the early 1900s, just a couple years before they went extinct. Experience it yourself, today.",
				icon: buffalo,
				price: 11.99,
				calories: 850
			},
			{
				name: "Deluxe Fries",
				description: "While we can't say that his fries are made out of real French people, we can guarantee the taste to be like that of French cuisine.",
				icon: french,
				price: 7.99,
				calories: 250
			}
		]
	},
	{
		title: "BURGERS",
		offset: false,
		items: [
			{
				name: "Bacon Burger",
				description: "John's Bacon Burger has both a layer of bacon and a bacon filled patty. What more can you ask for?",
				icon: bacon,
				price: 19.99,
				calories: 1200
			},
			{
				name: "Italian Burger",
				description: "John derived the Italian burger during his time in Italy in the early 1900s. He considered combining pizza and burgers, but decided on this instead.",
				icon: burger,
				price: 15.99,
				calories: 1300
			},
			{
				name: "Classic Burger",
				description: "Simple yet savory, John's original burger is once again on the menu. Using the same style that pleased thousands long ago, experience the burger that made John Burger.",
				icon: classic,
				price: 21.99,
				calories: 950
			}
		]
	}
]

function Course({ course }: { course: Course }) {
	return <>
		<SectionHeader text={course.title} />
		{course.items.map((item, i) => <BurgerItem offset={course.offset ? i % 2 == 0 : i % 2 == 1} offsetThird={i % 3 == 2} {...item} key={i} />)}
	</>
}

function ContactPage() {
	return <div className='contact'>
		<h1>NOT SATISFIED?</h1>
		<p>Feel free to contact us below if there's anything you think we should add or if there are any problems with our menu.</p>
		<a href="tel:+11234567890"><span>+1 (123) 456-7890</span></a>
		<a href="mailto:john.burger@gmail.com"><span>john.burger@gmail.com</span></a>
		<a href="https://www.google.com/maps/place/47+W+13th+St+New+York+NY+10011+USA"><span>47 W 13th St, New York, NY 10011, USA</span></a>
	</div>;
}

function App() {
	return (
		<>
			<RestaurantHero />
			<AboutPage />
			{courses.map(course => <Course course={course} />)}
			<ContactPage />
		</>
	)
}

export default App
