import { Skeleton } from '@/components/ui/Skeleton/Skeleton'

import styles from './FilterSkeleton.module.scss'

const sectionTagWidths = [
	['38%', '32%', '45%', '28%', '35%', '42%'],
	['34%', '40%', '36%', '30%', '44%', '32%'],
	['26%', '30%', '24%', '28%'],
	['18%', '18%', '18%', '18%', '18%'],
	['42%', '46%', '28%']
]

export const FilterSkeleton = () => {
	return (
		<div className={styles.root}>
			<Skeleton className={styles.search} />

			{sectionTagWidths.map((tags, sectionIndex) => (
				<div className={styles.section} key={sectionIndex}>
					<Skeleton className={styles.label} />

					<div className={styles.tags}>
						{tags.map((width, tagIndex) => (
							<Skeleton key={`${sectionIndex}-${tagIndex}`} className={styles.tag} width={width} />
						))}
					</div>

					{sectionIndex < 2 && <Skeleton className={styles.link} />}
				</div>
			))}
		</div>
	)
}
