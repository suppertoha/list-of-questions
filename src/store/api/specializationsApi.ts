import type { SpecializationsResponse } from '@/types/question'

import { baseApi } from './baseApi'

export const specializationsApi = baseApi.injectEndpoints({
	endpoints: builder => ({
		getSpecializations: builder.query<SpecializationsResponse, void>({
			query: () => '/specializations',
		}),
	}),
})

export const { useGetSpecializationsQuery } = specializationsApi
