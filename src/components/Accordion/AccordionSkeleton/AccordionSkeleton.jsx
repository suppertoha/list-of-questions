import { Skeleton } from '@/components/ui/Skeleton/Skeleton'

import styles from './AccordionSkeleton.module.scss'

export const AccordionSkeleton = ({ count = 6 }) => {
	return (
		<>
			{Array.from({ length: count }).map((_, index) => (
				<div className={styles.skeletonCard} key={index}>
					<div className={styles.skeletonHead}>
						<Skeleton className={styles.skeletonTitle} />
						<Skeleton className={styles.skeletonIcon} />
					</div>
				</div>
			))}
		</>
	)
}
