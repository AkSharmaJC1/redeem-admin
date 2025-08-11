import storage from "../utils/storage";

export const ACCESS_TOKEN_KEY = "__RTA__";

export const getAccessToken = (): string => {
	return storage?.get(ACCESS_TOKEN_KEY);
};

export const setAccessToken = (accessToken: string): void => {
	return storage?.set(ACCESS_TOKEN_KEY, accessToken);
};
