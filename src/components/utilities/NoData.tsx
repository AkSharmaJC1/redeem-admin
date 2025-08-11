import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import Button from "../formElements/Button";

import NoDataFoundImg from "../../assets/images/no-data-found-img.png";

import "./NoInternet.scss";

const NoDataFound: React.FC = () => {
	const { t: translation } = useTranslation();
	const navigate = useNavigate();
	return (
		<div className="no-internet-page pt-5 pb-5">
			<div className="container">
				<div className="page-inner">
					<div className="page-box">
						<div className="box-img">
							<img src={NoDataFoundImg} alt="NoDataFoundImg" />
						</div>
						<div className="content">
							<h2>{translation("no_data_found")}</h2>
							{/* <p>
                  Seems like you’re offline. <br />
                  Please check your internet connection.
                </p> */}
							<Button
								onClick={() => navigate(0)}
								type="submit"
								className="white-outline-btn radius-sm"
							>
								{translation("pls_try_again")}
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default NoDataFound;
