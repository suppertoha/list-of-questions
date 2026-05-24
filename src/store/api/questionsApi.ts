import type { Question, QuestionsListResponse } from '@/types/question'

import { baseApi } from './baseApi'

export const questionsApi = baseApi.injectEndpoints({
	endpoints: builder => ({
		getQuestions: builder.query<QuestionsListResponse, void>({
			query: () => '/questions/public-questions',
		}),
		getPublicQuestionById: builder.query<Question, string | number>({
			query: id => `/questions/public-questions/${id}`,
		}),
		getQuestionsByCollectionId: builder.query<
			QuestionsListResponse,
			string | number
		>({
			query: collectionId =>
				`/questions/public-questions?collectionId=${collectionId}`,
		}),
	}),
})

export const {
	useGetQuestionsQuery,
	useGetPublicQuestionByIdQuery,
	useGetQuestionsByCollectionIdQuery,
} = questionsApi
