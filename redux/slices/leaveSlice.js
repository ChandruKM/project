import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  leaves: []
};

const leaveSlice = createSlice({
  name: "leave",
  initialState,
  reducers: {

    applyLeave: (state, action) => {
      state.leaves.push(action.payload);
    },

    updateLeave: (state, action) => {
      const index = state.leaves.findIndex(l => l.id === action.payload.id);
      if (index !== -1) {
        state.leaves[index] = action.payload;
      }
    },

    deleteLeave: (state, action) => {
      state.leaves = state.leaves.filter(l => l.id !== action.payload);
    },

    // 🔥 APPROVE LEAVE
    approveLeave: (state, action) => {
      const index = state.leaves.findIndex(l => l.id === action.payload.id);
      if (index !== -1) {
        state.leaves[index].status = "approved";
      }
    }

  }
});

export const { applyLeave, updateLeave, deleteLeave, approveLeave } = leaveSlice.actions;
export default leaveSlice.reducer;