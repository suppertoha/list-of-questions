import { Link } from 'react-router-dom'

import { SvgIcon } from '@/components/SvgIcon/SvgIcon'
import { ROUTES } from '@/constants/routes'
import type { Collection } from '@/types/collection'

import styles from './CollectionDetailsSidebar.module.scss'

const formatKeyword = (keyword: string) =>
	keyword.startsWith('#') ? keyword : `#${keyword}`

const keywordQuery = (keyword: string) =>
	encodeURIComponent(keyword.replace(/^#/, '').trim())

interface CollectionDetailsSidebarProps {
	collection: Collection
	questionsCount?: number
}

export const CollectionDetailsSidebar = ({
	collection,
	questionsCount,
}: CollectionDetailsSidebarProps) => {
	const displayQuestionsCount = questionsCount ?? collection.questionsCount

	const specs = collection.specializations ?? []
	const keywords = collection.keywords ?? []
	const authorName = collection.createdBy?.username

	return (
		<aside className={styles.root}>
			{specs.length > 0 && (
				<section className={styles.section}>
					<h2 className={styles.label}>Специализация</h2>
					<div className={styles.tags}>
						{specs.map(spec => (
							<span key={spec.id} className={styles.tag}>
								{spec.title}
							</span>
						))}
					</div>
				</section>
			)}

			<section className={styles.section}>
				<h2 className={styles.label}>Доступ</h2>
				<div className={styles.tags}>
					<span className={styles.tag}>
						<span className={styles.accessIcon}>
							{SvgIcon.StarsMinimalistic}
						</span>
						{collection.isFree ? 'Для всех' : 'Для участников'}
					</span>
				</div>
			</section>

			<section className={styles.section}>
				<h2 className={styles.label}>Количество вопросов</h2>
				<span className={styles.countBadge}>{displayQuestionsCount}</span>
			</section>

			{keywords.length > 0 && (
				<section className={styles.section}>
					<h2 className={styles.label}>Ключевые слова</h2>
					<div className={styles.keywords}>
						{keywords.map(keyword => (
							<Link
								key={keyword}
								to={`${ROUTES.questions}?query=${keywordQuery(keyword)}`}
								className={styles.keywordLink}
							>
								{formatKeyword(keyword)}
							</Link>
						))}
					</div>
				</section>
			)}

			{authorName && (
				<div className={styles.author}>
					<span className={styles.authorLabel}>Автор: </span>
					<span className={styles.authorName}>{authorName}</span>
				</div>
			)}
		</aside>
	)
}
