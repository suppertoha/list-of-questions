import type { Collection, CollectionFilters } from '@/types/collection'

export const matchesCollectionFilters = (
	collection: Collection,
	filters: CollectionFilters
): boolean => {
	const query = filters.query.trim().toLowerCase()

	if (query) {
		const inTitle = collection.title.toLowerCase().includes(query)
		const inDescription = collection.description?.toLowerCase().includes(query)
		const inCompany = collection.company?.title?.toLowerCase().includes(query)
		if (!inTitle && !inDescription && !inCompany) return false
	}

	if (filters.specializationIds.length > 0) {
		const specIds = collection.specializations.map(s => s.id)
		const hasSpec = filters.specializationIds.some(id => specIds.includes(id))
		if (!hasSpec) return false
	}

	if (filters.access.length > 0) {
		const matchesMembers =
			filters.access.includes('members') && !collection.isFree
		const matchesFree = filters.access.includes('free') && collection.isFree
		if (!matchesMembers && !matchesFree) return false
	}

	return true
}
