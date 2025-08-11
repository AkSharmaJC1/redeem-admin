import { ApprovalStatus } from "../constants/commonConstant";

export interface IAddBusines {
	ownerName: string;
	businessName: string;
	email: string;
	phone?: string;
	address?: string;
	zip?: string;
	about: string;
	password: string;
	images?: string[];
	mainImage?: string;
}

export interface IUpdateBusines {
	ownerName?: string;
	businessName?: string;
	email?: string;
	phone?: string;
	address?: string;
	zip?: string;
	about?: string;
	password?: string;
	images?: string[];
	mainImage?: string;
}

export interface IUpdateOwnerStatus {
	ownerId: number;
	status: boolean;
}

export interface IUpdateApprovalStatus {
	ownerId: number;
	status: ApprovalStatus;
	reason?: string;
}

export interface ImageItem {
	id?: string | undefined;
	imageUrl: string;
	imageType: "fromS3" | "blob";
	// isFavorite: boolean;
	file?: File | undefined;
}

export interface RegisterBusinessForm {
	businessName: string;
	ownerName: string;
	email: string;
	password: string;
	about: string;
	address: string;
	zipcode: string;
	phone: string;
	accountType: string;
	mainImage: string;
	images: string[];
}

export interface IRegisterFormSubmit {
	businessName: string;
	ownerName: string;
	isTopPlace: number | boolean;
	email: string;
	password: string;
	confirmPassword: string;
	about: string;
	address: string;
	zipcode: string;
	phone: string;
}

export interface IBusinessEvent {
	id: number;
	name: string;
	startTime: string; // ISO 8601 date string
	endTime: string; // ISO 8601 date string
	about: string;
	images: string[];
	categories: {
		id: string;
		name: string;
	};
	user: {
		id: string;
		name: string;
		email: string;
		phone: string;
		businessDetails: {
			name: string;
		};
	};
}

export interface IGetBusinessEvents {
	userId: string;
	eventType: string;
}

export interface IUpdatePassword {
	ownerId: number;
	password: string;
}

export interface IUpdateTopPlace {
	businessId: number;
	isTopPlace: boolean;
}

export interface IBusinessData {
	id: string;
	name: string;
	isTopPlace: boolean;
	about: string;
	images: string[];
	address: string;
	coordinates: Coordinates;
	city: string | null;
	state: string | null;
	country: string | null;
	zipcode: string;
	createdAt: string;
	updatedAt: string;
	user: IUser;
}

interface Coordinates {
	x: number;
	y: number;
}

export interface IUser {
	id: string;
	name: string;
	email: string;
	account_type: string;
	password: string;
	image: string;
	phone: string;
	countryCode: string;
	phoneCountryCode: string;
	isEmailVerified: number;
	isActive: number;
	verificationCode: string | null;
	allowNotification: number;
	timezone: string;
	createdAt: string;
	updatedAt: string;
}

export interface IBusiness {
	id: string;
	name: string;
	about: string;
	status: ApprovalStatus;
	createdAt: string;
	updatedAt: string;
	user: IUser;
}

export interface IBusinessDetails {
	id: string;
	name: string;
	about: string;
	images: string[];
	address: string | null;
	location: {
		type: string;
		coordinates: number[];
	} | null;
	city: string | null;
	state: string | null;
	country: string | null;
	zipcode: string | null;
	isNonProfitOrg: number;
	taxExemptionCertificates: string[];
	status: ApprovalStatus | null;
	reject_reason: string | null;
	createdAt: string;
	updatedAt: string;
	user: IUser;
}
