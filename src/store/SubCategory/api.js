import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

export const subCategoriesGetAll = createAsyncThunk('subCategories/getAll', async () => {
    const response = await axios.get(`http://localhost:8080/rest/subCategories`);
    return response.data;
});