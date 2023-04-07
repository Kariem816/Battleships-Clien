import { useState } from "react";

export default function Ship({ ship, style, ...props }) {
	const styles = {
		...style,
		"--size": ship.size,
		backgroundImage: `url(../ships/ship_${ship.index}/${
			ship.rotation === "horizontal" ? "h" : "v"
		}${ship.destroyed ? "_destroyed" : ""}.png)`,
	};
	return (
		<div
			className={`ship ship-${ship.index} ${ship.rotation}${
				ship.selected ? " selected" : ""
			}`}
			style={styles}
			{...props}
		></div>
	);
}
