import { useState } from 'react'
import { Link } from 'react-router-dom'

import skillFallbackIcon from '@/assets/images/sidebar/figma.png'
import { ROUTES } from '@/constants/routes'
import type { Question, QuestionSkill } from '@/types/question'

import { ExpertCard } from './ExpertCard/ExpertCard'
import styles from './QuestionMetaSidebar.module.scss'

interface StatItemProps {
	label: string
	value?: number | null
}

const StatItem = ({ label, value }: StatItemProps) => (
	<div className={styles.statBox}>
		<span className={styles.statLabel}>{label}</span>
		<span className={styles.statBadge}>{value ?? '—'}</span>
	</div>
)

interface SkillIconProps {
	imageSrc?: string | null
}

const SkillIcon = ({ imageSrc }: SkillIconProps) => {
	const [hasError, setHasError] = useState(false)

	if (!imageSrc || hasError) {
		return (
			<img
				className={styles.skillIconImg}
				src={skillFallbackIcon}
				alt=''
				width={20}
				height={20}
			/>
		)
	}

	return (
		<img
			className={styles.skillIconImg}
			src={imageSrc}
			alt=''
			width={20}
			height={20}
			onError={() => setHasError(true)}
		/>
	)
}

interface SkillTagProps {
	skill: QuestionSkill
}

const SkillTag = ({ skill }: SkillTagProps) => {
	const content = (
		<>
			<SkillIcon imageSrc={skill.imageSrc} />
			<span>{skill.title}</span>
		</>
	)

	if (skill.id == null) {
		return <span className={styles.skillTag}>{content}</span>
	}

	return (
		<Link
			to={`${ROUTES.questions}?skills=${skill.id}`}
			className={styles.skillTag}
		>
			{content}
		</Link>
	)
}

const formatKeyword = (keyword: string) =>
	keyword.startsWith('#') ? keyword : `#${keyword}`

const keywordQuery = (keyword: string) =>
	encodeURIComponent(keyword.replace(/^#/, '').trim())

interface QuestionMetaSidebarProps {
	question: Question
}

export const QuestionMetaSidebar = ({ question }: QuestionMetaSidebarProps) => {
	const skills = question.questionSkills ?? []
	const keywords = question.keywords ?? []
	const authorName = question.createdBy?.username

	return (
		<div className={styles.sidebarColumn}>
			<aside className={styles.root}>
				<section className={styles.section}>
					<h2 className={styles.sectionTitle}>Уровень:</h2>
					<div className={styles.levelRow}>
						<StatItem label='Сложность:' value={question.complexity} />
						<StatItem label='Рейтинг:' value={question.rate} />
					</div>
				</section>

				{skills.length > 0 && (
					<section className={styles.section}>
						<h2 className={styles.sectionTitle}>Навыки:</h2>
						<div className={styles.skills}>
							{skills.map(skill => (
								<SkillTag key={skill.id} skill={skill} />
							))}
						</div>
					</section>
				)}

				{keywords.length > 0 && (
					<section className={styles.section}>
						<h2 className={styles.sectionTitle}>Ключевые слова:</h2>
						<ul className={styles.keywords}>
							{keywords.map(keyword => (
								<li key={keyword}>
									<Link
										to={`${ROUTES.questions}?query=${keywordQuery(keyword)}`}
										className={styles.keyword}
									>
										{formatKeyword(keyword)}
									</Link>
								</li>
							))}
						</ul>
					</section>
				)}

				{authorName && (
					<p className={styles.author}>
						<span className={styles.authorLabel}>Автор: </span>
						<span className={styles.authorName}>{authorName}</span>
					</p>
				)}
			</aside>

			<ExpertCard />
		</div>
	)
}
