import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

export const authorityGetAll = createAsyncThunk('authority/getAll', async () => {
    const response = await axios.get(`http://localhost:8080/rest/authorities`);
    return response.data;
});