import type { SkillsResponse } from '@/types/question'

import { baseApi } from './baseApi'

export const skillsApi = baseApi.injectEndpoints({
	endpoints: builder => ({
		getSkills: builder.query<SkillsResponse, void>({
			query: () => '/skills',
		}),
	}),
})

export const { useGetSkillsQuery } = skillsApi
