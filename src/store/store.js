import { configureStore } from "@reduxjs/toolkit";
import imageSlice from "./CloudinaryUploaderSlice/slice";

const store = configureStore({
  reducer: {
    uploadImageStore: imageSlice.reducer,
  },
});

export default store;