/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from "react";
import {
	Control,
	Controller,
	FieldError,
	FieldErrorsImpl,
	FieldValues,
	Merge,
} from "react-hook-form";
import PhoneInput, { CountryData, PhoneInputProps } from "react-phone-input-2";

interface ICommonPhoneInputProps extends PhoneInputProps {
	control: Control<FieldValues | any>;
	name: string;
	error?: FieldError | Merge<FieldError, FieldErrorsImpl<FieldValues>>;
	disabled?: boolean;
	label?: string;
	onChange?: (value: string, data: CountryData) => void;
	country?: string;
	required?: boolean;
}

const CommonPhoneInput: FC<ICommonPhoneInputProps> = ({
	control,
	name,
	error,
	disabled,
	label,
	// country,
	onChange,
	required,
	...props
}) => {
	return (
		<div className="form-group mb-0">
			<Controller
				name={name}
				control={control}
				render={({ field }) => {
					return (
						<>
							<label>
								{label}
								{required && <sup>*</sup>}
							</label>
							<PhoneInput
								placeholder="Enter phone number"
								value={field.value}
								countryCodeEditable={false}
								disableDropdown
								country={"us"}
								onChange={(value, data) => {
									field.onChange(value);
									if (onChange) {
										onChange(value, data as CountryData);
									}
								}}
								disabled={disabled}
								{...props}
								inputClass="w-100"
							/>
						</>
					);
				}}
			/>
			{error && <p className="auth-msg danger">{error?.message as string}</p>}
		</div>
	);
};

export default CommonPhoneInput;
