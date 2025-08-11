const BackIcon = (props: { className?: string }) => {
	const { className } = props;
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="25"
			viewBox="0 0 24 25"
			fill="none"
			className={className}
		>
			<g clipPath="url(#clip0_1766_1085)">
				<path
					d="M5 12.5H19"
					stroke="#F9F9F9"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M5 12.5L9 16.5"
					stroke="#F9F9F9"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M5 12.5L9 8.5"
					stroke="#F9F9F9"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</g>
			<defs>
				<clipPath id="clip0_1766_1085">
					<rect
						width="24"
						height="24"
						fill="white"
						transform="translate(0 0.5)"
					/>
				</clipPath>
			</defs>
		</svg>
	);
};

export default BackIcon;
