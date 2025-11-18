import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apihandle from "../../api/apihandle";

const initialState = {
  classes: [],
  get_classes_status: "idle",
  get_classes_error: null,

  add_class_status: "idle",
  add_class_error: null,
};

export const getClasses = createAsyncThunk(
  "teacher/classes",
  async (_, thunkAPI) => {
    const res = await apihandle.getTeacherClasses();
    return res;
  }
);
export const getStudentClasses = createAsyncThunk(
  "student/classes",
  async (_, thunkAPI) => {
    const res = await apihandle.getStudentClasses();
    return res;
  }
);
export const addClass = createAsyncThunk(
  "teacher/add-class",
  async (body, thunkAPI) => {
    const res = await apihandle.addNewClasses(body);
    return res;
  }
);

const classSlice = createSlice({
  name: "class",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // get classes teacher
      .addCase(getClasses.pending, (state) => {
        state.get_classes_status = "loading";
      })
      .addCase(getClasses.fulfilled, (state, action) => {
        state.get_classes_status = "succeeded";
        const { classes } = action.payload;
        state.classes = classes;
      })
      .addCase(getClasses.rejected, (state, action) => {
        state.get_classes_status = "failed";
        state.get_classes_error = action.error.message;
      })

      // get student classes
      .addCase(getStudentClasses.pending, (state) => {
        state.get_classes_status = "loading";
      })
      .addCase(getStudentClasses.fulfilled, (state, action) => {
        state.get_classes_status = "succeeded";
        const { classes } = action.payload;
        state.classes = classes;
      })
      .addCase(getStudentClasses.rejected, (state, action) => {
        state.get_classes_status = "failed";
        state.get_classes_error = action.error.message;
      })

      // add class
      .addCase(addClass.pending, (state) => {
        state.add_class_status = "loading";
      })
      .addCase(addClass.fulfilled, (state, action) => {
        state.add_class_status = "succeeded";
      })
      .addCase(addClass.rejected, (state, action) => {
        state.add_class_status = "failed";
        state.add_class_error = action.error.message;
      });
  },
});

export const {} = classSlice.actions;
export default classSlice.reducer;
