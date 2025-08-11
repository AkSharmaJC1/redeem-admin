const AddIcon = (props: { className?: string }) => {
	const { className } = props;
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			className={className}
			style={{ stroke: "none" }}
		>
			<g clipPath="url(#clip0_2107_3191)">
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M12 22.8C17.9647 22.8 22.8 17.9648 22.8 12C22.8 6.03533 17.9648 1.19997 12 1.19997C6.03533 1.19997 1.19997 6.03533 1.19997 12C1.19997 17.9647 6.03533 22.8 12 22.8ZM12 24C18.6273 24 24 18.6273 24 12C24 5.37253 18.6273 0 12 0C5.37253 0 0 5.37253 0 12C0 18.6273 5.37253 24 12 24Z"
				/>
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M16.7993 12C16.7993 12.3313 16.5306 12.6 16.1993 12.6H7.79921C7.46781 12.6 7.19922 12.3313 7.19922 12C7.19922 11.6687 7.46781 11.4 7.79921 11.4H16.1992C16.5306 11.4 16.7993 11.6687 16.7993 12Z"
				/>
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M11.9984 16.8C11.6672 16.8 11.3984 16.5313 11.3984 16.2V7.79997C11.3984 7.46857 11.6672 7.19998 11.9984 7.19998C12.3297 7.19998 12.5984 7.46857 12.5984 7.79997V16.1999C12.5984 16.5313 12.3297 16.8 11.9984 16.8Z"
				/>
			</g>
			<defs>
				<clipPath id="clip0_2107_3191">
					<rect width="24" height="24" fill="white" />
				</clipPath>
			</defs>
		</svg>
	);
};

export default AddIcon;
