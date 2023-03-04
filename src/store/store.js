import { configureStore } from "@reduxjs/toolkit";
import imageSlice from "./CloudinaryUploader/slice";
import productItemSlice from "./ProductItem/slice";
import invoiceSlice from "./Invoice/slice";
import invoiceDetailsSlice from "./InvoiceDetail/slice";
import userSlice from "./User/slice";
import loginSlice from "./Login/slice";
import categoriesSlice from "./Category/slice";
import subCategoriesSlice from "./SubCategory/slice";

const store = configureStore({
  reducer: {
    uploadImageStore: imageSlice.reducer,
    userStore: userSlice.reducer,
    productItemStore: productItemSlice.reducer,
    invoiceStore: invoiceSlice.reducer,
    invoicesDetailsStore: invoiceDetailsSlice.reducer,
    categoriesStore: categoriesSlice.reducer,
    subCategoriesStore: subCategoriesSlice.reducer,
    loginStore: loginSlice.reducer,
  },
});

export default store;