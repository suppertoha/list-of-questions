import clsx from "clsx";
import styles from './WrapperPage.module.scss'

export const WrapperPage = ({children})=>{
	return <main className={clsx(styles.wrapper, 'container')}>
		{children}
	</main>
}