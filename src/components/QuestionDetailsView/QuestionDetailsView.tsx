import clsx from 'clsx'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'
import { SvgIcon } from '@/components/SvgIcon/SvgIcon'
import type { Question } from '@/types/question'

import { WrapperPage } from '../WrapperPage/WrapperPage'

import { QuestionMetaSidebar } from '../QuestionMetaSidebar/QuestionMetaSidebar'
import { AnswerMarkdown } from './AnswerMarkdown/AnswerMarkdown'
import { HeroMedia } from './HeroMedia/HeroMedia'
import styles from './QuestionDetailsView.module.scss'

interface QuestionDetailsViewProps {
	question: Question
	isExpanded?: boolean
	onToggleExpand?: () => void
	onPrev?: () => void
	onNext?: () => void
	hasPrev?: boolean
	hasNext?: boolean
}

export const QuestionDetailsView = ({
	question,
	isExpanded: isExpandedProp,
	onToggleExpand,
	onPrev,
	onNext,
	hasPrev = true,
	hasNext = true,
}: QuestionDetailsViewProps) => {
	const location = useLocation()
	const [isExpandedInternal, setIsExpandedInternal] = useState(false)

	const isControlled = typeof isExpandedProp === 'boolean'
	const isExpanded = isControlled ? isExpandedProp : isExpandedInternal

	const handleToggleExpand = () => {
		if (onToggleExpand) {
			onToggleExpand()
			return
		}
		setIsExpandedInternal(prev => !prev)
	}

	const hasShortAnswer =
		typeof question.shortAnswer === 'string' &&
		question.shortAnswer.trim().length > 0

	const hasLongAnswer =
		typeof question.longAnswer === 'string' &&
		question.longAnswer.trim().length > 0

	const listSearch = location.search

	return (
		<WrapperPage>
			<div className={styles.pageShell}>
				<Link
					to={{ pathname: ROUTES.questions, search: listSearch }}
					className={styles.backLink}
				>
					<span className={styles.backIcon}>{SvgIcon.ArrowLeft}</span>
					<span>Назад</span>
				</Link>

				<div className={styles.columnsRow}>
					<div className={styles.mainColumn}>
						<section className={styles.root}>
							<div className={styles.heroCard}>
								<div className={styles.heroMedia}>
									<HeroMedia question={question} />
								</div>

								<div className={styles.heroContent}>
									<h1 className={styles.title}>{question.title}</h1>
									<p className={styles.description}>
										{question.description}
									</p>
								</div>
							</div>

							<div className={styles.navigationCard}>
								<div className={styles.navigationButtons}>
									<button
										type='button'
										className={styles.navButton}
										onClick={onPrev}
										disabled={!hasPrev}
									>
										<span className={styles.navIcon}>
											{SvgIcon.ArrowLeft}
										</span>
										<span>Предыдущий</span>
									</button>

									<button
										type='button'
										className={styles.navButton}
										onClick={onNext}
										disabled={!hasNext}
									>
										<span>Следующий</span>
										<span className={styles.navIcon}>
											{SvgIcon.ArrowRight}
										</span>
									</button>
								</div>
							</div>

							<div className={styles.answers}>
								{hasShortAnswer && (
									<article className={styles.answerCard}>
										<h2 className={styles.answerTitle}>Краткий ответ</h2>
										<AnswerMarkdown
											content={question.shortAnswer}
											className={styles.answerHtml}
										/>
									</article>
								)}

								{hasLongAnswer && (
									<article
										className={clsx(
											styles.answerCard,
											styles.longAnswerCard
										)}
									>
										<h2 className={styles.answerTitle}>
											Развернутый ответ
										</h2>
										<div
											className={clsx(
												styles.longAnswerContent,
												!isExpanded && styles.longAnswerCollapsed
											)}
										>
											<AnswerMarkdown
												content={question.longAnswer}
												className={styles.answerHtml}
											/>
										</div>

										<div className={styles.expandArea}>
											<button
												type='button'
												className={styles.expandButton}
												onClick={handleToggleExpand}
											>
												<span>
													{isExpanded ? 'Свернуть' : 'Развернуть'}
												</span>
												<span
													className={clsx(
														styles.expandIcon,
														isExpanded && styles.expandIconOpen
													)}
												>
													{SvgIcon.ArrowBottomIcon}
												</span>
											</button>
										</div>
									</article>
								)}
							</div>
						</section>
					</div>
					<QuestionMetaSidebar question={question} />
				</div>
			</div>
		</WrapperPage>
	)
}
