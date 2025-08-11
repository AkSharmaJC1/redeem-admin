import React, { InputHTMLAttributes } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface TextboxProps<T extends FieldValues>
	extends InputHTMLAttributes<HTMLInputElement> {
	name: Path<T>;
	control: Control<T>;
	align?: "left" | "right";
	children?: React.ReactNode;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Searchbox<T extends FieldValues>({
	children,
	control,
	name,
	align = "left",
	onChange,
	...props
}: TextboxProps<T>) {
	return (
		<div className={`icon-align ${align}`}>
			<Controller
				control={control}
				name={name}
				render={({ field }) => (
					<input
						{...props}
						{...field}
						value={field.value ?? ""}
						onChange={(e) => {
							field.onChange(e);
							if (onChange) {
								onChange(e);
							}
						}}
					/>
				)}
			/>
			{children}
		</div>
	);
}
