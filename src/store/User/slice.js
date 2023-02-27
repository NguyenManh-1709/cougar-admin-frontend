import { createSlice } from "@reduxjs/toolkit";
// import { userGetAll, userGetById, userPost, userPut, userDelete } from "./api";
import { userPost } from "./api";

const userSlice = createSlice({
  name: "user",
  initialState: [{
    id: "",
    password: "",
    fullname: "",
    phone: "",
    email: "",
    createdate: "",
    avatar: "",
    resetPasswordToken: "",
    status: "idle",
    error: null,
  }],
  reducers: {
    // ...
  },
  extraReducers: (builder) => {
    builder
      .addCase(userPost.pending, (state) => {
        state.status = "loading";
      })
      .addCase(userPost.fulfilled, (state, action) => {
        state.url = action.payload;
        state.status = "idle";
      })
  },
});

export default userSlice;