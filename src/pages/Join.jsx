import { useEffect, useRef, useState } from "react";
import { useSocket } from "../contexts/socketContext";
import Button from "../components/Button";
import LoginForm from "../components/LoginForm";
import { useNavigate } from "react-router";
import { useLocalStorage } from "../hooks/useStorage";

export default function Join() {
	const { socket, connected } = useSocket();
	const [roomCode, setRoomCode] = useState("");
	const [roomType, setRoomType] = useLocalStorage("join-room-type", "public");
	const errorRef = useRef();
	const navigate = useNavigate();

	useEffect(() => {
		socket.on("joined", (res) => {
			navigate("/game/" + res);
		});

		socket.on("join-error", (message) => {
			errorRef.current.innerText = message;
		});

		return () => {
			socket.off("joined");
			socket.off("join-error");
		};
	}, []);

	function handleChange(e) {
		setRoomType(e.target.value);
	}

	function handleSubmit(e) {
		e.preventDefault();
		socket.emit("join", roomCode);
	}

	return (
		<div className="join-game">
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
				<h1>Join</h1>
				<p>
					Here you can join a game. You will need a room code from
					your friend to join their game.
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
				{roomType === "private" ? (
					<>
						<div className="input-pair">
							<label htmlFor="room-code">Room Code</label>
							<input
								type="text"
								name="room-code"
								id="room-code"
								value={roomCode}
								onChange={(e) => setRoomCode(e.target.value)}
								className="input"
							/>
						</div>
						<span className="error-text" ref={errorRef}></span>
						<Button type="submit" disabled={!connected}>
							Join Game
						</Button>
					</>
				) : (
					<>
						<Rooms />
						<span className="error-text" ref={errorRef}></span>
					</>
				)}
			</form>
		</div>
	);
}

function Rooms() {
	const { socket, connected } = useSocket();
	const [rooms, setRooms] = useState([]);

	useEffect(() => {
		const interval = setInterval(() => {
			socket.emit("public-rooms");
		}, 1000);

		socket.on("public-rooms", (res) => {
			setRooms(res);
		});

		socket.on("public-rooms-error", () => {
			setRooms([]);
		});

		return () => {
			clearInterval(interval);
			socket.off("public-rooms");
			socket.off("public-rooms-error");
		};
	}, []);

	function refreshRooms() {
		socket.emit("public-rooms");
	}

	function handleJoin(roomId) {
		socket.emit("join", roomId);
	}

	return (
		<div className="rooms">
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<h2>Public Rooms</h2>
				<Button disabled={!connected} onClick={refreshRooms}>
					Refresh
				</Button>
			</div>
			{rooms.length ? (
				<ul>
					{rooms.map((room) => (
						<li key={room.id}>
							<span>{room.id}</span>
							<span>{room.host}</span>
							<span>
								{room.userCount} / {room.size}
							</span>
							<Button
								onClick={() => handleJoin(room.id)}
								disabled={room.userCount == room.size}
							>
								Join
							</Button>
						</li>
					))}
				</ul>
			) : (
				<p>There are no public rooms available.</p>
			)}
		</div>
	);
}
