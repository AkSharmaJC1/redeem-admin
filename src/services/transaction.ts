import { ICommonDataForApi } from "../interfaces/commonInterfaces";
import endpoints from "../constants/endpoints";
import ApiResponse from "../resources/entity/IApiResponse";
import * as http from "../utils/http";

/**
 * Get Transaction List
 * @param data
 * @returns
 */
export const getTransactionList = ({
	offset,
	limit,
	search_text,
}: ICommonDataForApi): Promise<ApiResponse> => {
	return http.get(endpoints.TRANSACTION.TRANSACTIONS_LIST, {
		offset,
		limit,
		search_text,
	});
};
