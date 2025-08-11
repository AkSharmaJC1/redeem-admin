import React, { HTMLAttributes } from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";

interface CheckBoxProps<T extends FieldValues>
	extends Omit<HTMLAttributes<HTMLInputElement>, "value"> {
	name: Path<T>;
	control: Control<T>;
	children?: React.ReactNode;
	value: number | string; // Ensure value is number or string
}

export default function CustomCheckBox<T extends FieldValues>({
	name,
	control,
	children,
	value,
	...props
}: CheckBoxProps<T>) {
	return (
		<>
			<Controller
				render={({ field }) => {
					const isChecked = Array.isArray(field.value)
						? field.value.includes(value)
						: false;

					return (
						<input
							type="checkbox"
							{...props}
							{...field}
							value={value}
							checked={isChecked}
							onChange={(e) => {
								const checkedValue = e.target.checked;
								if (Array.isArray(field.value)) {
									const newValue = checkedValue
										? [...field.value, value]
										: field.value.filter((v: number) => v !== value);
									field.onChange(newValue);
								} else {
									field.onChange(checkedValue ? [value] : []);
								}
							}}
						/>
					);
				}}
				name={name}
				control={control}
				defaultValue={[] as T[typeof name]} // default to empty array for multi-select
			/>
			{children}
		</>
	);
}
