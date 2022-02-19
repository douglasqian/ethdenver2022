import { createSlice } from '@reduxjs/toolkit'

const ruleSlice = createSlice({
  name: 'rules',
  initialState: {
      value: [],
  },
  reducers: {
    add(state, action) {
      state.value.push({
          id: action.payload.id,
          tokenContractAddr: action.payload.tokenContractAddr,
      })
    },
    remove(state, action) {
      state.value = state.value.filter((rule) => rule.id !== action.payload);
    }
  },
})

export const { add, remove } = ruleSlice.actions
export default ruleSlice.reducer