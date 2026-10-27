import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axios";

// CREATE COMMENT
export const createComment = createAsyncThunk(
  "comments/createComment",
  async ({ courseId, text }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/api/comments/${courseId}`, {
        text,
      });
      console.log("Comment created successfully:", res.data);
      return res.data;
    } catch (err) {
      console.error(
        "Error creating comment:",
        err.response?.data || err.message
      );
      return rejectWithValue(err.response?.data || "Failed to create comment");
    }
  }
);

// GET COMMENTS by Course
export const getComments = createAsyncThunk(
  "comments/getComments",
  async (courseId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/api/comments/${courseId}`);
      console.log("Comments fetched:", res.data);
      return res.data.comments;
    } catch (err) {
      console.error(
        "Error fetching comments:",
        err.response?.data || err.message
      );
      return rejectWithValue(err.response?.data || "Failed to fetch comments");
    }
  }
);

// GET ALL COMMENTS (Admin/Instructor)
export const getAllComments = createAsyncThunk(
  "comments/getAllComments",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/api/comments/all");
      console.log("All comments fetched:", res.data);
      return res.data.comments;
    } catch (err) {
      console.error(
        "Error fetching all comments:",
        err.response?.data || err.message
      );
      return rejectWithValue(
        err.response?.data || "Failed to fetch all comments"
      );
    }
  }
);

export const updateComment = createAsyncThunk(
  "comments/updateComment",
  async ({ id, text }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/api/comments/${id}`, { text });
      return response.data.comment;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || error.message || "Failed to update comment",
      );
    }
  },
);

export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/comments/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || error.message || "Failed to delete comment",
      );
    }
  },
);

// SLICE
const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    comments: [],
    status: "idle",
    error: null,
  },
  // this is for local state management
  // it will not affect the global state
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createComment.fulfilled, (state, action) => {
        const newComment = action.payload.comment;
        if (Array.isArray(state.comments)) {
          state.comments.unshift(newComment);
        } else {
          state.comments = [newComment];
        }
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.comments = state.comments.map((comment) =>
          comment._id === action.payload._id ? action.payload : comment,
        );
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(
          (comment) => comment._id !== action.payload,
        );
      })
      .addCase(getComments.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.comments = action.payload;
      })
      .addCase(getComments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getAllComments.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllComments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.comments = action.payload; // ✅ fixed
      })
      .addCase(getAllComments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default commentsSlice.reducer;
