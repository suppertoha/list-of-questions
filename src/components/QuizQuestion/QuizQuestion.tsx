import { useEffect, useState } from 'react'

import clsx from 'clsx'
import { Navigate, useNavigate } from 'react-router-dom'

import quizHero from '@/assets/images/quiz/quiz-question-hero.png'
import { ROUTES } from '@/constants/routes'
import { BackLink } from '@/components/ui/BackLink/BackLink'
import { SvgIcon } from '@/components/SvgIcon/SvgIcon'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
	finishQuiz,
	goNext,
	goPrev,
	resetQuiz,
	setAnswer,
} from '@/store/slices/quizSlice'
import type { QuizKnowledge } from '@/types/quiz'
import { getQuestionAnswerText } from '@/utils/quizUtils'

import styles from './QuizQuestion.module.scss'

export const QuizQuestion = () => {
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const { status, questions, currentIndex, answers } = useAppSelector(
		state => state.quiz
	)
	const [answerVisible, setAnswerVisible] = useState(false)

	const question = questions[currentIndex]
	const total = questions.length
	const knowledge: QuizKnowledge | null = question
		? (answers[question.id] ?? null)
		: null

	useEffect(() => {
		setAnswerVisible(false)
	}, [currentIndex])

	if (!question || total === 0) {
		return <Navigate to={ROUTES.quiz} replace />
	}

	if (status === 'idle' || status === 'loading') {
		return <Navigate to={ROUTES.quiz} replace />
	}

	if (status === 'finished') {
		return <Navigate to={ROUTES.quizResult} replace />
	}

	const progressPercent = ((currentIndex + 1) / total) * 100
	const heroSrc = question.imageSrc?.trim() ? question.imageSrc : quizHero

	const handleFinish = () => {
		dispatch(finishQuiz())
		navigate(ROUTES.quizResult, { replace: true })
	}

	const handleBackToSetup = () => {
		dispatch(resetQuiz())
	}

	return (
		<div className={styles.page}>
			<BackLink to={ROUTES.quiz} onClick={handleBackToSetup} />

			<section className={styles.headerCard}>
				<div className={styles.headerRow}>
					<h1 className={styles.headerTitle}>Вопросы собеседования</h1>
					<span className={styles.counter}>
						{currentIndex + 1}/{total}
					</span>
				</div>
				<div className={styles.progressTrack}>
					<div
						className={styles.progressFill}
						style={{ width: `${progressPercent}%` }}
					/>
				</div>
			</section>

			<section className={styles.card}>
				<div className={styles.navRow}>
					<button
						type='button'
						className={styles.navLink}
						onClick={() => dispatch(goPrev())}
						disabled={currentIndex <= 0}
					>
						<span className={styles.navIcon}>{SvgIcon.ArrowLeft}</span>
						<span>Предыдущий</span>
					</button>
					<button
						type='button'
						className={styles.navLink}
						onClick={() => dispatch(goNext())}
						disabled={currentIndex >= total - 1}
					>
						<span>Далее</span>
						<span className={styles.navIcon}>{SvgIcon.ArrowRight}</span>
					</button>
				</div>

				<div className={styles.body}>
					<div className={styles.content}>
						<div className={styles.questionBlock}>
							<div className={styles.questionRow}>
								<span className={styles.bullet} aria-hidden='true' />
								<p className={styles.questionText}>{question.title}</p>
							</div>
							<button
								type='button'
								className={styles.viewAnswer}
								onClick={() => setAnswerVisible(prev => !prev)}
							>
								{answerVisible ? 'Скрыть ответ' : 'Посмотреть ответ'}
							</button>
							{answerVisible && (
								<p className={styles.answerText}>
									{getQuestionAnswerText(question)}
								</p>
							)}
						</div>

						<div className={styles.knowledgeRow}>
							<button
								type='button'
								className={clsx(
									styles.knowledgeBtn,
									knowledge === 'unknown' && styles.knowledgeBtnActive
								)}
								onClick={() =>
									dispatch(
										setAnswer({
											questionId: question.id,
											knowledge: 'unknown',
										})
									)
								}
							>
								<span className={styles.knowledgeIcon}>
									{SvgIcon.ThumbDown}
								</span>
								<span>Не знаю</span>
							</button>
							<button
								type='button'
								className={clsx(
									styles.knowledgeBtn,
									knowledge === 'know' && styles.knowledgeBtnActive
								)}
								onClick={() =>
									dispatch(
										setAnswer({
											questionId: question.id,
											knowledge: 'know',
										})
									)
								}
							>
								<span className={styles.knowledgeIcon}>
									{SvgIcon.ThumbUp}
								</span>
								<span>Знаю</span>
							</button>
						</div>
					</div>

					<img
						className={styles.hero}
						src={heroSrc}
						alt=''
						width={622}
						height={358}
					/>
				</div>

				<button
					type='button'
					className={styles.finishBtn}
					onClick={handleFinish}
				>
					Завершить
				</button>
			</section>
		</div>
	)
}
