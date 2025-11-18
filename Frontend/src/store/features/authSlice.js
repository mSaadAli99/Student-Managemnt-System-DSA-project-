import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apihandle from "../../api/apihandle";

const initialState = {
  user: null,
  status: "idle",
  error: null,
  token: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (payload, thunkAPI) => {
    const res = await apihandle.login(payload);
    return res;
  }
);

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, thunkAPI) => {
    const res = await apihandle.checkAuth();
    return res;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = "idle";
      localStorage.removeItem("authToken");
    },
    setUser(state, action) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(action.payload);
        
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("authToken", action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(checkAuth.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.status = "idle";
        state.user = null;
        localStorage.removeItem("authToken");
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
