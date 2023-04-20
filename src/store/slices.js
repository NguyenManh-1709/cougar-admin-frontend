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
  resetPassword,
  brandGetAll,
  contactGetAll,
  contactStatusPut,
  getOptions,
  createOrUpdateProductItem,
  createOrUpdateProduct,
  CreateOption,
  getAllVariation,
  getAllProductConfigurations,
  updateProductConfigurations
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
    brands: [],
    contacts: [],
    options: [],
    variations: [],
    configurations: []
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
      state.brands = [];
      state.options = [];
      state.variations = [];
      state.configurations = [];
    },

    updateProItem: (state, action)=>{
      state.productItems.forEach((ite, index)=>{
        action.payload.forEach((i)=>{
          if(ite.id === i.id){
            state.productItems.splice(index, 1, i);
          }
        })
      })
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
          const userIndex = users.findIndex((item) => item.id === user.id);
          if (userIndex === -1) {
            users.push({
              ...user,
              role: [role.name],
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
        state.invoices = action.payload.filter(item => item.orderStatus !== null);
        state.status = "idle";
      })

      // Put invoiceStatus
      .addCase(invoiceStatusPut.pending, (state) => {
        state.status = "loading";
      })
      .addCase(invoiceStatusPut.fulfilled, (state, action) => {
        const invoiceUpdated = action.payload;
        state.invoices = state.invoices.map((item) =>
          item.id === invoiceUpdated.id ? invoiceUpdated : item
        );

        const updatedArr = state.invoiceDetails.map((invoiceDetails) => {
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
      .addCase(userPost.rejected, (state, action) => {})

      // CREATE USER (ROLE ADMIN) AND UPLOAD AVATAR TO CLOUD
      .addCase(userPostAndUploadAvatarToCloud.fulfilled, (state, action) => {
        const userSaved = action.payload;
        userSaved.role = ["ADMIN"];
        state.usersWithRoles.push(userSaved);
        state.status = "idle";
      })
      .addCase(userPostAndUploadAvatarToCloud.rejected, (state, action) => {})

      // UPDATE USER (ROLE ADMIN)
      .addCase(userPut.fulfilled, (state, action) => {
        const userUpdated = action.payload;
        const updatedArr = state.usersWithRoles.map((item) => {
          if (item.id === userUpdated.id) {
            return { ...userUpdated, role: item.role };
          }
          return item;
        });

        state.usersWithRoles = updatedArr;
        state.status = "successfully";
      })
      .addCase(userPut.rejected, (state, action) => {})

      // UPDATE USER (ROLE ADMIN) AND UPLOAD AVATAR TO CLOUD
      .addCase(userPutAndUploadAvatarToCloud.fulfilled, (state, action) => {
        const userUpdated = action.payload;
        const updatedArr = state.usersWithRoles.map((item) => {
          if (item.id === userUpdated.id) {
            return { ...userUpdated, role: item.role };
          }
          return item;
        });

        state.usersWithRoles = updatedArr;
        state.status = "successfully";
      })
      .addCase(userPutAndUploadAvatarToCloud.rejected, (state, action) => {})

      // GET ALL PRODUCTS
      .addCase(productGetAll.pending, (state) => {
        state.status = "loading";
      })
      .addCase(productGetAll.fulfilled, (state, action) => {
        state.products = action.payload;
        state.status = "idle";
      })

      // CHANGE PASSWORD
      .addCase(changePassword.fulfilled, (state, action) => {})
      .addCase(changePassword.rejected, (state, action) => {})

      // FORGOT PASSWORD
      .addCase(forgotPassword.fulfilled, (state, action) => {})
      .addCase(forgotPassword.rejected, (state, action) => {})

      // RESET PASSWORD
      .addCase(resetPassword.fulfilled, (state, action) => {})
      .addCase(resetPassword.rejected, (state, action) => {})

      //get all brand
      .addCase(brandGetAll.fulfilled, (state, action) => {
        state.brands = action.payload;
        state.status = "Successed";
      })

      .addCase(brandGetAll.rejected, (state) => {
        state.status = "Error";
      })

      // GET ALL CONTACTS
      .addCase(contactGetAll.pending, (state) => {
        state.status = "loading";
      })
      .addCase(contactGetAll.fulfilled, (state, action) => {
        state.contacts = action.payload;
        state.status = "idle";
      })

      // PUT CONTACT STATUS
      .addCase(contactStatusPut.pending, (state) => {
        state.status = "loading";
      })
      .addCase(contactStatusPut.fulfilled, (state, action) => {
        const contactUpdated = action.payload;
        state.contacts = state.contacts.map((item) =>
          item.id === contactUpdated.id ? contactUpdated : item
        );

        state.status = "idle";
      })

      //get Options
      .addCase(getOptions.fulfilled, (state, action) => {
        state.options = action.payload;
        state.status = "Successed";
      })

      .addCase(getOptions.rejected, (state) => {
        state.status = "Error";
      })

      //get all variation
      .addCase(getAllVariation.fulfilled, (state, action) => {
        state.variations = action.payload;
        state.status = "Successed";
      })

      .addCase(getAllVariation.rejected, (state) => {
        state.status = "Error";
      })


      //get all productConfiguration
      .addCase(getAllProductConfigurations.fulfilled, (state, action) => {
        state.configurations = action.payload;
        state.status = "Successed";
      })

      .addCase(getAllProductConfigurations.rejected, (state) => {
        state.status = "Error";
      })

      //Create Options
      .addCase(CreateOption.fulfilled, (state, action) => {
        state.options.push(action.payload);
        state.status = "Successed";
      })

      .addCase(CreateOption.rejected, (state) => {
        state.status = "Error";
      })

      //create or update product
      .addCase(createOrUpdateProduct.fulfilled, (state, action) => {
        const product = action.payload;
        
        if (product.productItem === undefined) {
          const date = new Date(product.createDate);
          const day = date.getDate().toString().padStart(2, "0");
          const month = (date.getMonth() + 1).toString().padStart(2, "0");
          const year = date.getFullYear().toString();
          const formattedDate = `${year}-${month}-${day}`;
          product.createDate = formattedDate;

          const exist = state.products.find((proI) => proI.id === product.id);

          if (exist) {
            Object.assign(exist, product);
            console.log("sua product slice");
          }
        }else{
          const pro = product.product;
          const date = new Date(pro.createDate);
          const day = date.getDate().toString().padStart(2, "0");
          const month = (date.getMonth() + 1).toString().padStart(2, "0");
          const year = date.getFullYear().toString();
          const formattedDate = `${year}-${month}-${day}`;
          pro.createDate = formattedDate;

          const proI = product.productItem;
          const dateI = new Date(proI.createDate);
          const dayI = dateI.getDate().toString().padStart(2, "0");
          const monthI = (dateI.getMonth() + 1).toString().padStart(2, "0");
          const yearI = dateI.getFullYear().toString();
          const formattedDateI = `${yearI}-${monthI}-${dayI}`;
          proI.createDate = formattedDateI;




          state.products.push(pro);
          state.productItems.push(proI);
          console.log("them product slice");
          
        }

        state.status = "Successed";
      })

      .addCase(createOrUpdateProduct.rejected, (state, action) => {
        state.status = action.error.message;
      })

      //create Or Update ProductItem
      .addCase(createOrUpdateProductItem.fulfilled, (state, action) => {
        var productItem = {};

        if(action.payload.listConReponse){
          productItem = action.payload.newItem;
          action.payload.listConReponse.forEach(con=>{
            state.configurations.push(con);
          })
        }else{
          productItem = action.payload;
        }
        
        

        const date = new Date(productItem.createDate);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear().toString();
        const formattedDate = `${year}-${month}-${day}`;
        productItem.createDate = formattedDate;

        const exist = state.productItems.find(
          (proI) => proI.id === productItem.id
        );

        if (exist) {
          Object.assign(exist, productItem);
          console.log("sua product item slice");
        } else {
          state.productItems.push(productItem);
          console.log("them product item slice");
        }
        state.status = "Successed";
      })

      .addCase(createOrUpdateProductItem.rejected, (state, action) => {
        state.status = action.error.message;
      })

      //update update Product Configurations
      .addCase(updateProductConfigurations.fulfilled, (state, action)=>{
        const confi = action.payload;
        const exist = state.configurations.find(
          (con) => con.id === confi.id
        );

        if (exist) {
          Object.assign(exist, confi);
          console.log("sua product configuation slice");
        } 
      })

      .addCase(updateProductConfigurations.rejected, (state, action)=>{
        console.log("Khong sua dc product Configuation");
      })
  },
});

export default mySlice;
