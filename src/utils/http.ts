/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

import { getAccessToken } from "../helper/storage";
import config from "../config/config";
import { withData, withError } from "./api";

export const http = axios.create({
	baseURL: config.baseUrl,
	headers: {
		"Content-Type": "application/json",
		"ngrok-skip-browser-warning": "69420",
	},
});

http.interceptors.request.use((req: any) => {
	if (getAccessToken())
		if (req.headers) req.headers.authorization = `Bearer ${getAccessToken()}`;
	return req;
});

http.interceptors.response.use(
	(res) => withData(res.data),
	(err) => withError(err?.response?.data)
);

export async function get<P>(url: string, params?: P): Promise<any> {
	return http({
		method: "get",
		url,
		params,
	});
}

export async function post<D, P>(url: string, data: D, params?: P) {
	return http({
		method: "post",
		url,
		data,
		params,
	});
}

export async function postFile<D, P>(url: string, data: D, params?: P) {
	return http({
		method: "post",
		headers: { "Content-Type": "multipart/form-data" },
		url,
		data,
		params,
	});
}

export async function put<D, P>(url: string, data?: D, params?: P) {
	return http({
		method: "put",
		url,
		data,
		params,
	});
}

export async function patch<D, P>(url: string, data: D, params?: P) {
	return http({
		method: "patch",
		url,
		data,
		params,
		// withCredentials: true,
	});
}

export async function remove<P>(url: string, params?: P) {
	return http({
		method: "delete",
		url,
		params,
		// withCredentials: true,
	});
}
