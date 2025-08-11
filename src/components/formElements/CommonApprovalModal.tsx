import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "./Button";
import InputWrapper from "./InputWrapper";
import { approvalRejectSchema } from "../../validationSchema/business";
import { useTranslation } from "react-i18next";

interface IProps {
	onClose: () => void;
	onApprove: () => void;
	onReject: (reason: string) => void;
	disabled?: boolean;
	heading: string;
	paragraph: string;
	loading?: boolean;
}

interface IRejectForm {
	reason: string;
}

const CommonApprovalModal: FC<IProps> = ({
	onClose,
	onApprove,
	onReject,
	disabled,
	heading,
	paragraph,
	loading,
}) => {
	const { t: translation } = useTranslation();
	const [showRejectForm, setShowRejectForm] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<IRejectForm>({
		resolver: yupResolver(approvalRejectSchema(translation)),
	});

	const onSubmitReject = (data: IRejectForm) => {
		onReject(data.reason);
	};

	return (
		<div className="modal theme-modal show-modal">
			<div className="modal-dialog modal-dialog-centered">
				<div className="modal-content">
					<div className="modal-header">
						<button
							type="button"
							className="btn-close text-white"
							onClick={onClose}
							aria-label="Close"
							style={{ position: "absolute", right: "15px" }}
						>
							✖
						</button>
						<h2 className="w-100 text-center mb-0">{heading}</h2>
					</div>
					<div className="modal-body">
						<p className="text-white text-center">{paragraph}</p>
						{showRejectForm ? (
							<form onSubmit={handleSubmit(onSubmitReject)}>
								<InputWrapper>
									<InputWrapper.Label required>Reason</InputWrapper.Label>
									<textarea
										{...register("reason")}
										className="form-control"
										rows={3}
										placeholder="Enter reason for rejection"
									/>
									<InputWrapper.Error message={errors?.reason?.message || ""} />
								</InputWrapper>
								<div className="action-btn justify-content-center mt-4">
									<Button
										type="submit"
										className="primary-btn radius-sm btn-sm"
										disabled={disabled}
										loading={loading}
									>
										Submit
									</Button>
									<Button
										type="button"
										onClick={() => setShowRejectForm(false)}
										className="white-outline-btn radius-sm btn-sm"
										disabled={disabled}
									>
										Cancel
									</Button>
								</div>
							</form>
						) : (
							<div className="action-btn justify-content-center">
								<Button
									onClick={onApprove}
									className="primary-btn radius-sm btn-sm"
									disabled={disabled}
									loading={loading}
								>
									Approve
								</Button>
								<Button
									onClick={() => setShowRejectForm(true)}
									className="white-outline-btn radius-sm btn-sm"
									disabled={disabled}
								>
									Reject
								</Button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default CommonApprovalModal;
