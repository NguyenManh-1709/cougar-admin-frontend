import { createSlice } from "@reduxjs/toolkit";
import { login } from "./api";
const loginSlice = createSlice({
  name: "productItem",
  initialState: {
    userLogedInToken: [],
    userLogedIn: []
  },
  reducers: {
    // ...
  },
  extraReducers: (builder) => {
    builder
      // DO LOG IN
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        // action.payload là token trả về
        state.userLogedInToken = action.payload.token;

        // Cần xử lý token để trả về userLogedIn
        // state.userLogedIn = ;
        state.status = "idle";
      })
  },
});

export default loginSlice;