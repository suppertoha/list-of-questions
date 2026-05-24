import type { Question } from '@/types/question'
import type { QuestionFilters } from '@/types/question'
import type { QuestionSkill } from '@/types/question'

const DIFFICULTY_RANGES = {
	'1–3': [1, 3],
	'4–6': [4, 6],
	'7–8': [7, 8],
	'9–10': [9, 10]
}

export const matchesFilters = (
	question: Question,
	filters: QuestionFilters,
	learnedIds: number[] = []
): boolean => {
	const matchesRating =
		!filters.rating || Number(question.rate) === Number(filters.rating)

	const selectedDifficultyRange = filters.difficulty
		? DIFFICULTY_RANGES[filters.difficulty]
		: null

	const matchesDifficulty =
		!selectedDifficultyRange ||
		(question.complexity != null &&
			question.complexity >= selectedDifficultyRange[0] &&
			question.complexity <= selectedDifficultyRange[1])

	const isLearned = learnedIds.includes(question.id)

	const matchesStatus =
		filters.status === 'Все' ||
		(filters.status === 'Изученные' && isLearned) ||
		(filters.status === 'Не изученные' && !isLearned)

	const query = filters.query.trim()

	const matchesQuery =
		!query ||
		(question.title?.toLowerCase().includes(query.toLowerCase()) ?? false) ||
		(question.description?.toLowerCase().includes(query.toLowerCase()) ?? false)

	const skillItems = question.questionSkills ?? []
	const questionSkillIds = skillItems.map((item: QuestionSkill) => item.id)
	const matchesSkills =
		filters.skillIds.length === 0 ||
		filters.skillIds.some(id => questionSkillIds.includes(id))

	const specItems = question.questionSpecializations ?? []
	const questionSpecializationIds = specItems.map(item => item.id)
	const matchesSpecializations =
		filters.specializationIds.length === 0 ||
		filters.specializationIds.some(id => questionSpecializationIds.includes(id))

	return (
		matchesRating &&
		matchesDifficulty &&
		matchesStatus &&
		matchesQuery &&
		matchesSkills &&
		matchesSpecializations
	)
}
