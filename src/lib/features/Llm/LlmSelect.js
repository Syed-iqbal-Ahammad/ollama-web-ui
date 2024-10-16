import { createSlice } from '@reduxjs/toolkit'

const LlmSelect = createSlice({
  name: 'LlmSelect',
  initialState: {
    SelectValue: '',
  },
  reducers: {
    selectvalue: (state, action) => {
      state.SelectValue = action.payload
    },
  },
})

export const { selectvalue } = LlmSelect.actions
export default LlmSelect.reducer
