import styles from './Button.module.scss'
type Props = {
	children: React.ReactNode;
	variant: 'base' | 'primary' | 'iconLeft' | 'link';
	size: 'sm' | 'md' | 'xl';
	className: string;
	href: string;
}
export default function Button({ children, variant = 'base', size='md', className, href, ...props }: Props) {
	const classes = [
		styles.btn,
		styles[`btn--${variant}`],
		styles[`btn--${size}`],
		href,
		className
	].join(' ')

	if(href){
		return <a href={href} target='_blank' className={classes} {...props}>{children}</a>
	}
	return <button className={classes} {...props}>{children}</button>
}