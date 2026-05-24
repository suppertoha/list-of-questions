import clsx from 'clsx'

import { SvgIcon } from '@/components/SvgIcon/SvgIcon'

import styles from './Pagination.module.scss'

export const Pagination = ({
	totalPages,
	currentPage,
	changePage,
	changePageButtonPrev,
	changePageButtonNext
}) => {
	const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

	return (
		<div className={styles.root}>
			<ul className={styles.items}>
				<li className={styles.item}>
					<button onClick={()=> changePageButtonPrev(currentPage)} className={styles.arrow} type='button'>
						{SvgIcon.ArrowLeft}
					</button>
				</li>

				{pages.map((page, index) => (
					<li key={`page_${index}`} className={styles.item}>
						<button
							onClick={() => changePage(page)}
							className={clsx(
								styles.buttonEl,
								page === currentPage && styles.active
							)}
						>
							{page}
						</button>
					</li>
				))}

				<li className={styles.item}>
					<button onClick={()=> changePageButtonNext(currentPage)} className={styles.arrow} type='button'>
						{SvgIcon.ArrowRight}
					</button>
				</li>
			</ul>
		</div>
	)
}
