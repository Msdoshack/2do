import { createSlice } from "@reduxjs/toolkit";

const getUser = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user")!)
  : null;

const initialState = {
  user: getUser,
};

const authSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },

    logoutUser: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
  },
});

export const selectUser = (state: any) => state.user;
// export const selectOption = (state: any) => state.user;

export const { setUser, logoutUser } = authSlice.actions;

export default authSlice.reducer;
