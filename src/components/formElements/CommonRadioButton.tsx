/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, memo } from "react";

import {
	Controller,
	FieldValues,
	Control,
	FieldError,
	FieldErrorsImpl,
	Merge,
} from "react-hook-form";

interface Iprops {
	name: string;
	control: Control<any>;
	disabled?: boolean;
	className?: string;
	error?: FieldError | Merge<FieldError, FieldErrorsImpl<FieldValues>>;
	label?: string;
	required?: boolean;
	buttons: {
		label: string;
		value?: boolean | string | number;
		disabled?: boolean;
	}[];
}

const CommonRadioButton: FC<Iprops> = (props) => {
	const {
		className,
		error,
		control,
		//label,
		name,
		disabled,
		buttons,
		//required,
	} = props;

	return (
		<>
			{/* <label className="custom-radio">
        {label}
        {required ? <sup>*</sup> : null}
      </label> */}
			<div className="d-flex gap-4">
				{buttons.map((item) => (
					<>
						<label
							className={disabled ? "custom-radio opacity-50" : "custom-radio"}
						>
							<p>{item.label}</p>
							<Controller
								key={item.label}
								render={({ field }) => (
									<>
										<input
											type="radio"
											id={item.label}
											disabled={item.disabled}
											className={className}
											checked={field.value === item.value}
											value={field.value as string}
											onChange={() => !disabled && field.onChange(item.value)}
											name={name}
										/>
										{/* <label
                    htmlFor={item.label}
                    className={
                      field.value === item.value
                        ? "form-check-label d-flex active mb-0 "
                        : "form-check-label d-flex mb-0"
                    }
                  >
                    <h5 className="me-2 p-2">{item.label}</h5>
                  </label> */}
										<span className="checkmark" />
									</>
								)}
								control={control}
								name={name}
							/>
						</label>
					</>
				))}
			</div>

			<p className="auth-msg-error">
				{error && error.message ? <>{error?.message}</> : null}
			</p>
		</>
	);
};

export default memo(CommonRadioButton);
