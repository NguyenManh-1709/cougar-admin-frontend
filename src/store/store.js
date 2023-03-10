import { configureStore } from "@reduxjs/toolkit";
import mySlice from "./slices";

const store = configureStore({
  reducer: {
    myStore: mySlice.reducer,
  },
});

export default store;