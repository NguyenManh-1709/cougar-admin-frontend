import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

export const invoiceDetailsGetAll = createAsyncThunk('invoiceDetails/getAll', async () => {
    const response = await axios.get(`http://localhost:8080/rest/orderDetails`);
    return response.data;
});