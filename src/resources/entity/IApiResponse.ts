/* eslint-disable @typescript-eslint/no-explicit-any */

import { AxiosResponse } from "axios";

export interface StringKeyObject {
	[key: string]: any;
}

export type TApiState = Record<string, any> | null;

export default interface ApiResponse<T = any>
	extends Partial<AxiosResponse<T | TApiState>> {
	success: boolean;
	message: string;
	data: TApiState;
	error: TApiState;
}
