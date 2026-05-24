import { useEffect, useMemo, useState } from 'react'

import { ITEMS_PER_PAGE } from '@/constants/pagination'
import { useCollectionFilters } from '@/hooks/useCollectionFilters'
import { useHideOnClick } from '@/hooks/useHideOnClick'
import { useWindowWidth } from '@/hooks/useWindowWidth'
import { useGetCollectionsPublicQuery } from '@/store/api/collectionsApi'
import { useGetSpecializationsQuery } from '@/store/api/specializationsApi'
import { matchesCollectionFilters } from '@/utils/matchesCollectionFilters'

import { Filter } from '@/components/Filter/Filter'
import { CollectionsList } from '@/components/CollectionsList/CollectionsList'
import { FilterSkeleton } from '@/components/Filter/FilterSkeleton/FilterSkeleton'
import { SvgIcon } from '@/components/SvgIcon/SvgIcon'
import { WrapperPage } from '@/components/WrapperPage/WrapperPage'

import styles from './ListCollections.module.scss'

export const ListCollections = () => {
	const widthWindow = useWindowWidth()
	const [isActiveMenu, setIsActiveMenu] = useState(false)
	const ref = useHideOnClick(closeMenu, isActiveMenu)

	const {
		filters,
		searchInput,
		updateFilter,
		handleSearchChange,
		searchParams,
		currentPage,
		setPage,
	} = useCollectionFilters()

	const listSearch = searchParams.toString()

	const {
		data: collectionsData,
		isLoading: isCollectionsLoading,
		isError: isCollectionsError,
	} = useGetCollectionsPublicQuery()
	const {
		data: specializationsData,
		isLoading: isSpecializationsLoading,
		isError: isSpecializationsError,
	} = useGetSpecializationsQuery()

	const collections = collectionsData?.data ?? []
	const specializations = specializationsData?.data ?? []

	const loading = isCollectionsLoading || isSpecializationsLoading
	const error =
		isCollectionsError || isSpecializationsError ? 'Ошибка загрузки' : null

	function openMenu() {
		setIsActiveMenu(true)
	}

	function closeMenu() {
		setIsActiveMenu(false)
	}

	const filteredCollections = useMemo(
		() => collections.filter(c => matchesCollectionFilters(c, filters)),
		[collections, filters]
	)

	const totalPages = Math.max(
		1,
		Math.ceil(filteredCollections.length / ITEMS_PER_PAGE)
	)

	useEffect(() => {
		if (currentPage > totalPages) {
			setPage(totalPages)
		}
	}, [currentPage, totalPages, setPage])

	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
	const paginatedCollections = filteredCollections.slice(
		startIndex,
		startIndex + ITEMS_PER_PAGE
	)

	const changePage = (page: number) => setPage(page)
	const changePageButtonPrev = () => {
		if (currentPage <= 1) return
		setPage(currentPage - 1)
	}
	const changePageButtonNext = () => {
		if (currentPage >= totalPages) return
		setPage(currentPage + 1)
	}

	const filterProps = {
		variant: 'collections' as const,
		specializations,
		filters,
		searchInput,
		onSearchChange: handleSearchChange,
		updateFilter,
	}

	return (
		<WrapperPage>
			{error && (
				<div>Не удалось загрузить данные. Попробуй обновить страницу.</div>
			)}
			<CollectionsList
				widthWindow={widthWindow}
				openMenu={openMenu}
				paginatedCollections={paginatedCollections}
				totalPages={totalPages}
				loading={loading}
				currentPage={currentPage}
				changePage={changePage}
				changePageButtonPrev={changePageButtonPrev}
				changePageButtonNext={changePageButtonNext}
				listSearch={listSearch}
				totalItems={filteredCollections.length}
			/>
			{widthWindow > 1024 &&
				(loading ? (
					<FilterSkeleton />
				) : (
					<Filter {...filterProps} />
				))}
			{isActiveMenu && (
				<div ref={ref} className={styles.modal}>
					<button type='button' onClick={closeMenu} className={styles.close}>
						{SvgIcon.CloseMenu}
					</button>
					{loading ? <FilterSkeleton /> : <Filter {...filterProps} />}
				</div>
			)}
		</WrapperPage>
	)
}
