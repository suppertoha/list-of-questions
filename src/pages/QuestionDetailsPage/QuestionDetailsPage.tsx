import { useMemo } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'
import { QuestionDetailsView } from '@/components/QuestionDetailsView/QuestionDetailsView'
import { useLearnedIds } from '@/hooks/useLearnedIds'
import {
	useGetPublicQuestionByIdQuery,
	useGetQuestionsQuery,
} from '@/store/api/questionsApi'
import { matchesFilters } from '@/utils/matchesFilters'
import { parseQuestionFilters } from '@/utils/questionFiltersFromParams'

export const QuestionDetailsPage = () => {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const location = useLocation()
	const { learnedIds } = useLearnedIds()

	const questionId = Number(id)

	const {
		data: question,
		isLoading,
		isError,
	} = useGetPublicQuestionByIdQuery(id!, { skip: !id })

	const { data: questionsData } = useGetQuestionsQuery()

	const filters = useMemo(
		() => parseQuestionFilters(new URLSearchParams(location.search)),
		[location.search]
	)

	const filteredQuestions = useMemo(() => {
		const allQuestions = questionsData?.data ?? []
		return allQuestions.filter(q => matchesFilters(q, filters, learnedIds))
	}, [questionsData, filters, learnedIds])

	const currentIndex = useMemo(
		() => filteredQuestions.findIndex(q => q.id === questionId),
		[filteredQuestions, questionId]
	)

	const hasPrev = currentIndex > 0
	const hasNext =
		currentIndex >= 0 && currentIndex < filteredQuestions.length - 1

	const goToQuestion = (nextId: number) => {
		navigate({
			pathname: ROUTES.question(nextId),
			search: location.search,
		})
	}

	const goPrev = () => {
		if (!hasPrev) return
		goToQuestion(filteredQuestions[currentIndex - 1].id)
	}

	const goNext = () => {
		if (!hasNext) return
		goToQuestion(filteredQuestions[currentIndex + 1].id)
	}

	if (isLoading) return <div>Загрузка...</div>
	if (isError || !question) return <div>Не найден</div>

	return (
		<QuestionDetailsView
			question={question}
			onPrev={goPrev}
			onNext={goNext}
			hasPrev={hasPrev}
			hasNext={hasNext}
		/>
	)
}
