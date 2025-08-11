/* eslint-disable @typescript-eslint/no-explicit-any */
import { TApiState } from "../resources/entity/IApiResponse";

export const withError = <T extends TApiState>(arg: T): any => {
	return {
		data: null,
		error: {
			...arg,
		},
	};
};

export const withData = <T extends TApiState>(data: T): any => ({
	error: null,
	data,
});
