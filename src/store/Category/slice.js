import { createSlice } from "@reduxjs/toolkit";
import { categoriesGetAll } from "./api";
const categoriesSlice = createSlice({
  name: "category",
  initialState: {
    categories: []
  },
  reducers: {
    // ...
  },
  extraReducers: (builder) => {
    builder
      // GET ALL CATEGORIES
      .addCase(categoriesGetAll.pending, (state) => {
        state.status = "loading";
      })
      .addCase(categoriesGetAll.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.status = "idle";
      })
  },
});

export default categoriesSlice;