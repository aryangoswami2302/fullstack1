import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter",

  // initial value
  initialState: { value: 0 },

  // actions (kaise change hoga)
  reducers: {
    increment: (state) => {
      state.value++;
    },
    decrement: (state) => {
      state.value--;
    },
  },
});

// actions export
export const { increment, decrement } = counterSlice.actions;

// reducer export
export default counterSlice.reducer;