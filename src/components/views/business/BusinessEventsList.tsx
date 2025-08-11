import moment from "moment";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CategoryType, EVENT_TYPE, ROUTES } from "../../../utils/constants";
import { useApiCall } from "../../../hooks/useApiCall";
import { getBusinessEvents } from "../../../services/business";
import {
	IBusinessEvent,
	IGetBusinessEvents,
} from "../../../interfaces/BusinessInterfaces";
import { IResponseData } from "../../../interfaces/commonInterfaces";
import thumbnailImg from "./../../../assets/images/thumbnail-img.png";

import Button from "../../formElements/Button";
import SmallLoader from "../../utilities/smallLoader";
import "./Business.scss";
import { TAB_TYPE } from "../../../constants/commonConstant";

const BusinessEventsList = ({ userId }: { userId: string }) => {
	const navigate = useNavigate();
	const { t: translation } = useTranslation();
	const [eventType, setEventType] = useState(EVENT_TYPE.upcoming);

	const {
		data: businessEventsData,
		refetch: fetchBusinessEvents,
		loading: businessEventsDataLoading,
	} = useApiCall<IResponseData, IGetBusinessEvents, never>({
		lazy: true,
		apiCall: getBusinessEvents,
	});

	const fetchEventsData = async (userId: string, eventType: string) => {
		await fetchBusinessEvents({
			userId,
			eventType,
		});
	};

	useEffect(() => {
		if (userId && eventType === EVENT_TYPE.upcoming) {
			fetchEventsData(userId, eventType);
		}

		if (userId && eventType === EVENT_TYPE.past) {
			fetchEventsData(userId, eventType);
		}
	}, [userId, eventType]);

	return (
		<div className="all-events-section">
			<div className="section-top">
				<div className="name">
					<h3>{translation("all_events")}</h3>
				</div>
			</div>
			<div className="section-tab-menu">
				<Button
					type="button"
					className={
						eventType === EVENT_TYPE.upcoming
							? "primary-btn radius-sm btn-sm"
							: "white-outline-btn radius-sm btn-sm"
					}
					onClick={() => {
						setEventType(EVENT_TYPE.upcoming);
					}}
				>
					{translation("upcoming_events")}
				</Button>
				<Button
					type="button"
					className={
						eventType === EVENT_TYPE.past
							? "primary-btn radius-sm btn-sm"
							: "white-outline-btn radius-sm btn-sm"
					}
					onClick={() => {
						setEventType(EVENT_TYPE.past);
					}}
				>
					{translation("past_events")}
				</Button>
			</div>
			<div className="section-tab-content">
				<div className="row">
					{businessEventsDataLoading ? (
						<div className="col-md-12 text-center">
							<SmallLoader />
						</div>
					) : businessEventsData && businessEventsData.length ? (
						businessEventsData?.map((event: IBusinessEvent, index: number) => (
							<div className="col-md-6 col-lg-6 col-xl-4" key={index}>
								<div
									className="event-card cursor-pointer"
									onClick={() =>
										eventType === EVENT_TYPE.upcoming
											? navigate(
													ROUTES.EVENT_DETAIL.replace(
														":id",
														event.id.toString()
													),
													{
														state: {
															eventType: TAB_TYPE.upcomingEvent,
														},
													}
												)
											: navigate(
													ROUTES.EVENT_DETAIL.replace(
														":id",
														event.id.toString()
													)
												)
									}
								>
									<div className="card-img">
										{/* Use event image */}
										<img
											src={event.images[0] || thumbnailImg}
											alt="Event Image"
										/>{" "}
									</div>
									<div className="event-detail">
										<div className="event-detail-top">
											<div className="name">
												{/* Event name */}
												<h3>{event.name}</h3>
												<p>{event.user.businessDetails.name}</p>
											</div>
											<div className="event-time">
												<p>
													{/* Business name and event start date */}
													{event?.startTime
														? `${moment(new Date(event?.startTime)).format(
																"MMM D, YYYY"
															)} ${moment(event?.startTime).format("h:mm A")}`
														: "-"}
												</p>
												{/* Event category */}
												<span>
													{CategoryType[
														event?.categories?.name as keyof typeof CategoryType
													] ?? ""}
												</span>{" "}
											</div>
											{/* <div className="event-time">
												<p>
													
													{event?.endTime
														? `${moment(new Date(event?.endTime)).format(
																"MMM D, YYYY"
															)} ${moment(event?.endTime).format("h:mm A")}`
														: "-"}
												</p>
												<td>
											</td>
												
												<span>
													{CategoryType[
														event?.categories?.name as keyof typeof CategoryType
													] ?? ""}
												</span>{" "}
											</div> */}
										</div>
										<div className="event-detail-mid">
											{/* Event description */}
											<p>{event.about}</p>
										</div>
									</div>
								</div>
							</div>
						))
					) : (
						<div className="col-md-12 text-center">
							<p className="text-center text-white">
								{translation("no_events_found")}
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
export default BusinessEventsList;
