import { useForm } from "react-hook-form";
import { subDays } from "date-fns";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";

import {
	IChartArea,
	IGraphResponse,
	IRange,
} from "../../../interfaces/commonInterfaces";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	Filler,
} from "chart.js";
import {
	fetchGraphData,
	getTotalBusiness,
	getTotalEvents,
	getTotalUsers,
} from "../../../services/dashboard";
import { ROUTES } from "../../../utils/constants";
import DateRangeSelector from "../../formElements/CommonDateRangePicker";
import "./Dashboard.scss";
import Select from "../../formElements/Select";
import {
	BG_COLOR,
	COLOR,
	GRAPH_OPTIONS,
	GRAPH_TYPE_NAME,
	graphTypeOptions,
} from "../../../constants/commonConstant";
import InputWrapper from "../../formElements/InputWrapper";
import { getCategories } from "../../../services/event";
import { setCategories } from "../../../store/categoriesSlice";
import { useDispatch, useSelector } from "react-redux";
import { ITransactionList } from "../../../interfaces/transactionInterfaces";
import { getTransactionList } from "../../../services/transaction";
import { RootState } from "../../../store";
import SmallLoader from "../../utilities/smallLoader";
import moment from "moment";
import useSessionExpiredHandler from "../../../hooks/useSessionExpiredHandler";

const Dashboard: React.FC = () => {
	const checkSessionExpired = useSessionExpiredHandler();
	const { control } = useForm();

	const { t: translation } = useTranslation();

	const categories = useSelector(
		(state: RootState) => state.category.categories
	);
	const currentMonth = new Date(
		new Date().getFullYear(),
		new Date().getMonth() + 1,
		0
	).getDate();

	const [totalUsersCount, setTotalUsersCount] = useState(0);
	const [totalEventsCount, setTotalEventsCount] = useState(0);
	const [graphData, setGraphData] = useState<IGraphResponse>();
	const [totalBusinessCount, setTotalBusinessCount] = useState(0);

	const [transactionList, setTransactionList] = useState<ITransactionList[]>(
		[]
	);

	const [isTransactionLoading, setIsTransactionLoading] = useState(false);
	const [graphTypeOption, setGraphTypeOption] = useState(
		graphTypeOptions[0].value
	);

	const [dateRangeSelectionForUser, setDateRangeSelectionForUser] = useState<
		IRange[]
	>([
		{
			startDate: subDays(new Date(), currentMonth),
			endDate: new Date(),
			key: "selection",
		},
	]);
	const [dateRangeSelectionForBusiness, setDateRangeSelectionForBusiness] =
		useState<IRange[]>([
			{
				startDate: subDays(new Date(), currentMonth),
				endDate: new Date(),
				key: "selection",
			},
		]);
	const [dateRangeSelectionForEvent, setDateRangeSelectionForEvent] = useState<
		IRange[]
	>([
		{
			startDate: subDays(new Date(), currentMonth),
			endDate: new Date(),
			key: "selection",
		},
	]);
	const dispatch = useDispatch();
	const fetchTotalUsers = async () => {
		try {
			const startDate = new Date(dateRangeSelectionForUser[0].startDate);
			startDate.setHours(0, 0, 0, 0);
			const endDate = new Date(dateRangeSelectionForUser[0].endDate);
			endDate.setHours(23, 59, 59, 999);
			const startDateUTC = startDate.toISOString();
			const endDateUTC = endDate.toISOString();
			const response = await getTotalUsers(startDateUTC, endDateUTC);
			if (response?.error?.error) {
				return checkSessionExpired(response?.error?.error);
			}
			if (response && response?.data?.data) {
				setTotalUsersCount(response.data?.data?.total);
			}
		} catch (error) {
			console.error("Error in getting total users", error);
		}
	};

	const fetchTotalBusiness = async () => {
		try {
			const startDate = new Date(dateRangeSelectionForBusiness[0].startDate);
			startDate.setHours(0, 0, 0, 0);
			const endDate = new Date(dateRangeSelectionForBusiness[0].endDate);
			endDate.setHours(23, 59, 59, 999);
			const startDateUTC = startDate.toISOString();
			const endDateUTC = endDate.toISOString();
			const response = await getTotalBusiness(startDateUTC, endDateUTC);
			if (response?.error?.error) {
				return checkSessionExpired(response?.error?.error);
			}
			if (response && response?.data?.data) {
				setTotalBusinessCount(response.data?.data?.total);
			}
		} catch (error) {
			console.error("Error in getting total business", error);
		}
	};

	const fetchTotalEvents = async () => {
		try {
			const startDate = new Date(dateRangeSelectionForEvent[0].startDate);
			startDate.setHours(0, 0, 0, 0);
			const endDate = new Date(dateRangeSelectionForEvent[0].endDate);
			endDate.setHours(23, 59, 59, 999);
			const startDateUTC = startDate.toISOString();
			const endDateUTC = endDate.toISOString();
			const response = await getTotalEvents(startDateUTC, endDateUTC);
			if (response && response?.data?.data) {
				setTotalEventsCount(response?.data?.data?.total ?? 0);
			}
		} catch (error) {
			console.error("Error in getting total events", error);
		}
	};

	useEffect(() => {
		if (dateRangeSelectionForUser) fetchTotalUsers();
	}, [dateRangeSelectionForUser]);

	useEffect(() => {
		if (dateRangeSelectionForBusiness) fetchTotalBusiness();
	}, [dateRangeSelectionForBusiness]);

	useEffect(() => {
		if (dateRangeSelectionForEvent) fetchTotalEvents();
	}, [dateRangeSelectionForEvent]);

	const fetchTransactionsList = async () => {
		try {
			setIsTransactionLoading(true);
			const transactionData = await getTransactionList({
				offset: 0,
				limit: 5,
				search_text: "",
			});
			if (transactionData && transactionData?.data?.success) {
				setTransactionList(transactionData?.data?.data);
			}
		} catch (e) {
			console.error("transaction List error", e);
		} finally {
			setIsTransactionLoading(false);
		}
	};

	useEffect(() => {
		fetchTransactionsList();
	}, []);

	ChartJS.register(
		CategoryScale,
		LinearScale,
		PointElement,
		LineElement,
		Title,
		Tooltip,
		Filler,
		Legend
	);
	const fetchTaskGraphData = async () => {
		let startDate = new Date();
		let endDate = new Date();
		try {
			if (graphTypeOption === graphTypeOptions[0].value) {
				startDate = new Date(startDate.getFullYear(), 0, 1);
				endDate = new Date(startDate.getFullYear(), 11, 31, 23, 59, 59, 999);
			} else if (graphTypeOption === graphTypeOptions[1].value) {
				startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
				endDate = new Date(
					startDate.getFullYear(),
					startDate.getMonth() + 1,
					0,
					23,
					59,
					59,
					999
				);
			} else if (graphTypeOption === graphTypeOptions[2].value) {
				const dayOfWeek = startDate.getDay();
				const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
				startDate.setDate(startDate.getDate() - diffToMonday);
				endDate = new Date(startDate);
				endDate.setDate(startDate.getDate() + 6);
			}

			if (startDate && endDate) {
				startDate.setHours(0, 0, 0, 0);
				endDate.setHours(23, 59, 59, 999);

				const startDateUTC = startDate.toISOString();
				const endDateUTC = endDate.toISOString();

				const response = await fetchGraphData({
					startDate: startDateUTC,
					endDate: endDateUTC,
					graphType: graphTypeOption,
				});
				if (response?.error?.error) {
					return checkSessionExpired(response?.error?.error);
				}
				if (response && response?.data) {
					setGraphData(response.data as IGraphResponse);
				}
			}
		} catch (e) {
			console.error("fetch graph data", e);
		}
	};

	//Provide gradient color in the graph
	const getGradient = (
		ctx: CanvasRenderingContext2D,
		chartArea: IChartArea
	) => {
		let width, height, gradient;
		const chartWidth = chartArea.right - chartArea.left;
		const chartHeight = chartArea.bottom - chartArea.top;
		if (!gradient || width !== chartWidth || height !== chartHeight) {
			width = chartWidth;
			height = chartHeight;
			gradient = ctx.createLinearGradient(
				0,
				chartArea.bottom,
				0,
				chartArea.top
			);

			gradient.addColorStop(0, BG_COLOR[6]);
			gradient.addColorStop(0.5, BG_COLOR[5]);
			gradient.addColorStop(1, BG_COLOR[3]);
			gradient.addColorStop(1, BG_COLOR[2]);
			gradient.addColorStop(1, BG_COLOR[1]);
		}

		return gradient;
	};

	const GRAPH_DATA = {
		labels: graphData?.graphData?.map(
			(item: { label: string; count: number }) => item.label
		),
		datasets: [
			{
				label: GRAPH_TYPE_NAME,
				data: graphData?.graphData?.map(
					(item: { label: string; count: number }) => item.count
				),
				borderColor: COLOR.BORDER_COLOR,
				backgroundColor: (context: {
					chart: {
						ctx: CanvasRenderingContext2D;
						chartArea: IChartArea;
					};
				}) => {
					const chart = context.chart;
					const { ctx, chartArea } = chart;

					if (!chartArea) {
						return;
					}
					return getGradient(ctx, chartArea);
				},
				pointBorderColor: COLOR.POINT_BORDER_COLOR,
				pointBackgroundColor: COLOR.POINT_BACKGROUND_COLOR,
				fill: true,
			},
		],
	};

	useEffect(() => {
		if (graphTypeOption) fetchTaskGraphData();
	}, [graphTypeOption]);

	const fetchCategories = async () => {
		if (categories.length > 0) return;
		const categoriesData = await getCategories();
		if (categoriesData.data?.success)
			dispatch(setCategories(categoriesData.data?.data));
	};

	useEffect(() => {
		fetchCategories();
	}, []);

	return (
		<div className="add-event-page pt-5 pb-5">
			<div className="container">
				<div className="page-inner">
					<div className="common-parent-box mb-4">
						<div className="heading">
							<h2>{translation("dashboard")}</h2>
						</div>
					</div>

					<div className="status-card-section">
						<div className="row">
							<div className="col-md-12 col-lg-6 col-xl-4">
								<div className="status-card">
									<div className="card-top">
										<div className="name">
											<h4>{translation("total_users")}</h4>
										</div>
										<div>
											<div className="date-range-show">
												<DateRangeSelector
													dateRangeSelection={dateRangeSelectionForUser}
													setDateRangeSelection={setDateRangeSelectionForUser}
													isMaxDate
												/>
											</div>
										</div>
									</div>
									<div className="card-mid">
										<p>{totalUsersCount ?? "0"}</p>
									</div>
									<div className="action-link">
										<Link to={ROUTES.USER_LIST}>
											{" "}
											{translation("view_all")}
										</Link>
									</div>
								</div>
							</div>{" "}
							<div className="col-md-12 col-lg-6 col-xl-4">
								<div className="status-card">
									<div className="card-top">
										<div className="name">
											<h4>{translation("total_businesses")}</h4>
										</div>
										<div>
											<div className="date-range-show">
												<DateRangeSelector
													dateRangeSelection={dateRangeSelectionForBusiness}
													setDateRangeSelection={
														setDateRangeSelectionForBusiness
													}
													isMaxDate
												/>
											</div>
										</div>
									</div>
									<div className="card-mid">
										<p>{totalBusinessCount ?? "0"}</p>
									</div>
									<div className="action-link">
										<Link to={ROUTES.BUSINESS_LIST}>
											{" "}
											{translation("view_all")}
										</Link>
									</div>
								</div>
							</div>{" "}
							<div className="col-md-12 col-lg-6 col-xl-4">
								<div className="status-card">
									<div className="card-top">
										<div className="name">
											<h4> {translation("total_events")}</h4>
										</div>
										<div>
											<div className="date-range-show">
												<DateRangeSelector
													dateRangeSelection={dateRangeSelectionForEvent}
													setDateRangeSelection={setDateRangeSelectionForEvent}
												/>
											</div>
										</div>
									</div>
									<div className="card-mid">
										<p>{totalEventsCount ?? "0"}</p>
									</div>
									<div className="action-link">
										<Link to={ROUTES.EVENT_LIST}>
											{" "}
											{translation("view_all")}
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="revenue-card">
						<div className="row">
							<div className="col-md-9 col-lg-10">
								<div className="name">
									<h3>{translation("revenue")}</h3>
									<p>
										{`$${
											graphData?.totalRevenue
												? parseFloat(
														graphData.totalRevenue.toString()
													).toLocaleString(undefined, {
														minimumFractionDigits:
															graphData.totalRevenue % 1 === 0 ? 0 : 2,
														maximumFractionDigits: 2,
													})
												: "0.00"
										}`}
									</p>
								</div>
							</div>
							<div className="col-md-3 col-lg-2">
								<InputWrapper>
									<Select
										name={"graphTypeOptions"}
										control={control}
										className="form-control form-select"
										option={graphTypeOptions}
										onChange={(e) => {
											setGraphTypeOption(e?.target?.value);
										}}
										disableFirstOption
									/>
								</InputWrapper>
							</div>
						</div>

						<div className="card-body">
							<div className="w-100 mt-4">
								{graphData && GRAPH_OPTIONS ? (
									<Line
										options={GRAPH_OPTIONS}
										data={GRAPH_DATA}
										height={"70px"}
									/>
								) : (
									<SmallLoader />
								)}
							</div>
						</div>
					</div>

					<div className="dash-transactions">
						<div className="dash-transactions-top">
							<div className="heading">
								<h4>{translation("recent_transactions")}</h4>
							</div>
							<div className="action-link">
								<Link to={ROUTES.TRANSACTIONS_LIST}>
									{translation("view_all")}
								</Link>
							</div>
						</div>
						<div className="theme-table">
							<div className="table-responsive">
								<table className="table">
									<thead>
										<tr>
											<td>{translation("name")}</td>
											<td>{translation("email")}</td>
											<td>{translation("event_name")}</td>
											<td>{translation("transaction_id")}</td>
											<td>{translation("transaction_date")}</td>
											<td>{translation("amount")}</td>
										</tr>
									</thead>
									<tbody>
										{transactionList?.length > 0 ? (
											transactionList.map(
												(item: ITransactionList, index: number) => {
													return (
														<tr key={index}>
															<td>{item?.user?.name ?? "-"}</td>
															<td>{item?.user?.email ?? "-"}</td>
															<td>{item?.event?.name ?? "-"}</td>
															<td>{item?.payment?.transactionId ?? "-"}</td>
															<td>
																{moment(
																	item?.payment?.transactionDateTime
																).format("MMM D, YYYY")}
															</td>
															<td>
																{item?.payment?.totalAmount
																	? `$${item?.payment?.totalAmount}`
																	: "-"}
															</td>
														</tr>
													);
												}
											)
										) : isTransactionLoading ? (
											<tr>
												<td colSpan={7} align="center">
													<SmallLoader />
												</td>
											</tr>
										) : (
											<tr>
												<td colSpan={7} align="center">
													{translation("no_record_found")}
												</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
