import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

/** Same-origin `/api`: Vite dev proxy + Vercel rewrites → api.yeatwork.ru */
export const baseApi = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
	endpoints: () => ({}),
})
