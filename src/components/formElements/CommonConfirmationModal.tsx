"use client";
import { FC } from "react";
import Button from "../formElements/Button";

interface IProps {
	onClickCancel: () => void;
	onClickOkay: () => void;
	disabled?: boolean;
	heading: string;
	paragraph: string;
	loading?: boolean;
}

const ConfirmationModal: FC<IProps> = ({
	onClickCancel,
	onClickOkay,
	disabled,
	heading,
	paragraph,
	loading,
}) => {
	return (
		<div className="modal theme-modal show-modal">
			<div className="modal-dialog modal-dialog-centered">
				<div className="modal-content">
					<div className="modal-header justify-content-center">
						<h2 className="text-center">{heading}</h2>
					</div>
					<div className="modal-body">
						<p className="text-white text-center">{paragraph}</p>
						<div className="action-btn justify-content-center">
							<Button
								onClick={onClickOkay}
								className="primary-btn radius-sm btn-sm"
								disabled={disabled}
								loading={loading}
							>
								Yes
							</Button>
							<Button
								onClick={onClickCancel}
								className="white-outline-btn radius-sm btn-sm"
								disabled={disabled}
							>
								No
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default ConfirmationModal;
