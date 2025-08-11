import React, { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import InputWrapper from "../../formElements/InputWrapper";
import Button from "../../formElements/Button";
import logo from "./../../../assets/images/logo.png";
import authVideo from "./../../../assets/images/auth-video.mp4";
import "./UserAuth.scss";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import { otpValidationSchema } from "../../../validationSchema/auth";
import { useForm } from "react-hook-form";
import {
	toastMessageSuccess,
	toastMessageError,
} from "../../../commonToast/CommonToastMessage";
import storage from "../../../utils/storage";
import { IOtp } from "../../../interfaces/commonInterfaces";
import { ROUTES } from "../../../utils/constants";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
	AccountType,
	VERIFICATION_TYPE,
} from "../../../constants/commonConstant";
import { resendOtp, verifyOtp } from "../../../services/auth";

const VerificationCode: React.FC = () => {
	const navigate = useNavigate();
	const lastSentTime = storage.get("otpLastSentTime");

	const [loading, setLoading] = useState(false);
	const [resendLoading, setResendLoading] = useState(false);

	const [counter, setCounter] = useState(60);
	const [linkDisabled, setLinkDisabled] = useState(true);
	const [otp, setOtp] = useState("");
	const { t: translation } = useTranslation();
	const location = useLocation();

	// Parse the query string
	const queryParams = new URLSearchParams(location.search);

	// Get the 'signature' parameter
	const signature = queryParams.get("signature");

	// Decode and parse the signature
	const stateData = signature
		? JSON.parse(decodeURIComponent(signature))
		: null;

	// Access the email
	const {
		handleSubmit,
		setValue,
		setError,
		formState: { errors },
	} = useForm({
		mode: "onChange",
		resolver: yupResolver(otpValidationSchema(translation)),
	});

	useEffect(() => {
		if (stateData?.email) {
			setValue("email", stateData.email);
		} else if (!stateData?.email && !lastSentTime) {
			navigate(ROUTES.LOGIN);
		}
		if (!lastSentTime) {
			navigate(ROUTES.LOGIN);
		}
	}, []);

	useEffect(() => {
		if (lastSentTime) {
			const elapsedTime = Math.floor(
				(Date.now() - parseInt(lastSentTime, 10)) / 1000
			);
			if (elapsedTime < 60) {
				setCounter(60 - elapsedTime);
				setLinkDisabled(true);
			} else {
				setCounter(0);
				setLinkDisabled(false);
			}
		}

		let timer: number | undefined;
		if (counter > 0)
			timer = setInterval(() => setCounter((prev) => prev - 1), 1000);
		else if (counter === 0) {
			setLinkDisabled(false);
		}
		return () => clearInterval(timer);
	}, [counter]);

	const onSubmit = async (data: IOtp) => {
		setLoading(true);

		try {
			const payload = {
				email: data.email,
				otp: data.otp,
				otpVerificationType: VERIFICATION_TYPE.forgotPassword,
				accountType: AccountType.ADMIN,
				timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
			};
			const response = await verifyOtp(payload);
			if (response?.success) {
				toastMessageSuccess(
					translation(response?.message, {
						[response?.message]: response?.message,
					})
				);
				const signature = encodeURIComponent(JSON.stringify(data));
				const query = `?signature=${signature}`;
				const href = `${ROUTES.RESET_PASSWORD}${query}`;
				storage.remove("otpLastSentTime");
				navigate(href);
			} else {
				toastMessageError(
					translation(response?.message, {
						[response?.message]: response?.message,
					})
				);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleResendOtp = async () => {
		setCounter(60);
		setLinkDisabled(true);
		setOtp("");
		setValue("otp", "");
		storage.set("otpLastSentTime", Date.now().toString());
		const data = {
			email: stateData?.email,
			otpVerificationType: VERIFICATION_TYPE.forgotPassword,
			accountType: AccountType.ADMIN,
		};
		try {
			setResendLoading(true);
			const response = await resendOtp(data);

			if (response?.success) {
				toastMessageSuccess(translation("resent_otp"));
			} else {
				if (response?.message === "Link expired") {
					navigate(ROUTES.LOGIN);
					toastMessageError(
						translation(response?.message, {
							[response?.message]: response?.message,
						})
					);
					return;
				}
				toastMessageError(
					translation(response?.message, {
						[response?.message]: response?.message,
					})
				);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setResendLoading(false);
		}
	};

	const handleChange = (changedOtp: string) => {
		setOtp(changedOtp);
		setValue("otp", changedOtp);
		setError("otp", {});
	};

	return (
		<div className="userauth-main">
			<div className="container-fluid">
				<div className="row">
					<div className="col-md-6 col-lg-6 col-xl-6 col-xxl-7">
						<div className="auth-video-card">
							<div className="card-video">
								<video width="320" height="240" loop autoPlay muted>
									<source src={authVideo} type="video/mp4" />
								</video>
								<div className="card-content">
									<h2>{translation("verification_banner_heading")}</h2>
									<p>{translation("verification_banner_brief")}</p>
								</div>
							</div>
						</div>
					</div>
					<div className="col-md-6 col-lg-6 col-xl-6 col-xxl-5">
						<div className="userauth-form">
							<div className="auth-logo">
								<img src={logo} alt="logo" />
							</div>
							<div className="form-box">
								<div className="heading">
									<h2>{translation("account_verification")}</h2>
									<p>{translation("account_verification_brief")}</p>
								</div>
								<div className="form-section">
									<form
										onSubmit={handleSubmit((data) => {
											onSubmit(data as IOtp);
										})}
									>
										<InputWrapper className="text-center">
											<InputWrapper.Label required htmlFor="otp">
												{translation("verification_code")}
											</InputWrapper.Label>
											<div className="otp-inputs">
												<OtpInput
													value={otp}
													onChange={handleChange}
													numInputs={4}
													renderInput={(props) => <input {...props} />}
												/>
											</div>
											<InputWrapper.Error message={errors.otp?.message || ""} />
										</InputWrapper>
										<div className="action-btn">
											<Button
												type="submit"
												loading={loading}
												disabled={loading || resendLoading}
												className="primary-btn radius-sm w-100"
											>
												{translation("verify")}
											</Button>
											{!linkDisabled ? (
												<Button
													type="button"
													onClick={handleResendOtp}
													loading={resendLoading}
													disabled={loading || resendLoading}
													className="primary-btn radius-sm w-100"
												>
													{translation("resend_code")}
												</Button>
											) : (
												<div className="resend-code-btn">
													<p>
														{translation("didnt_receive_code")}{" "}
														<span>
															{translation("resend_in")}{" "}
															{counter < 10
																? `00:0${counter}`
																: `00:${counter}`}
														</span>
													</p>
												</div>
											)}

											<div className="back-to-login">
												<Link
													to={ROUTES.LOGIN}
													style={{ textDecoration: "none" }}
												>
													{translation("back_to_login")}
												</Link>
											</div>
										</div>
									</form>
								</div>
							</div>
							<div className="form-bottom">
								<div className="account-route">
									<p>{translation("rights_reserved")}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default VerificationCode;
