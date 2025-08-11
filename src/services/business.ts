import ApiResponse from "../resources/entity/IApiResponse";
import endpoints from "../constants/endpoints";
import {
	ICommonDataForApi,
	IPresignedData,
} from "../interfaces/commonInterfaces";
import {
	IGetBusinessEvents,
	IUpdateApprovalStatus,
	IUpdateOwnerStatus,
	IUpdateTopPlace,
} from "../interfaces/BusinessInterfaces";

import { http } from "../utils/http";

/**
 * Get Business List
 * @param data
 * @returns
 */

export const getBusinessList = ({
	offset,
	limit,
	search_text,
}: ICommonDataForApi): Promise<ApiResponse> => {
	return http.get(
		`${endpoints.BUSINESS.GET_BUSINESS_LIST}?offset=${offset}&limit=${limit}${
			search_text ? `&searchQuery=${search_text.trim()}` : ""
		}`
	);
};

/**
 * Get Pending Business List
 * @param data
 * @returns
 */
export const getPendingBusinessList = ({
	offset,
	limit,
	search_text,
}: ICommonDataForApi): Promise<ApiResponse> => {
	return http.get(
		`${endpoints.BUSINESS.LIST_PENDING_BUSINESSES}?offset=${offset}&limit=${limit}${
			search_text ? `&searchQuery=${search_text.trim()}` : ""
		}`
	);
};

/**
 * Update Business
 * @param data
 * @returns
 */
export const updateBusinessOwnerStatus = (
	data?: IUpdateOwnerStatus
): Promise<ApiResponse> => {
	return http.put(`${endpoints.BUSINESS.UPDATE_BUSINESS_OWNER_STATUS}`, data);
};

/**
 * Update Business Approval Status
 * @param data
 * @returns
 */
export const updateBusinessApprovalStatus = (
	data?: IUpdateApprovalStatus
): Promise<ApiResponse> => {
	return http.put(
		`${endpoints.BUSINESS.UPDATE_BUSINESS_APPROVAL_STATUS}`,
		data
	);
};

/**
 * Get Business
 * @param data
 * @returns
 */
export const getBusiness = (data?: string): Promise<ApiResponse> => {
	return http.get(
		`${endpoints.BUSINESS.GET_BUSINESS.replace(":id", data ?? "")}`
	);
};

/**
 * get signed url
 * @param data
 * @returns
 */
export const getSignedUrl = (data: IPresignedData): Promise<ApiResponse> =>
	http.post(`${endpoints.BUSINESS.GET_PRESIGNED_URL}`, data);

/**
 * Fetch Business Events
 */
export const getBusinessEvents = (
	queryParams?: IGetBusinessEvents
): Promise<ApiResponse> => {
	return http.get(
		`${endpoints.ADMIN.BUSINESS_EVENTS}?userId=${queryParams?.userId}&eventType=${queryParams?.eventType}`
	);
};

/**
 * Update Business Event
 * @param data
 * @returns
 */
export const updateIsTopPlace = (
	data?: IUpdateTopPlace
): Promise<ApiResponse> => {
	return http.put(`${endpoints.BUSINESS.TOP_PLACE_UPDATE}`, data);
};
