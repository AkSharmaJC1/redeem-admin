export interface IUserList {
	id: string;
	name: string;
	email: string;
	phoneCountryCode: string;
	phone: string;
	image?: string;
	isActive: number;
	createdAt: string;
}

export interface IUpdateUserStatus {
	userId: string;
	isActive: number;
}

interface IAddress {
	address: string;
	city: string;
	country: string;
	state: string;
	zipcode: string;
}

export interface IUserDetails extends IUserList {
	userDetails: IAddress;
}

export interface IMyBookingDataForApi {
	offset: number;
	limit: number;
	userId: string;
	timeZone?: Date;
	pastBookings?: boolean;
}
