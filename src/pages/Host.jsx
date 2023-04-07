import Button from "../components/Button";
import { useSocket } from "../contexts/socketContext";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import LoginForm from "../components/LoginForm";
import { useLocalStorage } from "../hooks/useStorage";

export default function Host() {
	const { socket, connected } = useSocket();
	const [roomType, setRoomType] = useLocalStorage("host-room-type", "public");
	const [maxPlayers, setMaxPlayers] = useLocalStorage("host-max-players", 10);
	const errorRef = useRef();
	const navigate = useNavigate();

	useEffect(() => {
		socket.on("hosted", (res) => {
			navigate("/game/" + res);
		});

		socket.on("host-error", (message) => {
			errorRef.current.innerText = message;
		});

		return () => {
			socket.off("hosted");
			socket.off("host-error");
		};
	}, []);

	function handleChange(e) {
		setRoomType(e.target.value);
	}

	function handleSubmit(e) {
		e.preventDefault();
		socket.emit("host", { type: roomType, size: maxPlayers });
	}

	return (
		<div className="host-game">
			<Button
				style={{
					position: "absolute",
					top: "10px",
					left: "10px",
					zIndex: "1000",
				}}
				to="/"
			>
				Back
			</Button>
			<div className="info-container">
				<h1>Host</h1>
				<p>
					Here you can host a game. You will be given a room code that
					you can give to your friends to join your game.
				</p>
			</div>
			<form className="form" onSubmit={handleSubmit}>
				<LoginForm />
				<fieldset>
					<legend>Room Type</legend>
					<input
						type="radio"
						name="room-type"
						id="public-room"
						value="public"
						checked={roomType === "public"}
						onChange={handleChange}
					/>
					<label htmlFor="public-room">Public</label>
					<input
						type="radio"
						name="room-type"
						id="private-room"
						value="private"
						checked={roomType === "private"}
						onChange={handleChange}
					/>
					<label htmlFor="private-room">Private</label>
				</fieldset>
				<div className="input-pair">
					<label htmlFor="max-players">Max Players</label>
					<input
						type="number"
						name="max-players"
						id="max-players"
						min="2"
						max="10"
						className="input"
						value={maxPlayers}
						onChange={(e) => setMaxPlayers(e.target.value)}
					/>
				</div>
				<Button type="submit" disabled={!connected}>
					Host Game
				</Button>
				<span className="error-text" ref={errorRef}></span>
			</form>
		</div>
	);
}
