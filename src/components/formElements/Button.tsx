import { ButtonHTMLAttributes, MouseEvent, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
	onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
	disabled?: boolean;
	children?: ReactNode;
	loading?: boolean;
}

const Button = ({
	className,
	type,
	disabled = false,
	onClick,
	children,
	loading,
}: Props) => (
	<>
		<button
			type={type}
			className={`theme-button ${className}`}
			onClick={(e) => {
				if (onClick) {
					onClick(e as unknown as MouseEvent<HTMLButtonElement>);
				}
			}}
			disabled={disabled}
		>
			{children}
			{loading ? <div className="spinner-border"></div> : null}
		</button>
	</>
);

Button.Icon = function ({
	src,
	align,
	loading,
}: {
	src: string | ReactNode;
	align?: "left" | "right";
	loading?: boolean;
}) {
	return (
		<>
			{typeof src === "string" ? (
				align === "left" ? (
					<img src={src} alt="icon" className="icon-btn mr-10" />
				) : (
					<img src={src as string} alt="icon" className="icon-btn ml-10" />
				)
			) : (
				src
			)}
			{loading ? <div className="spinner-border"></div> : null}
		</>
	);
};

export default Button;
