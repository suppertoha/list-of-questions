import { Navigate, Route, Routes } from 'react-router-dom'

import { Layout } from '@/components/Layout/Layout'
import { CollectionDetailsPage } from '@/pages/CollectionDetailsPage/CollectionDetailsPage'
import { CollectionsPage } from '@/pages/CollectionsPage/CollectionsPage'
import { ListQuestionsPage } from '@/pages/ListQuestionsPage/ListQuestionsPage'
import { QuizPage } from '@/pages/QuizPage/QuizPage'
import { QuizPlayPage } from '@/pages/QuizPlayPage/QuizPlayPage'
import { QuizResultPage } from '@/pages/QuizResultPage/QuizResultPage'
import { PlaceholderPage } from '@/pages/PlaceholderPage/PlaceholderPage'
import { QuestionDetailsPage } from '@/pages/QuestionDetailsPage/QuestionDetailsPage'

function App() {
	return (
		<Routes>
			<Route path='/' element={<Layout />}>
				<Route index element={<Navigate to='/questions' replace />} />
				<Route path='questions' element={<ListQuestionsPage />} />
				<Route path='questions/:id' element={<QuestionDetailsPage />} />
				<Route path='collections' element={<CollectionsPage />} />
				<Route path='collections/:id' element={<CollectionDetailsPage />} />
				<Route path='quiz' element={<QuizPage />} />
				<Route path='quiz/play' element={<QuizPlayPage />} />
				<Route path='quiz/result' element={<QuizResultPage />} />
				<Route
					path='materials'
					element={<PlaceholderPage title='Материалы' />}
				/>
			</Route>
		</Routes>
	)
}

export default App
