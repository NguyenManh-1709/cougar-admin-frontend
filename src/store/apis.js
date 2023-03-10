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

export const uploadAvatarToCloud = createAsyncThunk('uploadAvatarToCloud', async (dataURL) => {
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

// Put user (Role = "ADMIN")
export const userPut = createAsyncThunk('userPut', async (user) => {
  const response = await axios.put(`http://localhost:8080/rest/users`, user);
  return response.data;
});