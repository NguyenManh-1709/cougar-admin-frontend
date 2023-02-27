import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

export const userGetAll = createAsyncThunk('user/getAll', async () => {
    const response = await axios.get(`API`);
    return response;
});

export const userGetById = createAsyncThunk('user/getById', async (user) => {
    const response = await axios.get(`API/${user.id}`);
    return response;
});

export const userPost = createAsyncThunk('user/post', async (user) => {
    const response = await axios.post(`API`, user);
    return response;
});

export const userPut = createAsyncThunk('user/put', async (user) => {
    const response = await axios.put(`API/${user.id}`, user);
    return response;
});

export const userDelete = createAsyncThunk('user/delete', async (user) => {
    await axios.delete(`API/${user.id}`);
    return user.id;
});

