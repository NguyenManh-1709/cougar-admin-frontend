import { createSlice } from "@reduxjs/toolkit";
import { productItemGetAll } from "./api";
const productItemSlice = createSlice({
  name: "productItem",
  initialState: {
    productItems: []
  },
  reducers: {
    // ...
  },
  extraReducers: (builder) => {
    builder
      // GET ALL PRODUCT ITEMS
      .addCase(productItemGetAll.pending, (state) => {
        state.status = "loading";
      })
      .addCase(productItemGetAll.fulfilled, (state, action) => {
        state.productItems = action.payload;
        state.status = "idle";
      })
  },
});

export default productItemSlice;