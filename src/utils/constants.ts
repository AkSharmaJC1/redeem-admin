export const ROUTES = {
	LOGIN: "/",
	FORGOT_PASSWORD: "/forgot-password",
	VERIFICATION_CODE: "/verification-code",
	RESET_PASSWORD: "/reset-password",
	BUSINESS_LIST: "/business-list",
	BUSINESS_DETAIL: "/business-detail/:businessId",
	EVENT_DETAIL: "/event-detail/:id",
	EVENT_LIST: "/event-list",
	USER_LIST: "/user-list",
	TRANSACTIONS_LIST: "/transactions-list",
	SUPPORT_LIST: "/support-list",
	USER_DETAIL: "/user-detail/:userId",
	DASHBOARD: "/",
	SETTINGS: "/settings",
	// CLIENT REQUEST
	// APPROVAL_REQUESTS: "/approval-requests",
};

export const PERSONAL_STUFF_TYPE = {
	note: "note",
	image: "image",
	file: "file",
};

export const MESSAGE_TYPE = {
	success: "success",
	error: "error",
};

export const EVENT_TYPE = {
	upcoming: "Upcoming Event",
	past: "Past Event",
};

export const BOOKING_RESPONSE = {
	IS_INITIALIZED: "Booking is initialized",
	IS_NOT_INITIALIZED: "Booking is not initialized",
};

export const BOOKING_STATUS = {
	CANCELED: "canceled",
	ATTENDED: "attended",
	CONFIRMED: "confirmed",
	PENDING: "pending",
};

export const CategoryType = {
	community: "Community",
	conference: "Conference",
	music: "Music",
};

export const VALIDATION_CONST = {
	this_field_is_required: "This Field is Required",
	INVALID_TOKEN: "token_expired",
	token_expired: "Token Expired",
	session_exipred: "invalid_token",
	session_created: "Session Created Successfully",
};
