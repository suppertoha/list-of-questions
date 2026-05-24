import { useState } from 'react'

import figmaHero from '@/assets/images/questions/figma-hero.png'
import type { Question } from '@/types/question'

import styles from '../QuestionDetailsView.module.scss'

interface HeroMediaProps {
	question: Question
}

export const HeroMedia = ({ question }: HeroMediaProps) => {
	const [apiImageError, setApiImageError] = useState(false)
	const [figmaImageError, setFigmaImageError] = useState(false)
	const [skillImageError, setSkillImageError] = useState(false)

	const skillImageSrc = question.questionSkills?.[0]?.imageSrc

	if (question.imageSrc && !apiImageError) {
		return (
			<img
				className={styles.heroImage}
				src={question.imageSrc}
				alt={question.title}
				onError={() => setApiImageError(true)}
			/>
		)
	}

	if (!figmaImageError) {
		return (
			<img
				className={styles.heroImage}
				src={figmaHero}
				alt=''
				onError={() => setFigmaImageError(true)}
			/>
		)
	}

	if (skillImageSrc && !skillImageError) {
		return (
			<img
				className={styles.heroImage}
				src={skillImageSrc}
				alt=''
				onError={() => setSkillImageError(true)}
			/>
		)
	}

	return <div className={styles.heroImagePlaceholder}>160 x 160</div>
}
