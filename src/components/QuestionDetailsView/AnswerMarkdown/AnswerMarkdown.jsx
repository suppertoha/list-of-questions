import { useEffect, useRef } from 'react'
import hljs from 'highlight.js'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'

import 'highlight.js/styles/github.min.css'

import { CodeBlock } from '../CodeBlock/CodeBlock'

const CODE_SEGMENT = /(```[\s\S]*?```|`[^`]+`)/g

const decodeEntities = (content) =>
	content
		.replace(/&gt;/g, '>')
		.replace(/&lt;/g, '<')
		.replace(/&amp;/g, '&')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")

const isHtmlContent = (content) => {
	const trimmed = content.trim()
	if (!trimmed.startsWith('<')) return false
	if (/^<p>\s*#/.test(trimmed)) return false

	return /<(pre|ul|ol|h[1-6]|table|blockquote)\b/i.test(trimmed)
}

const normalizeApiArtifacts = (content) =>
	content.replace(
		/(^|\n)(python|javascript|jsx|tsx|typescript|html|css|plaintext)\s*\n+(?:Copy\s*\n+)?(?:Download\s*\n+)?\n*```\w*\n/gim,
		'$1```$2\n'
	)

const cleanHtmlSegment = (segment) =>
	segment
		.replace(/^<p>/i, '')
		.replace(/<\/p>$/i, '')
		.replace(/<\/?p>/gi, '\n\n')
		.replace(/<br\s*\/?>/gi, '\n')
		.replace(/<strong>(.*?)<\/strong>/gis, '**$1**')
		.replace(/<em>(.*?)<\/em>/gis, '*$1*')
		.replace(/<[^>]+>/g, '')

const toMarkdown = (content) => {
	if (typeof content !== 'string') return ''

	const decoded = decodeEntities(content)
	const normalized = normalizeApiArtifacts(decoded)

	return normalized
		.split(CODE_SEGMENT)
		.map((segment) =>
			segment.startsWith('```') || segment.startsWith('`')
				? segment
				: cleanHtmlSegment(segment)
		)
		.join('')
		.trim()
}

const markdownComponents = {
	pre({ children }) {
		return <CodeBlock>{children}</CodeBlock>
	}
}

const HtmlAnswer = ({ content, className }) => {
	const rootRef = useRef(null)

	useEffect(() => {
		const root = rootRef.current
		if (!root) return

		root.querySelectorAll('pre code').forEach((block) => {
			hljs.highlightElement(block)
		})
	}, [content])

	return (
		<div
			ref={rootRef}
			className={className}
			dangerouslySetInnerHTML={{ __html: content }}
		/>
	)
}

const MarkdownAnswer = ({ content, className }) => {
	const markdown = toMarkdown(content)

	if (!markdown) return null

	return (
		<div className={className}>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				rehypePlugins={[rehypeHighlight]}
				components={markdownComponents}
			>
				{markdown}
			</ReactMarkdown>
		</div>
	)
}

export const AnswerMarkdown = ({ content, className }) => {
	if (typeof content !== 'string' || !content.trim()) return null

	if (isHtmlContent(content)) {
		return <HtmlAnswer content={content} className={className} />
	}

	return <MarkdownAnswer content={content} className={className} />
}
