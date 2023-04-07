import { useState } from "react";
import { Link } from "react-router-dom";

export default function Button({ to, className, onClick, ...props }) {
	const [debounced, setDebounced] = useState(false);

	if (to) {
		return (
			<Link
				to={to}
				className={className ? className + " btn" : "btn"}
				{...props}
			/>
		);
	}

	function handleClick() {
		if (debounced) return;
		setDebounced(true);
		onClick();
		setTimeout(() => {
			setDebounced(false);
		}, 300);
	}

	return (
		<button
			type="button"
			className={className ? className + " btn" : "btn"}
			onClick={onClick ? handleClick : null}
			{...props}
		/>
	);
}
