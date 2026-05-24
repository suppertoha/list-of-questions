export interface QuestionSkill {
	id: number
	title: string
	description?: string
	imageSrc?: string | null
}

export interface QuestionSpecialization {
	id: number
	title?: string
}

export interface CreatedBy {
	id: string
	username: string
}

export interface Question {
	id: number
	title: string
	description?: string
	rate?: number
	complexity?: number
	imageSrc?: string | null
	shortAnswer?: string
	longAnswer?: string
	keywords?: string[]
	questionSkills?: QuestionSkill[]
	questionSpecializations?: QuestionSpecialization[]
	createdBy?: CreatedBy
}

export interface SkillListItem {
	id: number
	title: string
}

export interface SpecializationListItem {
	id: number
	title: string
}

export interface QuestionsListResponse {
	data: Question[]
	page: number
	limit: number
	total: number
}

export interface SpecializationsResponse {
	data: SpecializationListItem[]
}

export interface SkillsResponse {
	data: SkillListItem[]
}

type DifficultyKey = '1–3' | '4–6' | '7–8' | '9–10'

export interface QuestionFilters {
	specializationIds: number[]
	skillIds: number[]
	status: 'Все' | 'Изученные' | 'Не изученные'
	rating: string | null
	difficulty: DifficultyKey | null
	query: string
}
