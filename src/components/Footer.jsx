export default function Footer() {
	const styles = {
		footer: {
			backgroundColor: "#000",
			color: "#fff",
			padding: "1rem",
			textAlign: "center",
		},
	};

	return (
		<footer style={styles.footer}>
			<p>
				Made with{" "}
				<span role="img" aria-label="love">
					❤️
				</span>{" "}
				by{" "}
				<a
					href="https://github.com/Kariem816"
					target="_blank"
					rel="noopener noreferrer"
					style={{ color: "#fff" }}
				>
					Bumble
				</a>
			</p>
		</footer>
	);
}
