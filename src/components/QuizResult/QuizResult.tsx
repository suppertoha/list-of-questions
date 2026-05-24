import { useMemo } from 'react'

import clsx from 'clsx'
import { Navigate } from 'react-router-dom'

import resultThumb1 from '@/assets/images/quiz/result/result-card-thumb-1.png'
import resultThumb2 from '@/assets/images/quiz/result/result-card-thumb-2.png'
import { ROUTES } from '@/constants/routes'
import { BackLink } from '@/components/ui/BackLink/BackLink'
import { SvgIcon } from '@/components/SvgIcon/SvgIcon'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { resetQuiz } from '@/store/slices/quizSlice'
import type { QuizKnowledge } from '@/types/quiz'
import type { Question } from '@/types/question'

import styles from './QuizResult.module.scss'

const THUMBS = [resultThumb1, resultThumb2] as const

interface SkillProgress {
	id: number
	name: string
	current: number
	total: number
}

const buildSkillProgress = (
	questions: Question[],
	answers: Record<number, QuizKnowledge>
): SkillProgress[] => {
	const map = new Map<number, SkillProgress>()

	questions.forEach(question => {
		const skills = question.questionSkills ?? []

		if (!skills.length) {
			const fallback = map.get(0) ?? {
				id: 0,
				name: 'Общее',
				current: 0,
				total: 0,
			}
			fallback.total += 1
			if (answers[question.id] === 'know') fallback.current += 1
			map.set(0, fallback)
			return
		}

		skills.forEach(skill => {
			const entry = map.get(skill.id) ?? {
				id: skill.id,
				name: skill.title,
				current: 0,
				total: 0,
			}
			entry.total += 1
			if (answers[question.id] === 'know') entry.current += 1
			map.set(skill.id, entry)
		})
	})

	return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name))
}

export const QuizResult = () => {
	const dispatch = useAppDispatch()
	const { status, questions, answers } = useAppSelector(state => state.quiz)

	const handleBackToSetup = () => {
		dispatch(resetQuiz())
	}

	const stats = useMemo(() => {
		const total = questions.length
		const knowCount = questions.filter(q => answers[q.id] === 'know').length
		const unknownCount = questions.filter(
			q => answers[q.id] === 'unknown'
		).length
		const inProgressCount = total - knowCount - unknownCount
		const percent = total > 0 ? Math.round((knowCount / total) * 100) : 0

		return {
			total,
			knowCount,
			unknownCount,
			inProgressCount,
			percent,
			skills: buildSkillProgress(questions, answers),
		}
	}, [questions, answers])

	if (status !== 'finished' || questions.length === 0) {
		return <Navigate to={ROUTES.quiz} replace />
	}

	return (
		<div className={styles.page}>
			<BackLink to={ROUTES.quiz} onClick={handleBackToSetup} />

			<section className={styles.statsCard}>
				<div className={styles.statsHeader}>
					<h1 className={styles.pageTitle}>Умный режим изучения вопросов</h1>
					<button type='button' className={styles.statsLink}>
						<span>Посмотреть статистику</span>
						<span className={styles.statsLinkIcon}>{SvgIcon.ArrowRight}</span>
					</button>
				</div>

				<div className={styles.statsBody}>
					<div className={styles.donutCard}>
						<h2 className={styles.donutTitle}>
							Статистика пройденных вопросов
						</h2>
						<div className={styles.donutWrap}>
							<div
								className={styles.donutChart}
								style={{
									background: `conic-gradient(#008616 0% ${stats.percent}%, #ffe7ae ${stats.percent}% 100%)`,
								}}
								aria-hidden='true'
							>
								<div className={styles.donutInner} />
							</div>
							<p className={styles.donutLabel}>
								<span className={styles.donutPercent}>{stats.percent}%</span>
								<span>Изучено</span>
							</p>
						</div>
						<div className={styles.legend}>
							<div className={styles.legendItem}>
								<span className={styles.legendKey}>Всего</span>
								<span className={styles.legendValue}>{stats.total}</span>
							</div>
							<div className={styles.legendItem}>
								<span className={styles.legendKey}>Не знаю</span>
								<span className={styles.legendValue}>
									{stats.unknownCount}
								</span>
							</div>
							<div className={styles.legendItem}>
								<span className={styles.legendKey}>В процессе</span>
								<span className={styles.legendValue}>
									{stats.inProgressCount}
								</span>
							</div>
							<div className={styles.legendItem}>
								<span className={styles.legendKey}>Изучено</span>
								<span className={styles.legendValue}>{stats.knowCount}</span>
							</div>
						</div>
					</div>

					<div className={styles.skillsCard}>
						<h2 className={styles.skillsTitle}>Прогресс обучения по навыкам</h2>
						<ul className={styles.skillsList}>
							{stats.skills.map(skill => {
								const fillPercent =
									skill.total > 0
										? Math.min(
												100,
												Math.round((skill.current / skill.total) * 100)
											)
										: 0

								return (
									<li key={skill.id} className={styles.skillRow}>
										<div className={styles.skillHeader}>
											<span>{skill.name}</span>
											<span>
												{skill.current}/{skill.total}
											</span>
										</div>
										<div className={styles.skillTrack}>
											<div
												className={styles.skillFill}
												style={{ width: `${fillPercent}%` }}
											/>
										</div>
									</li>
								)
							})}
						</ul>
					</div>
				</div>

				<button type='button' className={styles.statsLinkMobile}>
					<span>Посмотреть статистику</span>
					<span className={styles.statsLinkIcon}>{SvgIcon.ArrowRight}</span>
				</button>
			</section>

			<section className={styles.questionsCard}>
				<h2 className={styles.questionsTitle}>
					Список пройденных вопросов собеседования
				</h2>
				<ul className={styles.questionsGrid}>
					{questions.map((question, index) => {
						const knowledge = answers[question.id]
						const isKnow = knowledge === 'know'

						return (
							<li key={question.id} className={styles.questionCard}>
								<img
									className={styles.questionThumb}
									src={
										question.imageSrc?.trim() ||
										THUMBS[index % THUMBS.length]
									}
									alt=''
									width={154}
									height={154}
								/>
								<div className={styles.questionBody}>
									<p className={styles.questionText}>{question.title}</p>
									<div
										className={clsx(
											styles.badge,
											isKnow && styles.badgeKnow
										)}
									>
										<span className={styles.badgeIcon}>
											{isKnow ? SvgIcon.ThumbUp : SvgIcon.ThumbDown}
										</span>
										<span>{isKnow ? 'Знаю' : 'Не знаю'}</span>
									</div>
								</div>
							</li>
						)
					})}
				</ul>
			</section>
		</div>
	)
}
