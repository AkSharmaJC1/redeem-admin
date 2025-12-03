export default {
	Auth: {
		LOGIN: "/auth/login",
		VERIFY_OTP: "/auth/otp-verification",
		FORGET_PASSWORD: "/auth/forgot-password",
		RESEND_OTP: "/auth/resend-otp",
		RESET_PASSWORD: "/auth/reset-password",
	},
	USER: {
		EDIT_PROFILE_IMAGE: "/user/edit-profile-image",
		LOGOUT_USER: "/user/logout-user",
	},
	ADMIN: {
		GET_USER_LIST: "/admin/get-user-list",
		GET_USER_DETAIL: "/admin/get-user-detail",
		CHANGE_USER_STATUS: "/admin/change-user-status",
		BUSINESS_EVENTS: "/admin/get-business-events",
	},
	BUSINESS: {
		GET_BUSINESS_LIST: "/business/list-businesses",
		LIST_PENDING_BUSINESSES: "/business/list-pending-businesses",
		UPDATE_BUSINESS_OWNER_STATUS: "/business/update-owner-status",
		UPDATE_BUSINESS_APPROVAL_STATUS: "/business/update-owner-approval-status",
		GET_BUSINESS: "/business/business-info/:id",
		GET_PRESIGNED_URL: "/business/pre-signed-url",
		TOP_PLACE_UPDATE: "/business/top-place-update",
	},
	EVENT: {
		CATEGORIES: "/business/categories",
		GET_EVENT: "/event/get-event",
		GET_EVENT_DETAIL: "/event/get-event-detail",
		GET_EVENT_FOR_HOME: "/event/get-event-for-home",
		FEATURED_EVENT_UPDATE: "event/featured-event-update",
		BUSINESS_EVENTS: "/event/get-business-events",
		MY_BOOKINGS: "/event/my-bookings",
		TOTAL_REVENUE_OF_EVENTS: "/event/total-revenue-of-events",
		TOTAL_REVENUE_OF_BUSINESS: "/event/total-revenue-of-business",
		// BOOKING_INITIALIZE: "/event/booking-initialized/:id",
		// SEND_EVENT_DETAILS_BY_EMAIL: "/event/send-event-details-by-email",
	},
	DASHBOARD: {
		GET_TOTAL_EVENT: "/admin-dashboard/get-total-events-count",
		GET_TOTAL_BUSINESS: "/admin-dashboard/get-total-business-count",
		GET_TOTAL_USERS: "/admin-dashboard/get-total-users-count",
		FETCH_GRAPH_DATA: "/admin-dashboard/fetch-graph-data",
	},
	TRANSACTION: {
		TRANSACTIONS_LIST: "/transactions/transactions-list",
	},
	SUPPORT: {
		SUPPORT_TICKET_LIST: "/support-tickets/get-tickets",
	},
} as const;
