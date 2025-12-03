import { debounce } from "lodash";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import InfiniteScroll from "react-infinite-scroll-component";

import useInfiniteScroll from "../../../hooks/useInfiniteScroll";
import searchIcon from "./../../../assets/images/search-icon.svg";
import { getTicketsList } from "../../../services/business";
import { LIST_RECORDS_LIMIT } from "../../../constants/commonConstant";
import SmallLoader from "../../utilities/smallLoader";
import InputWrapper from "../../formElements/InputWrapper";
import Searchbox from "../../formElements/SearchBox";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../utils/constants";
import helper from "../../../utils/helper";

interface ITicket {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  inquiry_type: string;
  event_id: string | null;
  order_number: string | null;
  subject: string;
  description: string;
  issue_type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  event: any | null;
}

const INQUIRY_TYPE_MAP: Record<string, string> = {
  technical_or_billing_issue: "Technical/Billing Issue",
  organizer_onboarding: "Organizer Onboarding",
  general_inquiry: "General Inquiry",
  feature_request: "Feature Request",
  partnership: "Partnership",
};

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "status-pending" },
  in_progress: { label: "In Progress", className: "status-in-progress" },
  resolved: { label: "Resolved", className: "status-resolved" },
  closed: { label: "Closed", className: "status-closed" },
};

const TicketList: React.FC = () => {
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
    fetchData: getTickets,
  } = useInfiniteScroll({
    apiService: getTicketsList,
    apiParams: { search_text: searchValue },
    limit: LIST_RECORDS_LIMIT,
  });

  const getSearchData = debounce(() => {
    getTickets(true);
  }, 1000);

  // Format date using JavaScript Date object
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  // Format phone number (check if helper has this function)
  const formatPhoneNumber = (phone: string) => {
    // First check if helper has formatPhoneNumber
    if (helper.formatPhoneNumber && typeof helper.formatPhoneNumber === 'function') {
      return helper.formatPhoneNumber(phone);
    }
    
    // Fallback formatting
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  const getInquiryTypeDisplay = (type: string) => {
    return INQUIRY_TYPE_MAP[type] || type.replace(/_/g, " ");
  };

  const getStatusDisplay = (status: string) => {
    const statusInfo = STATUS_MAP[status] || { label: status, className: "status-default" };
    return (
      <span className={`status-badge ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  useEffect(() => {
    if (searchValue) {
      getSearchData();
      return () => {
        getSearchData.cancel();
      };
    } else {
      getTickets(true);
    }
  }, [searchValue]);

  useEffect(() => {
    if (message) {
      setFirstLoad(false);
    }
  }, [message]);

  return (
    <div className="ticket-page pt-5 pb-5">
      <div className="container">
        <div className="page-inner">
          <div className="common-parent-box mb-4">
            <div className="row align-items-center">
              <div className="col-md-4">
                <div className="heading">
                  <h2>{translation("tickets")}</h2>
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
                        placeholder={translation("search_tickets")}
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
            <div className="table-responsive" id="scrollableTicketListDiv">
              <InfiniteScroll
                dataLength={data?.length}
                next={loadMore}
                hasMore={hasMore}
                scrollableTarget="scrollableTicketListDiv"
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
                      <th>{translation("Ticket Id")}</th>
                      <th>{translation("Customer Name")}</th>
                      <th>{translation("email")}</th>
                      <th>{translation("Inquiry Type")}</th>
                      <th>{translation("subject")}</th>
                      {/* <th>{translation("status")}</th> */}
                      <th>{translation("Created Date")}</th>
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
                      data.map((ticket: ITicket, index: number) => {
                        return (
                          <tr
                            className="cursor-pointer"
                            key={ticket.id}
                            // onClick={() => {
                            //   navigate(
                            //     ROUTES.TICKET_DETAIL.replace(
                            //       ":ticketId",
                            //       ticket.id
                            //     )
                            //   );
                            // }}
                          >
                            <td>
                              <span className="ticket-id">#{ticket.id}</span>
                            </td>
                            <td>
                              <div className="customer-info">
                                <div className="customer-name">
                                  {ticket.full_name || "-"}
                                </div>
                                {ticket.phone && (
                                  <div className="customer-phone text-muted small">
                                    {formatPhoneNumber(ticket.phone)}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td>
                              <a
                                href={`mailto:${ticket.email}`}
                                className="text-primary"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {ticket.email}
                              </a>
                            </td>
                            <td>
                              <span className="inquiry-type">
                                {getInquiryTypeDisplay(ticket.inquiry_type)}
                              </span>
                              {ticket.issue_type && (
                                <div className="issue-type small text-muted">
                                  {ticket.issue_type.replace(/_/g, " ")}
                                </div>
                              )}
                            </td>
                            <td>
                              <div className="subject-text" title={ticket.subject}>
                                {ticket.subject.length > 50
                                  ? `${ticket.subject.substring(0, 50)}...`
                                  : ticket.subject}
                              </div>
                            </td>
                            {/* <td>{getStatusDisplay(ticket.status)}</td> */}
                            <td className="text-nowrap">
                              {formatDate(ticket.createdAt)}
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
                            {translation("no_tickets_found")}
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

export default TicketList;