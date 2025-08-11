import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import InputWrapper from "../../formElements/InputWrapper";
import searchIcon from "./../../../assets/images/search-icon.svg";

import { TAB_TYPE } from "../../../constants/commonConstant";
import Searchbox from "../../formElements/SearchBox";
import useDebounce from "../../../hooks/useDebounce";
import UpcomingEventsAndPastEvent from "./UpcomingEventsAndPastEvent";

const EventList: React.FC = () => {
	const { control } = useForm();
	const { t: translation } = useTranslation();
	const [tab, setTab] = useState(TAB_TYPE.upcomingEvent);
	const [searchValue, setSearchValue] = useState("");
	const debouncedFilterValue = useDebounce(searchValue, 1000);

	return (
		<>
			<div className="pt-5 pb-5">
				<div className="container">
					<div className="page-inner">
						<div className="common-parent-box mb-4">
							<div className="row align-items-center mb-4">
								<div className="col-md-4">
									<div className="heading-tab">
										<ul>
											<li
												className={
													TAB_TYPE.upcomingEvent === tab ? "active" : ""
												}
												onClick={() => setTab(TAB_TYPE.upcomingEvent)}
											>
												{translation("upcoming_events")}
											</li>
											<li
												onClick={() => setTab(TAB_TYPE.pastEvent)}
												className={TAB_TYPE.pastEvent === tab ? "active" : ""}
											>
												{translation("past_events")}
											</li>
										</ul>
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
													onChange={(
														e: React.ChangeEvent<HTMLInputElement>
													) => {
														setSearchValue(e.target.value);
													}}
													className="form-control"
													placeholder="Search"
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
							{tab === TAB_TYPE.upcomingEvent ? (
								<UpcomingEventsAndPastEvent
									searchValue={debouncedFilterValue}
									tab={TAB_TYPE.upcomingEvent}
								/>
							) : null}
							{tab === TAB_TYPE.pastEvent ? (
								<UpcomingEventsAndPastEvent
									searchValue={debouncedFilterValue}
									tab={TAB_TYPE.pastEvent}
								/>
							) : null}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default EventList;
