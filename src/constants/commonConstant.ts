export const PERSONAL_STUFF_TYPE = {
	note: "note",
	image: "image",
	file: "file",
};

export const LIST_RECORDS_LIMIT = 15;
export const USER_BOOKING_LIST_RECORDS_LIMIT = 9;

export enum AccountType {
	ADMIN = "admin",
	USER = "user",
	BUSINESS = "business",
}

export enum ApprovalStatus {
	APPROVED = "approved",
	PENDING = "pending",
	REJECTED = "rejected",
	DEACTIVATED = "deactivated",
}

export const regexSchemaConstants = {
	emailRegex: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
	passwordRegex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W])[A-Za-z\d\W]{8,16}$/,
};

export enum StorageKeys {
	authData = "authData",
}

export const graphTypeOptions = [
	{
		id: 1,
		label: "This Year",
		value: "This Year",
	},
	{ id: 2, label: "This Month", value: "This Month" },
	{ id: 3, label: "This Week", value: "This Week" },
];

export const backGroundColor = {
	GREEN: "rgb(0, 255, 0)",
	RED: "rgba(100%, 0%, 0%, 1)",
};

export const GRAPH_OPTIONS = {
	responsive: true,
	plugins: {
		legend: {
			position: "bottom" as const,
			onClick: () => {},
		},
	},
};

export const EXTENSION = ["jpeg", "jpg", "png", "webp", "heif"];

export const COLOR = {
	BORDER_COLOR: "#CEA344",
	BACKGROUND_COLOR: "rgb(50,112,40,255)",
	POINT_BORDER_COLOR: "#806C40",
	POINT_BACKGROUND_COLOR: "#FEF1F1",
};

export const BG_COLOR = [
	"#806C40",
	"#806C40",
	"#806C40",
	"#806C40",
	"#806C40",
	"#4B422D",
	"#0c1a22",
];

export const EMAIL_ADDRESS_VALIDATION =
	/^[0-9a-zA-Z][a-zA-Z0-9._%+-]*@?[a-zA-Z0-9.-]*\.[a-zA-Z]{2,3}$/;

export const CONST_DATA = {
	invalidToken: "Invalid token",
	rememberMe: "rememberMe",
	unauthorized: "unauthorized",
};

export const CATEGORIES_DATA = "categoriesData";

export const VERIFICATION_TYPE = {
	forgotPassword: "forgotPassword",
	signup: "signup",
};

export enum TAB_TYPE {
	upcomingEvent = "Upcoming Event",
	pastEvent = "Past Event",
}
export const PROFILE_IMAGE_LIMIT = 10 * 1024 * 1024;

export const GRAPH_TYPE_NAME = "Revenue";
