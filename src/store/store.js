import { configureStore } from "@reduxjs/toolkit";
import imageSlice from "./CloudinaryUploader/slice";
import userSlice from "./User/slice";

const store = configureStore({
  reducer: {
    uploadImageStore: imageSlice.reducer,
    userStore: userSlice.reducer
  },
});

export default store;