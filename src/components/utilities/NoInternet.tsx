import React from "react";
import Button from "../formElements/Button";
import NoInternetImg from "../../../assets/images/no-internet-img.png";
import "./NoInternet.scss";

const NoInternet: React.FC = () => {
	return (
		<div className="no-internet-page pt-5 pb-5">
			<div className="container">
				<div className="page-inner">
					<div className="page-box">
						<div className="box-img">
							<img src={NoInternetImg} alt="NoInternetImg" />
						</div>
						<div className="content">
							<h2>No Internet Connection!</h2>
							<p>
								Seems like you’re offline. <br />
								Please check your internet connection.
							</p>
							<Button type="submit" className="white-outline-btn radius-sm">
								Try Again
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default NoInternet;
