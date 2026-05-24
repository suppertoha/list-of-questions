export interface CollectionCompany {
	id: string
	title: string
	legalName?: string
	description?: string
	imageSrc?: string | null
}

export interface CollectionSpecialization {
	id: number
	title: string
	slug?: string
}

export interface CollectionAuthor {
	id: string
	username: string
}

export interface Collection {
	id: number
	title: string
	slug: string
	description: string
	imageSrc: string | null
	isFree: boolean
	keywords: string[]
	company: CollectionCompany | null
	specializations: CollectionSpecialization[]
	questionsCount: number
	tasksCount?: number
	createdBy?: CollectionAuthor | null
}

export interface CollectionsListResponse {
	data: Collection[]
}

export type CollectionAccessFilter = 'members' | 'free'

export interface CollectionFilters {
	specializationIds: number[]
	access: CollectionAccessFilter[]
	query: string
}
