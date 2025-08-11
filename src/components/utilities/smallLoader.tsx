const SmallLoader = (props: { className?: string }) => {
	const { className } = props;

	return (
		<div className={`loader loading-sm ${className}`}>
			<div className="d-flex align-items-center justify-content-center m-2 gap-3">
				<div className="spinner-border text-white"></div>
			</div>
		</div>
	);
};

export default SmallLoader;
