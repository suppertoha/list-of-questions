import clsx from 'clsx'
import { NavLink } from 'react-router-dom'

import { SvgIcon } from '@/components/SvgIcon/SvgIcon'
import { HEADER_MENU } from '@/constants/constants'
import { useHideOnClick } from '@/hooks/useHideOnClick'

import styles from './MenuHeader.module.scss'

export const MenuHeader = ({
	widthWindow,
	toggleDropdown,
	closeDropdown,
	isActiveDropdown,
}) => {
	const ref = useHideOnClick(closeDropdown, isActiveDropdown)

	return (
		<>
			{widthWindow > 1024 ? (
				<ul className={clsx(styles.desktop)}>
					{HEADER_MENU.map(item => (
						<li key={item.id}>
							<NavLink
								to={item.path}
								end={item.path === '/questions'}
								className={({ isActive }) =>
									clsx(styles.desktop_link, isActive && styles.linkActive)
								}
							>
								{item.name}
							</NavLink>
						</li>
					))}
				</ul>
			) : (
				<div ref={ref} className={clsx(styles.mobile)}>
					<button
						className={clsx(
							styles.button,
							isActiveDropdown && styles.buttonActive
						)}
						onClick={toggleDropdown}
						type='button'
					>
						Подготовка
						{SvgIcon.ArrowBottomIcon}
					</button>
					{isActiveDropdown && (
						<ul className={clsx(styles.row)}>
							{HEADER_MENU.map(item => (
								<li key={item.id}>
									<NavLink
										to={item.path}
										end={item.path === '/questions'}
										className={({ isActive }) =>
											clsx(styles.link, isActive && styles.link_active)
										}
										onClick={closeDropdown}
									>
										{item.name}
									</NavLink>
								</li>
							))}
						</ul>
					)}
				</div>
			)}
		</>
	)
}
