import * as yup from "yup";

export const approvalRejectSchema = (translation: (key: string) => string) =>
	yup.object().shape({
		reason: yup
			.string()
			.min(10, translation("reason_min_req"))
			.max(500, translation("reason_max_req"))
			.required(translation("reason_req")),
	});
