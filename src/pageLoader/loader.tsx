const Loader = ({ IsMangeLoader = false }: { IsMangeLoader?: boolean }) => {
	return (
		<div className="loading-sm">
			<div className="d-flex align-items-center justify-content-center color-white">
				<div className="spinner-border font12 me-3"></div>
				{!IsMangeLoader ? "Loading...." : ""}
			</div>
		</div>
	);
};

export default Loader;
