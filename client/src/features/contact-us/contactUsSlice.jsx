import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axios";

export const contactUs = createAsyncThunk(
  "api/contactUs",
  async (formData, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        "/api/contact/send-message",
        formData,
      );
      if (!response) {
        return thunkAPI.rejectWithValue("No response from server");
      }
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Contact Us failed",
      );
    }
  },
);

const contactUsSlice = createSlice({
  name: "contact-us",
  initialState: {
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    resetContactUs: (state) => {
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(contactUs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(contactUs.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Message sent successfully";
        state.error = null;
      })
      .addCase(contactUs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to send message";
        state.message = null;
      });
  },
});

export const { resetContactUs } = contactUsSlice.actions;
export default contactUsSlice.reducer;
