/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef, HTMLAttributes } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface TextareaProps<T extends FieldValues>
	extends HTMLAttributes<HTMLTextAreaElement> {
	name: Path<T>;
	control: Control<T>;
	placeholder?: string;
	rows?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps<any>>(
	({ control, name, ...props }, ref) => {
		return (
			<Controller
				control={control}
				name={name}
				render={({ field }) => (
					<textarea
						{...props}
						{...field}
						ref={ref} // Attach the forwarded ref here
						value={field.value || ""}
						onChange={field.onChange}
					/>
				)}
				defaultValue=""
			/>
		);
	}
);

export default Textarea;
