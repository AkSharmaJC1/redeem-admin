import React, { HTMLAttributes } from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";

interface CheckBoxProps<T extends FieldValues>
	extends HTMLAttributes<HTMLInputElement> {
	name: Path<T>;
	control: Control<T>;
	children?: React.ReactNode;
	value?: boolean;
}

export default function CheckBox<T extends FieldValues>({
	name,
	control,
	children,
	...props
}: CheckBoxProps<T>) {
	return (
		<>
			<Controller
				render={({ field }) => (
					<input
						type="checkbox"
						{...props}
						{...field}
						value={field.value ?? ""}
						checked={field.value ?? false}
						onChange={(r) => {
							field.onChange(r);
						}}
					/>
				)}
				name={name}
				control={control}
				defaultValue={false as T[typeof name]}
			/>
			{children}
		</>
	);
}
