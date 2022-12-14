import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IUser {
  id: number | null;
  email: string | null;
  username: string | null;
  isActivated: boolean;
  bio: string | null;
  avatar: string | null;
}

const initialState: IUser = {
  id: null,
  email: null,
  username: null,
  isActivated: false,
  bio: null,
  avatar: null,
};

export const userSlice = createSlice({
  name: "USER",
  initialState,
  reducers: {
    setUser(state, { payload: { username, avatar, bio, email, id, isActivated } }: PayloadAction<IUser>) {
      state.avatar = avatar;
      state.bio = bio;
      state.email = email;
      state.id = id;
      state.isActivated = isActivated;
      state.username = username;
    },
    resetUser() {
      return initialState;
    },
  },
});

export const { setUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
