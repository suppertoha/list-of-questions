import clsx from 'clsx'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { BackLink } from '@/components/ui/BackLink/BackLink'
import { SvgIcon } from '@/components/SvgIcon/SvgIcon'
import { ROUTES } from '@/constants/routes'
import { useLazyGetNewMockQuizQuery } from '@/store/api/quizApi'
import { useGetSkillsQuery } from '@/store/api/skillsApi'
import { useGetSpecializationsQuery } from '@/store/api/specializationsApi'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
	setError as setQuizError,
	setLoading,
	startQuiz,
} from '@/store/slices/quizSlice'
import type { TrainerFormValues } from '@/types/quiz'
import { getQuizErrorMessage, parseComplexity } from '@/utils/quizUtils'

import {
	DEFAULT_QUESTION_COUNT,
	MOCK_DIFFICULTY_LEVELS,
	MOCK_MODES,
} from './trainerMockData'
import styles from './TrainerSetup.module.scss'

const skillIconByIndex = (index: number) =>
	index % 2 === 0 ? SvgIcon.SkillCube : SvgIcon.SkillDots

export const TrainerSetup = () => {
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const quizError = useAppSelector(state => state.quiz.error)
	const [fetchQuiz, { isFetching }] = useLazyGetNewMockQuizQuery()

	const {
		data: specializationsData,
		isLoading: isSpecializationsLoading,
		isError: isSpecializationsError,
	} = useGetSpecializationsQuery()

	const {
		data: skillsData,
		isLoading: isSkillsLoading,
		isError: isSkillsError,
	} = useGetSkillsQuery()

	const {
		handleSubmit,
		setValue,
		setError: setFieldError,
		clearErrors,
		watch,
		formState: { errors },
	} = useForm<TrainerFormValues>({
		defaultValues: {
			specializationId: null,
			skillIds: [],
			difficulty: null,
			mode: null,
			questionCount: DEFAULT_QUESTION_COUNT,
		},
	})

	const specializationId = watch('specializationId')
	const isStartDisabled = specializationId == null || isFetching
	const skillIds = watch('skillIds')
	const difficulty = watch('difficulty')
	const mode = watch('mode')
	const questionCount = watch('questionCount')

	const specializations = specializationsData?.data ?? []
	const skills = skillsData?.data ?? []

	const toggleSkill = (id: number) => {
		const next = skillIds.includes(id)
			? skillIds.filter(item => item !== id)
			: [...skillIds, id]
		setValue('skillIds', next, { shouldDirty: true })
	}

	const decrementCount = () => {
		setValue('questionCount', Math.max(1, questionCount - 1), {
			shouldDirty: true,
		})
	}

	const incrementCount = () => {
		setValue('questionCount', Math.min(99, questionCount + 1), {
			shouldDirty: true,
		})
	}

	const onSubmit = async (values: TrainerFormValues) => {
		if (values.specializationId == null) {
			setFieldError('specializationId', {
				type: 'required',
				message: 'Выберите специализацию',
			})
			return
		}

		if (values.questionCount < 1) {
			setFieldError('questionCount', {
				type: 'min',
				message: 'Минимум 1 вопрос',
			})
			return
		}

		dispatch(setLoading())

		try {
			const complexity = parseComplexity(values.difficulty)
			const result = await fetchQuiz({
				specializationId: values.specializationId,
				limit: values.questionCount,
				skillIds: values.skillIds.length ? values.skillIds : undefined,
				complexity,
			}).unwrap()

			if (!result.questions.length) {
				dispatch(
					setQuizError(
						'Вопросы не найдены. Выберите другую специализацию или измените фильтры.'
					)
				)
				return
			}

			dispatch(
				startQuiz({
					settings: {
						specializationId: values.specializationId,
						skillIds: values.skillIds,
						complexity: complexity ?? null,
						mode: values.mode,
						questionCount: values.questionCount,
					},
					questions: result.questions,
				})
			)
			navigate(ROUTES.quizPlay)
		} catch (error) {
			dispatch(setQuizError(getQuizErrorMessage(error)))
		}
	}

	return (
		<div className={styles.pageShell}>
			<BackLink to={ROUTES.questions} />

			<section className={styles.card}>
			<form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
				<div className={styles.content}>
					<h1 className={styles.title}>Собеседование</h1>

					<div className={styles.columns}>
						<div className={styles.leftColumn}>
							<div className={styles.section}>
								<h2 className={styles.label}>Выбор специализации</h2>
								{isSpecializationsLoading && (
									<p className={styles.statusText}>Загрузка…</p>
								)}
								{isSpecializationsError && (
									<p className={styles.statusText}>
										Не удалось загрузить специализации
									</p>
								)}
								{!isSpecializationsLoading && !isSpecializationsError && (
									<div className={styles.tags}>
										{specializations.map(spec => {
											const isActive = specializationId === spec.id

											return (
												<button
													key={spec.id}
													type='button'
													className={clsx(
														styles.tag,
														isActive && styles.tagActive
													)}
													onClick={() => {
														clearErrors('specializationId')
														setValue('specializationId', spec.id, {
															shouldDirty: true,
															shouldValidate: true,
														})
													}}
												>
													{spec.title}
												</button>
											)
										})}
									</div>
								)}
								{errors.specializationId && (
									<p className={styles.statusText}>
										Выберите специализацию
									</p>
								)}
							</div>

							<div className={styles.section}>
								<h2 className={styles.label}>Категории вопросов</h2>
								{isSkillsLoading && (
									<p className={styles.statusText}>Загрузка…</p>
								)}
								{isSkillsError && (
									<p className={styles.statusText}>
										Не удалось загрузить навыки
									</p>
								)}
								{!isSkillsLoading && !isSkillsError && (
									<div className={styles.tags}>
										{skills.map((skill, index) => {
											const isActive = skillIds.includes(skill.id)

											return (
												<button
													key={skill.id}
													type='button'
													className={clsx(
														styles.skillTag,
														isActive && styles.tagActive
													)}
													onClick={() => toggleSkill(skill.id)}
												>
													<span
														className={clsx(
															styles.skillIcon,
															isActive && styles.skillIconActive
														)}
													>
														{skillIconByIndex(index)}
													</span>
													<span className={styles.skillLabel}>
														{skill.title}
													</span>
												</button>
											)
										})}
									</div>
								)}
							</div>
						</div>

						<div className={styles.rightColumn}>
							<div className={styles.section}>
								<h2 className={styles.label}>Уровень сложности</h2>
								<div className={styles.tags}>
									{MOCK_DIFFICULTY_LEVELS.map(level => (
										<button
											key={level}
											type='button'
											className={clsx(
												styles.tag,
												styles.tagCompact,
												difficulty === level && styles.tagActive
											)}
											onClick={() =>
												setValue(
													'difficulty',
													difficulty === level ? null : level,
													{ shouldDirty: true }
												)
											}
										>
											{level}
										</button>
									))}
								</div>
							</div>

							<div className={styles.section}>
								<h2 className={styles.label}>Выберите режим</h2>
								<div className={styles.tags}>
									{MOCK_MODES.map(item => (
										<button
											key={item}
											type='button'
											className={clsx(
												styles.tag,
												styles.tagCompact,
												mode === item && styles.tagActive
											)}
											onClick={() =>
												setValue('mode', mode === item ? null : item, {
													shouldDirty: true,
												})
											}
										>
											{item}
										</button>
									))}
								</div>
							</div>

							<div className={styles.section}>
								<h2 className={styles.label}>Количество вопросов</h2>
								<div className={styles.counter}>
									<button
										type='button'
										className={styles.counterBtn}
										onClick={decrementCount}
										aria-label='Уменьшить'
									>
										<span className={styles.counterIcon}>
											{SvgIcon.Minus}
										</span>
									</button>
									<span className={styles.counterValue}>{questionCount}</span>
									<button
										type='button'
										className={styles.counterBtn}
										onClick={incrementCount}
										aria-label='Увеличить'
									>
										<span className={styles.counterIcon}>
											{SvgIcon.Plus}
										</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className={styles.footer}>
					<button
						type='submit'
						className={styles.startBtn}
						disabled={isStartDisabled}
					>
						<span>{isFetching ? 'Загрузка…' : 'Начать'}</span>
						<span className={styles.startIcon}>{SvgIcon.ArrowRight}</span>
					</button>
					{quizError && <p className={styles.statusText}>{quizError}</p>}
				</div>
			</form>
		</section>
		</div>
	)
}
