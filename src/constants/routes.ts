export const ROUTES = {
	questions: '/questions',
	question: (id: number | string) => `/questions/${id}`,
	collections: '/collections',
	collection: (id: number | string) => `/collections/${id}`,
	quiz: '/quiz',
	quizPlay: '/quiz/play',
	quizResult: '/quiz/result',
	materials: '/materials',
} as const
