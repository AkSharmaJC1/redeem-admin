/* eslint-disable @typescript-eslint/no-explicit-any */

import ApiResponse from "../resources/entity/IApiResponse";

export interface IMessageState {
	type: string;
	description: string;
}

export interface IInfiniteScrollParams {
	offset?: number;
	prevOffset?: number;
	hasMore?: boolean;
}
export interface IUseInfiniteScrollParams {
	apiService: (params: any) => any;
	apiParams?: {
		[key: string]: unknown;
	};
	limit?: number;
	offset?: number;
}
export interface IUseInfiniteScrollReturn {
	data: any;
	hasMore: boolean;
	loading: boolean;
	apiResponse?: ApiResponse;
	message?: IMessageState;
	setLoading: (flag: boolean) => void;
	loadMore: () => void;
	setData: (data: unknown[]) => void;
	fetchData: (firstLoad?: boolean, optionalParams?: DataObject) => void;
}
export interface IMessageState {
	type: string;
	description: string;
}

export type DataObject = { [x: string]: string | boolean | unknown };

export interface IRange {
	startDate: Date;
	endDate: Date;
	key: string;
}

export interface FilePath {
	filePath: string;
	fileFormat: string;
}

export interface IDeleteUrl {
	key: string;
}

export interface ICommonDataForApi {
	offset?: number;
	search_text?: string;
	limit?: number;
	id?: number;
	type?: string;
	account_type?: string;
	timeZone?: Date;
	eventType?: string;
}

export interface Imeta {
	previousId: number;
	nextId: number;
	total: number;
}

export interface IOtp {
	email: string;
	verification_type: string;
	otp: string;
}

export interface IPresignedData {
	filePath: string;
	fileFormat: string;
}

interface IStatus {
	code: number;
	message: string;
}

export interface IResponseData {
	status: IStatus;
	data?: any;
	message: string;
	success: boolean;
}

export interface IBooking {
	id: number;
	userId: string;
	bookingStatus: "confirmed" | "pending" | "canceled" | "attended"; // Based on possible statuses
	totalQuantity: number;
	totalAmount: string;
	createdAt: string; // ISO date string
	event: IEvent;
	bookingPasses: IBookingPass[];
}

interface IEvent {
	name: string;
	categoryId: string;
	startTime: string; // ISO date string
	endTime: string; // ISO date string
	images: string[];
	user: IUser;
}

interface IUser {
	id: string;
	businessDetails: {
		name: string;
	};
}

export interface IBookingPass {
	id: number;
	eventPassId: number;
	quantity: number;
}

export interface IRange {
	startDate: Date;
	endDate: Date;
	key: string;
}
export interface IGraphResponse {
	graphData: {
		label: string;
		count: number;
	}[];
	totalRevenue: number;
}

export interface IChartArea {
	left: number;
	right: number;
	top: number;
	bottom: number;
}

export interface ICommonRevenueCount {
	totalAmount: number;
	totalCount: number;
}
