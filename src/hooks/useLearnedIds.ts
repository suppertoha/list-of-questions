import { useCallback, useEffect, useState } from 'react'

import { LEARNED_IDS_STORAGE_KEY } from '@/constants/storage'

const readStoredIds = (): number[] => {
	try {
		const raw = localStorage.getItem(LEARNED_IDS_STORAGE_KEY)
		if (!raw) return []
		const parsed = JSON.parse(raw)
		if (!Array.isArray(parsed)) return []
		return parsed.filter((id): id is number => typeof id === 'number')
	} catch {
		return []
	}
}

export const useLearnedIds = () => {
	const [learnedIds, setLearnedIds] = useState<number[]>(readStoredIds)

	useEffect(() => {
		localStorage.setItem(LEARNED_IDS_STORAGE_KEY, JSON.stringify(learnedIds))
	}, [learnedIds])

	const toggleLearned = useCallback((id: number) => {
		setLearnedIds(prev =>
			prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
		)
	}, [])

	const isLearned = useCallback(
		(id: number) => learnedIds.includes(id),
		[learnedIds]
	)

	return { learnedIds, toggleLearned, isLearned }
}
