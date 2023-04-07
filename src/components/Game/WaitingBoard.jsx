import { useState } from "react";
import { useGame } from "../../contexts/gameContext";
import { useSocket } from "../../contexts/socketContext";
import Button from "../Button";

export default function WaitingBoard() {
	const { socket } = useSocket();
	const { gameState, isPlaying, isHost, allReady } = useGame();

	function startGame() {
		socket.emit("game-action", {
			action: "start-game",
		});
	}

	function handleNewPlayer() {
		socket.emit("game-action", {
			action: "new-player",
		});
	}

	function handleRemovePlayer() {
		socket.emit("game-action", {
			action: "remove-player",
		});
	}

	function handleAttack() {
		socket.emit("game-action", {
			action: "start-attack",
		});
	}

	return (
		<div className="waiting-board">
			{gameState.state === "setup" && (
				<h2>Please wait while players place their ships</h2>
			)}
			<FancyComponent />
			<div className="waiting-board-controls">
				{isPlaying ? (
					<Button onClick={handleRemovePlayer}>
						I don't want to play
					</Button>
				) : (
					<Button
						onClick={handleNewPlayer}
						disabled={!isPlaying && gameState.players.length === 2}
					>
						I want to play
					</Button>
				)}
				{isHost && gameState.players.length === 2 && (
					<Button onClick={startGame}>Place Ships</Button>
				)}
				{gameState.state === "setup" && isHost && allReady && (
					<Button onClick={handleAttack}>Attack</Button>
				)}
			</div>
		</div>
	);
}

function FancyComponent() {
	const [count, setCount] = useState(0);
	return (
		<div
			style={{
				margin: "1rem",
				padding: "1rem",
				border: "1px solid var(--color-secondary)",
			}}
		>
			<p>Count: {count}</p>
			<div style={{ display: "flex", gap: "1rem" }}>
				<Button onClick={() => setCount(count + 1)}>Increment</Button>
				<Button onClick={() => setCount(0)}>Reset</Button>
			</div>
		</div>
	);
}
