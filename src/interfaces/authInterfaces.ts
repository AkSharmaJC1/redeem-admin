import { ApprovalStatus } from "../constants/commonConstant";

export interface ILogin {
	email: string;
	password: string;
	timezone: string;
	accountType?: string;
}

export interface IChangePassword {
	password: string;
	newPassword: string;
	confirmPassword: string;
}

export interface IPostChangePassword {
	password: string;
	new_password: string;
}

export interface IForgotPassword {
	email: string;
	accountType: string;
}
export interface IVerifyOtp {
	email: string;
	otp: string;
	otpVerificationType: string;
	accountType: string;
}
export interface IResendOtp {
	email: string;
	otpVerificationType: string;
	accountType: string;
}
export interface IResetPassword {
	email: string;
	otp: string;
	password: string;
	otpVerificationType: string;
	accountType: string;
}
export interface IUserData {
	id: string;
	name: string;
	email: string;
	account_type: string;
	image: string | null;
	phone: string | null;
	countryCode: string | null;
	phoneCountryCode: string | null;
	isEmailVerified: number;
	isActive: number;
	verificationCode: {
		otp: string | null;
		otp_created_ts: string | null;
	} | null;
	allowNotification: number;
	status: ApprovalStatus | null;
	timezone: string;
	address: string | null;
	createdAt: string;
	updatedAt: string;
}

export type IAuthContextData = {
	authData?: IUserData;
	loading: boolean;
	appLoading: boolean;
	login(email: string, password: string, account_type: string): Promise<void>;
	signOut(): void;
	errorMessage?: string;
	clearError(): void;
	profilePicture?: string;
	updateProfilePicture(resetData: { image: string }): Promise<void>;
};
