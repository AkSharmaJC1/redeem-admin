import React, { useRef, useState } from "react";

import "./Settings.scss";
import { useTranslation } from "react-i18next";
import placeholderImg from "../../../assets/images/placeholder-img.png";
import CameraIcon from "../../utilities/svgElements/CameraIcon";
import {
	EXTENSION,
	PROFILE_IMAGE_LIMIT,
} from "../../../constants/commonConstant";
import { toastMessageError } from "../../../commonToast/CommonToastMessage";
import imageCompression from "browser-image-compression";
import useAuth from "../../../hooks/useAuth";
import helper from "../../../utils/helper";

const Settings: React.FC = () => {
	const { t: translation } = useTranslation();

	const [previewImage, setPreviewImage] = useState<string>();
	const [imgLoading, setImgLoading] = useState(false);
	const { authData, updateProfilePicture } = useAuth();
	const inputRefForProfile = useRef<HTMLInputElement>(null);

	const handleImageSelection = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		const extension = file ? file.type.split("/")[1].toLowerCase() : "";
		const fileNameWithoutExt = file
			? file.name.split(".").slice(0, -1).join(".")
			: "";
		if (file) {
			if (!EXTENSION.includes(extension)) {
				const allowedExtensions = EXTENSION.join(", ");
				toastMessageError(
					translation("invalid_image_format") + `( ${allowedExtensions}).`
				);
				if (inputRefForProfile.current) {
					inputRefForProfile.current.value = "";
				}
				return;
			}
			// Validate file size
			if (file.size > PROFILE_IMAGE_LIMIT) {
				toastMessageError(translation("invalid_size_format"));
				if (inputRefForProfile.current) {
					inputRefForProfile.current.value = "";
				}
				return;
			}
			// Validate file type
			const options = {
				maxSizeMB: 1,
				maxWidthOrHeight: 720,
				useWebWorker: true,
			};
			const compressedBlob = (await imageCompression(file, options)) as File;
			const imageUrl = URL.createObjectURL(compressedBlob);
			// Set the selected image if validation passes
			setPreviewImage(imageUrl);
			// setImage(file);
			handleUploadImage(fileNameWithoutExt, extension, compressedBlob);
		}
	};

	const handleUploadImage = async (
		fileNameWithoutExt: string,
		fileExt: string,
		compressedBlob: Blob
	) => {
		setImgLoading(true);
		const timeStamp = new Date().getTime();
		const filePath = `profile_images/${fileNameWithoutExt}-${timeStamp}.${fileExt}`;
		try {
			const responseFromS3 = await helper.uploadFileOnS3(
				compressedBlob,
				filePath
			);
			if (responseFromS3) {
				const resetData = {
					image: responseFromS3,
				};
				if (resetData)
					await updateProfilePicture(resetData as { image: string });
			} else {
				toastMessageError(translation("error_in_upload_s3"));
			}
		} catch (error) {
			console.error("ERROR: ", error);
		}
		setImgLoading(false);
	};

	return (
		<div className="add-event-page pt-5 pb-5">
			<div className="container">
				<div className="page-inner">
					<div className="common-parent-box mb-4">
						<div className="heading">
							<h2>{translation("settings")}</h2>
						</div>
					</div>
					<div className="theme-card">
						<div className="card-mid">
							<div className="user-section">
								<div className="user-image">
									<img
										src={
											previewImage
												? previewImage
												: authData?.image
													? authData.image
													: placeholderImg
										}
										alt="user"
									/>
									<div className="edit-image">
										<input
											onChange={(event) => handleImageSelection(event)}
											type="file"
											ref={inputRefForProfile}
										/>
										{imgLoading ? (
											<div className="spinner-border"></div>
										) : (
											<CameraIcon />
										)}
									</div>
								</div>
								<div className="client-info">
									<h2>{authData?.name ?? "-"}</h2>
									<div className="inner-info">
										<h6>{translation("email")}</h6>
										<p>
											<span>:</span> {authData?.email ?? "-"}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default Settings;
