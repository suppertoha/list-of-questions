import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import type { QuestionFilters } from '@/types/question'
import { parseQuestionFilters } from '@/utils/questionFiltersFromParams'

import { useDebounce } from './useDebounce'

const STATUS_TO_URL: Record<QuestionFilters['status'], string> = {
	Все: 'all',
	Изученные: 'learned',
	'Не изученные': 'unlearned',
}

const parseIdList = (value: string | null): number[] => {
	if (!value) return []
	return value
		.split(',')
		.map(part => Number(part.trim()))
		.filter(id => !Number.isNaN(id))
}

const formatIdList = (ids: number[]): string | null =>
	ids.length > 0 ? ids.join(',') : null

export const useQuestionFilters = () => {
	const [searchParams, setSearchParams] = useSearchParams()
	const [searchInput, setSearchInput] = useState(
		() => searchParams.get('query') ?? ''
	)

	const debouncedQuery = useDebounce(searchInput, 400)

	const filters = useMemo(
		() => parseQuestionFilters(searchParams),
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

			if (key === 'skillIds' && typeof value === 'number') {
				patchParams(next => {
					const ids = parseIdList(next.get('skills'))
					const updated = ids.includes(value)
						? ids.filter(id => id !== value)
						: [...ids, value]
					const formatted = formatIdList(updated)
					if (formatted) next.set('skills', formatted)
					else next.delete('skills')
				})
				return
			}

			if (key === 'status') {
				const status = value as QuestionFilters['status']
				patchParams(next => {
					if (!status || status === 'Все') next.delete('status')
					else next.set('status', STATUS_TO_URL[status])
				})
				return
			}

			if (key === 'rating' || key === 'difficulty') {
				patchParams(next => {
					const current = next.get(key)
					const nextValue =
						current === String(value) ? null : value != null ? String(value) : null
					if (nextValue) next.set(key, nextValue)
					else next.delete(key)
				})
				return
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
		setSearchParams,
		currentPage,
		setPage,
	}
}
