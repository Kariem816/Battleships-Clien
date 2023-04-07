export default function BoardGrid({
	grid,
	onDrop,
	onClick,
	hits = [],
	misses = [],
}) {
	function handleClick(e) {
		if (!onClick) return;
		const index = e.target.dataset.index;
		onClick(index);
	}

	return (
		<div
			className="board-grid"
			ref={grid}
			onDrop={onDrop}
			onDragOver={(e) => e.preventDefault()}
			onDragLeave={(e) => e.preventDefault()}
		>
			{Array(100)
				.fill()
				.map((_, i) => {
					return (
						<div
							key={i}
							className={`board-grid-cell${
								hits.includes(i) ? " hit" : ""
							}${misses.includes(i) ? " miss" : ""}`}
							onDragLeave={(e) => e.preventDefault()}
							data-index={i}
							onClick={handleClick}
						></div>
					);
				})}
			<div className="grid-letters">
				{["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"].map(
					(letter, i) => (
						<div key={i} className="board-grid-letter">
							{letter}
						</div>
					)
				)}
			</div>

			<div className="grid-numbers">
				{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number, i) => (
					<div key={i} className="board-grid-number">
						{number}
					</div>
				))}
			</div>
		</div>
	);
}
