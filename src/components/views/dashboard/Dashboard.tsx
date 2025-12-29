import { useForm } from "react-hook-form";
import { subDays } from "date-fns";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
	ComposableMap,
	Geographies,
	Geography,
	Marker,
	ZoomableGroup
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";

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
	BarElement,
	ArcElement,
	Title,
	Tooltip,
	Legend,
	Filler,
} from "chart.js";
import {
	fetchGraphData,
	getGoogleAnalytics,
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

interface IGoogleAnalytics {
	usersByCountry?: Record<string, number>;
	usersBySource?: Record<string, number>;
	pageViews?: Record<string, number>;
}

const COUNTRY_COORDINATES: Record<string, [number, number]> = {
	"India": [78.9629, 20.5937],
	"United States": [-95.7129, 37.0902],
	"Germany": [10.4515, 51.1657],
	"Canada": [-106.3468, 56.1304],
	"China": [104.1954, 35.8617],
	"Ireland": [-8.2439, 53.1424],
	"Peru": [-75.0152, -9.1900],
	"United Kingdom": [-3.4360, 55.3781],
	"Australia": [133.7751, -25.2744],
	"Brazil": [-51.9253, -14.2350],
	"France": [2.2137, 46.2276],
	"Japan": [138.2529, 36.2048],
	"Russia": [105.3188, 61.5240],
	"Mexico": [-102.5528, 23.6345],
	"South Africa": [22.9375, -30.5595],
};

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
	const [googleAnalyticsList, setGoogleAnalyticsList] = useState<IGoogleAnalytics>({});
	const [isGoogleAnalyticsLoading, setIsGoogleAnalyticsLoading] = useState(true);
	const geoUrl =
		"https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
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

	const [mapTooltip, setMapTooltip] = useState<string | null>(null);
	const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
	const dispatch = useDispatch();

	// Register ChartJS components
	ChartJS.register(
		CategoryScale,
		LinearScale,
		PointElement,
		LineElement,
		BarElement,
		ArcElement,
		Title,
		Tooltip,
		Filler,
		Legend
	);

	// Fetch functions
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

	const fetchGoogleAnalytics = async () => {
		try {
			setIsGoogleAnalyticsLoading(true);
			const googleAnalytics = await getGoogleAnalytics();
			if (googleAnalytics && googleAnalytics?.data?.success) {
				setGoogleAnalyticsList(googleAnalytics?.data?.summary);
			}
		} catch (e) {
			console.error("Google Analytics error", e);
		} finally {
			setIsGoogleAnalyticsLoading(false);
		}
	};

	useEffect(() => {
		fetchTransactionsList();
		fetchGoogleAnalytics();
	}, []);

	// Prepare data for world map
	const getCountryDataForMap = () => {
		const usersByCountry = googleAnalyticsList?.usersByCountry || {};

		return Object.entries(usersByCountry)
			.filter(([country]) => country !== "(not set)")
			.map(([country, value]) => ({
				country,
				value,
				coordinates: COUNTRY_COORDINATES[country] || [0, 0]
			}));
	};

	// Prepare data for source chart
	const getSourceChartData = () => {
		const usersBySource = googleAnalyticsList?.usersBySource || {};

		// Get top 8 sources
		const sortedSources = Object.entries(usersBySource)
			.sort(([, a], [, b]) => b - a)
			.slice(0, 8);

		return {
			labels: sortedSources.map(([source]) => source),
			datasets: [
				{
					label: 'Users by Source',
					data: sortedSources.map(([, count]) => count),
					backgroundColor: [
						'#FF6384',
						'#36A2EB',
						'#FFCE56',
						'#4BC0C0',
						'#9966FF',
						'#FF9F40',
						'#FF6384',
						'#C9CBCF'
					],
					borderColor: '#ffffff',
					borderWidth: 1,
				},
			],
		};
	};

	// Prepare data for page views chart
	const getPageViewsChartData = () => {
		const pageViews = googleAnalyticsList?.pageViews || {};

		// Get top 10 pages
		const sortedPages = Object.entries(pageViews)
			.sort(([, a], [, b]) => b - a)
			.slice(0, 10);

		return {
			labels: sortedPages.map(([page]) => {
				// Shorten long page names
				if (page.length > 20) {
					return page.substring(0, 20) + '...';
				}
				return page;
			}),
			datasets: [
				{
					label: 'Page Views',
					data: sortedPages.map(([, views]) => views),
					backgroundColor: '#36A2EB',
					borderColor: '#36A2EB',
					borderWidth: 1,
				},
			],
		};
	};

	const getCountryUsers = (country: string) =>
		googleAnalyticsList?.usersByCountry?.[country] || 0;

	// Create color scale for map
	const getColorScale = () => {
		const countryData = getCountryDataForMap();
		const maxValue = Math.max(...countryData.map(d => d.value), 1);

		return scaleLinear<string>()
			.domain([0, maxValue / 2, maxValue])
			.range(["#E0F2FE", "#38BDF8", "#0369A1"]);
	};

	// Handle mouse events for map
	const handleMouseEnter = (geo: any, event: React.MouseEvent) => {
		const countryName = geo.properties.name;
		const usersByCountry = googleAnalyticsList?.usersByCountry || {};
		const userCount = usersByCountry[countryName] || 0;

		if (userCount > 0) {
			setMapTooltip(`${countryName}: ${userCount} users`);
			setTooltipPosition({ x: event.clientX, y: event.clientY });
		}
	};

	const handleMouseMove = (event: React.MouseEvent) => {
		if (mapTooltip) {
			setTooltipPosition({ x: event.clientX + 10, y: event.clientY - 10 });
		}
	};

	const handleMouseLeave = () => {
		setMapTooltip(null);
	};

	// Chart options for sources
	const sourceChartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: 'bottom' as const,
				labels: {
					boxWidth: 12,
					padding: 20,
					 color: "#ffffff",
				}
			},
			title: {
				display: true,
				text: 'Top Traffic Sources',
				 color: "#ffffff",
				font: {
					size: 16,
				}
			},
		},
	};

	// Chart options for page views
const pageViewsChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
      labels: {
        color: "#ffffff", // ✅ legend text
      },
    },
    title: {
      display: true,
      text: "Top Viewed Pages",
      color: "#ffffff", // ✅ title text
      font: {
        size: 16,
      },
    },
    tooltip: {
      titleColor: "#ffffff",
      bodyColor: "#ffffff",
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        color: "#ffffff", // ✅ y-axis text
      },
      grid: {
        display: true,
        color: "rgba(255, 255, 255, 0.1)", // ✅ subtle white grid
      },
    },
    x: {
      ticks: {
        maxRotation: 45,
        minRotation: 45,
        color: "#ffffff", // ✅ x-axis text
      },
      grid: {
        display: false,
      },
    },
  },
};

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

	// Provide gradient color in the graph
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

	// Calculate total users from analytics
	const getTotalUsersFromAnalytics = () => {
		const usersByCountry = googleAnalyticsList?.usersByCountry || {};
		return Object.values(usersByCountry).reduce((sum, count) => sum + count, 0);
	};

	return (
		<div className="add-event-page pt-5 pb-5">
			<div className="container">
				<div className="page-inner">
					<div className="common-parent-box mb-4">
						<div className="heading">
							<h2>{translation("dashboard")}</h2>
						</div>
					</div>

					{/* Status cards section */}
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
											{translation("view_all")}
										</Link>
									</div>
								</div>
							</div>
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
											{translation("view_all")}
										</Link>
									</div>
								</div>
							</div>
							<div className="col-md-12 col-lg-6 col-xl-4">
								<div className="status-card">
									<div className="card-top">
										<div className="name">
											<h4>{translation("total_events")}</h4>
										</div>
										<div>
											<div className="date-range-show left0">
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
											{translation("view_all")}
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Revenue Card */}
					<div className="revenue-card mb-4">
						<div className="row">
							<div className="col-md-9 col-lg-10">
								<div className="name">
									<h3>{translation("revenue")}</h3>
									<p>
										{`$${graphData?.totalRevenue
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

					{/* Google Analytics Section */}
					<div className="google-analytics-section  mb-4">
						<div className="common-parent-box">
							<div className="heading text-white mb-4">
								{/* <h3>{translation("google_analytics")}</h3> */}
								{/* <p className="text-white">
									Total Users: {getTotalUsersFromAnalytics()}
								</p> */}
							</div>

							{isGoogleAnalyticsLoading ? (
								<div className="text-center py-5">
									<SmallLoader />
								</div>
							) : (
								<>
									{/* World Map Section */}
									<div className="row mb-4 analytic-bg">
										<div className="col-12">
											<div className="card h-100 pt-2">
												<div className="card-header">
													<h5>{translation("global_users_distribution") || "Global Users Distribution"}</h5>
												</div>
												<div className="card-body position-relative">
													{/* Tooltip */}
													{mapTooltip && (
														<div
															className="map-tooltip"
															style={{
																position: 'fixed',
																left: `${tooltipPosition.x}px`,
																top: `${tooltipPosition.y}px`,
																zIndex: 1000,
																pointerEvents: 'none',
															}}
														>
															<div className="bg-dark text-white p-2 rounded shadow">
																<small>{mapTooltip}</small>
															</div>
														</div>
													)}

													<div
														className="world-map-container"
														onMouseMove={handleMouseMove}
														onMouseLeave={handleMouseLeave}
														style={{ height: '500px', position: 'relative' }}
													>
														<ComposableMap
															projection="geoMercator"
															projectionConfig={{
																scale: 120,
																center: [0, 20]
															}}
															style={{ width: '100%', height: '100%' }}
														>
															<ZoomableGroup center={[0, 20]} zoom={1}>
																<Geographies geography={geoUrl}>
																	{({ geographies }: any) =>
																		geographies.map((geo: any) => {
																			const name = geo.properties.name;
																			const users = getCountryUsers(name);
																			const colorScale = getColorScale();

																			return (
																				<Geography
																					key={geo.rsmKey}
																					geography={geo}
																					fill={users > 0 ? colorScale(users) : '#f0f0f0'}
																					stroke="#EAEAEC"
																					strokeWidth={0.5}
																					style={{
																						default: {
																							outline: 'none',
																							transition: 'all 250ms'
																						},
																						hover: {
																							fill: '#4F46E5',
																							outline: 'none',
																							cursor: 'pointer',
																						},
																						pressed: {
																							fill: '#3730A3',
																							outline: 'none',
																						},
																					}}
																					onMouseEnter={(event: any) => handleMouseEnter(geo, event)}
																					onMouseLeave={handleMouseLeave}
																				/>
																			);
																		})
																	}
																</Geographies>

																{/* Country markers */}
																{getCountryDataForMap().map(({ country, value, coordinates }) => (
																	<Marker
																		key={country}
																		coordinates={coordinates}
																		onMouseEnter={(event: any) =>
																			handleMouseEnter({ properties: { name: country } }, event)
																		}
																		onMouseLeave={handleMouseLeave}
																	>
																		<circle
																			r={Math.max(3, Math.min(8, value / 10))}
																			fill={value > 100 ? "#DC2626" : value > 50 ? "#F59E0B" : "#10B981"}
																			fillOpacity={0.8}
																			stroke="#FFF"
																			strokeWidth={1}
																			className="country-marker"
																		/>

																		{/* Country label for larger countries */}
																		{value > 50 && (
																			<text
																				textAnchor="middle"
																				y={-Math.max(3, Math.min(8, value / 10)) - 5}
																				style={{
																					fontFamily: 'system-ui',
																					fill: '#374151',
																					fontSize: '8px',
																					fontWeight: 'bold',
																					pointerEvents: 'none',
																				}}
																			>
																				{value}
																			</text>
																		)}
																	</Marker>
																))}
															</ZoomableGroup>
														</ComposableMap>

														{/* Legend */}
														<div className="map-legend">
															<div className="legend-title mb-2">
																<small className="text-white">Users by Country</small>
															</div>
															<div className="legend-items">
																<div className="legend-item">
																	<div className="legend-color" style={{ backgroundColor: '#E0F2FE' }}></div>
																	<small>Low</small>
																</div>
																<div className="legend-item">
																	<div className="legend-color" style={{ backgroundColor: '#38BDF8' }}></div>
																	<small>Medium</small>
																</div>
																<div className="legend-item">
																	<div className="legend-color" style={{ backgroundColor: '#0369A1' }}></div>
																	<small>High</small>
																</div>
															</div>
														</div>
													</div>
													<div className="card-footer ps-0 mt-2">
														<small className="text-white">
															Hover over countries to see user counts
														</small>
													</div>
												</div>
											</div>
										</div>
									</div>

									{/* Traffic Sources and Page Views */}
									<div className="row analytic-bg">
										{/* Traffic Sources Pie Chart */}
										<div className="col-md-12 col-lg-6 mb-4">
											<div className="card h-100">
												<div className="card-header">
													<h5>{translation("traffic_sources") || "Traffic Sources"}</h5>
												</div>
												<div className="card-body">
													<div className="chart-container" style={{ height: '350px' }}>
														<Pie data={getSourceChartData()} options={sourceChartOptions} />
													</div>
													<div className="text-center mt-3">
														<small className="text-white">
															Showing top 8 traffic sources
														</small>
													</div>
												</div>
											</div>
										</div>

										{/* Page Views Bar Chart */}
										<div className="col-md-12 col-lg-6 mb-4">
											<div className="card h-100">
												<div className="card-header">
													<h5>{translation("top_pages") || "Top Pages"}</h5>
												</div>
												<div className="card-body">
													<div className="chart-container" style={{ height: '350px' }}>
														<Bar data={getPageViewsChartData()} options={pageViewsChartOptions} />
													</div>
													<div className="text-center mt-3">
														<small className="text-white">
															Showing top 10 viewed pages
														</small>
													</div>
												</div>
											</div>
										</div>
									</div>
								</>
							)}
						</div>
					</div>

					{/* Recent Transactions */}
					<div className="dash-transactions ">
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