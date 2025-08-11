import { debounce } from "lodash";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import InfiniteScroll from "react-infinite-scroll-component";

import useInfiniteScroll from "../../../hooks/useInfiniteScroll";

import searchIcon from "./../../../assets/images/search-icon.svg";
import {
	getPendingBusinessList,
	updateBusinessApprovalStatus,
} from "../../../services/business";
import {
	ApprovalStatus,
	LIST_RECORDS_LIMIT,
} from "../../../constants/commonConstant";
import SmallLoader from "../../utilities/smallLoader";
import {
	IBusiness,
	IBusinessDetails,
	IUpdateApprovalStatus,
} from "../../../interfaces/BusinessInterfaces";
import InputWrapper from "../../formElements/InputWrapper";
import Searchbox from "../../formElements/SearchBox";
import { MESSAGE_TYPE } from "../../../utils/constants";
import { useApiCall } from "../../../hooks/useApiCall";
import {
	toastMessageError,
	toastMessageSuccess,
} from "../../../commonToast/CommonToastMessage";
import CommonApprovalModal from "../../formElements/CommonApprovalModal";
import helper from "../../../utils/helper";

const ApprovalRequests: React.FC = () => {
	const { t: translation } = useTranslation();
	const [searchValue, setSearchValue] = useState("");
	const [businessList, setBusinessList] = useState<IBusiness[]>();
	const [businessStatusData, setBusinessStatusData] = useState<{
		showModal: boolean;
		index: number;
	}>({
		showModal: false,
		index: -1,
	});
	const [statusLoading, setStatusLoading] = useState<boolean>(false);
	const [firstLoad, setFirstLoad] = useState(true);
	const { control } = useForm();

	const {
		data,
		setData,
		loading,
		hasMore,
		loadMore,
		message,
		fetchData: getBusinesses,
	} = useInfiniteScroll({
		apiService: getPendingBusinessList,
		apiParams: { search_text: searchValue },
		limit: LIST_RECORDS_LIMIT,
	});

	const {
		refetch: updateBusinessStatus,
		message: updateBusinessStatusMessage,
	} = useApiCall<never, never, IUpdateApprovalStatus>({
		lazy: true,
		apiCall: updateBusinessApprovalStatus,
	});

	/**
	 * Changing Business Approval Status (approve/reject)
	 */
	const handleApprovalStatus = async (
		approval_status: boolean,
		reason?: string
	) => {
		setStatusLoading(true);
		const tempList: IBusiness[] = [...data];
		const newApprovalStatus = approval_status
			? ApprovalStatus.APPROVED
			: ApprovalStatus.REJECTED;

		tempList[businessStatusData.index] = {
			...tempList[businessStatusData.index],
			status: newApprovalStatus,
		};

		await updateBusinessStatus(undefined, {
			ownerId: parseInt(tempList[businessStatusData.index].user.id),
			status: newApprovalStatus,
			reason: reason,
		});

		setBusinessStatusData({
			showModal: false,
			index: -1,
		});

		setBusinessList(tempList);
		setStatusLoading(false);
		getBusinesses(true);
	};

	const getSearchData = debounce(() => {
		getBusinesses(true);
	}, 1000);

	useEffect(() => {
		if (updateBusinessStatusMessage) {
			if (updateBusinessStatusMessage.type === MESSAGE_TYPE.success) {
				setData(businessList as unknown as IBusiness[]);
				toastMessageSuccess(
					translation(updateBusinessStatusMessage.description)
				);
			} else {
				toastMessageError(translation(updateBusinessStatusMessage.description));
			}
		}
	}, [updateBusinessStatusMessage]);

	/**
	 * Search Functionality
	 */
	useEffect(() => {
		if (searchValue) {
			getSearchData();
			return () => {
				getSearchData.cancel();
			};
		} else {
			getBusinesses(true);
		}
	}, [searchValue]);

	const handleApprove = async () => {
		await handleApprovalStatus(true);
	};

	const handleReject = async (reason: string) => {
		await handleApprovalStatus(false, reason);
	};

	const handleCloseModal = () => {
		setBusinessStatusData({
			showModal: false,
			index: -1,
		});
	};

	useEffect(() => {
		if (message) {
			setFirstLoad(false);
		}
	}, [message]);

	return (
		<div className="business-page pt-5 pb-5">
			<div className="container">
				<div className="page-inner">
					<div className="common-parent-box mb-4">
						<div className="row align-items-center">
							<div className="col-md-4">
								<div className="heading">
									<h2>{translation("approval_requests")}</h2>
								</div>
							</div>
							<div className="col-md-8">
								<div className="box-right">
									<div className="search-box">
										<InputWrapper className="mb-0">
											<Searchbox
												name="search"
												type="text"
												value={searchValue}
												control={control}
												onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
													setSearchValue(e.target.value);
												}}
												className="form-control"
												placeholder={translation("search")}
												align="right"
											>
												<InputWrapper.Icon
													src={searchIcon}
													onClick={() => {}}
												/>
											</Searchbox>
										</InputWrapper>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="theme-table">
						<div className="table-responsive" id="scrollableBusinessListDiv">
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
											{data.length > 0 &&
												translation("yay_you_have_seen_it_all")}
										</p>
									) : null
								}
							>
								<table className="table">
									<thead>
										<tr>
											<td>{translation("business_name")}</td>
											<td>{translation("owner_name")}</td>
											<td>{translation("email")}</td>
											<td>{translation("phone_num")}</td>
											<td>{translation("status")}</td>
										</tr>
									</thead>
									<tbody>
										{data.length == 0 && loading && firstLoad ? (
											<tr>
												<td colSpan={6} align="center" className="text-center">
													<SmallLoader />
												</td>
											</tr>
										) : data?.length > 0 ? (
											data.map((business: IBusinessDetails, index: number) => {
												return (
													<tr className="cursor-pointer" key={index + 1}>
														<td>{business.name}</td>
														<td>{business.user.name}</td>
														<td>{business.user.email}</td>
														<td className="text-nowrap">
															{business.user.phone
																? `+1 ${helper.formatPhoneNumber(
																		business.user.phone
																	)}`
																: "-"}
														</td>
														<td>
															<div className="switch-taggle-content">
																<div
																	className={`switch-taggle ${
																		business.status === ApprovalStatus.REJECTED
																			? "rejected"
																			: ""
																	}`}
																>
																	<input
																		type="checkbox"
																		checked={
																			business.status ===
																			ApprovalStatus.APPROVED
																		}
																		defaultChecked={
																			business.status ===
																			ApprovalStatus.APPROVED
																		}
																		onClick={(e) => {
																			e.stopPropagation(); // Prevent row click
																			setBusinessStatusData({
																				showModal: true,
																				index: index,
																			});
																		}}
																		role="switch"
																	/>
																	<span className="switch-slider round"></span>
																</div>
																<label
																	className={
																		business.status === ApprovalStatus.REJECTED
																			? "text-danger"
																			: ""
																	}
																>
																	{business.status === ApprovalStatus.PENDING
																		? translation("pending")
																		: business.status ===
																			  ApprovalStatus.REJECTED
																			? translation("rejected")
																			: translation("approved")}
																</label>
															</div>
														</td>
													</tr>
												);
											})
										) : loading ? (
											<tr>
												<td colSpan={6} align="center" className="text-center">
													<SmallLoader />
												</td>
											</tr>
										) : (
											<tr>
												<td colSpan={6}>
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
				</div>
			</div>
			{businessStatusData.showModal && (
				<CommonApprovalModal
					onApprove={handleApprove}
					onReject={handleReject}
					onClose={handleCloseModal}
					disabled={statusLoading}
					loading={statusLoading}
					heading={translation("user_status_update_heading")}
					paragraph={translation("approval_status_update_paragraph")}
				/>
			)}
		</div>
	);
};

export default ApprovalRequests;
