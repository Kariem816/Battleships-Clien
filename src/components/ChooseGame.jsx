import Button from "./Button";

export default function ChooseGame() {
	return (
		<div className="choose-game">
			<h2>Choose a game mode</h2>
			<div className="game-mode">
				<Button to="/join">Join</Button>
				<Button to="/host">Host</Button>
			</div>
		</div>
	);
}
