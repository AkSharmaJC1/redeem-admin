import { subDays } from "date-fns";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

import {
	ICommonRevenueCount,
	IRange,
} from "../../../interfaces/commonInterfaces";
import DateRangeSelector from "../../formElements/CommonDateRangePicker";
import helperInstance from "../../../utils/helper";
import { getTotalRevenueOfBusinesses } from "../../../services/event";
import "swiper/css/pagination";
import "./Business.scss";
import "swiper/css";
import useSessionExpiredHandler from "../../../hooks/useSessionExpiredHandler";

const BusinessRevenueCard = ({ businessId }: { businessId: number }) => {
	const { t: translation } = useTranslation();
	const checkSessionExpired = useSessionExpiredHandler();
	const [businessesRevenueData, setBusinessesRevenueData] = useState<{
		totalRevenue: ICommonRevenueCount;
	}>();
	const currentMonth = new Date(
		new Date().getFullYear(),
		new Date().getMonth() + 1,
		0
	).getDate();
	const [dateRangeSelectionForBusiness, setDateRangeSelectionForBusiness] =
		useState<IRange[]>([
			{
				startDate: subDays(new Date(), currentMonth),
				endDate: new Date(),
				key: "selection",
			},
		]);
	useEffect(() => {
		const fetchTotalRevenueForBusiness = async () => {
			try {
				const startDate = new Date(dateRangeSelectionForBusiness[0].startDate);
				startDate.setHours(0, 0, 0, 0);
				const endDate = new Date(dateRangeSelectionForBusiness[0].endDate);
				endDate.setHours(23, 59, 59, 999);
				const startDateUTC = startDate.toISOString();
				const endDateUTC = endDate.toISOString();
				const getTotalRevenueData = await getTotalRevenueOfBusinesses({
					startDate: startDateUTC,
					endDate: endDateUTC,
					businessId,
				});
				if (getTotalRevenueData?.error?.error) {
					return checkSessionExpired(getTotalRevenueData?.error?.error);
				}
				if (getTotalRevenueData && getTotalRevenueData?.data?.success) {
					setBusinessesRevenueData(getTotalRevenueData?.data?.data || []);
				}
				// else {
				// 	toastMessageError(
				// 		translation(
				// 			getTotalRevenueData?.data?.message ?? "something_went_wrong"
				// 		)
				// 	);
				// 	navigate(ROUTES.BUSINESS_LIST);
				// }
			} catch (error) {
				console.error("An error occurred while fetching event details:", error);
			}
		};

		fetchTotalRevenueForBusiness();
	}, [businessId, dateRangeSelectionForBusiness]);

	return (
		<div className="col-md-12 col-lg-4 col-xl-4 mb-3">
			<div className="revenue-card">
				<div className="revenue-top">
					<div className="name mb-0">
						<h5 className="pt-2">{translation("revenue")}</h5>
						<p>
							$
							{helperInstance.formatAmountWithCommas(
								+(businessesRevenueData?.totalRevenue?.totalAmount ?? 0)
							)}
						</p>
					</div>

					<div className="date-range-show">
						<DateRangeSelector
							dateRangeSelection={dateRangeSelectionForBusiness}
							setDateRangeSelection={setDateRangeSelectionForBusiness}
							isMaxDate
						/>
					</div>
				</div>
				<div className="revenue-mid">
					<div className="revenue-item">
						<h6>
							{businessesRevenueData?.totalRevenue?.totalCount
								? helperInstance.formatNumberWithCommas(
										+businessesRevenueData?.totalRevenue?.totalCount
									)
								: 0}{" "}
							{translation("tickets_sold")}
						</h6>
					</div>
				</div>
			</div>
		</div>
	);
};
export default BusinessRevenueCard;
