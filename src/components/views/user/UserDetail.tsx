import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useTranslation } from "react-i18next";

import {
	getUserBookingsData,
	getUserDetailsById,
} from "../../../services/user";
import helper from "../../../utils/helper";

import Button from "../../formElements/Button";
import SmallLoader from "../../utilities/smallLoader";
// import LottieLoader from "../../lottieLoader/LottieLoader";

import { IUserDetails } from "../../../interfaces/userInterfaces";

import BackIcon from "../../utilities/svgElements/BackIcon";
import thumbnailImg from "./../../../assets/images/thumbnail-img.png";
import placeholderImg from "../../../assets/images/placeholder-img.png";

import "swiper/css/pagination";
import "swiper/css";
import { USER_BOOKING_LIST_RECORDS_LIMIT } from "../../../constants/commonConstant";
import useInfiniteScroll from "../../../hooks/useInfiniteScroll";
import InfiniteScroll from "react-infinite-scroll-component";
import { IBooking } from "../../../interfaces/commonInterfaces";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { ICategories } from "../../../store/categoriesSlice";
import NoDataFound from "../../utilities/NoData";
import { CategoryType } from "../../../utils/constants";

const UserDetail: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { userId } = useParams();
	const [userInfo, setUserInfo] = useState<IUserDetails>({
		...location.state,
		userDetails: {},
	});

	const [userDetailLoading, setUserDetailLoading] = useState<boolean>(false);
	console.log("userDetailLoading>>>>>>>>>>>", userDetailLoading);
	const { t: translation } = useTranslation();
	const [firstLoad, setFirstLoad] = useState(true);
	const [isPastBookings, setIsPastBookings] = useState<boolean>(false);

	const eventCategories: ICategories[] = useSelector(
		(state: RootState) => state.category.categories
	);

	const {
		data: userBookingsData,
		loading: bookingListLoading,
		hasMore,
		loadMore,
		message: bookingsApiCallMessage,
		fetchData: fetchUserBookings,
	} = useInfiniteScroll({
		apiService: getUserBookingsData, // add booking data api
		apiParams: { userId: userId, pastBookings: isPastBookings },
		limit: USER_BOOKING_LIST_RECORDS_LIMIT,
	});

	const getCategoryNameById = (id: string): string => {
		const category = eventCategories.find((category) => +category.id === +id);
		return category
			? CategoryType[category.name as keyof typeof CategoryType]
			: "-"; // Returns name if found, otherwise undefined
	};

	//change this bring it from helper file
	const convertIntoUTCFormat = (timeString: string) => {
		try {
			const date = new Date(timeString);
			if (isNaN(date.getTime())) {
				throw new Error("Invalid date format");
			}
			return new Intl.DateTimeFormat("en-US", {
				year: "numeric",
				month: "short",
				day: "2-digit",
			}).format(date);
		} catch (error) {
			console.error(error);
			return "Invalid date";
		}
	};

	const getSlicedName = (
		name: string | undefined,
		wordLimit: number
	): string => {
		if (!name) return "-";

		return name.length > wordLimit ? `${name.slice(0, wordLimit)}...` : name;
	};

	const fetchUserProfileData = async () => {
		setUserDetailLoading(true);
		try {
			const userData = await getUserDetailsById(+userId!);
			setUserInfo(userData.data?.data);
		} catch (error) {
			console.error("ERROR: ", error);
		}
		setUserDetailLoading(false);
	};
	useEffect(() => {
		if (userId) {
			fetchUserProfileData();
		}
	}, [userId]);

	useEffect(() => {
		if (bookingsApiCallMessage) {
			setFirstLoad(false);
		}
	}, [bookingsApiCallMessage]);

	useEffect(() => {
		fetchUserBookings(true);
		setFirstLoad(true);
	}, [isPastBookings]);

	return (
		<div className="business-page pt-5 pb-5">
			<div className="container">
				<div className="page-inner">
					<div className="back-btn-action mb-4">
						<Button
							onClick={() => navigate(-1)}
							className="white-outline-btn radius-sm btn-sm"
						>
							<BackIcon /> {translation("back")}
						</Button>
					</div>
					{!userInfo?.name ? (
						<NoDataFound />
					) : (
						<div className="theme-card business-detail-card">
							<div className="card-mid">
								<div className="business-info-section">
									<div className="row">
										<div className="col-md-12">
											<div className="section-inline">
												<div className="user-img">
													<img
														src={
															userInfo?.image ? userInfo.image : placeholderImg
														}
														alt="user-profile"
														referrerPolicy="no-referrer"
													/>
												</div>
												<div className="section-info">
													<div className="name">
														<h2>{userInfo?.name ? userInfo.name : "-"}</h2>
													</div>
													<div className="info-list">
														<div className="item">
															<h6>{translation("email")}</h6>
															<p>
																<span>:</span>{" "}
																{userInfo?.email ? userInfo.email : "-"}
															</p>
														</div>
														<div className="item">
															<h6>{translation("phone")}</h6>
															<p>
																<span>:</span>
																{userInfo.phone ? (
																	<>
																		+{userInfo.phoneCountryCode ?? ""}{" "}
																		{helper.formatPhoneNumber(userInfo.phone)}
																	</>
																) : (
																	"-"
																)}
															</p>
														</div>
														<div className="item">
															<h6>{translation("status")}</h6>
															<p className="color-primary">
																<span className="color-white-primary">:</span>{" "}
																{userInfo?.isActive === 1
																	? translation("active")
																	: translation("in-active")}
															</p>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div className="all-events-section">
									<div className="section-tab-menu">
										<Button
											type="submit"
											className={`${
												!isPastBookings ? "primary-btn" : "white-outline-btn"
											} radius-sm btn-sm`}
											onClick={() => setIsPastBookings(false)}
										>
											{translation("current_bookings")}
										</Button>
										<Button
											type="submit"
											className={`${
												isPastBookings ? "primary-btn" : "white-outline-btn"
											} radius-sm btn-sm`}
											onClick={() => setIsPastBookings(true)}
										>
											{translation("past_bookings")}
										</Button>
									</div>
									<div className="section-tab-content">
										<InfiniteScroll
											className="row"
											dataLength={userBookingsData.length}
											next={loadMore}
											hasMore={hasMore}
											scrollableTarget="scrollableUserDiv"
											scrollThreshold="100px"
											loader={!firstLoad && <SmallLoader />}
											height={userBookingsData.length === 0 ? 50 : 500}
											endMessage={
												!bookingListLoading &&
												!hasMore &&
												userBookingsData.length > 0 ? (
													<p className="text-center text-white mt-3">
														{translation("yay_you_have_seen_it_all")}
													</p>
												) : null
											}
										>
											{firstLoad ? (
												<div className="text-center">
													<SmallLoader />
												</div>
											) : userBookingsData && userBookingsData.length > 0 ? (
												userBookingsData.map(
													(booking: IBooking, index: number) => (
														<div
															className="col-md-6 col-lg-6 col-xl-4"
															key={index}
														>
															<div className="event-card">
																<div className="card-img">
																	<img
																		src={
																			booking?.event?.images[0] ?? thumbnailImg
																		}
																		alt="img"
																	/>
																</div>
																<div className="event-detail">
																	<div className="event-detail-top">
																		<div className="name">
																			<h3 className="event-time">
																				{getSlicedName(
																					booking?.event?.name,
																					15
																				)}
																				<span>
																					{translation(booking?.bookingStatus)}
																				</span>
																			</h3>
																			<p>
																				{getSlicedName(
																					booking?.event?.user?.businessDetails
																						?.name,
																					30
																				)}
																			</p>
																		</div>

																		<div className="event-time">
																			<p>
																				{convertIntoUTCFormat(
																					booking?.event?.endTime
																				)}
																			</p>
																			<span>
																				{getCategoryNameById(
																					booking?.event?.categoryId
																				)}
																			</span>
																		</div>
																	</div>

																	<div className="booking-details">
																		<div className="booking-heading">
																			<p>{translation("booking_details")}:</p>
																		</div>
																		<div className="booking-items">
																			<p>
																				{booking?.totalQuantity}{" "}
																				{booking?.totalQuantity > 1
																					? translation("tickets")
																					: translation("ticket")}
																			</p>
																		</div>
																		<div className="booking-items">
																			<p>
																				{convertIntoUTCFormat(
																					booking?.createdAt
																				)}
																			</p>
																			<p className="fw-bold">
																				${booking?.totalAmount ?? "-"}
																			</p>
																		</div>
																	</div>
																</div>
															</div>
														</div>
													)
												)
											) : bookingListLoading && !hasMore ? (
												<div className="text-center">
													<SmallLoader />
												</div>
											) : (
												!bookingListLoading &&
												userBookingsData.length === 0 && (
													<div className="text-center">
														<p className="m-0 text-white">
															{translation("no_record_found")}
														</p>
													</div>
												)
											)}
										</InfiniteScroll>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
export default UserDetail;
