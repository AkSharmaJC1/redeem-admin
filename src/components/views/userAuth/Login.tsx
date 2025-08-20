import CryptoJS from "crypto-js";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import InputWrapper from "../../formElements/InputWrapper";
import Textbox from "../../formElements/Textbox";
import CheckBox from "../../formElements/CheckBox";
import Button from "../../formElements/Button";
import EyeIcon from "../../../assets/images/eye-icon.svg";

import EyeCloseIcon from "../../../assets/images/eye-close-icon.svg";
import logo from "./../../../assets/images/logo.png";
import { yupResolver } from "@hookform/resolvers/yup";
import "./UserAuth.scss";
import { useTranslation } from "react-i18next";

import useAuth from "../../../hooks/useAuth";
import { loginSchema } from "../../../validationSchema/auth";
import storage from "../../../utils/storage";
import { AccountType, CONST_DATA } from "../../../constants/commonConstant";
import config from "../../../config/config";
import { toastMessageError } from "../../../commonToast/CommonToastMessage";
import { ROUTES } from "../../../utils/constants";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
// import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import SliderOne from "../../../assets/images/auth-banner-one.webp";

const Login: React.FC = () => {
	const { t: translation } = useTranslation();
	const navigate = useNavigate();
	const { login, loading, errorMessage, clearError } = useAuth();
	const [isShowPassword, setIsShowPassword] = useState(true);
	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(loginSchema(translation)),
	});

	useEffect(() => {
		try {
			clearError();
			const rememberMeData = storage?.get(CONST_DATA.rememberMe);
			if (rememberMeData !== null) {
				const bytes = CryptoJS.AES.decrypt(
					rememberMeData,
					config.RememberMeKey!
				);
				const decryptRememberMe = bytes.toString(CryptoJS.enc.Utf8);
				// Check if the decrypted string is not empty and is valid JSON
				if (decryptRememberMe) {
					try {
						const parsedData = JSON.parse(decryptRememberMe);
						reset({
							email: parsedData.email,
							password: parsedData.password,
							rememberMe: true,
						});
					} catch (parseError) {
						console.error(
							"Error parsing decrypted rememberMe data",
							parseError
						);
					}
				}
			}
		} catch (e) {
			console.error("e>>>>>>>>>", e);
		}
	}, []);

	// Admin login
	const onSubmit = async (data: {
		email: string;
		password: string;
		rememberMe: boolean;
	}) => {
		try {
			await login(data.email, data.password, AccountType.ADMIN);
			if (data.rememberMe && !errorMessage) {
				const encryptedRememberData = CryptoJS.AES.encrypt(
					JSON.stringify({
						email: data.email,
						password: data.password,
					}),
					config.RememberMeKey!
				).toString();
				storage?.set(CONST_DATA.rememberMe, encryptedRememberData);
				navigate(ROUTES.DASHBOARD);
			} else {
				storage?.remove(CONST_DATA.rememberMe);
			}
		} catch (e) {
			console.error("error>>>>>>>>>>>>>>>>>..", e);
		}
	};

	useEffect(() => {
		if (errorMessage) {
			toastMessageError(errorMessage);
		}
	}, [errorMessage]);
	return (
		<div className="userauth-main">
			<div className="container-fluid">
				<div className="row g-4">
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
									<h2>{translation("welcome")}</h2>
									<p>
										{translation("enter_your_email_and_password_to_access")}
									</p>
								</div>
								<div className="form-section">
									<form onSubmit={handleSubmit((data) => onSubmit(data))}>
										<InputWrapper>
											<InputWrapper.Label required htmlFor="email">
												{translation("email")}
											</InputWrapper.Label>
											<Textbox
												name="email"
												type="email"
												control={control}
												className="form-control"
												placeholder={translation("enter_your_email")}
											></Textbox>
											<InputWrapper.Error
												message={errors?.email?.message || ""}
											/>
										</InputWrapper>
										<InputWrapper>
											<InputWrapper.Label required htmlFor="email">
												{translation("password")}
											</InputWrapper.Label>
											<Textbox
												name="password"
												type={isShowPassword ? "password" : "text"}
												control={control}
												className="form-control"
												placeholder={translation("enter_password")}
												align="right"
											>
												<InputWrapper.Icon
													src={isShowPassword ? EyeCloseIcon : EyeIcon}
													onClick={() => setIsShowPassword(!isShowPassword)}
												/>
											</Textbox>
											<InputWrapper.Error
												message={errors?.password?.message || ""}
											/>
										</InputWrapper>

										<div className="form-checkbox-align">
											<InputWrapper.Label
												htmlFor="rememberMe"
												className="custom-checkbox"
											>
												{translation("remember_me")}
												<CheckBox name="rememberMe" control={control}>
													<span className="checkmark"></span>
												</CheckBox>
											</InputWrapper.Label>
											<Link
												to={ROUTES.FORGOT_PASSWORD}
												className="forgot-password-link"
											>
												{translation("forgot_password")}?
											</Link>
										</div>

										<div className="action-btn">
											<Button
												type="submit"
												disabled={loading}
												loading={loading}
												className="primary-btn radius-sm w-100"
											>
												{translation("sign_in")}
											</Button>
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
export default Login;
