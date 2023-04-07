import { useSocket } from "../contexts/socketContext";
import { useEffect, useRef, useState } from "react";
import Button from "./Button";

export default function GameSidebar() {
	const { socket, connected } = useSocket();
	const contentRef = useRef();

	useEffect(() => {
		socket.on("message", (message) => {
			contentRef.current.innerHTML += `<p><strong>${message.sender}</strong>: ${message.text}</p>`;
			contentRef.current.scrollTop = contentRef.current.scrollHeight;
		});

		socket.on("system-message", (message) => {
			contentRef.current.innerHTML += `<p class="${message.type}-text"><i>${message.text}</i></p>`;
			contentRef.current.scrollTop = contentRef.current.scrollHeight;
		});

		return () => {
			socket.off("message");
			socket.off("system-message");
		};
	}, []);

	function handleMessage(message) {
		socket.emit("message", message);
	}

	return (
		<div className="game-sidebar">
			<div className="messages-container">
				<div className="messages" ref={contentRef}></div>
			</div>
			<MessageForm onMessage={handleMessage} disabled={!connected} />
		</div>
	);
}

function MessageForm({ onMessage, disabled }) {
	const [message, setMessage] = useState("");

	function handleSubmit(e) {
		e.preventDefault();
		onMessage(message);
		setMessage("");
	}

	return (
		<form className="message-form" onSubmit={handleSubmit}>
			<input
				className="input"
				type="text"
				value={message}
				onChange={(e) => setMessage(e.target.value)}
			/>
			<Button
				type="submit"
				disabled={!message || message.trim().length === 0 || disabled}
			>
				Send
			</Button>
		</form>
	);
}
