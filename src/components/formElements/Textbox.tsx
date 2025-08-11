/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { InputHTMLAttributes, forwardRef } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface TextboxProps<T extends FieldValues>
	extends InputHTMLAttributes<HTMLInputElement> {
	name: Path<T>;
	control: Control<T>;
	align?: "left" | "right";
	children?: React.ReactNode;
	isDisabled?: boolean;
}

const Textbox = forwardRef<HTMLInputElement, TextboxProps<any>>(
	({ children, control, name, align, isDisabled, ...props }, ref) => {
		return (
			<div className={`icon-align ${align}`}>
				<Controller
					control={control}
					name={name}
					render={({ field }) => (
						<input
							{...props}
							{...field}
							ref={ref} // Attach the forwarded ref here
							value={isDisabled ? 0 : field.value || ""}
							disabled={isDisabled}
						/>
					)}
					defaultValue=""
				/>
				{children}
			</div>
		);
	}
);

export default Textbox;
