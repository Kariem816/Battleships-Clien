import heroImg from "../assets/hero-background.jpg";

export default function Hero() {
	return (
		<div className="hero-section">
			<img src={heroImg} alt="hero" className="hero-img" />
			<div className="hero-text">
				<h1>Battle Ships</h1>
				<p>
					A game of strategy and luck. Sink your opponent's ships
					before they sink yours.
				</p>
			</div>
		</div>
	);
}
