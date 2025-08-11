import * as yup from "yup";
import {
	EMAIL_ADDRESS_VALIDATION,
	regexSchemaConstants,
} from "../constants/commonConstant";

export const loginSchema = (translation: (key: string) => string) =>
	yup.object().shape({
		email: yup
			.string()
			.trim()
			.email(translation("email_req"))
			.required(translation("email_req"))
			.matches(EMAIL_ADDRESS_VALIDATION, translation("valid_email_req")),
		password: yup.string().required(translation("password_req")),
		rememberMe: yup.boolean().default(false),
	});

export const changePasswordSchema = () =>
	yup.object().shape({
		password: yup.string().trim().required("Password is required"),
		// .matches(
		// 	regexSchemaConstants.passwordRegex,
		// 	"Password must be between 8 and 16 characters long and include at least 1 uppercase letter, 1 lowercase letter, 1 numeric digit, and 1 special character"
		// ),
		newPassword: yup
			.string()
			.trim()
			.required("New password is required")
			.matches(
				regexSchemaConstants.passwordRegex,
				"New password must be between 8 and 16 characters long and include at least 1 uppercase letter, 1 lowercase letter, 1 numeric digit, and 1 special character"
			),
		confirmPassword: yup
			.string()
			.trim()
			.oneOf(
				[yup.ref("newPassword")],
				"The confirmed password does not match the new password"
			)
			.required("Confirm password is required"),
	});

export const forgotPasswordValidationSchema = (
	translation: (key: string) => string
) =>
	yup.object().shape({
		email: yup
			.string()
			.trim()
			.email(translation("email_req"))
			.required(translation("email_req"))
			.matches(EMAIL_ADDRESS_VALIDATION, translation("valid_email_req")),
	});

export const otpValidationSchema = (translation: (key: string) => string) =>
	yup.object().shape({
		otp: yup
			.string()
			.test("less-than-four", translation("otp_valid"), (value) => {
				if (value) {
					return !isNaN(+value) && value.length >= 4;
				} else {
					return false;
				}
			})
			.required(translation("otp_req")),
		email: yup
			.string()
			.matches(EMAIL_ADDRESS_VALIDATION, translation("valid_email_req"))
			.email(translation("valid_email_req"))
			.trim()
			.required(translation("email_req")),
	});

export const resetPasswordValidationSchema = (
	translation: (key: string) => string
) =>
	yup.object().shape({
		newPassword: yup
			.string()
			.trim()
			.required(translation("password_req"))
			.matches(
				regexSchemaConstants.passwordRegex,
				translation("password_complexity_req")
			),
		confirmPassword: yup
			.string()
			.required(translation("confirm_password_req"))
			.oneOf([yup.ref("newPassword")], translation("pass_not_matched")),
	});
