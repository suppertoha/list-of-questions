import { Link } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'
import { SvgIcon } from '@/components/SvgIcon/SvgIcon'

import type { Question } from '@/types/question'

import styles from './Accordion.module.scss'

interface AccordionProps {
	paginatedQuestions?: Question[]
	listSearch?: string
}

export const Accordion = ({
	paginatedQuestions = [],
	listSearch = ''
}: AccordionProps) => {
	const questionSearch = listSearch ? `?${listSearch}` : ''
	return (
		<>
			{paginatedQuestions.map(question => {
				return (
					<details className={styles.root} key={question.id}>
						<summary className={styles.head}>
							<p className={styles.title}>{question.title}</p>

							{SvgIcon.ArrowBottomIcon}
						</summary>

						<div className={styles.content}>
							<ul className={styles.meta}>
								<li className={styles.tag}>
									Рейтинг: <mark>{question.rate}</mark>
								</li>
								<li className={styles.tag}>
									Сложность: <mark>{question.complexity}</mark>
								</li>
							</ul>

							{question.imageSrc && (
								<img
									className={styles.image}
									src={question.imageSrc}
									alt={question.title}
								/>
							)}

							<p className={styles.text}>{question.description}</p>
							<Link
								to={`${ROUTES.question(question.id)}${questionSearch}`}
								className={styles.goLink}
							>
								Перейти к вопросу
							</Link>
						</div>
					</details>
				)
			})}
		</>
	)
}
