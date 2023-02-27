import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
const imageSlice = createSlice({
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

export const confirmationClick = createAsyncThunk('image/confirmationClick', async (dataURL) => {
  const response = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`, {
    file: dataURL,
    upload_preset: `${process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET}`,
  });
  return response.data.secure_url;
});

export default imageSlice;