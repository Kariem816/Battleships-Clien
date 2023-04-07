import { useEffect, useRef, useState } from "react";
import { useSocket } from "../contexts/socketContext";
import Button from "./Button";

export default function LoginForm() {
	const { socket, connected, playerName, loggedIn } = useSocket();
	const [name, setName] = useState(playerName);
	const errorRef = useRef();

	useEffect(() => {
		socket.on("login-error", (message) => {
			errorRef.current.innerText = message;
		});

		socket.on("logged-in", (res) => {
			setName(res);
			errorRef.current.innerText = "";
		});

		socket.on("logged-out", () => {
			setName("");
			errorRef.current.innerText = "";
		});

		return () => {
			socket.off("login-error");
		};
	}, []);

	function handleLogin(e) {
		if (loggedIn) socket.emit("logout");
		else socket.emit("login", name);
	}

	return (
		<>
			<div className="input-pair">
				<label htmlFor="playerName">Player Name</label>
				<input
					type="text"
					id="playerName"
					name="playerName"
					value={name}
					onChange={(e) => setName(e.target.value)}
					className="input"
					disabled={!connected || loggedIn}
				/>
				<Button
					onClick={handleLogin}
					disabled={!connected}
					className={loggedIn ? "error" : "success"}
				>
					{loggedIn ? "Logout" : "Login"}
				</Button>
			</div>
			<span className="error-text" ref={errorRef}></span>
		</>
	);
}
