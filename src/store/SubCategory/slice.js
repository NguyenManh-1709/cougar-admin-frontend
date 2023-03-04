import { createSlice } from "@reduxjs/toolkit";
import { subCategoriesGetAll } from "./api";
const subCategoriesSlice = createSlice({
  name: "subCategory",
  initialState: {
    subCategories: []
  },
  reducers: {
    // ...
  },
  extraReducers: (builder) => {
    builder
      // GET ALL SUB CATEGORIES
      .addCase(subCategoriesGetAll.pending, (state) => {
        state.status = "loading";
      })
      .addCase(subCategoriesGetAll.fulfilled, (state, action) => {
        state.subCategories = action.payload;
        state.status = "idle";
      })
  },
});

export default subCategoriesSlice;