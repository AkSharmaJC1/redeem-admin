import { ButtonHTMLAttributes, FC, ReactNode } from "react";
import { PERSONAL_STUFF_TYPE } from "../utils/constants";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
	className?: string;
	label?: string;
	iconType?: "image" | "component" | undefined;
	disabled?: boolean;
	iconSrc?: string | ReactNode;
	iconSrcLeft?: string | ReactNode;
	isSvgDisabled?: boolean;
	loadingColorDark?: boolean;
	type?: "submit" | "reset" | "button";
	loading?: boolean;
	onClick?: (e: { preventDefault: () => void }) => void;
}

const CommonButton: FC<Props> = ({
	className,
	label,
	iconType,
	disabled,
	iconSrc,
	iconSrcLeft,
	isSvgDisabled,
	loadingColorDark,
	type,
	loading,
	onClick,
}) => {
	return (
		<button
			className={`theme-button ${className}`}
			disabled={loading || disabled}
			onClick={onClick}
			type={type ?? "submit"}
		>
			<>
				{!isSvgDisabled && (
					<>
						{iconSrcLeft && iconType === PERSONAL_STUFF_TYPE.image ? (
							<img
								src={iconSrcLeft as string}
								alt="icon"
								className="icon-btn"
							/>
						) : (
							iconSrcLeft
						)}
						{label}
						{iconSrc && iconType === PERSONAL_STUFF_TYPE.image ? (
							<img src={iconSrc as string} alt="icon" className="icon-btn" />
						) : (
							iconSrc
						)}
					</>
				)}
				{loading ? (
					<div
						className={`spinner-border ${loadingColorDark ? "text-dark" : ""}`}
					></div>
				) : null}
			</>
		</button>
	);
};

export default CommonButton;
