import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import type { CollectionAccessFilter, CollectionFilters } from '@/types/collection'

import { useDebounce } from './useDebounce'

const parseIdList = (value: string | null): number[] => {
	if (!value) return []
	return value
		.split(',')
		.map(part => Number(part.trim()))
		.filter(id => !Number.isNaN(id))
}

const formatIdList = (ids: number[]): string | null =>
	ids.length > 0 ? ids.join(',') : null

const parseAccess = (value: string | null): CollectionAccessFilter[] => {
	if (!value) return []
	return value
		.split(',')
		.map(part => part.trim())
		.filter(
			(part): part is CollectionAccessFilter =>
				part === 'members' || part === 'free'
		)
}

const filtersFromParams = (searchParams: URLSearchParams): CollectionFilters => ({
	specializationIds: parseIdList(searchParams.get('specializations')),
	access: parseAccess(searchParams.get('access')),
	query: searchParams.get('query') ?? '',
})

export const useCollectionFilters = () => {
	const [searchParams, setSearchParams] = useSearchParams()
	const [searchInput, setSearchInput] = useState(
		() => searchParams.get('query') ?? ''
	)

	const debouncedQuery = useDebounce(searchInput, 400)

	const filters = useMemo(
		() => filtersFromParams(searchParams),
		[searchParams]
	)

	const currentPage = Math.max(1, Number(searchParams.get('page')) || 1)

	useEffect(() => {
		setSearchInput(searchParams.get('query') ?? '')
	}, [searchParams])

	useEffect(() => {
		const urlQuery = searchParams.get('query') ?? ''
		const nextQuery = debouncedQuery.trim()

		if (nextQuery === urlQuery) return

		setSearchParams(
			prev => {
				const next = new URLSearchParams(prev)
				if (nextQuery) next.set('query', nextQuery)
				else next.delete('query')
				next.delete('page')
				return next
			},
			{ replace: true }
		)
	}, [debouncedQuery, searchParams, setSearchParams])

	const patchParams = useCallback(
		(patch: (next: URLSearchParams) => void, resetPage = true) => {
			setSearchParams(
				prev => {
					const next = new URLSearchParams(prev)
					patch(next)
					if (resetPage) next.delete('page')
					return next
				},
				{ replace: true }
			)
		},
		[setSearchParams]
	)

	const updateFilter = useCallback(
		(key: string, value: string | number | null) => {
			if (key === 'query') {
				setSearchInput(typeof value === 'string' ? value : '')
				return
			}

			if (key === 'specializationIds' && typeof value === 'number') {
				patchParams(next => {
					const ids = parseIdList(next.get('specializations'))
					const updated = ids.includes(value)
						? ids.filter(id => id !== value)
						: [...ids, value]
					const formatted = formatIdList(updated)
					if (formatted) next.set('specializations', formatted)
					else next.delete('specializations')
				})
				return
			}

			if (key === 'access' && typeof value === 'string') {
				patchParams(next => {
					const current = parseAccess(next.get('access'))
					const updated = current.includes(value as CollectionAccessFilter)
						? current.filter(item => item !== value)
						: [...current, value as CollectionAccessFilter]
					if (updated.length > 0) next.set('access', updated.join(','))
					else next.delete('access')
				})
			}
		},
		[patchParams]
	)

	const handleSearchChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			updateFilter('query', e.target.value)
		},
		[updateFilter]
	)

	const setPage = useCallback(
		(page: number) => {
			const safePage = Math.max(1, page)
			setSearchParams(
				prev => {
					const next = new URLSearchParams(prev)
					if (safePage <= 1) next.delete('page')
					else next.set('page', String(safePage))
					return next
				},
				{ replace: true }
			)
		},
		[setSearchParams]
	)

	return {
		filters,
		searchInput,
		updateFilter,
		handleSearchChange,
		searchParams,
		currentPage,
		setPage,
	}
}
