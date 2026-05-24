import { useState } from 'react'
import { Link } from 'react-router-dom'

import productImage from '@/assets/images/collections/collection-placeholder.png'
import { SvgIcon } from '@/components/SvgIcon/SvgIcon'
import { ROUTES } from '@/constants/routes'
import type { Collection } from '@/types/collection'

import styles from './CollectionCard.module.scss'

interface CollectionCardProps {
	collection: Collection
	listSearch?: string
}

export const CollectionCard = ({
	collection,
	listSearch = '',
}: CollectionCardProps) => {
	const [imageSrc, setImageSrc] = useState(
		collection.imageSrc || productImage
	)

	const tagSpecs = collection.specializations?.slice(0, 3) ?? []
	const cardTitle =
		collection.description?.trim() || collection.title
	const companyTitle = collection.company?.title
	const search = listSearch ? `?${listSearch}` : ''

	const questionsLabel =
		collection.questionsCount === 1
			? '1 вопрос'
			: collection.questionsCount >= 2 && collection.questionsCount <= 4
				? `${collection.questionsCount} вопроса`
				: `${collection.questionsCount} вопросов`

	return (
		<Link
			to={`${ROUTES.collection(collection.id)}${search}`}
			className={styles.card}
		>
			<div className={styles.inner}>
				<div className={styles.mediaColumn}>
					<img
						className={styles.image}
						src={imageSrc}
						alt=''
						onError={() => setImageSrc(productImage)}
					/>
				</div>

				<div className={styles.body}>
					<div className={styles.topBlock}>
						{tagSpecs.length > 0 && (
							<div className={styles.tags}>
								{tagSpecs.map(spec => (
									<span key={spec.id} className={styles.tag}>
										{spec.title}
									</span>
								))}
							</div>
						)}
						<h3 className={styles.title}>{cardTitle}</h3>
					</div>

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

					{companyTitle && (
						<div className={styles.footer}>
							<span className={styles.footerText}>{companyTitle}</span>
						</div>
					)}
				</div>
			</div>
		</Link>
	)
}
