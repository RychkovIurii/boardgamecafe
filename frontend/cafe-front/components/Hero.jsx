import ".Style/HeroStyles.css";

function Hero(props){
	return(
		<div className={props.cName}>
			<img className="imgClass" alt="HeroImg" src={props.heroImage}/>

			<div className="hero-text">
				<h1>{props.title}</h1>
				<p>{props.text}</p>
				<a href={props.url} className={props.linkClass}>
					{props.linkText}
				</a>

			</div>
		</div>
	)
}

export default Hero;