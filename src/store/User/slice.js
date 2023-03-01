import { createSlice } from "@reduxjs/toolkit";
import { userPost, userPut } from "./api";
import { authorityGetAll } from "../Authority/api";

const userSlice = createSlice({
  name: "user",
  initialState: {
    customListOfUsersWithRoles: []
  },
  reducers: {
    // ...
  },
  extraReducers: (builder) => {
    builder
      // GET AUTHORITIES
      .addCase(authorityGetAll.pending, (state) => {
        state.status = "loading";
      })
      .addCase(authorityGetAll.fulfilled, (state, action) => {
        const authorities = action.payload;

        const customListOfUsersWithRoles = authorities.reduce((users, auth) => {
          const userIndex = users.findIndex(u => u.id === auth.user.id);
          if (userIndex === -1) {
            users.push({
              ...auth.user,
              role: [auth.role.name]
            });
          } else {
            users[userIndex].role.push(auth.role.name);
          }
          return users;
        }, []);

        state.customListOfUsersWithRoles = customListOfUsersWithRoles;
        state.status = "idle";
      })

      // CREATE
      .addCase(userPost.pending, (state) => {
        state.status = "loading";
      })
      .addCase(userPost.fulfilled, (state, action) => {
        const userSaved = action.payload;
        userSaved.role = "ADMIN";
        state.customListOfUsersWithRoles.push(userSaved);
        state.status = "idle";
      })

      // UPDATE
      .addCase(userPut.pending, (state) => {
        state.status = "loading";
      })
      .addCase(userPut.fulfilled, (state, action) => {
        const userUpdated = action.payload;
        const updatedArr = state.customListOfUsersWithRoles.map(item => {
          if (item.id === userUpdated.id) {
            return { ...userUpdated, role: item.role };
          }
          return item;
        });

        state.customListOfUsersWithRoles = updatedArr;
        state.status = "successfully";
      })
  },
});

export default userSlice;