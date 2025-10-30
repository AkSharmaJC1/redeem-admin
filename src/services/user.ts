import ApiResponse from "../resources/entity/IApiResponse";
import endpoints from "../constants/endpoints";
import { ICommonDataForApi } from "../interfaces/commonInterfaces";

import * as http from "../utils/http";
import {
	IMyBookingDataForApi,
	IUpdateUserStatus,
} from "../interfaces/userInterfaces";

/**
 * Get User List
 * @param data
 * @returns
 */
export const getUserList = ({
	offset,
	limit,
	search_text,
}: ICommonDataForApi): Promise<ApiResponse> => {
	return http.get(
		`${endpoints.ADMIN.GET_USER_LIST}?offset=${offset}&limit=${limit}${
			search_text
				? `&search_text=${encodeURIComponent(search_text.trim())}`
				: ""
		}`
	);
};

/**
 * Change User Status
 * @param data
 * @returns
 */
export const updateUserStatus = (
	data: IUpdateUserStatus
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<ApiResponse | any> => {
	return http.put(endpoints.ADMIN.CHANGE_USER_STATUS, data);
};

export const generatePassword = (
	data: IUpdateUserStatus
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<ApiResponse | any> => {
	return http.post("/admin/generate-password", data);
};

/**
 * Get User List
 * @param data
 * @returns
 */
export const getUserDetailsById = (userId: number): Promise<ApiResponse> => {
	return http.get(endpoints.ADMIN.GET_USER_DETAIL, { userId });
};

/**
 * edit profile image
 * @param data
 * @returns
 */
export const editProfileImage = (data: {
	imagePath: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
}): Promise<ApiResponse | any> => {
	return http.put(endpoints.USER.EDIT_PROFILE_IMAGE, data);
};

/**
 * Get User Bookings data
 * @param param0 offset limit userId timeZone pastBookings
 * @returns
 */
export const getUserBookingsData = ({
	offset,
	limit,
	userId,
	pastBookings,
}: IMyBookingDataForApi): Promise<ApiResponse> => {
	return http.get(
		`${endpoints.EVENT.MY_BOOKINGS}?offset=${offset}&limit=${limit}&userId=${userId}&pastBookings=${pastBookings}`
	);
};

export const logoutUser = async () => {
	return http.remove(endpoints.USER.LOGOUT_USER);
};
