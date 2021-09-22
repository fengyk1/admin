import { configureStore, createSlice } from '@reduxjs/toolkit';
import { getStorage } from '../utils/storage';
interface IState {
  token: string | null;
}
// 初始化token
const rootState: IState = {
  token: getStorage('token'),
};

const rootSlice = createSlice({
  name: 'root',
  initialState: rootState,
  reducers: {
    setToken(state, { payload }) {
      // 设置token
      return { ...state, token: payload };
    },
  },
});

export const { setToken} = rootSlice.actions

export const store = configureStore({
  reducer: {
    root: rootSlice.reducer,
  },
});
