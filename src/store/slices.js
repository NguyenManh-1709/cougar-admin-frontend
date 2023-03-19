import { createSlice } from "@reduxjs/toolkit";
import {
  authorityGetAll,
  categoriesGetAll,
  subCategoriesGetAll,
  uploadImageToCloud,
  invoiceGetAll,
  invoiceDetailsGetAll,
  login,
  productItemGetAll,
  userPost,
  userPut,
  getUserById,
  invoiceStatusPut,
  productGetAll,
  userPostAndUploadAvatarToCloud,
  userPutAndUploadAvatarToCloud,
  changePassword,
  forgotPassword,
  resetPassword
} from "./apis";

const mySlice = createSlice({
  name: "mySlice",
  initialState: {
    usersWithRoles: [],
    categories: [],
    subCategories: [],
    urlImageUploaded: "",
    invoices: [],
    invoiceDetails: [],
    userLogedIn: null,
    loginStatus: false,
    productItems: [],
    products: [],
  },
  reducers: {
    // ...
    logout: (state) => {
      state.usersWithRoles = [];
      state.categories = [];
      state.subCategories = [];
      state.urlImageUploaded = "";
      state.invoices = [];
      state.invoiceDetails = [];
      state.userLogedIn = null;
      state.loginStatus = false;
      state.productItems = [];
      state.products = [];
    },
  },

  extraReducers: (builder) => {
    builder

      // DO LOG IN
      .addCase(login.fulfilled, (state, action) => {
        if (action.payload === null) {
          state.userLogedIn = null;
          state.loginStatus = false;
        } else {
          state.userLogedIn = action.payload;
          state.loginStatus = true;
        }
      })
      .addCase(login.rejected, (state) => {
        state.userLogedIn = null;
        state.loginStatus = false;
      })

      // RELOAD USER LOGED IN INFO WHEN F5
      .addCase(getUserById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        const { password, ...temp } = action.payload;
        state.userLogedIn = temp;
        state.loginStatus = true;
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

        const updatedArr = state.invoiceDetails.map(invoiceDetails => {
          if (invoiceDetails.shopOrder.id === invoiceUpdated.id) {
            return { ...invoiceDetails, shopOrder: invoiceUpdated };
          }
          return invoiceDetails;
        });
        state.invoiceDetails = updatedArr;

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

      // UPLOAD PRODUCT IMAGE TO CLOUD
      .addCase(uploadImageToCloud.pending, (state) => {
        state.status = "loading";
      })
      .addCase(uploadImageToCloud.fulfilled, (state, action) => {
        state.urlImageUploaded = action.payload;
        state.status = "idle";
      })

      // CREATE USER (ROLE ADMIN)
      .addCase(userPost.fulfilled, (state, action) => {
        const userSaved = action.payload;
        userSaved.role = ["ADMIN"];
        state.usersWithRoles.push(userSaved);
        state.status = "idle";
      })
      .addCase(userPost.rejected, (state, action) => {
      })

      // CREATE USER (ROLE ADMIN) AND UPLOAD AVATAR TO CLOUD
      .addCase(userPostAndUploadAvatarToCloud.fulfilled, (state, action) => {
        const userSaved = action.payload;
        userSaved.role = ["ADMIN"];
        state.usersWithRoles.push(userSaved);
        state.status = "idle";
      })
      .addCase(userPostAndUploadAvatarToCloud.rejected, (state, action) => {
      })

      // UPDATE USER (ROLE ADMIN)
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
      .addCase(userPut.rejected, (state, action) => {
      })

      // UPDATE USER (ROLE ADMIN) AND UPLOAD AVATAR TO CLOUD
      .addCase(userPutAndUploadAvatarToCloud.fulfilled, (state, action) => {
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
      .addCase(userPutAndUploadAvatarToCloud.rejected, (state, action) => {
      })

      // GET ALL PRODUCTS
      .addCase(productGetAll.pending, (state) => {
        state.status = "loading";
      })
      .addCase(productGetAll.fulfilled, (state, action) => {
        state.products = action.payload;
        state.status = "idle";
      })

      // CHANGE PASSWORD
      .addCase(changePassword.fulfilled, (state, action) => {
      })
      .addCase(changePassword.rejected, (state, action) => {
      })

      //FORGOT PASSWORD
      .addCase(forgotPassword.fulfilled, (state, action) => {
      })
      .addCase(forgotPassword.rejected, (state, action) => {
      })

      //RESET PASSWORD
      .addCase(resetPassword.fulfilled, (state, action) => {
      })
      .addCase(resetPassword.rejected, (state, action) => {
      });
  },
});

export default mySlice;