import { createSlice } from "@reduxjs/toolkit";
import { getUserById, login } from "./api";
const loginSlice = createSlice({
  name: "productItem",
  initialState: {
    userLogedIn: null,
    loginStatus: null,
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
        if (action.payload.roles.includes("ADMIN")) {
          state.userLogedIn = action.payload;
          sessionStorage.setItem('userLogedIn', JSON.stringify(action.payload));
          state.loginStatus = "Successfully!";
        } else {
          state.userLogedIn = null;
          state.loginStatus = "Please login with admin account!";
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.userLogedIn = null;
        state.loginStatus = "Please check your email or password again!";
      })

      .addCase(getUserById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        const { password, ...userpayload } = action.payload;
        state.userLogedIn = userpayload;
        state.loginStatus = "Successfully!";
        state.status = "idle";
      });
  },
});

export default loginSlice;