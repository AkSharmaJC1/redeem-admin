import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import InfiniteScroll from "react-infinite-scroll-component";

import useInfiniteScroll from "../../../hooks/useInfiniteScroll";
import { getUserList, updateUserStatus, generatePassword, logoutUser } from "../../../services/user"; // Import logoutUser
import helper from "../../../utils/helper";

import InputWrapper from "../../formElements/InputWrapper";
import ConfirmationModal from "../../formElements/CommonConfirmationModal";
import {
	toastMessageError,
	toastMessageSuccess,
} from "../../../commonToast/CommonToastMessage";
import Searchbox from "../../formElements/SearchBox";

import SmallLoader from "../../utilities/smallLoader";

import { IUserList } from "../../../interfaces/userInterfaces";
import { LIST_RECORDS_LIMIT } from "../../../constants/commonConstant";

import searchIcon from "./../../../assets/images/search-icon.svg";
import { ROUTES } from "../../../utils/constants";

const UserList: React.FC = () => {
	const [searchText, setSearchText] = useState<string>("");
	const [firstLoad, setFirstLoad] = useState(true);
	const [statusLoading, setStatusLoading] = useState<boolean>(false);
	const [resendPasswordLoading, setResendPasswordLoading] = useState<boolean>(false);
	const [logoutLoading, setLogoutLoading] = useState<boolean>(false); // New state for logout loading
	const [userStatusData, setUserStatusData] = useState<{
		showModal: boolean;
		userId: string;
		isActive: number;
	}>({
		showModal: false,
		userId: "",
		isActive: -1,
	});
	const [resendPasswordData, setResendPasswordData] = useState<{
		showModal: boolean;
		userId: string;
		userName: string;
	}>({
		showModal: false,
		userId: "",
		userName: "",
	});
	const [logoutUserData, setLogoutUserData] = useState<{ // New state for logout user
		showModal: boolean;
		userId: string;
		userName: string;
	}>({
		showModal: false,
		userId: "",
		userName: "",
	});

	const { control } = useForm();
	const { t: translation } = useTranslation();
	const navigate = useNavigate();

	const {
		data: userListData,
		loading: userListLoading,
		hasMore,
		loadMore,
		message: userListApiCallMessage,
		fetchData: getUsersData,
	} = useInfiniteScroll({
		apiService: getUserList,
		apiParams: { search_text: searchText },
		limit: LIST_RECORDS_LIMIT,
	});

	const debouncedGetUsers = useCallback(
		debounce(() => getUsersData(true), 1000),
		[getUsersData]
	);

	/**
	 * Search Functionality
	 */
	useEffect(() => {
		if (searchText) {
			debouncedGetUsers();
			return () => {
				debouncedGetUsers.cancel();
			};
		} else {
			getUsersData(true);
		}
	}, [searchText]);

	const handleUserStatus = async () => {
		setStatusLoading(true);
		try {
			const payload = {
				userId: userStatusData.userId,
				isActive: userStatusData.isActive === 1 ? 0 : 1,
			};
			const response = await updateUserStatus(payload);
			if (response && response.data?.success) {
				const userIndex = userListData.findIndex(
					(user: IUserList) => user.id === payload.userId
				);

				userListData[userIndex].isActive = Number(payload.isActive);
				setUserStatusData({
					showModal: false,
					userId: "",
					isActive: -1,
				});
				toastMessageSuccess(translation(response.data.message));
			} else {
				toastMessageError(
					translation(response.data?.message ?? "something_went_wrong")
				);
			}
		} catch (error) {
			console.error("ERROR: update User Status ", error);
		}
		setStatusLoading(false);
	};

	const handleUserLogout = async () => {
		setLogoutLoading(true);
		try {
			const payload = {
				userId: logoutUserData.userId,
				isCleared:true
			};
			const response = await updateUserStatus(payload);
			if (response && response.data?.success) {
				setLogoutUserData({
					showModal: false,
					userId: "",
					userName: "",
				});
				toastMessageSuccess(translation(response.data.message || "user_logged_out_successfully"));
			} else {
				toastMessageError(
					translation(response.data?.message ?? "something_went_wrong")
				);
			}
		} catch (error) {
			console.error("ERROR: logout user ", error);
			toastMessageError(translation("something_went_wrong"));
		}
		setLogoutLoading(false);
	};

	const handleResendPassword = async () => {
		setResendPasswordLoading(true);
		try {
			const payload: any = {
				userId: resendPasswordData.userId,
			};
			const response = await generatePassword(payload);
			if (response && response.data?.success) {
				setResendPasswordData({
					showModal: false,
					userId: "",
					userName: "",
				});
				toastMessageSuccess(translation("Password sent successfully!"));
			} else {
				toastMessageError(
					translation(response.data?.message ?? "something_went_wrong")
				);
			}
		} catch (error) {
			console.error("ERROR: resend password ", error);
			toastMessageError(translation("something_went_wrong"));
		}
		setResendPasswordLoading(false);
	};

	useEffect(() => {
		if (userListApiCallMessage) {
			setFirstLoad(false);
		}
	}, [userListApiCallMessage]);

	return (
		<div className="user-page pt-5 pb-5">
			<div className="container">
				<div className="page-inner">
					<div className="common-parent-box mb-4">
						<div className="row align-items-center g-4">
							<div className="col-md-4">
								<div className="heading">
									<h2>{translation("users")}</h2>
								</div>
							</div>
							<div className="col-md-8">
								<div className="box-right">
									<div className="search-box">
										<InputWrapper className="mb-0">
											<Searchbox
												name="search"
												type="text"
												value={searchText}
												control={control}
												onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
													setSearchText(e.target.value);
												}}
												className="form-control"
												placeholder={translation("search")}
												align="right"
											>
												<InputWrapper.Icon
													src={searchIcon}
													onClick={() => { }}
												/>
											</Searchbox>
										</InputWrapper>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="theme-table">
						<div className="table-responsive">
							<InfiniteScroll
								dataLength={userListData.length}
								next={loadMore}
								hasMore={hasMore}
								scrollableTarget="scrollableUserDiv"
								scrollThreshold="100px"
								loader={userListData.length ? <SmallLoader /> : null}
								height={innerHeight - 280}
								endMessage={
									!userListLoading ? (
										<p className="text-center text-white mt-3">
											{userListData.length > 0 &&
												translation("yay_you_have_seen_it_all")}
										</p>
									) : null
								}
							>
								<table className="table">
									<thead>
										<tr>
											<td className="min-width-200">{translation("name")}</td>
											<td className="min-width-300">{translation("email")}</td>
											<td>{translation("phone_num")}</td>
											<td>{translation("date_joined")}</td>
											<td>{translation("status")}</td>
											<td>{translation("actions")}</td>
										</tr>
									</thead>

									<tbody>
										{firstLoad ? (
											<tr>
												<td colSpan={7} align="center" className="text-center">
													<SmallLoader />
												</td>
											</tr>
										) : userListData && userListData.length > 0 ? (
											userListData.map((user: IUserList, index: number) => {
												return (
													<tr
														className="cursor-pointer"
														key={index + 1}
														onClick={() => {
															navigate(
																ROUTES.USER_DETAIL.replace(
																	":userId",
																	`${user?.id}`
																),
																{
																	state: user,
																}
															);
														}}
													>
														<td>
															{user?.name
																? user?.name?.length > 20
																	? `${user?.name.slice(0, 20)}...`
																	: user?.name
																: "-"}
														</td>
														<td>{user.email ?? "-"}</td>
														<td>
															{user.phone ? (
																<>
																	+{user.phoneCountryCode ?? ""}{" "}
																	{helper.formatPhoneNumber(user.phone)}
																</>
															) : (
																"-"
															)}
														</td>
														<td>
															{new Intl.DateTimeFormat("en-US", {
																year: "numeric",
																month: "short",
																day: "2-digit",
															}).format(new Date(user.createdAt))}
														</td>
														<td>
															<div className="switch-taggle-content me-4">
																<div className="switch-taggle">
																	<input
																		checked={user.isActive === 1}
																		type="checkbox"
																		defaultChecked={user.isActive === 1}
																		onClick={(e) => {
																			// Prevent row click
																			e.stopPropagation();
																			setUserStatusData({
																				showModal: true,
																				userId: user.id,
																				isActive: user.isActive,
																			});
																		}}
																	/>
																	<span className="switch-slider round"></span>
																</div>
																<label>
																	{user.isActive === 1
																		? translation("active")
																		: translation("inactive")}
																</label>
															</div>
														</td>
														<td>
															<div className="d-flex gap-2">
																{/* Resend Password Button */}
																<button
																	type="button"
																	className="btn text-nowrap btn-outline-primary btn-sm"
																	onClick={(e) => {
																		e.stopPropagation();
																		setResendPasswordData({
																			showModal: true,
																			userId: user.id,
																			userName: user.name || user.email,
																		});
																	}}
																	disabled={resendPasswordLoading}
																>
																	{resendPasswordLoading ? (
																		<SmallLoader />
																	) : (
																		translation("resend_password")
																	)}
																</button>

																{/* Logout User Button */}
																<button
																	type="button"
																	className="btn text-nowrap btn-outline-warning btn-sm"
																	onClick={(e) => {
																		e.stopPropagation();
																		setLogoutUserData({
																			showModal: true,
																			userId: user.id,
																			userName: user.name || user.email,
																		});
																	}}
																	disabled={logoutLoading}
																>
																	{logoutLoading ? (
																		<SmallLoader />
																	) : (
																		translation("Logout User")
																	)}
																</button>
															</div>
														</td>
													</tr>
												);
											})
										) : userListLoading ? (
											<tr>
												<td colSpan={7} align="center" className="text-center">
													<SmallLoader />
												</td>
											</tr>
										) : (
											<tr>
												<td colSpan={7} className="text-center">
													<p className="m-0 text-white">
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

			{/* User Status Update Modal */}
			{userStatusData.showModal && (
				<ConfirmationModal
					onClickOkay={handleUserStatus}
					onClickCancel={() =>
						setUserStatusData({
							showModal: false,
							userId: "",
							isActive: -1,
						})
					}
					disabled={statusLoading}
					loading={statusLoading}
					heading={translation("user_status_update_heading")}
					paragraph={translation("user_status_update_paragraph")}
				/>
			)}

			{/* Resend Password Confirmation Modal */}
			{resendPasswordData.showModal && (
				<ConfirmationModal
					onClickOkay={handleResendPassword}
					onClickCancel={() =>
						setResendPasswordData({
							showModal: false,
							userId: "",
							userName: "",
						})
					}
					disabled={resendPasswordLoading}
					loading={resendPasswordLoading}
					heading={translation("resend_password_heading")}
					paragraph={translation("resend_password_paragraph", {
						userName: resendPasswordData.userName
					})}
				/>
			)}

			{/* Logout User Confirmation Modal */}
			{logoutUserData.showModal && (
				<ConfirmationModal
					onClickOkay={handleUserLogout}
					onClickCancel={() =>
						setLogoutUserData({
							showModal: false,
							userId: "",
							userName: "",
						})
					}
					disabled={logoutLoading}
					loading={logoutLoading}
					heading={translation("Logout User")}
					paragraph={translation("Are you sure you want to logout this user ?")}
				/>
			)}
		</div>
	);
};
export default UserList;