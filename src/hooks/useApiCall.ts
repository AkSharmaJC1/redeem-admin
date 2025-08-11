/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import { useDispatch } from "react-redux";
import { Imeta } from "../interfaces/commonInterfaces";
import ApiResponse from "../resources/entity/IApiResponse";
import { captureException } from "@sentry/react";
import useSessionExpiredHandler from "./useSessionExpiredHandler";
// import { handleAuthentication } from "utils/handleAuthentication";

export interface IMessageState {
	type: string;
	description: string;
}
export function useApiCall<T, V, Y>({
	apiCall,
	lazy,
}: {
	lazy?: boolean;
	apiCall: (param?: V, body?: Y) => Promise<ApiResponse<T>>;
}): {
	error?: string | AxiosError;
	loading?: boolean;
	data: T | any;
	meta: Imeta | undefined;
	message: IMessageState | undefined;

	refetch(param?: V, body?: Y): Promise<void>;
} {
	const checkSessionExpired = useSessionExpiredHandler();
	//   const { t: translation } = useTranslation();
	const [error, setError] = useState<string | AxiosError>();
	const [data, setData] = useState<T | undefined>();
	const [meta, setMeta] = useState<Imeta | undefined>();
	const [message, setMessage] = useState<IMessageState | undefined>();
	const [loading, setLoading] = useState<boolean>(!lazy);

	//   const dispatch = useDispatch();
	const fetch = useCallback(
		async (param?: V, body?: any) => {
			try {
				setError(undefined);
				setMessage(undefined);
				setLoading(true);
				const response =
					param && body
						? await apiCall(param, body)
						: param
							? await apiCall(param)
							: body
								? await apiCall(body)
								: await apiCall();

				// todo: the backend does not always send the payload back as `{data, code}`

				if (response?.data?.success || response?.data?.data?.success) {
					setData(response?.data.data ? response?.data?.data : response?.data);
					setMeta(response?.data.meta);
					setMessage({ type: "success", description: response?.data?.message });
				} else {
					// if (response?.error?.message === "invalid_token")
					// handleAuthentication(dispatch, translation);

					setMessage({
						type: "error",
						description: response?.data?.message ?? "something_went_wrong",
					});
					setData(undefined);
					return checkSessionExpired(
						response?.error?.error || "something_went_wrong"
					);
				}
			} catch (error) {
				captureException(error);

				setError(error as AxiosError);
			} finally {
				setLoading(false);
			}
		},
		[apiCall]
	);

	useEffect(() => {
		if (lazy) {
			return;
		}
		setLoading(true);
		fetch();
	}, [fetch, lazy]);

	return {
		error,
		data,
		meta,
		loading,
		message,
		refetch: fetch,
	};
}
