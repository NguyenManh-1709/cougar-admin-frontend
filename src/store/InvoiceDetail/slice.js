import { createSlice } from "@reduxjs/toolkit";
import { invoiceDetailsGetAll } from "./api";
const invoiceDetailsSlice = createSlice({
  name: "productItem",
  initialState: {
    invoicesDetails: []
  },
  reducers: {
    // ...
  },
  extraReducers: (builder) => {
    builder
      // GET ALL INVOICE DETAILS
      .addCase(invoiceDetailsGetAll.pending, (state) => {
        state.status = "loading";
      })
      .addCase(invoiceDetailsGetAll.fulfilled, (state, action) => {
        state.invoicesDetails = action.payload;
        state.status = "idle";
      })
  },
});

export default invoiceDetailsSlice;