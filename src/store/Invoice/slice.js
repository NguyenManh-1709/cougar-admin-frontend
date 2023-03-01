import { createSlice } from "@reduxjs/toolkit";
import { invoiceGetAll } from "./api";
const invoiceSlice = createSlice({
  name: "productItem",
  initialState: {
    invoices: []
  },
  reducers: {
    // ...
  },
  extraReducers: (builder) => {
    builder
      // GET ALL INVOICES
      .addCase(invoiceGetAll.pending, (state) => {
        state.status = "loading";
      })
      .addCase(invoiceGetAll.fulfilled, (state, action) => {
        state.invoices = action.payload;
        state.status = "idle";
      })
  },
});

export default invoiceSlice;