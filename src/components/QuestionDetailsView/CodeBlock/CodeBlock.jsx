import { Children, isValidElement, useState } from 'react'

import styles from './CodeBlock.module.scss'

const getCodeText = (children) => {
	const child = Children.toArray(children)[0]

	if (!isValidElement(child)) return ''

	const { children: codeChildren } = child.props

	if (typeof codeChildren === 'string') return codeChildren

	if (Array.isArray(codeChildren)) {
		return codeChildren
			.map((part) => (typeof part === 'string' ? part : ''))
			.join('')
	}

	return String(codeChildren ?? '')
}

export const CodeBlock = ({ children }) => {
	const [copied, setCopied] = useState(false)
	const codeText = getCodeText(children)

	const handleCopy = async () => {
		if (!codeText) return

		try {
			await navigator.clipboard.writeText(codeText)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch {
			/* clipboard unavailable */
		}
	}

	return (
		<div className={styles.codeBlock}>
			<pre className={styles.pre}>{children}</pre>
			<button
				type='button'
				className={styles.copyButton}
				onClick={handleCopy}
				aria-label='Копировать код'
			>
				{copied ? 'Скопировано' : 'Копировать'}
			</button>
		</div>
	)
}
