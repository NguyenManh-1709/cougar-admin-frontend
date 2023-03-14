import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

// Get All Authorities => Custom list user with roles
export const authorityGetAll = createAsyncThunk('authorityGetAll', async () => {
  const response = await axios.get(`http://localhost:8080/rest/authorities`);
  return response.data;
});

// Get All Categories
export const categoriesGetAll = createAsyncThunk('categoriesGetAll', async () => {
  const response = await axios.get(`http://localhost:8080/rest/categories`);
  return response.data;
});

// Get All SubCategories
export const subCategoriesGetAll = createAsyncThunk('subCategoriesGetAll', async () => {
  const response = await axios.get(`http://localhost:8080/rest/subCategories`);
  return response.data;
});

// Upload Image To Cloud
export const uploadImageToCloud = createAsyncThunk('uploadImageToCloud', async (dataURL) => {
  const response = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`, {
    file: dataURL,
    upload_preset: `${process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET}`,
  });
  return response.data.secure_url;
});

// Get All Invoices
export const invoiceGetAll = createAsyncThunk('invoiceGetAll', async () => {
  const response = await axios.get(`http://localhost:8080/rest/shopOrders`);
  return response.data;
});

// Get All InvoiceDetails
export const invoiceDetailsGetAll = createAsyncThunk('invoiceDetailsGetAll', async () => {
  const response = await axios.get(`http://localhost:8080/rest/orderDetails`);
  return response.data;
});

// Login
export const login = createAsyncThunk('login', async (credentials) => {
  const response = await axios.post('http://localhost:8080/api/auth/signin', credentials);
  return response.data;
});

// Get User By Id
export const getUserById = createAsyncThunk('getUserById', async (id) => {
  const response = await axios.get(`http://localhost:8080/rest/users/${id}`);
  return response.data;
});

// Get All ProductItems
export const productItemGetAll = createAsyncThunk('productItemGetAll', async () => {
  const response = await axios.get(`http://localhost:8080/rest/productItems`);
  return response.data;
});

// Post user (Role = "ADMIN")
export const userPost = createAsyncThunk('userPost', async (user) => {
  const response = await axios.post(`http://localhost:8080/rest/users`, user);
  return response.data;
});

// const cloudinary = require('cloudinary').v2;
// cloudinary.config({
//   cloud_name: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.REACT_APP_CLOUDINARY_API_KEY,
//   api_secret: process.env.REACT_APP_CLOUDINARY_API_SECRET,
// });
export const userPostAndUploadAvatarToCloud = createAsyncThunk('userPostAndUploadAvatarToCloud', async ([values, dataURL]) => {
  // CREATE NEW USER
  const userRes = await axios.post(`http://localhost:8080/rest/users`, values);

  // CREATE FormData (to custom name) AND UPLOAD TO CLOUD
  const formData = new FormData();
  formData.append('file', dataURL);
  formData.append('upload_preset', `${process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET}`);
  formData.append('public_id', `avatar-user-id-${userRes.data.id}`);
      // formData.append('overwrite', true);
  const avatarRes = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  // UPDATE USER WITH AVATAR
  const url = avatarRes.data.secure_url.replace(`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/`, "");
  const userUpdated = { ...userRes.data, avatar: url };
  const response = await axios.put(`http://localhost:8080/rest/users`, userUpdated);

  return response.data;
});

// Put user (Role = "ADMIN")
export const userPut = createAsyncThunk('userPut', async (user) => {
  const response = await axios.put(`http://localhost:8080/rest/users`, user);
  return response.data;
});

export const userPutAndUploadAvatarToCloud = createAsyncThunk('userPutAndUploadAvatarToCloud', async ([values, dataURL]) => {
  // CREATE FormData (to custom name) AND UPLOAD TO CLOUD
  const formData = new FormData();
  formData.append('file', dataURL);
  formData.append('upload_preset', `${process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET}`);
  formData.append('public_id', `avatar-user-id-${values.id}`);
      // formData.append('overwrite', true);
  const avatarRes = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  // UPDATE USER WITH AVATAR
  const url = avatarRes.data.secure_url.replace(`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/`, "");
  const userUpdated = { ...values, avatar: url };
  const response = await axios.put(`http://localhost:8080/rest/users`, userUpdated);

  return response.data;
});

// Put invoice (status)
export const invoiceStatusPut = createAsyncThunk('invoiceStatusPut', async (invoice) => {
  const response = await axios.put(`http://localhost:8080/rest/shopOrders/changeStatus`, invoice);
  return response.data;
});

// Get All Products
export const productGetAll = createAsyncThunk('productGetAll', async () => {
  const response = await axios.get(`http://localhost:8080/rest/products`);
  return response.data;
});