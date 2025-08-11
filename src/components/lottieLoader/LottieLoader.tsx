import "./LottieLoader.scss";

import yellowLoader from "../../assets/images/yellowLoader.gif";

const LottieLoader = () => {
	return (
		<>
			<div className="lottie-loader">
				<img src={yellowLoader} alt="loader" width={400} height={400} />
			</div>
		</>
	);
};
export default LottieLoader;
