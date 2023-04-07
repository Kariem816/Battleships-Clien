import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import SocketProvider from "./contexts/socketContext";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<SocketProvider>
		<App />
	</SocketProvider>
);
