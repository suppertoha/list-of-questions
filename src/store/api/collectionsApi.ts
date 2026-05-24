import type { Collection, CollectionsListResponse } from '@/types/collection'

import { baseApi } from './baseApi'

export const collectionsApi = baseApi.injectEndpoints({
	endpoints: builder => ({
		getCollectionsPublic: builder.query<CollectionsListResponse, void>({
			query: () => '/collections/public',
		}),
		getCollectionByIdPublic: builder.query<Collection, string | number>({
			query: id => `/collections/${id}/public`,
		}),
	}),
})

export const {
	useGetCollectionsPublicQuery,
	useGetCollectionByIdPublicQuery,
} = collectionsApi
