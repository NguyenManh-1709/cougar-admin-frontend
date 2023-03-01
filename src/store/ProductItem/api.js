import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

export const productItemGetAll = createAsyncThunk('productItem/getAll', async () => {
    const response = await axios.get(`http://localhost:8080/rest/productItems`);
    return response.data;
});