import styles from './Skeleton.module.scss'

export const Skeleton = ({ width = '100%', height = 16, radius = 8, className = '' }) => {
	const inlineStyles = {
		width,
		height,
		borderRadius: radius
	}

	return <div className={`${styles.root} ${className}`.trim()} style={inlineStyles} />
}
