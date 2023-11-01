import { configureStore } from "@reduxjs/toolkit";
import createClusterReducer from "./slices/createClusterSlice";
import createSingleTopicSlice from "./slices/createSingleTopicSlice";
export const store = configureStore({
  reducer: {
    createCluster: createClusterReducer,
    createTopic: createSingleTopicSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
