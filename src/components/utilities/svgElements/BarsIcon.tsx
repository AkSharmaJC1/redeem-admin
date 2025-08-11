const BarsIcon = (props: { className?: string }) => {
	const { className } = props;
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			className={className}
		>
			<path
				d="M3 12H15M3 6H21M3 18H21"
				stroke="#CECFD2"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export default BarsIcon;
