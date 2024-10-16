import { createSlice } from '@reduxjs/toolkit'

const MongoString = createSlice({
  name: 'MongoString',
  initialState: {
    MongoStringUrl: 'mongodb://localhost:27017',
  },
  reducers: {
    mongostringurl: (state, action) => {
      state.MongoStringUrl = action.payload
    },
  },
})

export const { mongostringurl } = MongoString.actions
export default MongoString.reducer

