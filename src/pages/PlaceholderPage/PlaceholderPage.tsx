import { Link } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'

interface PlaceholderPageProps {
	title: string
}

export const PlaceholderPage = ({ title }: PlaceholderPageProps) => {
	return (
		<div style={{ padding: '2rem', maxWidth: 640, margin: '0 auto' }}>
			<h1>{title}</h1>
			<p>Раздел в разработке — будет в следующих практиках YeaHub.</p>
			<p>
				<Link to={ROUTES.questions}>← К базе вопросов</Link>
			</p>
		</div>
	)
}
