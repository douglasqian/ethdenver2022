import { configureStore } from '@reduxjs/toolkit'
import ruleReducer from '../ruleSlice'

export default configureStore({
  reducer: {
      rules: ruleReducer,
  },
})