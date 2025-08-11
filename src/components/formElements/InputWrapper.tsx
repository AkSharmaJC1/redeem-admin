import React, { ReactNode } from "react";

/**
 * Wrapper component for input fields
 * @param {string} className - Class name for the input field
 * @returns {React.ReactElement} - Wrapper component
 */
const InputWrapper = ({
	className,
	children,
}: {
	className?: string;
	children: ReactNode;
}): React.ReactElement => (
	<div className={`form-group ${className ?? ""}`}>{children}</div>
);

/**
 * Label component for input fields
 * @param {string} children - Label text
 * @returns {JSX.Element} - Label component
 */
InputWrapper.Label = function ({
	children,
	htmlFor,
	required,
	className,
}: {
	children: ReactNode;
	htmlFor?: string;
	required?: boolean;
	className?: string;
}): React.ReactElement {
	return (
		<label htmlFor={htmlFor} className={className}>
			{children}
			{required ? <sup>*</sup> : null}
		</label>
	);
};

/**
 * Error component for input fields to display error message
 * @param { string } message - Error message
 * @returns {React.ReactElement} - Error component
 */
InputWrapper.Error = function ({
	message,
}: {
	message: string;
}): React.ReactElement | null {
	return message ? <p className="auth-msg-error">{message}</p> : null;
};

/**
 * Icon component for input fields
 * @param { string } src - Icon source
 * @param { function } onClick - Function to be called on click
 * @returns {React.ReactElement} - Icon component
 */
InputWrapper.Icon = function ({
	src,
	onClick,
}: {
	src: string;
	onClick?: () => void;
}): React.ReactElement {
	return (
		<button className="show-icon" type="button" onClick={onClick}>
			<img src={src} alt="icon" />
		</button>
	);
};

export default InputWrapper;
