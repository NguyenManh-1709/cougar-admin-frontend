import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

export const invoiceGetAll = createAsyncThunk('invoice/getAll', async () => {
    const response = await axios.get(`http://localhost:8080/rest/shopOrders`);
    return response.data;
});