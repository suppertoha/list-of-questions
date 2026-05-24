import type { QuestionFilters } from '@/types/question'

const URL_TO_STATUS: Record<string, QuestionFilters['status']> = {
	all: 'Все',
	learned: 'Изученные',
	unlearned: 'Не изученные',
}

const parseIdList = (value: string | null): number[] => {
	if (!value) return []
	return value
		.split(',')
		.map(part => Number(part.trim()))
		.filter(id => !Number.isNaN(id))
}

export const parseQuestionFilters = (
	searchParams: URLSearchParams
): QuestionFilters => {
	const statusKey = searchParams.get('status') ?? 'all'

	return {
		specializationIds: parseIdList(searchParams.get('specializations')),
		skillIds: parseIdList(searchParams.get('skills')),
		status: URL_TO_STATUS[statusKey] ?? 'Все',
		rating: searchParams.get('rating'),
		difficulty: searchParams.get('difficulty') as QuestionFilters['difficulty'],
		query: searchParams.get('query') ?? '',
	}
}
