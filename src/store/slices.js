import { createSlice } from "@reduxjs/toolkit";
import {
  authorityGetAll,
  categoriesGetAll,
  subCategoriesGetAll,
  uploadImageToCloud,
  uploadAvatarToCloud,
  invoiceGetAll,
  invoiceDetailsGetAll,
  login,
  productItemGetAll,
  userPost,
  userPut,
  getUserById,
  invoiceStatusPut,
  productGetAll,
} from "./apis";

const mySlice = createSlice({
  name: "mySlice",
  initialState: {
    usersWithRoles: [],
    categories: [],
    subCategories: [],
    urlImageUploaded: "",
    urlAvatarUploaded: "",
    invoices: [],
    invoiceDetails: [],
    userLogedIn: null,
    loginStatus: null,
    productItems: [],
    products: []
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

      .addCase(login.rejected, (state) => {
        state.userLogedIn = null;
        state.loginStatus = "Please check your email or password again!";
      })

      // RELOAD USER LOGED IN INFO WHEN F5
      .addCase(getUserById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        const { password, ...temp } = action.payload;
        state.userLogedIn = temp;
        state.loginStatus = "Successfully!";
        state.status = "idle";
      })

      // GET ALL AUTHORITIES => usersWithRoles
      .addCase(authorityGetAll.pending, (state) => {
        state.status = "loading";
      })

      .addCase(authorityGetAll.fulfilled, (state, action) => {
        const authorities = action.payload;

        const usersWithRoles = authorities.reduce((users, auth) => {
          const { user, role } = auth;
          const userIndex = users.findIndex(item => item.id === user.id);
          if (userIndex === -1) {
            users.push({
              ...user,
              role: [role.name]
            });
          } else {
            users[userIndex].role.push(role.name);
          }
          return users;
        }, []);
        state.usersWithRoles = usersWithRoles;
        state.status = "idle";
      })

      // GET ALL CATEGORIES
      .addCase(categoriesGetAll.pending, (state) => {
        state.status = "loading";
      })
      .addCase(categoriesGetAll.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.status = "idle";
      })

      // GET ALL SUB CATEGORIES
      .addCase(subCategoriesGetAll.pending, (state) => {
        state.status = "loading";
      })
      .addCase(subCategoriesGetAll.fulfilled, (state, action) => {
        state.subCategories = action.payload;
        state.status = "idle";
      })

      // GET ALL INVOICES
      .addCase(invoiceGetAll.pending, (state) => {
        state.status = "loading";
      })
      .addCase(invoiceGetAll.fulfilled, (state, action) => {
        state.invoices = action.payload;
        state.status = "idle";
      })

      // Put invoiceStatus
      .addCase(invoiceStatusPut.pending, (state) => {
        state.status = "loading";
      })
      .addCase(invoiceStatusPut.fulfilled, (state, action) => {
        const invoiceUpdated = action.payload;
        state.invoices = state.invoices.map(item => item.id === invoiceUpdated.id ? invoiceUpdated : item);
        state.status = "idle";
      })

      // GET ALL INVOICE DETAILS
      .addCase(invoiceDetailsGetAll.pending, (state) => {
        state.status = "loading";
      })
      .addCase(invoiceDetailsGetAll.fulfilled, (state, action) => {
        state.invoiceDetails = action.payload;
        state.status = "idle";
      })

      // GET ALL PRODUCT ITEMS
      .addCase(productItemGetAll.pending, (state) => {
        state.status = "loading";
      })
      .addCase(productItemGetAll.fulfilled, (state, action) => {
        const temp = action.payload.reduce((accumulator, currentValue) => {
          const { color, size, ...rest } = currentValue;
          const newProductItem = rest.productItem;
          newProductItem.color = currentValue.color;
          newProductItem.size = currentValue.size;
          accumulator.push(newProductItem);
          return accumulator;
        }, []);
        state.productItems = temp;
        state.status = "idle";
      })

      // UPLOAD AVATAR TO CLOUD
      .addCase(uploadAvatarToCloud.pending, (state) => {
        state.status = "loading";
      })
      .addCase(uploadAvatarToCloud.fulfilled, (state, action) => {
        state.urlAvatarUploaded = action.payload;
        state.status = "idle";
      })

      // UPLOAD PRODUCT IMAGE TO CLOUD
      .addCase(uploadImageToCloud.pending, (state) => {
        state.status = "loading";
      })
      .addCase(uploadImageToCloud.fulfilled, (state, action) => {
        state.urlImageUploaded = action.payload;
        state.status = "idle";
      })

      // CREATE USER (ROLE ADMIN)
      .addCase(userPost.pending, (state) => {
        state.status = "loading";
      })
      .addCase(userPost.fulfilled, (state, action) => {
        const userSaved = action.payload;
        userSaved.role = ["ADMIN"];
        state.usersWithRoles.push(userSaved);
        state.status = "idle";
      })

      // UPDATE USER (ROLE ADMIN)
      .addCase(userPut.pending, (state) => {
        state.status = "loading";
      })
      .addCase(userPut.fulfilled, (state, action) => {
        const userUpdated = action.payload;
        const updatedArr = state.usersWithRoles.map(item => {
          if (item.id === userUpdated.id) {
            return { ...userUpdated, role: item.role };
          }
          return item;
        });

        state.usersWithRoles = updatedArr;
        state.status = "successfully";
      })

      // GET ALL PRODUCTS
      .addCase(productGetAll.pending, (state) => {
        state.status = "loading";
      })
      .addCase(productGetAll.fulfilled, (state, action) => {
        state.products = action.payload;
        state.status = "idle";
      })
  },
});

export default mySlice;