import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
const imageSlice = createSlice ({
  name: "image",
  initialState: {
    url: "",
    status: "idle",
    error: null,
  },
  reducers: {
    // ...
  },
  extraReducers: (builder) => {
    builder
      .addCase(confirmationClick.pending, (state) => {
        state.status = "loading";
      })
      .addCase(confirmationClick.fulfilled, (state, action) => {
        state.url = action.payload;
        state.status = "idle";
      })
  },
});

export const confirmationClick = createAsyncThunk('', async (formData) => {
    const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,formData);
    return res.data.secure_url;
});

export default imageSlice;