import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import mongoose from "mongoose";

interface IUser {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  mobile?: string;
  role: "user" | "deliveryboy" | "admin";
  image?: string;
}

interface IUserSlice {
  userData: IUser | null;
}

const initialState: IUserSlice = {
  userData: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // ✅ FIX: unwrap data if coming as { user: {...} }
    setUserData: (state, action: PayloadAction<any>) => {
      if (action.payload?.user) {
        state.userData = action.payload.user; // 👈 flatten here
      } else {
        state.userData = action.payload;
      }
    },
  },
});

export const { setUserData } = userSlice.actions;
export default userSlice.reducer;