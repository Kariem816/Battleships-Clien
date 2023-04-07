import { useState, useEffect, useContext, createContext } from "react";
import { useParams } from "react-router";
import { io } from "socket.io-client";
import { useLocalStorage } from "../hooks/useStorage";

const SocketContext = createContext();
const socket = io();

export function useSocket() {
	return useContext(SocketContext);
}

export default function SocketProvider({ children }) {
	const [connected, setConnected] = useState(socket.connected);
	const [playerName, setPlayerName] = useLocalStorage("playerName", "");
	const [loggedIn, setLoggedIn] = useState(false);

	useEffect(() => {
		socket.on("connect", () => {
			setConnected(true);
			socket.emit("login", playerName);
		});
		socket.on("disconnect", (reason) => {
			console.log("disconnected", reason);
			setConnected(false);
		});
		socket.on("logged-in", (res) => {
			setPlayerName(res);
			setLoggedIn(true);
		});

		socket.on("logged-out", () => {
			setPlayerName("");
			setLoggedIn(false);
		});

		return () => {
			socket.off("connect");
			socket.off("disconnect");
			socket.off("logged-in");
			socket.off("logged-out");
		};
	}, []);

	return (
		<SocketContext.Provider
			value={{ socket, connected, playerName, loggedIn }}
		>
			{children}
		</SocketContext.Provider>
	);
}
