import { useState, useContext, createContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useSocket } from "./socketContext";

const GameContext = createContext();

export function useGame() {
	return useContext(GameContext);
}

export default function GameProvider({ children }) {
	const { socket } = useSocket();
	const [gameState, setGameState] = useState({
		state: "idle",
		users: [],
		players: [],
		host: { id: 0, username: "" },
	});
	const [isPlaying, setIsPlaying] = useState(false);
	const [isHost, setIsHost] = useState(false);
	const [isUserTurn, setIsUserTurn] = useState(false);
	const [allReady, setAllReady] = useState(false);
	const [isReady, setIsReady] = useState(false);
	const { roomId } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		let roomError = false;
		socket.emit("game-state");

		socket.on("connect", () => {
			socket.emit("game-state");
		});

		socket.on("game-state", (room) => {
			setGameState(room);
		});

		socket.on("game-state-error", (err) => {
			console.log("game-state-error", err);
			if (err === "You are not in a game" && !roomError) {
				new Promise((resolve) => {
					setTimeout(resolve, 2000);
				}).then(() => {
					roomError = true;
					socket.emit("game-state");
				});
				return;
			}
			navigate("/");
		});

		socket.on("game-action", ({ action, data }) => {
			if (action === "attacked") {
				setGameState(data.game);
			} else {
				setGameState(data);
			}
		});

		return () => {
			socket.emit("leave-room");
			socket.off("game-state");
			socket.off("game-state-error");
			socket.off("game-action");
		};
	}, []);

	useEffect(() => {
		setIsPlaying(
			gameState.players.some((player) => player.user.id === socket.id)
		);
		setAllReady(gameState.players.every((player) => player.ready));
		setIsReady(
			gameState.players.find((player) => player.user.id === socket.id)
				?.ready ?? false
		);
	}, [gameState.players]);

	useEffect(() => {
		setIsHost(gameState.host.id === socket.id);
	}, [gameState.host]);

	useEffect(() => {
		setIsUserTurn(gameState.turn === socket.id);
	}, [gameState.turn]);

	function getUsername(id) {
		return gameState.players.find((player) => player.user.id === id).user
			.username;
	}

	return (
		<GameContext.Provider
			value={{
				roomId,
				gameState,
				isPlaying,
				isHost,
				allReady,
				isReady,
				isUserTurn,
				getUsername,
			}}
		>
			{children}
		</GameContext.Provider>
	);
}
