import { useState } from 'react'

import productImage from '@/assets/images/collections/collection-placeholder.png'
import { Accordion } from '@/components/Accordion/Accordion'
import { SvgIcon } from '@/components/SvgIcon/SvgIcon'
import { BackLink } from '@/components/ui/BackLink/BackLink'
import { Pagination } from '@/components/ui/Pagination/Pagination'
import { ROUTES } from '@/constants/routes'
import { ITEMS_PER_PAGE } from '@/constants/pagination'
import type { Collection } from '@/types/collection'
import type { Question } from '@/types/question'

import { CollectionDetailsSidebar } from './CollectionDetailsSidebar/CollectionDetailsSidebar'
import styles from './CollectionDetailsView.module.scss'

const COMMUNITY_URL = 'https://yeahub.ru'

interface CollectionDetailsViewProps {
	collection: Collection
	questions: Question[]
	paginatedQuestions: Question[]
	listSearch: string
	totalPages: number
	currentPage: number
	changePage: (page: number) => void
	changePageButtonPrev: () => void
	changePageButtonNext: () => void
}

export const CollectionDetailsView = ({
	collection,
	questions,
	paginatedQuestions,
	listSearch,
	totalPages,
	currentPage,
	changePage,
	changePageButtonPrev,
	changePageButtonNext,
}: CollectionDetailsViewProps) => {
	const [imageSrc, setImageSrc] = useState(
		collection.imageSrc || productImage
	)

	const backSearch = listSearch ? `?${listSearch}` : ''
	const isLocked = !collection.isFree

	const heroTitle = collection.description?.trim() || collection.title
	const showSubtitle =
		Boolean(collection.title?.trim()) && collection.title.trim() !== heroTitle

	const questionsCount = collection.isFree
		? questions.length
		: collection.questionsCount

	const questionsLabel =
		questionsCount === 1
			? '1 вопрос'
			: questionsCount >= 2 && questionsCount <= 4
				? `${questionsCount} вопроса`
				: `${questionsCount} вопросов`

	return (
		<div className={styles.pageShell}>
			<BackLink to={`${ROUTES.collections}${backSearch}`} />

			<div className={styles.layout}>
			<div className={styles.mainColumn}>
				<article className={styles.heroCard}>
					<img
						className={styles.heroImage}
						src={imageSrc}
						alt=''
						onError={() => setImageSrc(productImage)}
					/>
					<div className={styles.heroBody}>
						<h1 className={styles.heroTitle}>{heroTitle}</h1>
						{showSubtitle && (
							<p className={styles.heroDescription}>{collection.title}</p>
						)}
						<div className={styles.metaRow}>
							<span className={styles.metaItem}>
								<span className={styles.metaIcon}>
									{SvgIcon.StarsMinimalistic}
								</span>
								<span className={styles.metaText}>
									{collection.isFree ? 'Для всех' : 'Для участников'}
								</span>
							</span>
							<span className={styles.metaItem}>
								<span className={styles.metaIcon}>
									{SvgIcon.QuestionSquare}
								</span>
								<span className={styles.metaText}>{questionsLabel}</span>
							</span>
						</div>
					</div>
				</article>

				<section className={styles.questionsCard}>
					<div className={styles.questionsHeader}>
						<h2 className={styles.questionsTitle}>Список вопросов</h2>
						{isLocked && (
							<a
								href={COMMUNITY_URL}
								target='_blank'
								rel='noreferrer'
								className={styles.communityLink}
							>
								Стать участником сообщества
								<span className={styles.communityIcon}>
									{SvgIcon.ArrowRight}
								</span>
							</a>
						)}
					</div>

					{isLocked ? (
						<div className={styles.locked}>
							<div className={styles.lockIcon}>{SvgIcon.Lock}</div>
							<p className={styles.lockedText}>
								Список вопросов появится у участников сообщества
							</p>
						</div>
					) : questions.length === 0 ? (
						<p className={styles.empty}>В этой коллекции пока нет вопросов</p>
					) : (
						<>
							<div className={styles.accordionList}>
								<Accordion
									paginatedQuestions={paginatedQuestions}
									listSearch={listSearch}
								/>
							</div>

							{questions.length > ITEMS_PER_PAGE && (
								<Pagination
									totalPages={totalPages}
									currentPage={currentPage}
									changePage={changePage}
									changePageButtonPrev={changePageButtonPrev}
									changePageButtonNext={changePageButtonNext}
								/>
							)}
						</>
					)}
				</section>
			</div>

			<CollectionDetailsSidebar
				collection={collection}
				questionsCount={collection.isFree ? questions.length : undefined}
			/>
			</div>
		</div>
	)
}
