import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ICategories {
	id: number;
	name: string;
}

export interface ICategoriesState {
	categories: ICategories[];
}

const initialState: ICategoriesState = {
	categories: [],
};

const categorySlice = createSlice({
	name: "category",
	initialState,
	reducers: {
		setCategories: (state, action: PayloadAction<ICategories[]>) => {
			state.categories = action.payload;
		},

		clearCategories: (state) => {
			state.categories = [];
		},
	},
});

export const { setCategories, clearCategories } = categorySlice.actions;

export default categorySlice.reducer;
