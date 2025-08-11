import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";
import { IAuthContextData } from "../interfaces/authInterfaces";

function useAuth(): IAuthContextData {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error("Something Went wrong");
	}

	return context;
}

export default useAuth;
