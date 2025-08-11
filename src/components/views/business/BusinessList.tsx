import { debounce } from "lodash";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import InfiniteScroll from "react-infinite-scroll-component";

import useInfiniteScroll from "../../../hooks/useInfiniteScroll";

import searchIcon from "./../../../assets/images/search-icon.svg";
import { getBusinessList } from "../../../services/business";
import { LIST_RECORDS_LIMIT } from "../../../constants/commonConstant";
import SmallLoader from "../../utilities/smallLoader";
import { IBusinessDetails } from "../../../interfaces/BusinessInterfaces";
import InputWrapper from "../../formElements/InputWrapper";
import Searchbox from "../../formElements/SearchBox";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../utils/constants";
import helper from "../../../utils/helper";
import "./Business.scss";

const BusinessList: React.FC = () => {
	const { t: translation } = useTranslation();
	const [searchValue, setSearchValue] = useState("");
	const [firstLoad, setFirstLoad] = useState(true);
	const navigate = useNavigate();
	const { control } = useForm();

	const {
		data,
		loading,
		hasMore,
		loadMore,
		message,
		fetchData: getBusinesses,
	} = useInfiniteScroll({
		apiService: getBusinessList,
		apiParams: { search_text: searchValue },
		limit: LIST_RECORDS_LIMIT,
	});

	const getSearchData = debounce(() => {
		getBusinesses(true);
	}, 1000);

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
									<h2>{translation("businesses")}</h2>
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
										</tr>
									</thead>
									<tbody>
										{firstLoad ? (
											<tr>
												<td colSpan={6} align="center" className="text-center">
													<SmallLoader />
												</td>
											</tr>
										) : data?.length > 0 ? (
											data.map((business: IBusinessDetails, index: number) => {
												return (
													<tr
														className="cursor-pointer"
														key={index + 1}
														onClick={() => {
															navigate(
																ROUTES.BUSINESS_DETAIL.replace(
																	":businessId",
																	`${business?.user?.id}`
																)
															);
														}}
													>
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
		</div>
	);
};
export default BusinessList;
