import type { DifficultyLevel } from '@/types/quiz'
import type { Question } from '@/types/question'

export const parseComplexity = (
	difficulty: DifficultyLevel | null
): number[] | undefined => {
	if (!difficulty) return undefined

	const [minStr, maxStr] = difficulty.split('–')
	const min = Number(minStr)
	const max = Number(maxStr)

	if (Number.isNaN(min) || Number.isNaN(max)) return undefined

	const values: number[] = []
	for (let value = min; value <= max; value += 1) {
		values.push(value)
	}

	return values
}

export const stripHtml = (html: string): string =>
	html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

export const getQuestionAnswerText = (question: Question): string => {
	if (question.shortAnswer?.trim()) {
		return question.shortAnswer.trim()
	}

	if (question.longAnswer?.trim()) {
		return stripHtml(question.longAnswer)
	}

	return 'Ответ недоступен'
}

export const getQuizErrorMessage = (error: unknown): string => {
	if (
		error &&
		typeof error === 'object' &&
		'status' in error &&
		error.status === 404
	) {
		return 'Вопросы не найдены. Выберите другую специализацию или измените фильтры.'
	}

	return 'Не удалось загрузить вопросы. Попробуйте ещё раз.'
}
