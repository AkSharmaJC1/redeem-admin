import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import { encryptTransform } from "redux-persist-transform-encrypt";
import storage from "redux-persist/lib/storage";
import categoriesReducer from "./categoriesSlice";
import config from "../config/config";

// Add encryption transform
const encryptor = encryptTransform({
	secretKey: config.EncryptTransformKey,
	onError: (error) => {
		console.error("Encryption error:", error);
	},
});

const persistConfig = {
	key: "root",
	storage,
	transforms: [encryptor],
};

const rootReducer = combineReducers({
	category: categoriesReducer,
});

const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);

const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
export default store;
