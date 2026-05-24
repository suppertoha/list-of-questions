import expertAvatar from '@/assets/images/authors/expert-avatar.png'
import { EXPERT_PROFILE } from '@/constants/expertProfile'
import { EXPERT_SOCIAL_LINKS } from '@/constants/socialLinks'

import styles from './ExpertCard.module.scss'

export const ExpertCard = () => (
	<div className={styles.card}>
		<div className={styles.header}>
			<img
				className={styles.avatar}
				src={expertAvatar}
				alt={EXPERT_PROFILE.displayName}
				width={45}
				height={45}
			/>

			<div className={styles.meta}>
				<p className={styles.name}>{EXPERT_PROFILE.displayName}</p>
				<p className={styles.role}>{EXPERT_PROFILE.role}</p>
			</div>
		</div>

		<p className={styles.description}>{EXPERT_PROFILE.description}</p>

		<div className={styles.socials}>
			{EXPERT_SOCIAL_LINKS.map(link => (
				<a
					key={link.id}
					className={styles.socialLink}
					href={link.href}
					target='_blank'
					rel='noreferrer noopener'
					aria-label={link.label}
				>
					<img
						className={styles.socialIcon}
						src={link.icon}
						alt=''
						width={16}
						height={16}
					/>
				</a>
			))}
		</div>
	</div>
)
