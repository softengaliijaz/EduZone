import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axios";

// Thunks
export const fetchCourses = createAsyncThunk(
  "course/fetchCourses",
  async (params = {}, thunkAPI) => {
    try {
      const { search, category, level } = params;
      const query = new URLSearchParams();
      if (search) query.append("search", search);
      if (category) query.append("category", category);
      if (level) query.append("level", level);

      const response = await axiosInstance.get(
        `/api/courses/?${query.toString()}`,
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to fetch courses",
      );
    }
  },
);

export const fetchAllCourses = createAsyncThunk(
  "course/fetchAllCourses",
  async (_, thunkAPI) => {
    try {
      const pageSize = 100;
      const firstPage = await axiosInstance.get("/api/courses/", {
        params: { page: 1, limit: pageSize },
      });
      const courses = firstPage.data.data || [];
      const totalPages = firstPage.data.meta?.totalPages || 1;
      if (totalPages <= 1) return courses;

      const remainingPages = await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, index) =>
          axiosInstance.get("/api/courses/", {
            params: { page: index + 2, limit: pageSize },
          }),
        ),
      );
      return courses.concat(...remainingPages.map((page) => page.data.data || []));
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch all courses",
      );
    }
  },
);

export const createCourse = createAsyncThunk(
  "course/createCourse",
  async (courseData, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        "/api/courses/create-course",
        courseData,
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.errors?.join(" ") ||
          error?.response?.data?.message ||
          "Failed to create course",
      );
    }
  },
);

export const updateCourse = createAsyncThunk(
  "course/updateCourse",
  async ({ id, courseData }, thunkAPI) => {
    try {
      const response = await axiosInstance.put(
        `/api/courses/${id}`,
        courseData,
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to update course",
      );
    }
  },
);

export const deleteCourse = createAsyncThunk(
  "course/deleteCourse",
  async ({ id }, thunkAPI) => {
    try {
      await axiosInstance.delete(`/api/courses/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to delete course",
      );
    }
  },
);

// Slice
const courseSlice = createSlice({
  name: "course",
  initialState: {
    courses: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
        state.error = null;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
        state.error = null;
      })
      .addCase(fetchAllCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses.push(action.payload);
        state.error = null;
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.courses.findIndex(
          (c) => c._id === action.payload._id,
        );
        if (index !== -1) state.courses[index] = action.payload;
        state.error = null;
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = state.courses.filter(
          (course) => course._id !== action.payload,
        );
        state.error = null;
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default courseSlice.reducer;
