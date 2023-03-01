import { configureStore } from "@reduxjs/toolkit";
import imageSlice from "./CloudinaryUploader/slice";
import productItemSlice from "./ProductItem/slice";
import invoiceSlice from "./Invoice/slice";
import userSlice from "./User/slice";

const store = configureStore({
  reducer: {
    uploadImageStore: imageSlice.reducer,
    userStore: userSlice.reducer,
    productItemStore: productItemSlice.reducer,
    invoiceStore: invoiceSlice.reducer,
  },
});

export default store;