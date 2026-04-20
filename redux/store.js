import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import leaveReducer from "./slices/leaveSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    leave: leaveReducer,
  },
});