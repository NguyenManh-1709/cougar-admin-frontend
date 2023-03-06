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
        const itemsToAdd = action.payload.map(({ color, size, ...rest }) => {
          return {
            ...rest.productItem,
            color,
            size
          };
        });
        
        state.productItems.push(...itemsToAdd);

        state.status = "idle";
      })
  },
});

export default productItemSlice;