import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
// Import your slices here
//import counterReducer from "./features/counterSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      user:userReducer,
    },
  });
};

// Infer types
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
