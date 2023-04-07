import { useRef, useState } from "react";
import { useGame } from "../../contexts/gameContext";
import { useSocket } from "../../contexts/socketContext";
import { FaCopy, FaCheck } from "react-icons/fa";

export default function GameHeader() {
	const { playerName } = useSocket();
	const { roomId, gameState, getUsername, isUserTurn } = useGame();
	const [copied, setCopied] = useState(false);

	async function copyRoomID() {
		// navigator clipboard api needs a secure context (https)
		if (navigator.clipboard && window.isSecureContext) {
			// navigator clipboard api method'
			return navigator.clipboard.writeText(roomId);
		} else {
			// text area method
			let textArea = document.createElement("textarea");
			textArea.value = roomId;
			// make the textarea out of viewport
			textArea.style.position = "fixed";
			textArea.style.left = "-999999px";
			textArea.style.top = "-999999px";
			document.body.appendChild(textArea);
			textArea.focus();
			textArea.select();
			return new Promise((resolve, reject) => {
				// here the magic happens
				document.execCommand("copy") ? resolve() : reject();
				textArea.remove();
			});
		}
	}

	async function handleCopy() {
		if (copied) return;
		await copyRoomID();
		setCopied(true);
		setTimeout(() => {
			setCopied(false);
		}, 3000);
	}

	function gameStateText() {
		if (gameState.state === "idle") {
			if (gameState.players.length === 2) {
				return "waiting for host to start";
			} else {
				return "waiting for 2 players";
			}
		} else if (gameState.state === "setup") {
			return "placing ships";
		} else if (gameState.state === "playing") {
			if (isUserTurn) return "your turn";
			else return `${getUsername(gameState.turn)}'s turn`;
		} else if (gameState.state === "finished") {
			return "game finished";
		}
	}

	return (
		<div className="game-info">
			<h1>Battle Ships</h1>
			<div className="game-info-container">
				<p>
					Room ID:{" "}
					<span className="btn">
						{roomId}
						<button className="btn icon-btn" onClick={handleCopy}>
							{copied ? <FaCheck /> : <FaCopy />}
						</button>
					</span>
				</p>
				<p>
					Host: <span className="btn">{gameState.host.username}</span>
				</p>
				<p>
					Player Name: <span className="btn">{playerName}</span>
				</p>
				<p>
					Game State: <span className="btn">{gameStateText()}</span>
				</p>
			</div>
			<div className="game-info-container">
				<p>
					Public:{" "}
					<span className="btn">
						{gameState.type === "public" ? "yes" : "no"}
					</span>
				</p>
				<p>
					Users:{" "}
					<span className="btn">
						{gameState.users.length} / {gameState.size}
					</span>
				</p>
				<p>
					Players:{" "}
					<span className="btn">{gameState.players.length} / 2</span>
				</p>
			</div>
		</div>
	);
}
