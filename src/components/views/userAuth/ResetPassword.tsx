import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import InputWrapper from "../../formElements/InputWrapper";
import Textbox from "../../formElements/Textbox";
import Button from "../../formElements/Button";
import logo from "./../../../assets/images/logo.png";

import "./UserAuth.scss";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPasswordValidationSchema } from "../../../validationSchema/auth";
import {
	toastMessageError,
	toastMessageSuccess,
} from "../../../commonToast/CommonToastMessage";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
	AccountType,
	VERIFICATION_TYPE,
} from "../../../constants/commonConstant";
import storage from "../../../utils/storage";
import { resetPassword } from "../../../services/auth";
import EyeIcon from "../../../assets/images/eye-icon.svg";

import EyeCloseIcon from "../../../assets/images/eye-close-icon.svg";
import { ROUTES } from "../../../utils/constants";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
// import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import SliderOne from "../../../assets/images/auth-banner-one.webp";

const ResetPassword: React.FC = () => {
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const { t: translation } = useTranslation();
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		// mode: "onChange",
		resolver: yupResolver(resetPasswordValidationSchema(translation)),
	});
	const location = useLocation();

	// Parse the query string
	const queryParams = new URLSearchParams(location.search);

	// Get the 'signature' parameter
	const signature = queryParams.get("signature");

	// Decode and parse the signature
	const stateData = signature
		? JSON.parse(decodeURIComponent(signature))
		: null;

	useEffect(() => {
		if (!stateData && !stateData?.email) {
			navigate(ROUTES.LOGIN);
		}
	}, []);

	const onSubmit = async (data: {
		newPassword: string;
		confirmPassword: string;
	}) => {
		try {
			setLoading(true);
			const payload = {
				email: stateData.email,
				password: data.newPassword,
				otp: stateData.otp,
				otpVerificationType: VERIFICATION_TYPE.forgotPassword,
				accountType: AccountType.ADMIN,
			};
			const response = await resetPassword(payload);
			if (response?.success) {
				toastMessageSuccess(
					translation(response?.message, {
						[response?.message]: response?.message,
					})
				);
				storage.remove("otpLastSentTime");
				navigate(ROUTES.LOGIN);
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
	return (
		<div className="userauth-main">
			<div className="container-fluid">
				<div className="row">
					<div className="col-md-6 col-lg-6 col-xl-6 col-xxl-7">
						{/* <div className="auth-video-card">
							<div className="card-video">
								<video width="320" height="240" loop autoPlay muted>
									<source src={authVideo} type="video/mp4" />
								</video>
								<div className="card-content">
									<h2>{translation("login_banner_heading")}</h2>
									<p>{translation("login_banner_brief")}</p>
								</div>
							</div>
						</div> */}
						<div className="userauth_banner_group">
							<div className="banner_inner">
								<Swiper
									// modules={[Pagination, Autoplay]}
									spaceBetween={50}
									slidesPerView={1}
									// pagination={{ clickable: true }}
									// loop={true}
									// autoplay={{
									// 	delay: 2500,
									// 	disableOnInteraction: false,
									// }}
								>
									<SwiperSlide>
										<div className="banner_inner">
											<img
												src={SliderOne}
												alt="authBg"
												height={320}
												width={640}
											/>
											<div className="banner_content">
												<h1>
													Create & Discover{" "}
													<span>UNFORGETTABLE Experiences!</span>
												</h1>
												<p>
													Sign up to host events, buy tickets, and support
													communities. Whether you&apos;re an event organizer or
													an attendee, make an impact with every event you join.
												</p>
											</div>
										</div>
									</SwiperSlide>
									{/* <SwiperSlide>
										<img src={SliderOne} alt="authBg" height={320} width={640} />
										<div className="banner_content">
											<h1>
												Create & Discover <span>UNFORGETTABLE Experiences!</span>
											</h1>
											<p>
												Explore diverse categories and prioritize your favorite
												inspirations, all in one place with Redeemed Events.
											</p>
										</div>
									</SwiperSlide>{" "}
									<SwiperSlide>
										<img src={SliderOne} alt="authBg" height={320} width={640} />
										<div className="banner_content">
											<h1>
												Create & Discover <span>UNFORGETTABLE Experiences!</span>
											</h1>
											<p>
												Save your favourites into your ever accessible collection. So
												you can enjoy them at any time you like.
											</p>
										</div>
									</SwiperSlide> */}
								</Swiper>
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
									<h2>{translation("password_reset")}</h2>
									<p>{translation("password_reset_brief")}</p>
								</div>
								<div className="form-section">
									<form onSubmit={handleSubmit(onSubmit)}>
										<InputWrapper>
											<InputWrapper.Label required htmlFor="email">
												{translation("password")}
											</InputWrapper.Label>
											<Textbox
												name="newPassword"
												type={showPassword ? "text" : "password"}
												control={control}
												className="form-control"
												placeholder={translation("enter_password")}
												align="right"
											>
												<InputWrapper.Icon
													src={showPassword ? EyeIcon : EyeCloseIcon}
													onClick={() => setShowPassword(!showPassword)}
												/>
											</Textbox>
											<InputWrapper.Error
												message={errors?.newPassword?.message || ""}
											/>
										</InputWrapper>
										<InputWrapper>
											<InputWrapper.Label required htmlFor="email">
												{translation("confirm_password")}
											</InputWrapper.Label>
											<Textbox
												name="confirmPassword"
												type="password"
												control={control}
												className="form-control"
												placeholder={translation("reenter_password")}
											></Textbox>
											<InputWrapper.Error
												message={errors?.confirmPassword?.message || ""}
											/>
										</InputWrapper>

										<div className="action-btn">
											<Button
												type="submit"
												disabled={loading}
												loading={loading}
												className="primary-btn radius-sm w-100"
											>
												{translation("reset_password")}
											</Button>
										</div>
										<div className="back-to-login">
											<Link
												to={ROUTES.LOGIN}
												style={{ textDecoration: "none" }}
											>
												{translation("back_to_login")}
											</Link>
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

export default ResetPassword;
