import toast from "react-hot-toast";
import "../assets/theme/App.scss";
// Remove all existing toasts
const clearToasts = () => {
	toast.remove(); // This will remove all toasts
};

// Success toast
export const toastMessageSuccess = (message: string) => {
	clearToasts(); // Ensure only one toast is shown
	toast.success(message, {
		position: "top-right",
		// className: "custom-toast", // Apply custom CSS class
		style: {
			color: "black",
			backgroundColor: "#CEA344",
		},
	});
};

// Error toast
export const toastMessageError = (message: string) => {
	clearToasts(); // Ensure only one toast is shown
	toast.error(message, {
		position: "top-right",
		// className: "custom-toast", // Apply custom CSS class
		style: {
			color: "black",
			backgroundColor: "#CEA344",
		},
	});
};
