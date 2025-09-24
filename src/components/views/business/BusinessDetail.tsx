import moment from "moment";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { useNavigate, useParams } from "react-router-dom";
import { useApiCall } from "../../../hooks/useApiCall";

import Button from "../../formElements/Button";

import { MESSAGE_TYPE, ROUTES } from "../../../utils/constants";

import { getBusiness } from "../../../services/business";

import BackIcon from "../../utilities/svgElements/BackIcon";

import BusinessRevenueCard from "./BusinessRevenueCard";
import { IResponseData } from "../../../interfaces/commonInterfaces";
import { IBusinessDetails } from "../../../interfaces/BusinessInterfaces";
import BusinessEventsList from "./BusinessEventsList";
import "swiper/css/pagination";
import "./Business.scss";
import "swiper/css";
import SmallLoader from "../../utilities/smallLoader";

const BusinessDetail: React.FC = () => {
	const navigate = useNavigate();
	const { businessId } = useParams();
	const { t: translation } = useTranslation();
	const [showMore, setShowMore] = useState(false);

	const [businessDetails, setBusinessDetails] = useState<IBusinessDetails>();

	const {
		data: businessDetailData,
		refetch: getBusinessData,
		loading: businessDetailLoading,
		message: businessDetailMessage,
	} = useApiCall<IResponseData, string, never>({
		lazy: true,
		apiCall: getBusiness,
	});

	/**
	 * Fetch Data for selected Business
	 */
	useEffect(() => {
		if (businessId) {
			getBusinessData(businessId);
		}
	}, [businessId]);

	useEffect(() => {
		if (businessDetailMessage && businessDetailData) {
			if (businessDetailMessage.type === MESSAGE_TYPE.success) {
				setBusinessDetails(businessDetailData);
			}
		}
	}, [businessDetailMessage, businessDetailData]);

	// FUTURE SCOPE: UPDATE TO TOP PLACE
	// const updateTopPlace = async (isTopPlace: boolean, businessId: number) => {
	//   try {
	//     const response = await updateIsTopPlace({
	//       businessId: businessId,
	//       isTopPlace: isTopPlace,
	//     });
	//     if (response && response?.data?.success) {
	//       toastMessageSuccess(
	//         translation(
	//           translation(
	//             response?.message ?? "business_top_place_status_updated"
	//           )
	//         )
	//       );
	//       setBusinessDetails((prevState) => {
	//         if (!prevState) return prevState;
	//         return {
	//           ...prevState,
	//           isTopPlace: isTopPlace,
	//         };
	//       });
	//     } else {
	//       toastMessageError(
	//         translation(response?.message ?? "something_went_wrong")
	//       );
	//     }
	//   } catch (error) {
	//     console.log(
	//       "An error occurred while updating event hottest status:",
	//       error
	//     );
	//   }
	// };

	function formatPhoneNumber(phoneNumberString: string) {
		const cleaned = phoneNumberString.replace(/\D/g, "");
		const part1 = cleaned.slice(0, 3);
		const part2 = cleaned.slice(3, 6);
		const part3 = cleaned.slice(6, 10);

		return `(${part1}) ${part2}-${part3}`;
	}

	return (
		<div className="business-page pt-5 pb-5">
			<div className="container">
				<div className="page-inner">
					{businessDetailLoading ? (
						<div className="loading-state">
							<SmallLoader />
						</div>
					) : (
						<>
							<div className="back-btn-action mb-4">
								<Button
									className="white-outline-btn radius-sm btn-sm"
									onClick={() => navigate(ROUTES.BUSINESS_LIST)}
								>
									<BackIcon /> {translation("back")}
								</Button>
							</div>
							<div className="theme-card business-detail-card">
								<div className="card-mid">
									<div className="business-info-section">
										<div className="row">
											<div className="col-md-3">
												<div className="business-image-slider">
													{businessDetails && businessDetails?.images ? (
														<Swiper
															modules={[Pagination]}
															spaceBetween={50}
															slidesPerView={1}
															pagination={{ clickable: true }}
														>
															{businessDetails?.images?.map((image: string) => {
																return (
																	<SwiperSlide>
																		<div className="slider-img">
																			<img src={image} alt="thumbnailImg" />
																		</div>
																	</SwiperSlide>
																);
															})}
														</Swiper>
													) : null}
												</div>
											</div>
											<div className="col-md-9">
												<div className="section-info">
													<div className="name">
														<h2>{businessDetails?.name ?? "-"}</h2>
													</div>
													<div className="info-list">
														<div className="item">
															<h6>{translation("date_added")}</h6>
															<p>
																<span>:</span>{" "}
																{moment(businessDetailData?.createdAt).format(
																	"MMM D, YYYY"
																)}
															</p>
														</div>
														<div className="item">
															<h6>{translation("owner_name")}</h6>
															<p>
																<span>:</span>{" "}
																{businessDetails?.user?.name ?? "-"}
															</p>
														</div>
														<div className="item">
															<h6>{translation("email")}</h6>
															<p>
																<span>:</span>{" "}
																{businessDetails?.user?.email ?? "-"}
															</p>
														</div>
														<div className="item">
															<h6>{translation("phone")}</h6>
															<p>
																<span>:</span>
																{"+"}
																{businessDetails?.user?.phoneCountryCode}{" "}
																{formatPhoneNumber(
																	businessDetails?.user?.phone ?? "1234567890"
																)}
															</p>
														</div>
														<div className="item">
															<h6>{translation("address")}</h6>
															<p>
																<span>:</span> {businessDetails?.address ?? "-"}
															</p>
														</div>
														<div className="item">
															<h6>{translation("non_profit_org")}</h6>
															<p>
																<span>:</span>{" "}
																{businessDetails?.isNonProfitOrg ? "Yes" : "No"}
																{businessDetailData
																	?.taxExemptionCertificates?.[0] && (
																	<>
																		{/* {" | "} */}
																		<a
																			href={
																				businessDetailData
																					?.taxExemptionCertificates[0]
																			}
																			target="_blank"
																			rel="noopener noreferrer"
																			style={{
																				color: "rgba(255, 218, 136, 1)",
																			}}
																		>
																			Certificate Link
																		</a>
																	</>
																)}
															</p>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
									{/* <div className="make-hot-event">
										<div className="hot-event-action">
										<div className="name">
											<h5>{translation("mark_top")}</h5>
										</div>
										<div className="action-item">
											<label className="custom-radio">
											{translation("yes")}
											<input
												type="radio"
												name="radio"
												checked={businessDetails?.isTopPlace === true}
												onChange={() =>
												updateTopPlace(true, Number(businessId))
												}
											/>
											<span className="checkmark"></span>
											</label>
											<label className="custom-radio">
											{translation("no")}
											<input
												type="radio"
												name="radio"
												checked={businessDetails?.isTopPlace === false}
												onChange={() =>
												updateTopPlace(false, Number(businessId))
												}
											/>
											<span className="checkmark"></span>
											</label>
										</div>
										</div>
									</div> */}
									<div className="about-business-section">
										<div className="row">
											{businessDetailData?.id && (
												<BusinessRevenueCard
													businessId={+businessDetailData?.id}
												/>
											)}

											<div className="col-md-12 col-lg-8 col-xl-8">
												<div className="about-detail">
													<h3>{translation("about_the_business")}</h3>
													{businessDetailData?.about?.length > 500 ? (
														!showMore ? (
															<p className="align-btn">
																{" "}
																{businessDetailData?.about?.slice(0, 500) +
																	"..."}{" "}
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
																{businessDetails?.about}
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
														<p>{businessDetails?.about}</p>
													)}
												</div>
											</div>
										</div>
									</div>
									{businessDetails && (
										<BusinessEventsList
											userId={businessDetails?.user?.id?.toString()}
										/>
									)}
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};
export default BusinessDetail;
