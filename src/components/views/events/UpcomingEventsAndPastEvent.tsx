import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CategoryType, ROUTES } from "../../../utils/constants";
import { getHomeEventList } from "../../../services/event";
import { IEvent } from "../../../interfaces/eventInterfaces";
import InfiniteScroll from "react-infinite-scroll-component";
import useInfiniteScroll from "../../../hooks/useInfiniteScroll";
import SmallLoader from "../../utilities/smallLoader";
import {
	LIST_RECORDS_LIMIT,
	TAB_TYPE,
} from "../../../constants/commonConstant";

const UpcomingEventsAndPastEvent = ({
	searchValue,
	tab,
}: {
	searchValue: string;
	tab: string;
}) => {
	const navigate = useNavigate();
	const { t: translation } = useTranslation();
	const [firstLoad, setFirstLoad] = useState(true);

	const {
		data,
		loading,
		hasMore,
		loadMore,
		message: userListApiCallMessage,
		fetchData: getHomeEventsList,
	} = useInfiniteScroll({
		apiService: getHomeEventList,
		apiParams: {
			search_text: searchValue,
			eventType: tab,
		},

		limit: LIST_RECORDS_LIMIT,
	});

	useEffect(() => {
		getHomeEventsList(true);
	}, [searchValue]);

	useEffect(() => {
		if (userListApiCallMessage) {
			setFirstLoad(false);
		}
	}, [userListApiCallMessage]);

	return (
		<div className="theme-table">
			<div className="table-responsive">
				<InfiniteScroll
					dataLength={data?.length}
					next={loadMore}
					hasMore={hasMore}
					scrollableTarget="scrollableBusinessListDiv"
					scrollThreshold="100px"
					loader={data.length ? <SmallLoader /> : null}
					height={innerHeight - 280}
					endMessage={
						!loading ? (
							<p className="text-center text-white">
								{data.length > 0 && translation("yay_you_have_seen_it_all")}
							</p>
						) : null
					}
				>
					<table className="table">
						<thead>
							<tr>
								<td>{translation("event_name")}</td>
								<td>{translation("event_category")}</td>
								<td>{translation("business_name")}</td>
								<td>{translation("location")}</td>
								<td>{translation("event_date")}</td>
								<td>{translation("time")}</td>
							</tr>
						</thead>

						<tbody>
							{firstLoad ? (
								<tr>
									<td
										colSpan={tab === TAB_TYPE.pastEvent ? 7 : 6}
										align="center"
										className="text-center"
									>
										<SmallLoader />
									</td>
								</tr>
							) : data?.length > 0 ? (
								data.map((event: IEvent, index: number) => {
									return (
										<tr
											className="cursor-pointer"
											key={index}
											onClick={() => {
												navigate(
													ROUTES.EVENT_DETAIL.replace(
														":id",
														event.id.toString()
													),
													{
														state: {
															eventType: tab,
														},
													}
												);
											}}
										>
											<td>{event?.name ?? "-"}</td>

											<td>
												{CategoryType[
													event?.categories?.name as keyof typeof CategoryType
												] ?? "-"}
											</td>
											<td>{event?.user?.businessDetails?.name ?? "-"}</td>
											<td>{`${event?.city} ${event?.state}`}</td>
											<td>{moment(event?.startTime).format("MMM D, YYYY")}</td>
											<td>{moment(event?.startTime).format("h:mm A")}</td>
										</tr>
									);
								})
							) : loading ? (
								<tr>
									<td
										colSpan={tab === TAB_TYPE.pastEvent ? 7 : 6}
										align="center"
										className="text-center"
									>
										<SmallLoader />
									</td>
								</tr>
							) : (
								<tr>
									<td colSpan={tab === TAB_TYPE.pastEvent ? 7 : 6}>
										<p className="text-center text-white">
											{translation("no_record_found")}
										</p>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</InfiniteScroll>
			</div>
		</div>
	);
};
export default UpcomingEventsAndPastEvent;
