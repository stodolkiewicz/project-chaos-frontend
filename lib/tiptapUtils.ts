import { generateHTML } from '@tiptap/html'
import StarterKit from '@tiptap/starter-kit'
import { JSONContent, Content } from '@tiptap/react'

/**
 * Converts TipTap JSON content to HTML for display
 * 
 * @example
 * // Input: '{"type":"doc","content":[{"type":"paragraph","content":[{"text":"Hello world!","type":"text"}]}]}'
 * // Output: '<p>Hello world!</p>'
 */
export const convertTipTapContentToHtml = (content: string): string => {
  try {
    const parsedContent = JSON.parse(content)
    return generateHTML(parsedContent as JSONContent, [StarterKit])
  } catch {
    return content // fallback for plain text
  }
}

/**
 * Extracts plain text from TipTap JSON content (removes all formatting)
 * 
 * @example
 * // Input: '{"type":"doc","content":[{"type":"paragraph","content":[{"text":"Hello world!","type":"text"}]}]}'
 * // Output: 'Hello world!'
 * 
 * @example
 * // Input: '{"type":"doc","content":[{"type":"heading","content":[{"text":"Title","type":"text"}]},{"type":"paragraph","content":[{"text":"Text","type":"text"}]}]}'
 * // Output: 'Title Text'
 */
export const extractTextFromTipTapContent = (content: Content | string): string => {
  if (typeof content === 'string') {
    try {
      const parsedContent = JSON.parse(content)
      return extractTextFromTipTapContent(parsedContent)
    } catch {
      return content
    }
  }
  
  if (content && typeof content === 'object' && 'content' in content) {
    const nodes = content.content || []
    return nodes.map((node: any) => {
      if (node.type === 'text') return node.text || ''
      if (node.content) return extractTextFromTipTapContent({ content: node.content })
      return ''
    }).join(' ')
  }
  
  return ''
}