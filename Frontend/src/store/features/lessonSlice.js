// store/features/lessonSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apihandle from "../../api/apihandle";

const initialState = {
  lessons: [],
  get_lessons_status: "idle",
  get_lessons_error: null,

  add_lesson_status: "idle",
  add_lesson_error: null,

  students: [],
  get_students_status: "idle",
  get_students_error: null,

  invite_status: "idle",
  invite_error: null,
};

// Thunks
export const getLessons = createAsyncThunk(
  "lessons/getLessons",
  async (classId, thunkAPI) => {
    const res = await apihandle.getLessons(classId); // assumed
    return res;
  }
);

export const addLesson = createAsyncThunk(
  "lessons/addLesson",
  async (body, thunkAPI) => {
    const res = await apihandle.addLesson(body); // assumed
    return res;
  }
);

export const getClassStudents = createAsyncThunk(
  "lessons/getClassStudents",
  async (payload, thunkAPI) => {
    const res = await apihandle.getClassStudents(payload); // assumed
    return res;
  }
);

export const inviteStudents = createAsyncThunk(
  "lessons/inviteStudents",
  async (body, thunkAPI) => {
    const res = await apihandle.inviteStudents(body); // assumed
    return res;
  }
);

const lessonSlice = createSlice({
  name: "lesson",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getLessons
      .addCase(getLessons.pending, (state) => {
        state.get_lessons_status = "loading";
      })
      .addCase(getLessons.fulfilled, (state, action) => {
        state.get_lessons_status = "succeeded";
        const { lessons } = action.payload;
        state.lessons = lessons;
      })
      .addCase(getLessons.rejected, (state, action) => {
        state.get_lessons_status = "failed";
        state.get_lessons_error = action.error.message;
      })

      // addLesson
      .addCase(addLesson.pending, (state) => {
        state.add_lesson_status = "loading";
      })
      .addCase(addLesson.fulfilled, (state, action) => {
        state.add_lesson_status = "succeeded";
      })
      .addCase(addLesson.rejected, (state, action) => {
        state.add_lesson_status = "failed";
        state.add_lesson_error = action.error.message;
      })

      // getClassStudents
      .addCase(getClassStudents.pending, (state) => {
        state.get_students_status = "loading";
      })
      .addCase(getClassStudents.fulfilled, (state, action) => {
        state.get_students_status = "succeeded";
        const { students } = action.payload;
        state.students = students;
      })
      .addCase(getClassStudents.rejected, (state, action) => {
        state.get_students_status = "failed";
        state.get_students_error = action.error.message;
      })

      // inviteStudents
      .addCase(inviteStudents.pending, (state) => {
        state.invite_status = "loading";
      })
      .addCase(inviteStudents.fulfilled, (state, action) => {
        state.invite_status = "succeeded";
      })
      .addCase(inviteStudents.rejected, (state, action) => {
        state.invite_status = "failed";
        state.invite_error = action.error.message;
      });
  },
});

export default lessonSlice.reducer;
