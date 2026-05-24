import profileIcon from '@/assets/images/socials/profile.png'
import telegramIcon from '@/assets/images/socials/telegram.png'
import youtubeIcon from '@/assets/images/socials/youtube.png'

export interface SocialLink {
	id: string
	label: string
	href: string
	icon: string
}

export const EXPERT_SOCIAL_LINKS: SocialLink[] = [
	{
		id: 'telegram',
		label: 'Telegram',
		href: 'https://t.me/yeahub',
		icon: telegramIcon
	},
	{
		id: 'youtube',
		label: 'YouTube',
		href: 'https://www.youtube.com/@yeahub',
		icon: youtubeIcon
	},
	{
		id: 'profile',
		label: 'Профиль',
		href: 'https://yeahub.ru',
		icon: profileIcon
	}
]
