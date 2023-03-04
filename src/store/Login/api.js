import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

export const login = createAsyncThunk('login', async () => {
    const response = await axios.get(`http://localhost:8080/`);
    return response.data;
});