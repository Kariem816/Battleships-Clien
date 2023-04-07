import { useGame } from "../../contexts/gameContext";
import Button from "../Button";

export default function FinishGame() {
	const { isWinner, isPlaying, winner } = useGame();

	function handleRetry() {
		socket.emit("game-action", {
			action: "play-again",
		});
	}

	return (
		<div className="finish-game">
			<h1>
				{isPlaying
					? isWinner
						? "Congratulations! You won!"
						: "You lost!"
					: `${winner} won!`}
			</h1>
			<Button onClick={handleRetry}>Again?</Button>
		</div>
	);
}
