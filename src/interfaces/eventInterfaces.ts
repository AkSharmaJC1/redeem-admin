export interface ISocialLink {
	type: string;
	url: string;
}

export interface FeaturedUpdate {
	isFeatured: boolean;
	eventId: number;
}

interface Pass {
	passTypeId: number;
	quantity: number;
	price: number;
}

export interface IEventDetails {
	eventName: string;
	slug?: string;
	isFeatured: number;
	about: string;
	startTime: string;
	endTime: string;
	address: string;
	state: string;
	city: string;
	zipcode: string;
	categoryId: number;
}

export interface IEventBasicDetails extends IEventDetails {
	date: Date;
	image?: string;
}

export interface IAddEventData extends IEventDetails {
	location: {
		lat: number;
		lng: number;
	};
	userId: number;
	images: string[];
	passes?: Pass[];
}

export interface IEditEventData extends IAddEventData {
	eventId: number;
}

export interface IEventImage {
	imageUrl: string;
	imageType: "fromS3" | "blob";
	file: File;
}

export interface IPass {
	passTypeId: number;
	quantity: number;
	price: number;
	isFree: boolean;
}

export interface IPassesObject {
	passes: IPass[];
}

export interface IEvent {
	id: number;
	name: string;
	isFeatured: boolean;
	guestCapacity: number;
	startTime: string; // ISO string
	endTime: string; // ISO string
	externalLink: string;
	socialLinks: ISocialLink[];
	about: string;
	address: string;
	state: string;
	city: string;
	zipcode: string;
	location: ILocation;
	images: string[];
	categories: ICategory;
	user: IUser;
	agendas: IAgenda[];
	eventTickets: IEventTicket[];
	guests: IGuest[];
}

export interface ISocialLink {
	url: string;
	type: string; // you might want to restrict this to a union type like 'facebook' | 'linkedin' | etc.
}

export interface ILocation {
	type: string; // e.g., 'Point'
	coordinates: [number, number]; // [longitude, latitude]
}

export interface ICategory {
	id: string;
	name: string;
}

export interface IUser {
	id: string;
	name: string;
	email: string;
	phone: string;
	businessDetails: IBusinessDetails;
}

export interface IBusinessDetails {
	id: string;
	name: string;
	images: string[];
}

export interface IAgenda {
	id: number;
	title: string;
	speakerName: string;
	startDate: string | null;
	endDate: string | null;
	description: string;
}

export interface IEventTicket {
	id: number;
	ticketTitle: string;
	quantity: number;
	bookedQuantity: number;
	price: string;
	registrationDeadline: string | null;
}

export interface IGuest {
	id: number;
	name: string | null;
	bio: string | null;
	images: string[] | null;
	socialLinks: ISocialLink[];
}

export interface IReCreateEvent {
	eventId: number;
	eventDate: string;
	timezone: string;
}
