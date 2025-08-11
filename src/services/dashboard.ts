import endpoints from "../constants/endpoints";
import ApiResponse from "../resources/entity/IApiResponse";
import * as http from "../utils/http";

/**
 * Get Total Users
 * @query startDate
 * @query endDate
 * @returns
 **/
export const getTotalUsers = (startDate: string, endDate: string) => {
	return http.get(endpoints.DASHBOARD.GET_TOTAL_USERS, { startDate, endDate });
};
/**
 * Get Total Users
 * @query startDate
 * @query endDate
 * @returns
 **/
export const getTotalEvents = (startDate: string, endDate: string) => {
	return http.get(endpoints.DASHBOARD.GET_TOTAL_EVENT, { startDate, endDate });
};

/**
 * Get Total Users
 * @query startDate
 * @query endDate
 * @returns
 **/
export const getTotalBusiness = (startDate: string, endDate: string) => {
	return http.get(endpoints.DASHBOARD.GET_TOTAL_BUSINESS, {
		startDate,
		endDate,
	});
};

/**
 * Get Graph Data
 * @param data
 * @returns
 */
export const fetchGraphData = async ({
	startDate,
	endDate,
	graphType,
}: {
	startDate: string;
	endDate: string;
	graphType: string;
}): Promise<ApiResponse> => {
	const { data } = await http.get(endpoints.DASHBOARD.FETCH_GRAPH_DATA, {
		startDate,
		endDate,
		graphType,
	});
	return data;
};
