import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Join from "./pages/Join";
import Host from "./pages/Host";
import Game from "./pages/Game";
import Footer from "./components/Footer";

export default function App() {
	const router = createBrowserRouter([
		{
			path: "/",
			element: <Home />,
		},
		{
			path: "/join",
			element: <Join />,
		},
		{
			path: "/host",
			element: <Host />,
		},
		{
			path: "/game/:roomId",
			element: <Game />,
		},
	]);

	return (
		<>
			<RouterProvider router={router} />
			<Footer />
		</>
	);
}
