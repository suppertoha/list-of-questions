import { configureStore } from '@reduxjs/toolkit'

import { baseApi } from './api/baseApi'
import './api/collectionsApi'
import './api/questionsApi'
import './api/quizApi'
import './api/skillsApi'
import './api/specializationsApi'
import { quizReducer } from './slices/quizSlice'

export const store = configureStore({
	reducer: {
		quiz: quizReducer,
		[baseApi.reducerPath]: baseApi.reducer,
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware().concat(baseApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
