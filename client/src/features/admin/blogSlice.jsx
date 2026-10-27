// -----------------------
// features/admin/blogSlice.js
// -----------------------
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axios";

// THUNKS
export const createBlogThunk = createAsyncThunk(
  "blogs/createBlog",
  async (formData, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/api/blogs", formData, {
        // Let the browser set the multipart boundary for FormData.
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.details ||
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Error creating blog",
      );
    }
  },
);

export const fetchBlogs = createAsyncThunk(
  "blogs/fetch-blogs",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/api/blogs");
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const getBlogById = createAsyncThunk(
  "blogs/getBlogById",
  async (id, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/api/blogs/${id}`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch blog",
      );
    }
  },
);

export const updateBlog = createAsyncThunk(
  "blogs/updateBlog",
  async ({ id, blogData }, thunkAPI) => {
    try {
      const response = await axiosInstance.put(`/api/blogs/${id}`, blogData, {
        // Let the browser set the multipart boundary for FormData.
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update blog",
      );
    }
  },
);

export const deleteBlog = createAsyncThunk(
  "blogs/deleteBlog",
  async (id, thunkAPI) => {
    try {
      await axiosInstance.delete(`/api/blogs/${id}`);
      return { _id: id };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// Async thunk to increment view count
export const incrementViewCount = createAsyncThunk(
  "blogs/incrementViewCount",
  async (blogId, thunkAPI) => {
    try {
      // You can make an API call here or handle it locally
      return blogId; // Return the blog ID if you want to update locally

      // OR make API call if you want to update on server:
      // return await blogService.incrementViewCount(blogId);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    blogs: [],
    selectedBlog: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    // Local view count increment (if not using API)
    incrementLocalViewCount: (state, action) => {
      const blogId = action.payload;

      // Increment in blogs array
      state.blogs = state.blogs.map((blog) =>
        blog._id === blogId ? { ...blog, views: (blog.views || 0) + 1 } : blog,
      );

      // Increment in selectedBlog if it's the current one
      if (state.selectedBlog && state.selectedBlog._id === blogId) {
        state.selectedBlog = {
          ...state.selectedBlog,
          views: (state.selectedBlog.views || 0) + 1,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBlogThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlogThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs.push(action.payload);
      })
      .addCase(createBlogThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getBlogById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBlogById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBlog = action.payload;
      })
      .addCase(getBlogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.blogs.findIndex(
          (b) => b._id === action.payload._id,
        );
        if (index !== -1) state.blogs[index] = action.payload;
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = state.blogs.filter((b) => b._id !== action.payload._id);
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Increment View Count
      .addCase(incrementViewCount.pending, (state) => {
        state.loading = true;
      })
      .addCase(incrementViewCount.fulfilled, (state, action) => {
        const blogId = action.payload;

        // Update view count in blogs array
        state.blogs = state.blogs.map((blog) =>
          blog._id === blogId
            ? { ...blog, views: (blog.views || 0) + 1 }
            : blog,
        );

        // Update view count in selectedBlog if it's the current one
        if (state.selectedBlog && state.selectedBlog._id === blogId) {
          state.selectedBlog = {
            ...state.selectedBlog,
            views: (state.selectedBlog.views || 0) + 1,
          };
        }
      })
      .addCase(incrementViewCount.rejected, (state, action) => {
        // Optional: Handle error
        console.error("Failed to increment view count:", action.payload);
      });
  },
});

export const blogReducer = blogSlice.reducer;
