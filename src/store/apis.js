import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// import jwt_decode from "jwt-decode";

// Get All Authorities => Custom list user with roles
export const authorityGetAll = createAsyncThunk("authorityGetAll", async () => {
  const response = await axios.get(`http://localhost:8080/api/v1/authorities`);
  return response.data;
});

// Get All Categories
export const categoriesGetAll = createAsyncThunk(
  "categoriesGetAll",
  async () => {
    const response = await axios.get(`http://localhost:8080/api/v1/categories`);
    return response.data;
  }
);

// Get All SubCategories
export const subCategoriesGetAll = createAsyncThunk(
  "subCategoriesGetAll",
  async () => {
    const response = await axios.get(
      `http://localhost:8080/api/v1/subCategories`
    );
    return response.data;
  }
);

// Upload Image To Cloud
export const uploadImageToCloud = createAsyncThunk(
  "uploadImageToCloud",
  async (dataURL) => {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        file: dataURL,
        upload_preset: `${process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET}`,
      }
    );
    return response.data.secure_url;
  }
);

// Get All Invoices
export const invoiceGetAll = createAsyncThunk("invoiceGetAll", async () => {
  const response = await axios.get(`http://localhost:8080/api/v1/shopOrders`);
  return response.data;
});

// Get All InvoiceDetails
export const invoiceDetailsGetAll = createAsyncThunk(
  "invoiceDetailsGetAll",
  async () => {
    const response = await axios.get(`http://localhost:8080/api/v1/orderDetails`);
    return response.data;
  }
);

// Login
export const login = createAsyncThunk(
  "login",
  async (credentials, { rejectWithValue }) => {
    try {
      const loginResponse = await axios.post(
        "http://localhost:8080/api/v1/auth/signin",
        credentials
      );

      const isAdmin = loginResponse.data.SHARE_USER.roles.find(
        (obj) => obj.authority === "ADMIN"
      );

      if (isAdmin) {
        sessionStorage.setItem(
          "accessToken",
          JSON.stringify(loginResponse.data.accessToken)
        );
        sessionStorage.setItem(
          "userLogedIn",
          JSON.stringify(loginResponse.data.SHARE_USER)
        );
        return loginResponse.data.SHARE_USER;
      } else {
        return null;
      }
    } catch (error) {
      if (error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        throw error;
      }
    }
  }
);

// Get User By Id
export const getUserById = createAsyncThunk("getUserById", async (id) => {
  const response = await axios.get(`http://localhost:8080/api/v1/users/${id}`);
  return response.data;
});

// Get All ProductItems
export const productItemGetAll = createAsyncThunk(
  "productItemGetAll",
  async () => {
    const response = await axios.get(`http://localhost:8080/api/v1/productItems`);
    return response.data;
  }
);

// Put invoice (status)
export const invoiceStatusPut = createAsyncThunk(
  "invoiceStatusPut",
  async (invoice) => {
    const response = await axios.put(
      `http://localhost:8080/api/v1/shopOrders/changeStatus`,
      invoice
    );
    return response.data;
  }
);

// Get All Products
export const productGetAll = createAsyncThunk("productGetAll", async () => {
  const response = await axios.get(`http://localhost:8080/api/v1/products`);
  return response.data;
});

// Change Password
export const changePassword = createAsyncThunk(
  "changePassword",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/auth/change-password",
        values
      );
      return response;
    } catch (error) {
      if (error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        throw error;
      }
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/auth/forgot-password",
        email
      );
      return response.data;
    } catch (error) {
      if (error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        throw error;
      }
    }
  }
);

export const resetPassword = createAsyncThunk(
  "resetPassword",
  async ({ password, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/v1/auth/reset-password`,
        { password, token }
      );
      return response.data;
    } catch (error) {
      if (error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        throw error;
      }
    }
  }
);

// Post user (Role = "ADMIN")
export const userPost = createAsyncThunk(
  "userPost",
  async (user, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/v1/users/create-admin`,
        user
      );
      return response.data;
    } catch (error) {
      if (error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        throw error;
      }
    }
  }
);

export const userPostAndUploadAvatarToCloud = createAsyncThunk(
  "userPostAndUploadAvatarToCloud",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/v1/users/create-admin-with-avatar`,
        values
      );
      return response.data;
    } catch (error) {
      if (error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        throw error;
      }
    }
  }
);

// Put user (Role = "ADMIN")
export const userPut = createAsyncThunk(
  "userPut",
  async (user, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/v1/users/update-admin`,
        user
      );
      return response.data;
    } catch (error) {
      if (error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        throw error;
      }
    }
  }
);

export const userPutAndUploadAvatarToCloud = createAsyncThunk(
  "userPutAndUploadAvatarToCloud",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/v1/users/update-admin-with-avatar`,
        values
      );
      return response.data;
    } catch (error) {
      if (error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        throw error;
      }
    }
  }
);

// Get All brand
export const brandGetAll = createAsyncThunk("brandGetAll/get", async () => {
  const response = await axios.get(`http://localhost:8080/api/v1/brands`);
  return response.data;
});

// Get All Contacts
export const contactGetAll = createAsyncThunk("contactGetAll", async () => {
  const response = await axios.get(`http://localhost:8080/api/v1/contacts`);
  return response.data;
});

// PUT CONTACT STATUS
export const contactStatusPut = createAsyncThunk(
  "contactStatusPut",
  async (contact) => {
    const abc = { ...contact };
    const response = await axios.put(
      `http://localhost:8080/api/v1/contacts/change-status`,
      abc
    );
    return response.data;
  }
);

// Get All option
export const getOptions = createAsyncThunk("option/getOptions", async () => {
  const response = await axios.get(`http://localhost:8080/api/v1/options`);
  return response.data;
});

// Create option
export const CreateOption = createAsyncThunk("option/CreateOption", async (option) => {
  const response = await axios.post(`http://localhost:8080/api/v1/options`, option);
  return response.data;
});

export const createOrUpdateProduct = createAsyncThunk(
  "product/createOrUpdateProduct",
  async (product) => {
    if (product.product.id === undefined) {
      const reponseProduct = await axios.post(
        "http://localhost:8080/api/v1/products",
        product.product
      );

      const proItem = product.productItem;
      proItem.product = reponseProduct.data;

      const reponseProductItem = await axios.post(
        "http://localhost:8080/api/v1/productItems",
        proItem
      );

      const prItem = reponseProductItem.data;
      for (let propName in product.option) {
        const confi = {
          productItem: reponseProductItem.data,
          option: product.option[propName]
        };
        
        await axios.post(
          "http://localhost:8080/api/v1/productConfigurations",
          confi
        );
        prItem[propName] = product.option[propName].value;
      }

      console.log("them product, productItem, option");
      
      

      const dataSent = {
        product: reponseProduct.data,
        productItem: prItem,
      };
      return dataSent;
    } else {
      if (product.image === true) {
        const response = await axios.put(
          "http://localhost:8080/api/v1/products",
          product.product
        );
        console.log("sua product co hinh");
        return response.data;
      } else {
        const response = await axios.post(
          "http://localhost:8080/api/v1/products",
          product.product
        );
        console.log("sua product khong hinh");

        return response.data;
      }
    }
  }
);

//productItem
export const createOrUpdateProductItem = createAsyncThunk(
  "productItem/createOrUpdate",
  async (item) => {
    if (item.check) {
      if(item.item.id === undefined){
        const itemResponse = await axios.post(
          "http://localhost:8080/api/v1/productItems",
          item.item
        );
        const newItem =  itemResponse.data;
        const listOp = item.listOp;
        const listConReponse = [];
        for (let op of listOp) {
          const confi = {
            productItem: newItem,
            option: op
          };
          
          const configureponse = await axios.post(
            "http://localhost:8080/api/v1/productConfigurations/createNewItem",
            confi
          );
          listConReponse.push(configureponse.data);
          newItem[op.variation.name] = op.value;
        }


        console.log("create item ok api");
        return {newItem, listConReponse};
      }else{
        const response = await axios.put(
          "http://localhost:8080/api/v1/productItems",
          item.item
        );
        console.log("update item and image ok api");
        return response.data;
      }
    } else {
      const response = await axios.post(
        "http://localhost:8080/api/v1/productItems",
        item.item
      );
      
      return response.data;
    }
  }
);

//get all variation
export const getAllVariation = createAsyncThunk(
  "Variation/getAllVariation",
  async () => {
    const response = await axios.get(
      `http://localhost:8080/api/v1/variations`
    );
    return response.data;
  }
);

//get all productConfiguration
export const getAllProductConfigurations = createAsyncThunk(
  "ProductConfiguration/getAllProductConfigurations",
  async () => {
    const response = await axios.get(
      `http://localhost:8080/api/v1/productConfigurations`
    );
    return response.data;
  }
);

export const updateProductConfigurations = createAsyncThunk(
  "ProductConfiguration/updateProductConfigurations",
  async (proCon) => {
    const response = await axios.put(
      `http://localhost:8080/api/v1/productConfigurations`, proCon
    );
    return response.data;
  }
);