import GameProvider from "../contexts/gameContext";
import GamePage from "../components/Game/GamePage";

export default function Game() {
	return (
		<GameProvider>
			<GamePage />
		</GameProvider>
	);
}
