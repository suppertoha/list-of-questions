import { ITEMS_PER_PAGE } from '@/constants/pagination'
import { SvgIcon } from '@/components/SvgIcon/SvgIcon'

import { Accordion } from '@/components/Accordion/Accordion'
import { AccordionSkeleton } from '@/components/Accordion/AccordionSkeleton/AccordionSkeleton'
import { Pagination } from '@/components/ui/Pagination/Pagination'

import type { Question } from '@/types/question'

import styles from './Questions.module.scss'

interface QuestionsProps {
	widthWindow: number
	openMenu: () => void
	paginatedQuestions: Question[]
	totalPages: number
	loading: boolean
	currentPage: number
	changePage: (page: number) => void
	changePageButtonPrev: (page: number) => void
	changePageButtonNext: (page: number) => void
	listSearch?: string
	totalItems: number
}

export const Questions = ({
	widthWindow,
	openMenu,
	paginatedQuestions,
	totalPages,
	loading,
	currentPage,
	changePage,
	changePageButtonPrev,
	changePageButtonNext,
	listSearch = '',
	totalItems
}: QuestionsProps) => {
	return (
		<div className={styles.root}>
			<div className={styles.wrapper}>
				<div className={styles.header}>
					<h2 className={styles.title}>Вопросы React, JavaScript</h2>
					{widthWindow < 1024 && (
						<button onClick={openMenu} className={styles.button}>
							{SvgIcon.FilterButton}
						</button>
					)}
				</div>

				<div className={styles.list}>
					{loading ? (
						<AccordionSkeleton />
					) : (
						<Accordion
							paginatedQuestions={paginatedQuestions}
							listSearch={listSearch}
						/>
					)}
				</div>
			</div>

			{!loading && totalItems > ITEMS_PER_PAGE && (
				<Pagination
					totalPages={totalPages}
					currentPage={currentPage}
					changePage={changePage}
					changePageButtonPrev={changePageButtonPrev}
					changePageButtonNext={changePageButtonNext}
				/>
			)}
		</div>
	)
}
