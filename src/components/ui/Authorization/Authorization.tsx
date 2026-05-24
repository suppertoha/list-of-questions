import { useHideOnClick } from '@/hooks/useHideOnClick'

import { SvgIcon } from '@/components/SvgIcon/SvgIcon'

import Button from '@/components/ui/Button/Button'

import styles from './Authorization.module.scss'

type Props = {
	widthWindow: number
	isActiveAuth: boolean
	toggleAuth: () => void
	closeAuth: () => void
}
export const Authorization = ({
	widthWindow,
	isActiveAuth,
	toggleAuth,
	closeAuth
}: Props) => {
	const ref = useHideOnClick(closeAuth, isActiveAuth)

	return (
		<>
			{widthWindow > 1024 ? (
				<div className={styles.root}>
					<Button href='http://tragtorr.in' variant='link'>
						Вход
					</Button>
					<Button variant='primary' size='xl'>
						Регистрация
					</Button>
				</div>
			) : (
				<div ref={ref} className={styles.mob}>
					<button onClick={toggleAuth} className={styles.btn}>
						{SvgIcon.BurgerIcon}
					</button>

					{isActiveAuth ? (
						<div className={styles.block}>
							<Button variant='iconLeft' size='md'>
								<span>{SvgIcon.User}</span>
								Вход
							</Button>
							<Button variant='iconLeft' size='md'>
								<span>{SvgIcon.AddUser}</span>
								Регистрация
							</Button>
						</div>
					) : (
						''
					)}
				</div>
			)}
		</>
	)
}
