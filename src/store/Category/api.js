import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

export const categoriesGetAll = createAsyncThunk('categories/getAll', async () => {
    const response = await axios.get(`http://localhost:8080/rest/categories`);
    return response.data;
});