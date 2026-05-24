import clsx from 'clsx'
import { Link } from 'react-router-dom'

import { SvgIcon } from '@/components/SvgIcon/SvgIcon'

import styles from './BackLink.module.scss'

interface BackLinkProps {
	to: string
	onClick?: () => void
	className?: string
}

export const BackLink = ({ to, onClick, className }: BackLinkProps) => (
	<Link to={to} className={clsx(styles.root, className)} onClick={onClick}>
		<span className={styles.icon}>{SvgIcon.ArrowLeft}</span>
		<span>Назад</span>
	</Link>
)
