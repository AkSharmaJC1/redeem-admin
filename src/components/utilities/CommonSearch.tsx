import React, { InputHTMLAttributes, ChangeEvent } from "react";

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
	placeHolder?: string;
	onChange?: (event: ChangeEvent<HTMLInputElement>) => void; // Add the onChange prop
}

const CommonSearch: React.FC<IProps> = ({
	placeHolder,
	onChange, // Destructure the onChange prop
	...inputProps
}) => {
	return (
		<div className="common-search">
			<div className="form-group mb-0">
				<div className="left-icon-input">
					<input
						type="text"
						className="form-control"
						// placeholder="Search by Name, Email"
						placeholder={placeHolder}
						onChange={onChange} // Add the onChange event
						{...inputProps}
					/>
					<span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="27.528"
							height="28.513"
							viewBox="0 0 27.528 28.513"
						>
							<path
								id="search_3_"
								data-name="search (3)"
								d="M28.093,25.97l-6.786-7.058A11.507,11.507,0,1,0,12.5,23.024a11.389,11.389,0,0,0,6.6-2.083l6.838,7.111a1.5,1.5,0,1,0,2.164-2.082ZM12.5,3a8.509,8.509,0,1,1-8.509,8.509A8.518,8.518,0,0,1,12.5,3Z"
								transform="translate(-0.984)"
							/>
						</svg>
					</span>
				</div>
			</div>
		</div>
	);
};
export default CommonSearch;
