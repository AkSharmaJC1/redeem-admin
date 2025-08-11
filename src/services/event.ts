import ApiResponse from "../resources/entity/IApiResponse";
import endpoints from "../constants/endpoints";

import * as http from "../utils/http";
import { FeaturedUpdate } from "../interfaces/eventInterfaces";
import { ICommonDataForApi } from "../interfaces/commonInterfaces";

export const getCategories = (): Promise<ApiResponse> => {
	return http.get(endpoints.EVENT.CATEGORIES);
};

/**
 * Get Business List
 * @param data
 * @returns
 */

export const getEventList = ({
	offset,
	limit,
	search_text,
	id,
}: ICommonDataForApi): Promise<ApiResponse> => {
	// Create the base URL
	let url = `${endpoints.EVENT.GET_EVENT}?offset=${offset}&limit=${limit}`;

	// Add search_text parameter if it exists
	if (search_text) {
		url += `&searchQuery=${search_text.trim()}`;
	}

	// Add id parameter if it exists
	if (id) {
		url += `&id=${id}`;
	}

	// Make the HTTP GET request with the constructed URL
	return http.get(url);
};

/**
 * Update Business
 * @param data
 * @returns
 */
export const updateFeaturedEvent = (data?: FeaturedUpdate) => {
	return http.put(endpoints.EVENT.FEATURED_EVENT_UPDATE, data);
};

export const getHomeEventList = ({
	offset,
	limit,
	search_text,
	eventType,
	id,
}: ICommonDataForApi): Promise<ApiResponse> => {
	// Create the base URL
	let url = `${endpoints.EVENT.GET_EVENT_FOR_HOME}?offset=${offset}&limit=${limit}&eventType=${eventType}`;

	// Add search_text parameter if it exists
	if (search_text) {
		url += `&searchQuery=${search_text.trim()}`;
	}

	// Add id parameter if it exists
	if (id) {
		url += `&id=${id}`;
	}

	// Make the HTTP GET request with the constructed URL
	return http.get(url);
};

export const getEventDetail = (id: number): Promise<ApiResponse> => {
	return http.get(endpoints.EVENT.GET_EVENT_DETAIL, { id });
};

/**
 * Get Total Revenue For Events
 * @query data
 * @returns
 */
export const getTotalRevenueOfEvents = (id: number): Promise<ApiResponse> => {
	return http.get(endpoints.EVENT.TOTAL_REVENUE_OF_EVENTS, { id });
};

/**
 * Get Total Revenue For Businesses
 * @query data
 * @returns
 */
export const getTotalRevenueOfBusinesses = ({
	startDate,
	endDate,
	businessId,
}: {
	startDate: string;
	endDate: string;
	businessId: number;
}): Promise<ApiResponse> => {
	return http.get(endpoints.EVENT.TOTAL_REVENUE_OF_BUSINESS, {
		startDate,
		endDate,
		businessId,
	});
};

// export const getBookingStatus = (query?: string): Promise<ApiResponse> => {
// 	return http.get(
// 		`${endpoints.EVENT.BOOKING_INITIALIZE.replace(":id", query ?? "")}`
// 	);
// };

/**
 * Send event details to the user's email
 * @param userId The ID of the user who requested the event details
 * @returns A promise that resolves to the API response
 */
// export const sendEventDetailsEmailByUserId = (eventId: number) => {
// 	return http.post(endpoints.EVENT.SEND_EVENT_DETAILS_BY_EMAIL, {
// 		eventId,
// 	});
// };
