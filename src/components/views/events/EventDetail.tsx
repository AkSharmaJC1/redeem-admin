import React, { useEffect, useState } from "react";
import thumbnailImg from "./../../../assets/images/thumbnail-img.png";
import Button from "../../formElements/Button";
import BackIcon from "../../utilities/svgElements/BackIcon";
import { useNavigate, useParams } from "react-router-dom";
import {
	getEventDetail,
	getTotalRevenueOfEvents,
	updateFeaturedEvent,
} from "../../../services/event";
import moment from "moment";
import {
	toastMessageError,
	toastMessageSuccess,
} from "../../../commonToast/CommonToastMessage";
import { IEvent } from "../../../interfaces/eventInterfaces";
import { useTranslation } from "react-i18next";
import { ICommonRevenueCount } from "../../../interfaces/commonInterfaces";
import helperInstance from "../../../utils/helper";
import { CategoryType, ROUTES } from "../../../utils/constants";
import SmallLoader from "../../utilities/smallLoader";

const EventDetail: React.FC = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { t: translation } = useTranslation();
	const [eventDetails, setEventData] = useState<IEvent>();
	const [showMore, setShowMore] = useState(false);
	const [eventsRevenueData, setEventsRevenueData] = useState<{
		totalRevenue: ICommonRevenueCount;
	}>();

	useEffect(() => {
		const fetchEventDetails = async () => {
			try {
				const eventDetailsResponse = await getEventDetail(id ? +id : 0);
				if (eventDetailsResponse?.data?.success) {
					setEventData(eventDetailsResponse?.data?.data || []);
				} else {
					toastMessageError(
						translation(
							eventDetailsResponse?.data?.message || "something_went_wrong"
						)
					);
					navigate(ROUTES.EVENT_LIST);
				}
			} catch (error) {
				console.error("An error occurred while fetching event details:", error);
			}
		};

		fetchEventDetails();
	}, [id]);

	const updateFeatured = async (isFeatured: boolean, eventId: number) => {
		try {
			const payload = {
				eventId: eventId,
				isFeatured: isFeatured,
			};

			const response = await updateFeaturedEvent(payload);
			if (response?.data?.success) {
				// Check if the eventId matches the eventDetails.id
				if (eventDetails?.id === eventId) {
					setEventData({
						...eventDetails, // Spread the existing properties
						isFeatured: isFeatured, // Update the isFeatured property
					});
				}

				toastMessageSuccess(translation(response?.data?.message));
			} else {
				console.log("Error in updating event hottest status");
			}
		} catch (error) {
			console.error(
				"An error occurred while updating event hottest status:",
				error
			);
		}
	};
	useEffect(() => {
		const fetchTotalRevenueForEvents = async () => {
			try {
				const getTotalRevenueData = await getTotalRevenueOfEvents(id ? +id : 0);
				if (getTotalRevenueData && getTotalRevenueData?.data?.success) {
					setEventsRevenueData(getTotalRevenueData?.data?.data || []);
				}
				//  else {
				// 	toastMessageError(
				// 		translation(getTotalRevenueData?.message ?? "something_went_wrong")
				// 	);
				// 	// navigate(ROUTES.EVENT_LIST);
				// }
			} catch (error) {
				console.error("An error occurred while fetching event details:", error);
			}
		};

		fetchTotalRevenueForEvents();
	}, [id]);

	/**
	 * FUTURE SCOPE: TO SEND SUMMARY CARD OF BUSINESS PAYOUT
	 * Send event details to the associated user's email
	 * @function
	 * @async
	 */
	// const sendEventDetailsEmail = async () => {
	//   setEventDetailsLoading(true);
	//   try {
	//     // Explicitly check for undefined or null
	//     if (eventDetails?.id !== undefined && eventDetails?.id !== null) {
	//       const sendEventDetailsResponse = await sendEventDetailsEmailByUserId(
	//         eventDetails.id
	//       );
	//       if (sendEventDetailsResponse?.data?.success) {
	//         toastMessageSuccess(
	//           translation(sendEventDetailsResponse?.data?.message)
	//         );
	//       } else {
	//         toastMessageError(
	//           translation(
	//             sendEventDetailsResponse?.data?.message || "something_went_wrong"
	//           )
	//         );
	//       }
	//       setShowModal(false);
	//     }
	//   } catch (error) {
	//     console.log("An error occurred while sending event details:", error);
	//   }
	//   setEventDetailsLoading(false);
	// };

	return (
		<div className="business-page pt-5 pb-5">
			<div className="container">
				{!eventDetails ? (
					<div className="page-inner">
						<SmallLoader />{" "}
					</div>
				) : (
					<div className="page-inner">
						<div className="back-btn-action mb-4">
							<Button
								className="white-outline-btn radius-sm btn-sm"
								onClick={() => navigate(-1)}
							>
								<BackIcon /> {translation("back")}
							</Button>
						</div>
						<div className="theme-card business-detail-card">
							<div className="card-mid">
								<div className="summery-btns">
									{/* <div className="actin-btn">
											<Button
											className="primary-btn radius-sm"
											type="button"
											onClick={() => setShowModal(true)}
											>
											{translation("send_summary_card")}
											</Button>
									</div> */}
								</div>
								<div className="business-info-section">
									<div className="row">
										<div className="col-md-3">
											<div className="business-image-slider">
												<img
													src={eventDetails?.images?.[0] || thumbnailImg}
													alt="thumbnailImg"
												/>
											</div>
										</div>
										<div className="col-md-9">
											<div className="section-info">
												<div className="name">
													<h2>{eventDetails?.name}</h2>
												</div>
												<div className="info-list">
													<div className="item">
														<h6>{translation("date")}</h6>
														<p>
															<span>:</span>{" "}
															{moment(eventDetails?.startTime).format(
																"MMM D, YYYY"
															)}
														</p>
													</div>
													<div className="item">
														<h6>{translation("business_name")}</h6>
														<p>
															<span>:</span>{" "}
															{eventDetails?.user?.businessDetails?.name}
														</p>
													</div>
													<div className="item">
														<h6>{translation("time")}</h6>
														<p>
															<span>:</span>{" "}
															{moment(eventDetails?.startTime).format("h:mm A")}{" "}
															- {moment(eventDetails?.endTime).format("h:mm A")}
														</p>
													</div>
													<div className="item">
														<h6>{translation("event_category")}</h6>
														<p>
															<span>:</span>{" "}
															{CategoryType[
																eventDetails?.categories
																	?.name as keyof typeof CategoryType
															] || "-"}
														</p>
													</div>
													<div className="item">
														<h6>{translation("address")}</h6>
														<p>
															<span>:</span> {eventDetails?.address}
														</p>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div className="make-hot-event">
									<div className="hot-event-action">
										<div className="name">
											<h5>{translation("mark_featured")}</h5>
										</div>
										<div className="action-item">
											<label className="custom-radio">
												{translation("yes")}
												<input
													type="radio"
													name="radio"
													checked={eventDetails?.isFeatured === true}
													onChange={() =>
														updateFeatured(true, eventDetails?.id || -1)
													}
												/>
												<span className="checkmark"></span>
											</label>
											<label className="custom-radio">
												{translation("no")}
												<input
													type="radio"
													name="radio"
													checked={eventDetails?.isFeatured === false}
													onChange={() =>
														updateFeatured(false, eventDetails?.id || -1)
													}
												/>
												<span className="checkmark"></span>
											</label>
										</div>
									</div>
								</div>

								<div className="about-business-section">
									<div className="row">
										<div className="col-md-4">
											<div className="revenue-card">
												<div className="revenue-top">
													<div className="name">
														<h5 className="pt-2">{translation("revenue")}</h5>
														<p>
															$
															{helperInstance.formatAmountWithCommas(
																+(
																	eventsRevenueData?.totalRevenue
																		?.totalAmount ?? 0
																)
															)}
														</p>
													</div>
												</div>
												<div className="revenue-mid">
													<div className="revenue-item">
														<h6>
															{eventsRevenueData?.totalRevenue?.totalCount
																? helperInstance.formatNumberWithCommas(
																		+eventsRevenueData?.totalRevenue?.totalCount
																	)
																: 0}{" "}
															{translation("tickets_sold")}
														</h6>
													</div>
												</div>
											</div>
										</div>
										<div className="col-md-8">
											<div className="about-detail">
												<h3>{translation("about_the_event")}</h3>
												{eventDetails?.about.length > 500 ? (
													!showMore ? (
														<p className="align-btn">
															{" "}
															{eventDetails?.about.slice(0, 500) + "..."}{" "}
															<span
																className="color-primary cursor-pointer"
																onClick={() => setShowMore(true)}
															>
																{translation("show_more")}
															</span>
														</p>
													) : (
														<p className="align-btn">
															{" "}
															{eventDetails?.about}
															<span
																className="color-primary cursor-pointer"
																onClick={() => setShowMore(false)}
															>
																{" "}
																{translation("hide")}
															</span>
														</p>
													)
												) : (
													<p>{eventDetails?.about}</p>
												)}
											</div>
										</div>
									</div>
								</div>
								<div className="main-attractions-section">
									<div className="row">
										{eventDetails?.eventTickets &&
											eventDetails?.eventTickets.length && (
												<div className="col-md-12">
													<div className="section-top">
														<div className="name">
															<h3>{translation("tickets")}</h3>
														</div>
													</div>
													<div className="theme-table">
														<div className="table-responsive">
															<div className="table-outer-border">
																<table className="table">
																	<thead>
																		<tr>
																			<td>{translation("ticket_name")}</td>
																			<td>{translation("quantity")}</td>
																			<td>{translation("price")}</td>
																			<td>{translation("booked_quantity")}</td>
																		</tr>
																	</thead>

																	<tbody>
																		{eventDetails?.eventTickets?.map(
																			(ticket, index) => (
																				<tr key={index}>
																					<td>{`${ticket?.ticketTitle}`}</td>
																					<td>{ticket.quantity}</td>
																					<td>
																						${Number(ticket.price).toFixed(2)}
																					</td>
																					<td>{ticket.bookedQuantity}</td>
																				</tr>
																			)
																		)}
																	</tbody>
																</table>
															</div>
														</div>
													</div>
												</div>
											)}
									</div>
								</div>
								{/* You can add more sections here if needed */}
							</div>
						</div>
					</div>
				)}
			</div>
			{/* {showModal && (
				<ConfirmationModal
				heading={translation("send_summary_card")}
				paragraph={translation("are_you_sure_send_summary_card")}
				onClickCancel={() => setShowModal(false)}
				onClickOkay={sendEventDetailsEmail}
				disabled={eventDetailsLoading}
				loading={eventDetailsLoading}
				/>
			)} */}
		</div>
	);
};
export default EventDetail;
