import { configureStore } from '@reduxjs/toolkit'
import LlmSelect from './features/Llm/LlmSelect'
import MongoString from './features/MongoDbCString/MongoString'
import IsLogin from './features/Login/Login'

export const makeStore = () => {
  return configureStore({
    reducer: {
        LLm : LlmSelect,
        mongostrurl: MongoString,
        Login: IsLogin,
    },
  })
}