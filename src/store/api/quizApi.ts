import type {
	GetNewMockQuizParams,
	GetNewMockQuizResponse,
} from '@/types/quiz'

import { baseApi } from './baseApi'

export const quizApi = baseApi.injectEndpoints({
	endpoints: builder => ({
		getNewMockQuiz: builder.query<GetNewMockQuizResponse, GetNewMockQuizParams>({
			query: ({ specializationId, limit, skillIds, complexity }) => ({
				url: '/interview-preparation/quizzes/mock/new',
				params: {
					specialization: specializationId,
					limit,
					...(skillIds?.length ? { skills: skillIds } : {}),
					...(complexity?.length ? { complexity } : {}),
				},
			}),
		}),
	}),
})

export const { useGetNewMockQuizQuery, useLazyGetNewMockQuizQuery } = quizApi
