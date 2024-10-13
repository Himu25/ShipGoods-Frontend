"use client";
import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  isLoggedIn: false,
  role: null,
  token: null,
  name: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      console.log(action.payload);
      const { token, role, name } = action.payload;
      state.isLoggedIn = true;
      state.token = token;
      state.role = role;
      state.name = name;

      Cookies.set("token", token);
      Cookies.set("role", role);
      Cookies.set("name", name);
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.role = null;
      state.token = null;
      state.name = null;

      Cookies.remove("token");
      Cookies.remove("role");
      Cookies.remove("name");
    },
    loadUserFromCookies: (state) => {
      const token = Cookies.get("token");
      const role = Cookies.get("role");
      const name = Cookies.get("name");

      if (token && role && name) {
        state.isLoggedIn = true;
        state.token = token;
        state.role = role;
        state.name = name;
      }
    },
  },
});

export const { loginSuccess, logout, loadUserFromCookies } = authSlice.actions;
export default authSlice.reducer;
