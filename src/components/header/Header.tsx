import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import placeholderImg from "../../assets/images/placeholder-img.png";
import Button from "../formElements/Button";
import BarsIcon from "../utilities/svgElements/BarsIcon";
import DownArrowIcon from "../utilities/svgElements/DownArrowIcon";
import SettingsIcon from "../utilities/svgElements/SettingsIcon";
import LogoutIcon from "../utilities/svgElements/LogoutIcon";
import useAuth from "../../hooks/useAuth";
import { ROUTES } from "../../utils/constants";
import ConfirmationModal from "../formElements/CommonConfirmationModal";

const Header = () => {
	const { signOut, authData } = useAuth();
	const { t: translation } = useTranslation();

	const location = useLocation();
	const pathname = location.pathname;
	const detailPath = `/${pathname.split("/")[1]}`;
	const [showModal, setShowModal] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const navigate = useNavigate();
	const handleLogout = () => {
		setLoading(true);
		signOut();
		setLoading(false);
	};

	return (
		<>
			<div className="header">
				<div className="container">
					<div className="header-inner">
						<nav className="navbar navbar-expand-lg">
							<div className="navbar-brand">
								<img src={logo} alt="logo" />
							</div>
							<div className="header-action-btn">
								<button
									className="navbar-toggler"
									type="button"
									data-bs-toggle="collapse"
									data-bs-target="#collapsibleNavbar"
								>
									<BarsIcon />
								</button>
							</div>

							<div className="collapse navbar-collapse" id="collapsibleNavbar">
								<div className="navbar-collapse-inner">
									<ul className="navbar-nav">
										<li className="nav-item">
											<Link
												className={`${
													pathname === ROUTES.DASHBOARD
														? "active nav-link"
														: "nav-link"
												}`}
												to={ROUTES.DASHBOARD}
											>
												{translation("dashboard")}
											</Link>
										</li>
										<li className="nav-item">
											<Link
												className={`${
													pathname === ROUTES.USER_LIST ||
													detailPath === "/user-detail"
														? "active nav-link"
														: "nav-link"
												}`}
												to={ROUTES.USER_LIST}
											>
												{translation("users")}
											</Link>
										</li>
										<li className="nav-item">
											<Link
												className={`${
													[
														ROUTES.BUSINESS_LIST.split("/")[1],
														ROUTES.BUSINESS_DETAIL.split("/")[1],
														// ROUTES.ADD_BUSINESS.split("/")[1],
													].includes(pathname.split("/")[1])
														? "active nav-link"
														: "nav-link"
												}`}
												to={ROUTES.BUSINESS_LIST}
											>
												{translation("businesses")}
											</Link>
										</li>
										<li className="nav-item">
											<Link
												className={`${
													[
														ROUTES.EVENT_LIST.split("/")[1],
														ROUTES.EVENT_DETAIL.split("/")[1],
													].includes(pathname.split("/")[1])
														? "active nav-link"
														: "nav-link"
												}`}
												to={ROUTES.EVENT_LIST}
											>
												{translation("events")}
											</Link>
										</li>
										<li className="nav-item">
											<Link
												className={`${
													pathname === ROUTES.TRANSACTIONS_LIST
														? "active nav-link"
														: "nav-link"
												}`}
												to={ROUTES.TRANSACTIONS_LIST}
											>
												{translation("transactions")}
											</Link>
										</li>
										<li className="nav-item">
											<Link
												className={`${
													pathname === ROUTES.SUPPORT_LIST
														? "active nav-link"
														: "nav-link"
												}`}
												to={ROUTES.SUPPORT_LIST}
											>
												{translation("Support tickets")}
											</Link>
										</li>
										{/* CLIENT REQUEST */}
										{/* <li className="nav-item">
											<Link
												className={`${
													pathname === ROUTES.APPROVAL_REQUESTS
														? "active nav-link"
														: "nav-link"
												}`}
												to={ROUTES.APPROVAL_REQUESTS}
											>
												{translation("approval_requests")}
											</Link>
										</li> */}
									</ul>
									<div className="header-right">
										<div className="user-drop dropdown">
											<button
												type="button"
												className="dropdown-toggle"
												data-bs-toggle="dropdown"
											>
												<div className="header-user">
													<div className="user-img">
														<img
															src={
																authData?.image
																	? authData.image
																	: placeholderImg
															}
															alt="placeholderImg"
														/>
													</div>
													<div className="user-balance">
														<div className="user-balance-inline">
															<p>{authData?.name ?? "-"}</p>
															<DownArrowIcon className="arrow-icon" />
														</div>
														<span>{authData?.email ?? "-"}</span>
													</div>
												</div>
											</button>
											<div className="dropdown-menu">
												<div className="menu-list">
													<ul>
														<li>
															<Button onClick={() => navigate(ROUTES.SETTINGS)}>
																<SettingsIcon />
																{translation("settings")}
															</Button>
														</li>
														<li>
															<Button onClick={() => setShowModal(true)}>
																<LogoutIcon />
																{translation("logout")}
															</Button>
														</li>
													</ul>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</nav>
					</div>
				</div>
				{showModal && (
					<ConfirmationModal
						heading="Logout"
						paragraph="Are you sure you want to logout?"
						onClickCancel={() => setShowModal(false)}
						onClickOkay={handleLogout}
						disabled={loading}
						loading={loading}
					/>
				)}
			</div>
		</>
	);
};
export default Header;


