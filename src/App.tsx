import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import about from './assets/about.mov';
import burger from './assets/burger.jpg';
import hashbrowns from './assets/hashbrowns.jpg';
import sandwich from './assets/sandwich.avif';

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
	const images = useMemo(() => [burger, burger, burger, burger], []);
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
				John's burgers is really cool.
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
		items: [
			{
				name: "burger1",
				description: "burger",
				icon: burger,
				price: 123213,
				calories: 1238123
			},
			{
				name: "burger2",
				description: "burger",
				icon: hashbrowns,
				price: 123213,
				calories: 1238123
			},
			{
				name: "burger3",
				description: "burger",
				icon: sandwich,
				price: 123213,
				calories: 1238123
			}
		]
	}
]

function Course({ course }: { course: Course }) {
	return <>
		<SectionHeader text={course.title} />
		{course.items.map((item, i) => <BurgerItem offset={i % 2 == 1} offsetThird={i % 3 == 2} {...item} key={i} />)}
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
