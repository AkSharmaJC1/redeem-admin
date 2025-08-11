import {
	IForgotPassword,
	ILogin,
	IResendOtp,
	IResetPassword,
	IVerifyOtp,
} from "../interfaces/authInterfaces";
import endpoints from "../constants/endpoints";

import ApiResponse from "../resources/entity/IApiResponse";
import { post, put } from "../utils/http";

/**
 * SignIn
 * @param data
 * @returns
 */
export const signInService = async (
	loginData: ILogin
): Promise<ApiResponse> => {
	const { data } = await post(endpoints.Auth.LOGIN, loginData);
	return data;
};

export const forgotPassword = async (
	forgotPassword: IForgotPassword
): Promise<ApiResponse> => {
	const { data } = await post(endpoints.Auth.FORGET_PASSWORD, forgotPassword);
	return data;
};

export const verifyOtp = async (
	verifyOtp: IVerifyOtp
): Promise<ApiResponse> => {
	const { data } = await post(endpoints.Auth.VERIFY_OTP, verifyOtp);
	return data;
};

export const resetPassword = async (
	resetData: IResetPassword
): Promise<ApiResponse> => {
	const { data } = await put(endpoints.Auth.RESET_PASSWORD, resetData);
	return data;
};

export const resendOtp = async (
	resendOtp: IResendOtp
): Promise<ApiResponse> => {
	const { data } = await post(endpoints.Auth.RESEND_OTP, resendOtp);
	return data;
};
