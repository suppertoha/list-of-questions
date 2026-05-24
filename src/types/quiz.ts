import type { Question } from '@/types/question'

export type QuizKnowledge = 'know' | 'unknown'

export type DifficultyLevel = '1–3' | '4–6' | '7–8' | '9–10'

export interface QuizSettings {
	specializationId: number
	skillIds: number[]
	complexity: number[] | null
	mode: string | null
	questionCount: number
}

export interface GetNewMockQuizParams {
	specializationId: number
	limit: number
	skillIds?: number[]
	complexity?: number[]
}

export interface GetNewMockQuizResponse {
	fullCount: number
	questions: Question[]
}

export type QuizStatus = 'idle' | 'loading' | 'playing' | 'finished'

export interface QuizState {
	status: QuizStatus
	error: string | null
	settings: QuizSettings | null
	questions: Question[]
	currentIndex: number
	answers: Record<number, QuizKnowledge>
}

export interface TrainerFormValues {
	specializationId: number | null
	skillIds: number[]
	difficulty: DifficultyLevel | null
	mode: string | null
	questionCount: number
}
