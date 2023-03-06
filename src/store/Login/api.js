import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

export const login = createAsyncThunk('auth/signin', async (credentials) => {
    const response = await axios.post('http://localhost:8080/api/auth/signin', credentials);
    return response.data;
});

export const getUserById = createAsyncThunk('User/getById', async (id) => {
    const response = await axios.get(`http://localhost:8080/rest/users/${id}`);
    return response.data;
});