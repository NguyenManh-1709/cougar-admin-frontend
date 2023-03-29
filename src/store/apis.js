import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// import jwt_decode from "jwt-decode";

// Get All Authorities => Custom list user with roles
export const authorityGetAll = createAsyncThunk("authorityGetAll", async () => {
  const response = await axios.get(`http://localhost:8080/rest/authorities`);
  return response.data;
});

// Get All Categories
export const categoriesGetAll = createAsyncThunk(
  "categoriesGetAll",
  async () => {
    const response = await axios.get(`http://localhost:8080/rest/categories`);
    return response.data;
  }
);

// Get All SubCategories
export const subCategoriesGetAll = createAsyncThunk(
  "subCategoriesGetAll",
  async () => {
    const response = await axios.get(
      `http://localhost:8080/rest/subCategories`
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
  const response = await axios.get(`http://localhost:8080/rest/shopOrders`);
  return response.data;
});

// Get All InvoiceDetails
export const invoiceDetailsGetAll = createAsyncThunk(
  "invoiceDetailsGetAll",
  async () => {
    const response = await axios.get(`http://localhost:8080/rest/orderDetails`);
    return response.data;
  }
);

// Login
export const login = createAsyncThunk(
  "login",
  async (credentials, { rejectWithValue }) => {
    try {
      const loginResponse = await axios.post(
        "http://localhost:8080/api/auth/signin",
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
  const response = await axios.get(`http://localhost:8080/api/users/${id}`);
  return response.data;
});

// Get All ProductItems
export const productItemGetAll = createAsyncThunk(
  "productItemGetAll",
  async () => {
    const response = await axios.get(`http://localhost:8080/rest/productItems`);
    return response.data;
  }
);

// Put invoice (status)
export const invoiceStatusPut = createAsyncThunk(
  "invoiceStatusPut",
  async (invoice) => {
    const response = await axios.put(
      `http://localhost:8080/rest/shopOrders/changeStatus`,
      invoice
    );
    return response.data;
  }
);

// Get All Products
export const productGetAll = createAsyncThunk("productGetAll", async () => {
  const response = await axios.get(`http://localhost:8080/rest/products`);
  return response.data;
});

// Change Password
export const changePassword = createAsyncThunk(
  "changePassword",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/change-password",
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
        "http://localhost:8080/api/auth/forgot-password",
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
        `http://localhost:8080/api/auth/reset-password`,
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
        `http://localhost:8080/api/users/create-admin`,
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
        `http://localhost:8080/api/users/create-admin-with-avatar`,
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
        `http://localhost:8080/api/users/update-admin`,
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
        `http://localhost:8080/api/users/update-admin-with-avatar`,
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
  const response = await axios.get(`http://localhost:8080/api/brands`);
  return response.data;
});

// Get All Contacts
export const contactGetAll = createAsyncThunk("contactGetAll", async () => {
  const response = await axios.get(`http://localhost:8080/api/contacts`);
  return response.data;
});

// PUT CONTACT STATUS
export const contactStatusPut = createAsyncThunk(
  "contactStatusPut",
  async (contact) => {
    const abc = { ...contact };
    const response = await axios.put(
      `http://localhost:8080/api/contacts/change-status`,
      abc
    );
    return response.data;
  }
);

// Get All option
export const getOptions = createAsyncThunk("option/getOptions", async () => {
  const response = await axios.get(`http://localhost:8080/rest/options`);
  return response.data;
});


export const createOrUpdateProduct = createAsyncThunk(
  "product/createOrUpdateProduct",
  async (product) => {
    if (product.product.id === undefined) {
      const response = await axios.post(
        "http://localhost:8080/api/products",
        product.product
      );
      console.log("them product");

      return response.data;
    } else {
      if (product.image === true) {
        const response = await axios.put(
          "http://localhost:8080/api/products",
          product.product
        );
        console.log("sua product co hinh");
        return response.data;
      } else {
        const response = await axios.post(
          "http://localhost:8080/api/products",
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
      const response = await axios.put(
        "http://localhost:8080/api/productItems",
        item.item
      );
      console.log("update item and image ok api");
      return response.data;
    } else {
      const response = await axios.post(
        "http://localhost:8080/api/productItems",
        item.item
      );
      alert("update item no image ok-api");
      return response.data;
    }
  }
);


