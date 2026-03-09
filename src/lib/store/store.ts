import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import pricingReducer from "./pricingSlice";
// Import your slices here
//import counterReducer from "./features/counterSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      user:userReducer,
      pricing: pricingReducer,
    },
  });
};

// Infer types
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
