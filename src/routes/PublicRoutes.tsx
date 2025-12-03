import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../components/views/userAuth/Login";
import useAuth from "../hooks/useAuth";
import { ROUTES } from "../utils/constants";
import BusinessList from "../components/views/business/BusinessList";
import ResetPassword from "../components/views/userAuth/ResetPassword";
import VerificationCode from "../components/views/userAuth/VerificationCode";
import ForgotPassword from "../components/views/userAuth/ForgotPassword";
import BusinessDetail from "../components/views/business/BusinessDetail";
import EventDetail from "../components/views/events/EventDetail";
import EventList from "../components/views/events/EventList";
import TransactionsList from "../components/views/transactions/TransactionsList";
import UserDetail from "../components/views/user/UserDetail";
import UserList from "../components/views/user/UserList";
import Header from "../components/header/Header";
import Settings from "../components/views/settings/Settings";
import Dashboard from "../components/views/dashboard/Dashboard";
import LottieLoader from "../components/lottieLoader/LottieLoader";
import TicketList from "../components/views/tickets/TicketList";
// import ApprovalRequests from "../components/views/approval/ApprovalRequests";

const PublicPrivateRoutes: React.FC = () => {
	const { appLoading, authData } = useAuth();

	if (appLoading) {
		return <LottieLoader />;
	}

	return (
		<Suspense fallback={<LottieLoader />}>
			<div className="main">
				<div className="main-wrapper">
					{authData?.id ? <Header /> : <></>}
					<div className="main-wrapper-inner">
						<div className="wrapper-pages">
							<Routes>
								{authData?.id ? (
									<>
										<Route
											path={ROUTES.BUSINESS_LIST}
											element={<BusinessList />}
										/>
										<Route
											path={ROUTES.SUPPORT_LIST}
											element={<TicketList />}
										/>
										<Route path={ROUTES.USER_DETAIL} element={<UserDetail />} />
										<Route
											path={ROUTES.TRANSACTIONS_LIST}
											element={<TransactionsList />}
										/>
										<Route path={ROUTES.USER_LIST} element={<UserList />} />
										<Route path={ROUTES.EVENT_LIST} element={<EventList />} />
										<Route
											path={ROUTES.BUSINESS_DETAIL}
											element={<BusinessDetail />}
										/>
										<Route
											path={ROUTES.EVENT_DETAIL}
											element={<EventDetail />}
										/>
										<Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
										<Route path={ROUTES.SETTINGS} element={<Settings />} />
										{/* CLIENT REQUEST */}
										{/* <Route
											path={ROUTES.APPROVAL_REQUESTS}
											element={<ApprovalRequests />}
										/> */}
										<Route
											path="*"
											element={<Navigate to={ROUTES.DASHBOARD} replace />}
										/>
									</>
								) : (
									<>
										<Route path={ROUTES.LOGIN} element={<Login />} />
										<Route
											path={ROUTES.RESET_PASSWORD}
											element={<ResetPassword />}
										/>
										<Route
											path={ROUTES.VERIFICATION_CODE}
											element={<VerificationCode />}
										/>
										<Route
											path={ROUTES.FORGOT_PASSWORD}
											element={<ForgotPassword />}
										/>
										<Route
											path="*"
											element={<Navigate to={ROUTES.LOGIN} replace />}
										/>
									</>
								)}
							</Routes>
						</div>
					</div>
				</div>
			</div>
		</Suspense>
	);
};

export default PublicPrivateRoutes;
