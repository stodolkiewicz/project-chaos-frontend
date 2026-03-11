'use client'

import { Content } from "@tiptap/react"
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap/minimal-tiptap"

interface TiptapProps {
  value?: Content
  onChange?: (value: Content) => void
}

const Tiptap = ({ value, onChange }: TiptapProps) => {
  const defaultContent: Content = { type: 'doc', content: [] }

  return (
    <MinimalTiptapEditor
      value={value ?? defaultContent}
      onChange={onChange}
      className="w-full"
      editorContentClassName="p-5"
      output="json"
      placeholder="Napisz coś..."
      autofocus={true}
      editable={true}
      editorClassName="focus:outline-none"
    />
  )
}

export default Tiptap