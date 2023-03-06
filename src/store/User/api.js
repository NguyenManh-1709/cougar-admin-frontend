import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

export const userGetAll = createAsyncThunk('user/getAll', async () => {
    const response = await axios.get(`http://localhost:8080/rest/users`);
    return response.data;
});

export const userGetAdminOnly = createAsyncThunk('user/getAdminOnly', async () => {
    const response = await axios.get(`http://localhost:8080/rest/users/is-admin`);
    return response.data;
});

export const userGetUserOnly = createAsyncThunk('user/getUserOnly', async () => {
    const response = await axios.get(`http://localhost:8080/rest/users/is-user`);
    return response.data;
});

export const userPost = createAsyncThunk('user/post', async (user) => {
    const response = await axios.post(`http://localhost:8080/rest/users`, user);
    return response.data;
});

export const userPut = createAsyncThunk('user/put', async (user) => {
    const response = await axios.put(`http://localhost:8080/rest/users`, user);
    return response.data;
});

