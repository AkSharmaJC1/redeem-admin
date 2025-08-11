/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, InputHTMLAttributes, ReactNode } from "react";
import {
	Control,
	FieldError,
	FieldErrorsImpl,
	FieldValues,
	Merge,
} from "react-hook-form";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
	name: string;
	icon?: boolean;
	align?: string;
	disabled?: boolean;
	type: "checkbox";
	parentClassName?: string;
	iconSrc?: string;
	showIconSrc?: string;
	control: Control<any>;
	error?: FieldError | Merge<FieldError, FieldErrorsImpl<FieldValues>>;
	value?: string;
	label?: string | ReactNode;
	labelClass?: string;
	showPasswordIcon?: boolean;
	importantLabel?: boolean;
	handleClick?: () => void;
	checked?: boolean;
}

const CommonInputCheckbox: FC<Props> = ({
	className,
	// type,
	error,
	// control,
	label,
	name,
	disabled,
	labelClass,
	// value,
	// ...props
	handleClick,
	checked,
}) => {
	return (
		<>
			<label htmlFor={name} className="custom-check-box">
				<input
					id={name}
					name={name}
					className={className}
					type="checkbox"
					disabled={disabled}
					onClick={handleClick}
					checked={checked}
				/>
				{label}
				<span className={`checkmark ${labelClass}`}></span>
			</label>
			{error && <p className="auth-msg danger">{error?.message as string}</p>}
		</>
	);
};
export default CommonInputCheckbox;
