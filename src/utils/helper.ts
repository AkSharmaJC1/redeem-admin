import { IPresignedData } from "../interfaces/commonInterfaces";
import { getSignedUrl } from "../services/business";

class Helper {
	// pushFileToS3 = async (signedUrl: string, file: Blob) => {
	// 	const myHeaders = new Headers({
	// 		"Content-Type": file.type,
	// 		"x-amz-acl": "public-read",
	// 	});

	// 	return fetch(signedUrl, {
	// 		method: "PUT",
	// 		headers: myHeaders,
	// 		body: file,
	// 	});
	// };

	/**
	 *  Upload file on presignedUrl of S3
	 */
	pushFileToS3 = async (signedUrl: string, file: Blob) => {
		const myHeaders = new Headers({
			"Content-Type": file.type,
			"x-amz-acl": "public-read",
		});
		try {
			const response = await fetch(signedUrl, {
				method: "PUT",
				headers: myHeaders,
				body: file,
			});
			if (!response.ok) {
				throw new Error(
					`Failed to upload file: ${response.status} ${response.statusText}`
				);
			}
			return response;
		} catch (error) {
			console.error("Error uploading file:", error);
			throw error;
		}
	};

	/**
	 * Generating File URL
	 * @param file
	 * @param filePath
	 * @returns
	 */
	uploadFileOnS3 = async (file: Blob, filePath: string) => {
		const body: IPresignedData = {
			filePath: filePath,
			fileFormat: file.type as string,
		};

		let signedUrl;
		const presignedUrl = await getSignedUrl(body);
		if (presignedUrl && presignedUrl.data) {
			const response = await this.pushFileToS3(presignedUrl.data.data, file);
			if (response?.url) {
				signedUrl = response?.url.split("?Content")?.[0];
			}
		}
		return signedUrl;
	};

	createImageFilePath = (file: File) => {
		const fileNameWithoutExt = file.name.split(".").slice(0, -1).join(".");
		const fileExt = file.name.split(".").pop();
		const timeStamp = new Date().getTime();
		return `business-pictures/${fileNameWithoutExt}-${timeStamp}.${fileExt}`;
	};

	formatPhoneNumber = (phoneNumberString: string) => {
		const cleaned = phoneNumberString.replace(/\D/g, "");
		const part1 = cleaned.slice(0, 3);
		const part2 = cleaned.slice(3, 6);
		const part3 = cleaned.slice(6, 10);

		return `(${part1}) ${part2}-${part3}`;
	};

	formatNumberWithCommas(amount: number | string) {
		if (isNaN(Number(amount))) return String(amount);

		// Convert the input amount to a string and ensure it's a valid float or integer
		const amountStr = parseFloat(String(amount)).toFixed(
			String(amount).includes(".") ? 2 : 0
		);

		// Split the amount into integer and decimal parts (if applicable)
		const parts = amountStr.split(".");
		let integerPart = parts[0];
		const decimalPart = parts[1] || "";

		// Add commas to the integer part
		let integerPartWithCommas = "";
		while (integerPart.length > 3) {
			integerPartWithCommas =
				"," + integerPart.slice(-3) + integerPartWithCommas;
			integerPart = integerPart.slice(0, -3);
		}
		integerPartWithCommas = integerPart + integerPartWithCommas;

		// Combine the integer and decimal parts, limiting decimals to two digits if a float
		const formattedAmount = decimalPart
			? integerPartWithCommas + "." + decimalPart
			: integerPartWithCommas;

		return formattedAmount;
	}

	formatAmountWithCommas(amount: number | string) {
		if (isNaN(Number(amount))) return String(amount);

		// Convert the input amount to a float and format it to two decimal places
		const amountStr = parseFloat(String(amount)).toFixed(2);

		// Split the amount into integer and decimal parts
		const parts = amountStr.split(".");
		let integerPart = parts[0];
		const decimalPart = parts[1];

		// Add commas to the integer part
		let integerPartWithCommas = "";
		while (integerPart.length > 3) {
			integerPartWithCommas =
				"," + integerPart.slice(-3) + integerPartWithCommas;
			integerPart = integerPart.slice(0, -3);
		}
		integerPartWithCommas = integerPart + integerPartWithCommas;

		// Combine the integer and decimal parts
		return integerPartWithCommas + "." + decimalPart;
	}

	// Helper function to generate a slug
	generateSlug = (text: string) =>
		text
			.toLowerCase() // Convert to lowercase
			.trim() // Trim leading and trailing whitespace
			.replace(/[^a-z0-9\s-]+/g, "") // Remove special characters except spaces and hyphens
			.replace(/\s+/g, "-") // Replace spaces with a single hyphen
			.replace(/-+/g, "-") // Replace multiple consecutive hyphens with a single hyphen
			.replace(/^-|-$/g, ""); // Remove leading or trailing hyphens
}

const helperInstance = new Helper();
export default helperInstance;
