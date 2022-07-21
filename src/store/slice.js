import { createSlice } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

export const chatSlice = createSlice({
  name: "chat",
  initialState: {
    data: { message: [] },
  },
  reducers: {
    updateChat: (state, action) => ({
      ...state,
      data: action.payload,
    }),
  },
});

const reducer = combineReducers({
  chat: chatSlice.reducer,
});

export const { updateChat } = chatSlice.actions;

export default reducer;
