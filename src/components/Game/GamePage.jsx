import { useGame } from "../../contexts/gameContext";
import GameSidebar from "../GameSidebar";
import FinishGame from "./FinishGame";
import GameHeader from "./GameHeader";
import PlayBoard from "./PlayBoard";
import SetupBoard from "./SetupBoard";
import WaitingBoard from "./WaitingBoard";

export default function GamePage() {
	const { gameState, isPlaying } = useGame();

	return (
		<div className="game-page">
			<GameHeader />
			<div className="game-container">
				<div className="game">
					{gameState.state === "idle" &&
						gameState.users.length <= 2 && (
							<h1>Waiting for another player...</h1>
						)}
					{gameState.state === "idle" && <WaitingBoard />}
					{gameState.state === "setup" &&
						(isPlaying ? <SetupBoard /> : <WaitingBoard />)}
					{(gameState.state === "playing" ||
						gameState.state === "finished") && <PlayBoard />}
					{gameState.state === "finished" && <FinishGame />}
				</div>
				<GameSidebar />
			</div>
		</div>
	);
}
