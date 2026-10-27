import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axios";

const readStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

const normalizeAuthPayload = (responseData) => {
  const root = responseData?.data || responseData || {};
  const user = root.user || responseData?.user || responseData?.data?.user || null;
  const accessToken =
    root.accessToken ||
    root.token ||
    responseData?.token ||
    responseData?.accessToken ||
    null;

  return { user, accessToken };
};

export const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/api/auth/register", userData);
      const { user, accessToken } = normalizeAuthPayload(response.data);

      if (accessToken) localStorage.setItem("token", accessToken);
      if (user) localStorage.setItem("user", JSON.stringify(user));

      return { user, accessToken };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Registration failed",
      );
    }
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/api/auth/login", credentials);
      const { user, accessToken } = normalizeAuthPayload(response.data);

      if (accessToken) localStorage.setItem("token", accessToken);
      if (user) localStorage.setItem("user", JSON.stringify(user));

      return { user, accessToken };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Login failed",
      );
    }
  },
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/api/auth/profile");
      const user = response?.data?.data || response?.data?.user || null;

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      return { user };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to fetch current user",
      );
    }
  },
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  let serverLogoutSucceeded = true;
  try {
    await axiosInstance.post("/api/auth/logout");
  } catch (error) {
    serverLogoutSucceeded = false;
    console.error("Server logout failed:", error);
  }
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  return { serverLogoutSucceeded };
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: localStorage.getItem("token") ? readStoredUser() : null,
    loading: false,
    error: null,
    isInitializing: Boolean(localStorage.getItem("token")),
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      state.user = null;
      state.error = null;
      state.loading = false;
      state.isInitializing = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase("user/setUser", (state, action) => {
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed. Please try again.";
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isInitializing = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || null;
        state.isInitializing = false;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isInitializing = false;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.error = null;
        state.isInitializing = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
