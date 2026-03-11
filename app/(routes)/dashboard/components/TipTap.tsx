'use client'

import { Content } from "@tiptap/react"
import { CustomTiptapEditor } from "@/components/ui/minimal-tiptap/CustomTiptapEditor"

interface TiptapProps {
  value?: Content
  onChange?: (value: Content) => void
  toolbarSections?: ('headings' | 'formatting' | 'colors' | 'lists' | 'blocks')[]
}

const Tiptap = ({ value, onChange, toolbarSections = ['headings', 'formatting'] }: TiptapProps) => {
  const defaultContent: Content = { type: 'doc', content: [] }

  return (
    <CustomTiptapEditor
      value={value ?? defaultContent}
      onChange={onChange}
      className="w-full"
      editorContentClassName="p-5"
      output="json"
      placeholder="Type your comment here..."
      autofocus={true}
      editable={true}
      editorClassName="focus:outline-none"
      enabledSections={toolbarSections}
    />
  )
}

export default Tiptap