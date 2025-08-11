import { useTranslation } from "react-i18next";
import { VALIDATION_CONST } from "../utils/constants";
import useAuth from "./useAuth";
import { toastMessageError } from "../commonToast/CommonToastMessage";
import toast from "react-hot-toast";

const useSessionExpiredHandler = () => {
	const { signOut, authData } = useAuth();
	const { t: translation } = useTranslation();

	const handleSessionExpired = async () => {
		toastMessageError(translation("session_expired"));
		toast.dismiss(authData?.id);
		signOut();
	};

	const checkSessionExpired = (errorResponse: string) => {
		if (errorResponse === VALIDATION_CONST.INVALID_TOKEN) {
			handleSessionExpired();
		}
	};

	return checkSessionExpired;
};

export default useSessionExpiredHandler;
