
import logo from '@/assets/images/header/logo-icon.svg'
import logoText from '@/assets/images/header/logo-text.svg'

import styles from './Logo.module.scss'

export const Logo = ({ widthWindow }) => {
	return (
		<a href='/' className={styles.block}>
			<img src={logo} alt='logo' />
			{widthWindow > 500 ? <img src={logoText} alt='logo' /> : ''}
		</a>
	)
}
