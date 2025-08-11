import i18next from "i18next";
import HttpApi from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

i18next
	.use(initReactI18next)
	.use(HttpApi)
	.init({
		initImmediate: false,
		lng: "en", // default language
		fallbackLng: "en",
		// when specified language translations not present then fallbacklang translations loaded /
		ns: ["translations"],
		debug: true,
		backend: {
			// translation file path /
			loadPath: "/assets/i18n/{{ns}}/{{lng}}.json",
		},
		// can have multiple namespace, in case you want to divide a huge translation into smaller pieces and load them on demand /
		defaultNS: "translations",
		// keySeparator: false,
		interpolation: {
			escapeValue: false,
			formatSeparator: ",",
		},
		react: {
			useSuspense: false,
		},
	});

export default i18next;
