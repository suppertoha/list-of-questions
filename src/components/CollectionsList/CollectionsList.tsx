import { ITEMS_PER_PAGE } from '@/constants/pagination'
import { SvgIcon } from '@/components/SvgIcon/SvgIcon'
import { CollectionCard } from '@/components/CollectionCard/CollectionCard'
import { Pagination } from '@/components/ui/Pagination/Pagination'
import type { Collection } from '@/types/collection'

import styles from './CollectionsList.module.scss'

interface CollectionsListProps {
	widthWindow: number
	openMenu: () => void
	paginatedCollections: Collection[]
	totalPages: number
	loading: boolean
	currentPage: number
	changePage: (page: number) => void
	changePageButtonPrev: () => void
	changePageButtonNext: () => void
	listSearch?: string
	totalItems: number
}

export const CollectionsList = ({
	widthWindow,
	openMenu,
	paginatedCollections,
	totalPages,
	loading,
	currentPage,
	changePage,
	changePageButtonPrev,
	changePageButtonNext,
	listSearch = '',
	totalItems,
}: CollectionsListProps) => {
	return (
		<div className={styles.root}>
			<div className={styles.wrapper}>
				<div className={styles.header}>
					<h2 className={styles.title}>Коллекции</h2>
					{widthWindow < 1024 && (
						<button type='button' onClick={openMenu} className={styles.button}>
							{SvgIcon.FilterButton}
						</button>
					)}
				</div>

				<div className={styles.list}>
					{loading ? (
						<p className={styles.loading}>Загрузка…</p>
					) : paginatedCollections.length === 0 ? (
						<p className={styles.empty}>Коллекции не найдены</p>
					) : (
						paginatedCollections.map(collection => (
							<CollectionCard
								key={collection.id}
								collection={collection}
								listSearch={listSearch}
							/>
						))
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
