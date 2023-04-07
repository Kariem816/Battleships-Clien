import { useEffect, useState } from "react";
import { useSocket } from "../../contexts/socketContext";
import { useGame } from "../../contexts/gameContext";
import playAudio from "../../utils/playAudio";
import AttackBoard from "./AttackBoard";

export default function PlayBoard() {
	const { socket } = useSocket();
	const {
		gameState: { players },
	} = useGame();
	const [isAttackDisabled, setIsAttackDisabled] = useState(false);

	useEffect(() => {
		socket.on("game-action", ({ action, data }) => {
			if (action === "attacked") {
				setIsAttackDisabled(true);
				if (data.result === "destroyed") {
					playAudio("blast");
				} else if (data.result === "hit") {
					playAudio("hit");
				} else if (data.result === "miss") playAudio("miss");
				setTimeout(() => {
					setIsAttackDisabled(false);
				}, 2000);
			}
		});
	}, []);

	return (
		<div className="play-board">
			{players.map((player, i) => (
				<AttackBoard
					key={i}
					board={player.board}
					boardOwner={player.user}
					disabled={isAttackDisabled}
				/>
			))}
		</div>
	);
}
