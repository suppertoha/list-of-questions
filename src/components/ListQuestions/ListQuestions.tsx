import { useEffect, useMemo, useState } from 'react'

import { ITEMS_PER_PAGE } from '@/constants/pagination'
import { useHideOnClick } from '@/hooks/useHideOnClick'
import { useLearnedIds } from '@/hooks/useLearnedIds'
import { useQuestionFilters } from '@/hooks/useQuestionFilters'
import { useWindowWidth } from '@/hooks/useWindowWidth'
import { useGetQuestionsQuery } from '@/store/api/questionsApi'
import { useGetSkillsQuery } from '@/store/api/skillsApi'
import { useGetSpecializationsQuery } from '@/store/api/specializationsApi'
import { matchesFilters } from '@/utils/matchesFilters'

import { Filter } from '@/components/Filter/Filter'
import { FilterSkeleton } from '@/components/Filter/FilterSkeleton/FilterSkeleton'
import { Questions } from '@/components/Questions/Questions'
import { SvgIcon } from '@/components/SvgIcon/SvgIcon'
import { WrapperPage } from '@/components/WrapperPage/WrapperPage'

import styles from './ListQuestions.module.scss'

export const ListQuestions = () => {
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
	} = useQuestionFilters()

	const { learnedIds } = useLearnedIds()

	const listSearch = searchParams.toString()

	const {
		data: questionsData,
		isLoading: isQuestionsLoading,
		isError: isQuestionsError,
	} = useGetQuestionsQuery()
	const {
		data: specializationsData,
		isLoading: isSpecializationsLoading,
		isError: isSpecializationsError,
	} = useGetSpecializationsQuery()
	const {
		data: skillsData,
		isLoading: isSkillsLoading,
		isError: isSkillsError,
	} = useGetSkillsQuery()

	const questions = questionsData?.data ?? []
	const specializations = specializationsData?.data ?? []
	const skills = skillsData?.data ?? []

	const loading =
		isQuestionsLoading || isSpecializationsLoading || isSkillsLoading
	const error =
		isQuestionsError || isSpecializationsError || isSkillsError
			? 'Ошибка загрузки'
			: null

	function openMenu() {
		setIsActiveMenu(true)
	}

	function closeMenu() {
		setIsActiveMenu(false)
	}

	const filteredQuestions = useMemo(
		() => questions.filter(q => matchesFilters(q, filters, learnedIds)),
		[questions, filters, learnedIds]
	)

	const totalPages = Math.max(
		1,
		Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE)
	)

	useEffect(() => {
		if (currentPage > totalPages) {
			setPage(totalPages)
		}
	}, [currentPage, totalPages, setPage])

	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
	const endIndex = startIndex + ITEMS_PER_PAGE
	const paginatedQuestions = filteredQuestions.slice(startIndex, endIndex)

	const changePage = (page: number) => {
		setPage(page)
	}

	const changePageButtonPrev = () => {
		if (currentPage <= 1) return
		setPage(currentPage - 1)
	}

	const changePageButtonNext = () => {
		if (currentPage >= totalPages) return
		setPage(currentPage + 1)
	}

	return (
		<>
			<WrapperPage>
				{error && (
					<div>Не удалось загрузить данные. Попробуй обновить страницу.</div>
				)}
				<Questions
					widthWindow={widthWindow}
					openMenu={openMenu}
					paginatedQuestions={paginatedQuestions}
					totalPages={totalPages}
					loading={loading}
					currentPage={currentPage}
					changePage={changePage}
					changePageButtonPrev={changePageButtonPrev}
					changePageButtonNext={changePageButtonNext}
					listSearch={listSearch}
					totalItems={filteredQuestions.length}
				/>
				{widthWindow > 1024 &&
					(loading ? (
						<FilterSkeleton />
					) : (
						<Filter
							specializations={specializations}
							skills={skills}
							filters={filters}
							searchInput={searchInput}
							onSearchChange={handleSearchChange}
							updateFilter={updateFilter}
						/>
					))}
				{isActiveMenu && (
					<div ref={ref} className={styles.modal}>
						<button onClick={closeMenu} className={styles.close}>
							{SvgIcon.CloseMenu}
						</button>
						{loading ? (
							<FilterSkeleton />
						) : (
							<Filter
								specializations={specializations}
								skills={skills}
								filters={filters}
								searchInput={searchInput}
								onSearchChange={handleSearchChange}
								updateFilter={updateFilter}
							/>
						)}
					</div>
				)}
			</WrapperPage>
		</>
	)
}
