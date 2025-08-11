import SecureLS from "secure-ls";

const ls = new SecureLS({ encodingType: "aes" });

const storage = {
	set: (key: string, data: unknown): void => {
		try {
			ls.set(key, data);
		} catch (error) {
			console.error(`Error setting data for key ${key}:`, error);
		}
	},

	get: (key: string) => {
		try {
			const data = ls.get(key);
			return data;
		} catch (error) {
			console.error(`Error getting data for key ${key}:`, error);
			return null;
		}
	},

	remove: (key: string): void => {
		try {
			ls.remove(key);
		} catch (error) {
			console.error(`Error removing data for key ${key}:`, error);
		}
	},

	removeAll: (): void => {
		try {
			ls.removeAll();
		} catch (error) {
			console.error("Error removing all data:", error);
		}
	},

	clear: (): void => {
		try {
			ls.clear();
		} catch (error) {
			console.error("Error clearing storage:", error);
		}
	},

	getAllKeys: (): string[] => {
		try {
			const keys = ls.getAllKeys();
			return keys;
		} catch (error) {
			console.error("Error getting all keys:", error);
			return [];
		}
	},
};

export default storage;
