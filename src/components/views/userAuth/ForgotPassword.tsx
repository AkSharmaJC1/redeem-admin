import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import InputWrapper from "../../formElements/InputWrapper";
import Textbox from "../../formElements/Textbox";
import Button from "../../formElements/Button";

import logo from "./../../../assets/images/logo.png";

import "./UserAuth.scss";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgotPasswordValidationSchema } from "../../../validationSchema/auth";
import { forgotPassword } from "../../../services/auth";
import {
	toastMessageError,
	toastMessageSuccess,
} from "../../../commonToast/CommonToastMessage";
import { ROUTES } from "../../../utils/constants";
import storage from "../../../utils/storage";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
// import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import SliderOne from "../../../assets/images/auth-banner-one.webp";
import { AccountType } from "../../../constants/commonConstant";

const ForgotPassword: React.FC = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const { t: translation } = useTranslation();

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(forgotPasswordValidationSchema(translation)),
	});

	const onSubmit = async (data: { email: string }) => {
		try {
			setLoading(true);
			const payload = {
				email: data?.email?.toLowerCase(),
				accountType: AccountType.ADMIN,
			};
			const response = await forgotPassword(payload);
			if (response?.success) {
				storage.set("otpLastSentTime", Date.now().toString());
				toastMessageSuccess(translation(response.message));

				const query = `?signature=${encodeURIComponent(
					JSON.stringify({ email: data?.email?.toLowerCase() })
				)}`;
				navigate(`${ROUTES.VERIFICATION_CODE}${query}`);
			} else {
				toastMessageError(translation(response.message));
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
									<h2>{translation("forgot_password_banner_heading")}</h2>
									<p>{translation("forgot_password_banner_brief")}</p>
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
									<h2>{translation("forgot_password")}</h2>
									<p>{translation("password_brief")}</p>
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
												placeholder={translation("enter_your_email_address")}
											></Textbox>
											<InputWrapper.Error
												message={errors?.email?.message || ""}
											/>
										</InputWrapper>

										<div className="action-btn">
											<Button
												type="submit"
												loading={loading}
												disabled={loading}
												className="primary-btn radius-sm w-100"
											>
												{translation("continue")}
											</Button>
											<div className="remember-password">
												<p>
													{translation("remember_your_password")}?{" "}
													<Link to={ROUTES.LOGIN}>
														{translation("sign_in")}
													</Link>
												</p>
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
export default ForgotPassword;
