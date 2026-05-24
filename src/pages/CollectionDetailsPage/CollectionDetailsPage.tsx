import { useCallback, useEffect, useMemo } from 'react'
import { useLocation, useParams, useSearchParams } from 'react-router-dom'

import { CollectionDetailsView } from '@/components/CollectionDetailsView/CollectionDetailsView'
import { WrapperPage } from '@/components/WrapperPage/WrapperPage'
import { ITEMS_PER_PAGE } from '@/constants/pagination'
import { useGetCollectionByIdPublicQuery } from '@/store/api/collectionsApi'
import { useGetQuestionsByCollectionIdQuery } from '@/store/api/questionsApi'

export const CollectionDetailsPage = () => {
	const { id } = useParams<{ id: string }>()
	const location = useLocation()
	const [searchParams, setSearchParams] = useSearchParams()
	const listSearch = location.search.replace(/^\?/, '')

	const currentPage = Math.max(1, Number(searchParams.get('page')) || 1)

	const setPage = useCallback(
		(page: number) => {
			const safePage = Math.max(1, page)
			setSearchParams(
				prev => {
					const next = new URLSearchParams(prev)
					if (safePage <= 1) next.delete('page')
					else next.set('page', String(safePage))
					return next
				},
				{ replace: true }
			)
		},
		[setSearchParams]
	)

	const {
		data: collection,
		isLoading: isCollectionLoading,
		isError: isCollectionError,
	} = useGetCollectionByIdPublicQuery(id!, { skip: !id })

	const shouldLoadQuestions = Boolean(id && collection?.isFree)

	const {
		data: questionsData,
		isLoading: isQuestionsLoading,
		isError: isQuestionsError,
	} = useGetQuestionsByCollectionIdQuery(id!, {
		skip: !shouldLoadQuestions,
	})

	const questions = questionsData?.data ?? []
	const loading = isCollectionLoading || (shouldLoadQuestions && isQuestionsLoading)
	const error =
		isCollectionError || (shouldLoadQuestions && isQuestionsError)
			? 'Ошибка загрузки'
			: null

	const totalPages = Math.max(
		1,
		Math.ceil(questions.length / ITEMS_PER_PAGE)
	)

	useEffect(() => {
		if (currentPage > totalPages) {
			setPage(totalPages)
		}
	}, [currentPage, totalPages, setPage])

	const paginatedQuestions = useMemo(() => {
		const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
		return questions.slice(startIndex, startIndex + ITEMS_PER_PAGE)
	}, [questions, currentPage])

	const changePage = (page: number) => {
		setPage(page)
	}

	const changePageButtonPrev = () => {
		if (currentPage <= 1) return
		setPage(currentPage - 1)
	}

	const changePageButtonNext = () => {
		if (currentPage >= totalPages) return
		setPage(currentPage + 1)
	}

	if (loading) {
		return (
			<WrapperPage>
				<div>Загрузка…</div>
			</WrapperPage>
		)
	}

	if (error || !collection) {
		return (
			<WrapperPage>
				<div>Коллекция не найдена</div>
			</WrapperPage>
		)
	}

	return (
		<WrapperPage>
			<CollectionDetailsView
				collection={collection}
				questions={questions}
				paginatedQuestions={paginatedQuestions}
				listSearch={listSearch}
				totalPages={totalPages}
				currentPage={currentPage}
				changePage={changePage}
				changePageButtonPrev={changePageButtonPrev}
				changePageButtonNext={changePageButtonNext}
			/>
		</WrapperPage>
	)
}
