import { useSocket } from "../../contexts/socketContext";
import { useGame } from "../../contexts/gameContext";
import BoardGrid from "./BoardGrid";

import Ship from "./Ship";

export default function AttackBoard({ board, boardOwner }) {
	const { socket } = useSocket();
	const {
		isPlaying,
		gameState: { state },
	} = useGame();
	const ships = board.ships.map((ship, i) => (
		<Ship
			key={i}
			ship={ship}
			style={{
				position: "absolute",
				top: ship.location.y * 30 + 2,
				left: ship.location.x * 30 + 2,
			}}
		/>
	));

	function handleClick(cell) {
		if (!isPlaying || boardOwner.id === socket.id) return;
		socket.emit("game-action", {
			action: "attack",
			data: { cell: parseInt(cell) },
		});
	}

	return (
		<div
			className="attack-board-container"
			style={{ order: boardOwner.id === socket.id ? 1 : 2 }}
		>
			<div className="attack-board">
				<BoardGrid
					onClick={handleClick}
					hits={board.hits}
					misses={board.misses}
				/>
				{boardOwner.id === socket.id ||
				!isPlaying ||
				state === "finished"
					? ships
					: ships.filter((ship) => ship.props.ship.destroyed)}
			</div>
			<h2>{boardOwner.id === socket.id ? "You" : boardOwner.username}</h2>
		</div>
	);
}
