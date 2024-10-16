import { createSlice } from '@reduxjs/toolkit'

const IsLogin = createSlice({
  name: 'Login',
  initialState: {
    Login: false,
  },
  reducers: {
    login: (state, action) => {
      state.Login = action.payload
    },
  },
})

export const { login } = IsLogin.actions
export default IsLogin.reducer

