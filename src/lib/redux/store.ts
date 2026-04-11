import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";

// Import all injected endpoint slices so they register themselves
import "@/lib/redux/api/tutorApi";
import "@/lib/redux/api/bookingApi";
import "@/lib/redux/api/categoryApi";
import "@/lib/redux/api/reviewApi";
import "@/lib/redux/api/adminApi";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
