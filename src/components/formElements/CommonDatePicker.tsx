/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef } from "react";
import DatePicker from "react-date-picker";
import { Control, Controller, FieldError } from "react-hook-form";

import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";

interface CustomDatePickerProps {
	className?: string;
	onClick?: () => void;
	label?: string;
	control: Control<any>;
	name: string;
	errors?: FieldError | FieldError[];
	importantLabel: boolean;
	minDate?: Date;
	maxDate?: Date;
	disabled?: boolean;
}

const CustomDatePickerWrapper = forwardRef<
	HTMLDivElement,
	CustomDatePickerProps
>(
	(
		{
			className = "",
			importantLabel = false,
			label = "",
			control,
			name,
			minDate,
			maxDate,
			disabled,
			errors = [],
		},
		ref
	) => {
		return (
			<div
				ref={ref} // Attach the forwarded ref here
				className={`form-group custom-datepicker ${className} ${
					errors && !Array.isArray(errors) && errors.message
						? "error-border"
						: ""
				}`}
			>
				<label>
					{label}
					{importantLabel && <sup>*</sup>}
				</label>
				<Controller
					control={control}
					name={name}
					render={({ field }) => (
						<DatePicker
							onChange={(date) => field.onChange(date)}
							value={field.value} // Access value from field object
							minDate={minDate ? minDate : undefined}
							maxDate={maxDate ? maxDate : undefined}
							dayPlaceholder="DD"
							monthPlaceholder="MM"
							yearPlaceholder="YYYY"
							format="MM/dd/yy"
							disabled={disabled ?? false}
							className={field.value ? "success-border" : ""}
						/>
					)}
				/>
				{errors && !Array.isArray(errors) && (
					<p className="auth-msg-error">{errors?.message}</p>
				)}
			</div>
		);
	}
);

export default CustomDatePickerWrapper;
