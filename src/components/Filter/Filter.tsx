import clsx from 'clsx'
import { useState } from 'react'

import { SvgIcon } from '@/components/SvgIcon/SvgIcon'
import type { CollectionFilters } from '@/types/collection'
import type {
	QuestionFilters,
	SpecializationListItem,
	SkillListItem,
} from '@/types/question'

import styles from './Filter.module.scss'

const difficulty = ['1–3', '4–6', '7–8', '9–10']
const rating = ['1', '2', '3', '4', '5']
const status = ['Изученные', 'Не изученные', 'Все']

type FilterBaseProps = {
	specializations: SpecializationListItem[]
	searchInput: string
	onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	updateFilter: (key: string, value: string | number | null) => void
}

type QuestionsFilterProps = FilterBaseProps & {
	variant?: 'questions'
	skills: SkillListItem[]
	filters: QuestionFilters
}

type CollectionsFilterProps = FilterBaseProps & {
	variant: 'collections'
	filters: CollectionFilters
}

export type FilterProps = QuestionsFilterProps | CollectionsFilterProps

export const Filter = (props: FilterProps) => {
	const {
		specializations,
		searchInput,
		onSearchChange,
		updateFilter,
		variant = 'questions',
	} = props

	const isCollections = variant === 'collections'
	const filters = props.filters

	const [showAllSpecialization, setShowAllSpecialization] = useState(false)
	const [showAllSkills, setShowAllSkills] = useState(false)

	const specLimit = isCollections ? 3 : 4
	const visibleSpecializations = showAllSpecialization
		? specializations
		: specializations.slice(0, specLimit)

	const skills = variant === 'questions' ? props.skills : []
	const visibleSkills =
		variant === 'questions' && showAllSkills ? skills : skills.slice(0, 4)

	const collectionFilters = isCollections
		? (filters as CollectionFilters)
		: null

	const searchId = isCollections ? 'collectionsSearch' : 'searchLoop'

	return (
		<div className={styles.root}>
			<div className={styles.search}>
				<label htmlFor={searchId}>{SvgIcon.Loop}</label>
				<input
					id={searchId}
					className={styles.input}
					value={searchInput}
					onChange={onSearchChange}
					placeholder='Введите запрос…'
				/>
			</div>

			<div className={styles.section}>
				<div className={styles.label}>Специализация</div>
				<div className={styles.tagsScroll}>
					{visibleSpecializations.map(item => {
						const isActive = filters.specializationIds.includes(item.id)
						return (
							<button
								key={item.id}
								type='button'
								onClick={() => updateFilter('specializationIds', item.id)}
								className={clsx(styles.tag, isActive && styles.active)}
							>
								{item.title}
							</button>
						)
					})}
				</div>
				{specializations.length > specLimit && (
					<button
						type='button'
						onClick={() => setShowAllSpecialization(prev => !prev)}
						className={styles.link}
					>
						{showAllSpecialization ? 'Скрыть' : 'Посмотреть все'}
					</button>
				)}
			</div>

			{isCollections && collectionFilters && (
				<div className={styles.section}>
					<div className={styles.label}>Доступ</div>
					<div className={styles.accessRow}>
						<button
							type='button'
							onClick={() => updateFilter('access', 'members')}
							className={clsx(
								styles.tag,
								styles.accessTag,
								collectionFilters.access.includes('members') && styles.active
							)}
						>
							<span className={styles.accessIcon}>
								{SvgIcon.StarsMinimalistic}
							</span>
							Для участников
						</button>
						<button
							type='button'
							onClick={() => updateFilter('access', 'free')}
							className={clsx(
								styles.tag,
								styles.accessTagFree,
								collectionFilters.access.includes('free') && styles.active
							)}
						>
							Для всех
						</button>
					</div>
				</div>
			)}

			{variant === 'questions' && (
				<>
					<div className={styles.section}>
						<div className={styles.label}>Навыки</div>
						<div className={styles.tags}>
							{visibleSkills.map(item => {
								const questionFilters = filters as QuestionFilters
								const isActive = questionFilters.skillIds.includes(item.id)
								return (
									<button
										key={item.id}
										type='button'
										onClick={() => updateFilter('skillIds', item.id)}
										className={clsx(styles.tag, isActive && styles.active)}
									>
										{item.title}
									</button>
								)
							})}
						</div>
						{skills.length > 4 && (
							<button
								type='button'
								onClick={() => setShowAllSkills(prev => !prev)}
								className={styles.link}
							>
								{showAllSkills ? 'Скрыть' : 'Посмотреть все'}
							</button>
						)}
					</div>

					<div className={styles.section}>
						<div className={styles.label}>Уровень сложности</div>
						<div className={styles.tags}>
							{difficulty.map(item => {
								const questionFilters = filters as QuestionFilters
								const isActive = questionFilters.difficulty === item
								return (
									<button
										key={item}
										type='button'
										onClick={() => updateFilter('difficulty', item)}
										className={clsx(styles.tag, isActive && styles.active)}
									>
										{item}
									</button>
								)
							})}
						</div>
					</div>

					<div className={styles.section}>
						<div className={styles.label}>Рейтинг</div>
						<div className={styles.tags}>
							{rating.map(item => {
								const questionFilters = filters as QuestionFilters
								const isActive = questionFilters.rating === item
								return (
									<button
										key={item}
										type='button'
										onClick={() => updateFilter('rating', item)}
										className={clsx(styles.tag, isActive && styles.active)}
									>
										{item}
									</button>
								)
							})}
						</div>
					</div>

					<div className={styles.section}>
						<div className={styles.label}>Статус</div>
						<div className={styles.tags}>
							{status.map(item => {
								const questionFilters = filters as QuestionFilters
								const isActive = questionFilters.status === item
								return (
									<button
										key={item}
										type='button'
										onClick={() => updateFilter('status', item)}
										className={clsx(styles.tag, isActive && styles.active)}
									>
										{item}
									</button>
								)
							})}
						</div>
					</div>
				</>
			)}
		</div>
	)
}
