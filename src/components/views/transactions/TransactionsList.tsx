import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import InputWrapper from "../../formElements/InputWrapper";
import searchIcon from "./../../../assets/images/search-icon.svg";
import { useTranslation } from "react-i18next";
import useInfiniteScroll from "../../../hooks/useInfiniteScroll";
import { LIST_RECORDS_LIMIT } from "../../../constants/commonConstant";
import SmallLoader from "../../utilities/smallLoader";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroll-component";
import { getTransactionList } from "../../../services/transaction";
import { ITransactionList } from "../../../interfaces/transactionInterfaces";
import useDebounce from "../../../hooks/useDebounce";
import Searchbox from "../../formElements/SearchBox";

const TransactionsList: React.FC = () => {
	const { control } = useForm();
	const { t: translation } = useTranslation();
	const [searchValue, setSearchValue] = useState("");
	const [firstLoad, setFirstLoad] = useState(true);

	const debouncedFilterValue = useDebounce(searchValue, 500);
	const { data, loading, hasMore, loadMore, fetchData, message } =
		useInfiniteScroll({
			apiService: getTransactionList,
			apiParams: {
				search_text: encodeURIComponent(debouncedFilterValue) ?? "",
			},
			limit: LIST_RECORDS_LIMIT,
		});

	useEffect(() => {
		fetchData(true);
	}, [debouncedFilterValue]);

	useEffect(() => {
		if (message) {
			setFirstLoad(false);
		}
	}, [message]);
	return (
		<div className="pt-5 pb-5">
			<div className="container">
				<div className="page-inner">
					<div className="common-parent-box mb-4">
						<div className="row align-items-center">
							<div className="col-md-4">
								<div className="heading">
									<h2>{translation("transactions")}</h2>
								</div>
							</div>
							<div className="col-md-8">
								<div className="box-right">
									<div className="search-box">
										<InputWrapper className="mb-0">
											<Searchbox
												name="search"
												type="text"
												control={control}
												className="form-control"
												placeholder="Search"
												align="right"
												onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
													setSearchValue(e.target.value);
												}}
											>
												<InputWrapper.Icon src={searchIcon} />
											</Searchbox>
										</InputWrapper>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="theme-table">
						<div className="table-responsive" id="scrollableTransactionListDiv">
							<InfiniteScroll
								dataLength={data?.length}
								next={loadMore}
								hasMore={hasMore}
								scrollableTarget="scrollableTransactionListDiv"
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
											<td>{translation("name")}</td>
											<td>{translation("email")}</td>
											<td>{translation("event_name")}</td>
											<td>{translation("transaction_id")}</td>
											<td>{translation("transaction_date")}</td>
											<td>{translation("amount")}</td>
										</tr>
									</thead>

									<tbody>
										{firstLoad ? (
											<tr>
												<td colSpan={7} align="center" className="text-center">
													<SmallLoader />
												</td>
											</tr>
										) : data?.length > 0 ? (
											data.map((item: ITransactionList, index: number) => {
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
											})
										) : loading ? (
											<tr>
												<td colSpan={7} align="center" className="text-center">
													<SmallLoader />
												</td>
											</tr>
										) : (
											<tr>
												<td colSpan={7}>
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
export default TransactionsList;
