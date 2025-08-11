/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import TimePicker from "react-time-picker";
import { Controller, Control } from "react-hook-form";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

interface CommonTimePickerProps {
	name: string;
	control: Control<any>;
	label?: string;
	required?: boolean;
	defaultValue?: string;
	disableClock?: boolean;
	className?: string;
}

const CommonTimePicker: React.FC<CommonTimePickerProps> = ({
	name,
	control,
	defaultValue = "00:00",
	disableClock = true,
}) => {
	return (
		<Controller
			name={name}
			control={control}
			defaultValue={defaultValue}
			render={({ field }) => (
				<TimePicker
					{...field}
					onChange={(value) => field.onChange(value)}
					value={field.value}
					disableClock={disableClock}
				/>
			)}
		/>
	);
};

export default CommonTimePicker;
