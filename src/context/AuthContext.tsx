import { useTranslation } from "react-i18next";
import React, { createContext, useEffect, useState } from "react";
import { IAuthContextData, IUserData } from "../interfaces/authInterfaces";
import { StorageKeys, CATEGORIES_DATA } from "../constants/commonConstant";
import { setAccessToken, ACCESS_TOKEN_KEY } from "../helper/storage";
import storage from "../utils/storage";
import { signInService } from "../services/auth";
import { useDispatch } from "react-redux";
import {
	toastMessageError,
	toastMessageSuccess,
} from "../commonToast/CommonToastMessage";
import { editProfileImage, logoutUser } from "../services/user";
import { clearCategories } from "../store/categoriesSlice";
import useSessionExpiredHandler from "../hooks/useSessionExpiredHandler";

export const AuthContext = createContext<IAuthContextData>(
	{} as IAuthContextData
);

interface Props {
	children: React.ReactNode;
}

const AuthProvider = ({ children }: Props) => {
	const { t: translation } = useTranslation();
	const checkSessionExpired = useSessionExpiredHandler();
	const dispatch = useDispatch();
	const [authData, setAuthData] = useState<IUserData>();
	const [loading, setLoading] = useState(false);
	const [appLoading, setAppLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState<string | undefined>();

	/**
	 * useEffect to initialize app loading state and retrieve stored authentication data
	 */
	useEffect(() => {
		(async () => {
			setAppLoading(true);

			try {
				// Retrieve stored authentication data
				const storedAuthData = await storage?.get(StorageKeys.authData);
				if (storedAuthData) {
					// Parse the stored data and set it to authData
					setAuthData(JSON.parse(storedAuthData));
				}
			} catch (error) {
				// Handle any errors that might occur during data retrieval or parsing
				console.error("something went wrong", error);
				// You could handle the error further if needed, such as showing a notification to the admin
			} finally {
				// Ensure appLoading is set to false regardless of whether there was an error
				setAppLoading(false);
			}
		})();
	}, []);

	function clearError() {
		setErrorMessage(undefined);
	}
	/**
	 * Function to handle admin login
	 * @param email - admin email
	 * @param password - admin password
	 */
	const login = async (
		email: string,
		password: string,
		accountType: string
	) => {
		setLoading(true);
		clearError();

		// Perform admin login
		const res = await signInService({
			email,
			password,
			accountType,
			timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		});

		const userData = res?.data?.userData;

		if (res?.error || !userData) {
			setErrorMessage(
				translation(res?.message ?? res?.data?.message) ??
					"Something went wrong"
			);
		} else {
			setAuthData(userData);
			setAccessToken(res?.data?.token);
			storage.set(StorageKeys.authData, JSON.stringify(userData));
		}

		setLoading(false);
	};

	//Remove data from context, so the App can be notified
	//and send the admin to the AuthStack
	const signOut = async () => {
		setLoading(true);
		await logoutUser();
		setAuthData(undefined);
		storage?.remove(StorageKeys.authData);
		storage?.remove(ACCESS_TOKEN_KEY);
		storage?.remove(CATEGORIES_DATA);
		setLoading(false);
		dispatch(clearCategories());
	};

	const updateProfilePicture = async (resetData: { image: string }) => {
		const response = await editProfileImage({
			imagePath: resetData.image,
		});
		if (response?.error?.error) {
			return checkSessionExpired(response?.error?.error);
		}
		if (response?.data?.success) {
			if (authData && authData.id !== undefined) {
				setAuthData({ ...authData, image: resetData.image });
			}
			storage?.set(
				StorageKeys.authData,
				JSON.stringify({ ...authData, image: resetData.image })
			);
			toastMessageSuccess(translation(response.data.message));
		} else {
			toastMessageError(translation(response.data?.message));
		}
	};

	return (
		//This component will be used to encapsulate the whole App,
		//so all components will have access to the Context
		<AuthContext.Provider
			value={{
				authData,
				loading,
				appLoading,
				login,
				signOut,
				updateProfilePicture,
				errorMessage,
				clearError,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
