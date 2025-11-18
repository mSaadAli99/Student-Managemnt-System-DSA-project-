import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/features/authSlice";
import classReducer from "../store/features/classSlice";
import lessonReducer from "../store/features/lessonSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    class: classReducer,
    lesson: lessonReducer,
  },
});

export default store;
