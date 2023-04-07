import { useEffect, useRef, useState } from "react";
import { useSocket } from "../../contexts/socketContext";
import BoardGrid from "./BoardGrid";
import Button from "../Button";
import Ship from "./Ship";

import "./game.css";
import { useGame } from "../../contexts/gameContext";

const INITIAL_SHIPS = [
	{
		index: 0,
		size: 2,
		rotation: "horizontal",
		location: null,
		cells: [],
		selected: false,
	},
	{
		index: 1,
		size: 3,
		rotation: "horizontal",
		location: null,
		cells: [],
		selected: false,
	},
	{
		index: 2,
		size: 3,
		rotation: "horizontal",
		location: null,
		cells: [],
		selected: false,
	},
	{
		index: 3,
		size: 4,
		rotation: "horizontal",
		location: null,
		cells: [],
		selected: false,
	},
	{
		index: 4,
		size: 5,
		rotation: "horizontal",
		location: null,
		cells: [],
		selected: false,
	},
];

function indexToCoordinates(index) {
	return {
		x: index % 10,
		y: Math.floor(index / 10),
	};
}

function coordinatesToIndex(x, y) {
	if (typeof x === "object") return x.x + x.y * 10;
	return x + y * 10;
}

function shipIndeces(location, size, rotation) {
	if (!location) return [];
	const indeces = [];
	for (let i = 0; i < size; i++) {
		if (rotation === "horizontal") {
			indeces.push(coordinatesToIndex(location.x + i, location.y));
		} else {
			indeces.push(coordinatesToIndex(location.x, location.y + i));
		}
	}
	return indeces;
}

function checkOutOfBounds(location, size, rotation) {
	if (!location) return false;
	if (rotation === "horizontal") {
		return (
			location.x + size > 10 ||
			location.x < 0 ||
			location.y < 0 ||
			location.y > 10
		);
	} else {
		return (
			location.y + size > 10 ||
			location.y < 0 ||
			location.x < 0 ||
			location.x > 10
		);
	}
}

export default function SetupBoard({ readyPlayers }) {
	const { socket } = useSocket();
	const { isHost, isReady, allReady } = useGame();
	const [ships, setShips] = useState(INITIAL_SHIPS);
	const gridCells = useRef(
		Array(100)
			.fill()
			.map((_, i) => {
				return {
					index: i,
					occupied: false,
				};
			})
	);
	const grid = useRef();

	useEffect(() => {
		// prettier-ignore
		function handleKeyUp(e) { // TODO: Fix this
			console.log("key up");
			if (e.key === "R" || e.key === "r") {
				console.log("key up r");
				handleRotate();
			}
			if (e.key === "Enter") {
				console.log("key up enter");
				handleReady();
			}
			if (e.key === "Escape" || e.key === " ") {
				console.log("key up escape");
				resetShips();
			}
			if (e.key === "1") {
				console.log("key up 1");
				handleShipClicked(ships[0]);
			}
			if (e.key === "2") {
				console.log("key up 2");
				handleShipClicked(ships[1]);
			}
			if (e.key === "3") {
				console.log("key up 3");
				handleShipClicked(ships[2]);
			}
			if (e.key === "4") {
				console.log("key up 4");
				handleShipClicked(ships[3]);
			}
			if (e.key === "5") {
				console.log("key up 5");
				handleShipClicked(ships[4]);
			}
		}

		document.addEventListener("keyup", handleKeyUp);

		return () => {
			document.removeEventListener("keyup", handleKeyUp);
		};
	}, []);

	function checkShipCollision(ship) {
		if (!ship.location) return false;
		const indeces = shipIndeces(ship.location, ship.size, ship.rotation);
		const newIndeces = indeces.filter((index) => {
			return !ship.cells.includes(index);
		});
		if (newIndeces.length === 0) return false;
		if (newIndeces.some((index) => index < 0 || index > 99)) return true;
		return newIndeces.some(
			(index) => gridCells.current[index]?.occupied ?? false
		);
	}

	function handleShipClicked(ship) {
		setShips((prevShips) => {
			return prevShips.map((prevShip) => ({
				...prevShip,
				selected: prevShip.index === ship.index,
			}));
		});
	}

	function handleOnDrag(e, ship) {
		// Add dragging effect
		e.target.classList.add("dragged");

		// Get the local location of the drag
		const {
			pageX,
			pageY,
			target: {
				offsetLeft,
				offsetTop,
				parentElement: {
					offsetLeft: parentOffsetLeft = 0,
					offsetTop: parentOffsetTop = 0,
				},
			},
		} = e;

		// setup variables to hold the local location of the drag
		let dragLocalLocation = 0;

		// calculate the local location of the drag
		if (ship.rotation === "horizontal") {
			if (
				offsetLeft + parentOffsetLeft > pageX ||
				offsetLeft === parentOffsetLeft
			) {
				dragLocalLocation = pageX - offsetLeft;
			} else {
				dragLocalLocation = pageX - (offsetLeft + parentOffsetLeft);
			}
		} else if (ship.rotation === "vertical") {
			if (
				offsetTop + parentOffsetTop > pageY ||
				offsetTop === parentOffsetTop
			) {
				dragLocalLocation = pageY - offsetTop;
			} else {
				dragLocalLocation = pageY - (offsetTop + parentOffsetTop);
			}
		}

		// calculate the drag part
		const dragPart = Math.ceil(dragLocalLocation / 30);

		// set the dataTransfer object
		e.dataTransfer.setData("ship", JSON.stringify(ship));
		e.dataTransfer.setData("dragPart", dragPart);

		// set this ship as selected
		handleShipClicked(ship);
	}

	function handleDragEnd(e) {
		e.target.classList.remove("dragged");
	}

	function handleOnDrop(e) {
		// get the ship data from the dataTransfer object
		const ship = JSON.parse(e.dataTransfer.getData("ship"));
		const dragPart = e.dataTransfer.getData("dragPart");

		// get the tile index and coordinates from the target element
		const tileIndex = e.target.dataset.index;
		if (!tileIndex) return;
		const location = indexToCoordinates(tileIndex);

		// calculate the ship location based on the dragPart
		if (ship.rotation === "horizontal") {
			location.x = location.x - dragPart + 1;
		} else if (ship.rotation === "vertical") {
			location.y = location.y - dragPart + 1;
		}

		// check if the ship is out of bounds
		if (checkOutOfBounds(location, ship.size, ship.rotation)) return;

		// check if the ship is overlapping with another ship
		if (
			checkShipCollision({
				...ship,
				location,
			})
		)
			return;

		// clear previous ship cells from the grid if the ship has been moved
		const shipCells = shipIndeces(location, ship.size, ship.rotation);
		const prevShipCells = shipIndeces(
			ship.location,
			ship.size,
			ship.rotation
		);

		// update the ship location
		setShips((prevShips) => {
			return prevShips.map((prevShip) => {
				if (prevShip.index === ship.index) {
					return { ...prevShip, location, cells: shipCells };
				}
				return prevShip;
			});
		});
		gridCells.current = gridCells.current.map((prevGridCell) => {
			if (shipCells.includes(prevGridCell.index)) {
				return { ...prevGridCell, occupied: true };
			} else if (prevShipCells.includes(prevGridCell.index)) {
				return { ...prevGridCell, occupied: false };
			}
			return prevGridCell;
		});
	}

	function handleRotate() {
		const ship = ships.find((ship) => ship.selected);
		if (!ship) return;
		const newRotation =
			ship.rotation === "horizontal" ? "vertical" : "horizontal";
		const newCells = shipIndeces(ship.location, ship.size, newRotation);
		if (checkOutOfBounds(ship.location, ship.size, newRotation)) return;
		if (
			ship.location &&
			checkShipCollision({
				...ship,
				rotation: newRotation,
			})
		)
			return;

		setShips((prevShips) => {
			return prevShips.map((prevShip) => {
				if (prevShip.index === ship.index) {
					return {
						...prevShip,
						rotation: newRotation,
						cells: newCells,
					};
				}
				return prevShip;
			});
		});
		gridCells.current = gridCells.current.map((prevGridCell) => {
			if (newCells.includes(prevGridCell.index)) {
				return { ...prevGridCell, occupied: true };
			} else if (ship.cells.includes(prevGridCell.index)) {
				return { ...prevGridCell, occupied: false };
			}
			return prevGridCell;
		});
	}

	function handleDragOut(e) {
		// TODO: optimize this then readd
		console.log("drag out", e);
		const shipData = e.dataTransfer.getData("ship");
		if (!shipData) return;
		const ship = JSON.parse(shipData);
		console.log(ship);
		if (!ship.location) return;
		// setShips((prevShips) => {
		// 	return prevShips.map((prevShip) => {
		// 		if (prevShip.index === ship.index) {
		// 			return { ...prevShip, location: null };
		// 		}
		// 		return prevShip;
		// 	});
		// });
		// setGridCells((prevGridCells) => {
		// 	return prevGridCells.map((prevGridCell) => {
		// 		if (ship.cells.includes(prevGridCell.index)) {
		// 			return { ...prevGridCell, occupied: false };
		// 		}
		// 		return prevGridCell;
		// 	});
		// });
	}

	function handleReady() {
		if (isReady) {
			socket.emit("game-action", {
				action: "unready",
			});
		} else {
			socket.emit("game-action", {
				action: "ready",
				data: ships,
			});
			setShips((prevShips) => {
				return prevShips.map((prevShip) => {
					return { ...prevShip, selected: false };
				});
			});
		}
	}

	function handleAttack() {
		socket.emit("game-action", {
			action: "start-attack",
			data: {},
		});
	}

	function resetShips() {
		setShips(INITIAL_SHIPS);
		gridCells.current = gridCells.current.map((gridCell) => {
			return { ...gridCell, occupied: false };
		});
	}

	return (
		<>
			<div className="setup-board">
				<div className="docks">
					{/* <div onDrop={handleDragOut} className="ship-dock"> */}
					{ships
						.filter((ship) => !ship.location)
						.map((ship, i) => (
							<Ship
								key={i}
								ship={ship}
								draggable
								onDragStart={(e) => handleOnDrag(e, ship)}
								onDragEnd={handleDragEnd}
								onClick={() => handleShipClicked(ship)}
							/>
						))}
					{/* </div> */}
					<Button
						onClick={handleRotate}
						style={{
							margin: "10px",
						}}
					>
						Rotate
					</Button>
				</div>
				<div className="game-board">
					<BoardGrid onDrop={handleOnDrop} grid={grid} />
					{ships
						.filter((ship) => ship.location)
						.map((ship, i) => (
							<Ship
								key={i}
								ship={ship}
								draggable
								onDragStart={(e) => handleOnDrag(e, ship)}
								onDragEnd={handleDragEnd}
								onClick={() => handleShipClicked(ship)}
								style={{
									position: "absolute",
									top: ship.location.y * 30 + 2,
									left: ship.location.x * 30 + 2,
								}}
							/>
						))}
				</div>
				<Button onClick={resetShips}>Reset Ships</Button>
			</div>
			<div className="setup-board-controls">
				<Button onClick={handleReady}>
					{isReady ? "Not Ready" : "Ready"}
				</Button>
				{isHost && allReady && (
					<Button onClick={handleAttack}>Attack</Button>
				)}
			</div>
		</>
	);
}
