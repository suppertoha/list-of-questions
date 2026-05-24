import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { Question } from '@/types/question'
import type { QuizKnowledge, QuizSettings, QuizState } from '@/types/quiz'

const initialState: QuizState = {
	status: 'idle',
	error: null,
	settings: null,
	questions: [],
	currentIndex: 0,
	answers: {},
}

interface StartQuizPayload {
	settings: QuizSettings
	questions: Question[]
}

interface SetAnswerPayload {
	questionId: number
	knowledge: QuizKnowledge
}

const quizSlice = createSlice({
	name: 'quiz',
	initialState,
	reducers: {
		resetQuiz: () => initialState,
		setLoading: state => {
			state.status = 'loading'
			state.error = null
		},
		setError: (state, action: PayloadAction<string>) => {
			state.status = 'idle'
			state.error = action.payload
		},
		startQuiz: (state, action: PayloadAction<StartQuizPayload>) => {
			state.status = 'playing'
			state.error = null
			state.settings = action.payload.settings
			state.questions = action.payload.questions
			state.currentIndex = 0
			state.answers = {}
		},
		setAnswer: (state, action: PayloadAction<SetAnswerPayload>) => {
			state.answers[action.payload.questionId] = action.payload.knowledge
		},
		goNext: state => {
			if (state.currentIndex < state.questions.length - 1) {
				state.currentIndex += 1
			}
		},
		goPrev: state => {
			if (state.currentIndex > 0) {
				state.currentIndex -= 1
			}
		},
		finishQuiz: state => {
			state.status = 'finished'
		},
	},
})

export const {
	resetQuiz,
	setLoading,
	setError,
	startQuiz,
	setAnswer,
	goNext,
	goPrev,
	finishQuiz,
} = quizSlice.actions

export const quizReducer = quizSlice.reducer
