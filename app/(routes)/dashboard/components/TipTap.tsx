'use client'

import type { Content, Editor } from "@tiptap/react"
import { EditorContent, EditorContext } from "@tiptap/react"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { SectionOne } from "@/components/ui/minimal-tiptap/components/section/one"
import { SectionTwo } from "@/components/ui/minimal-tiptap/components/section/two"
import { LinkBubbleMenu } from "@/components/ui/minimal-tiptap/components/bubble-menu/link-bubble-menu"
import { useMinimalTiptapEditor } from "@/components/ui/minimal-tiptap/hooks/use-minimal-tiptap"
import { MeasuredContainer } from "@/components/ui/minimal-tiptap/components/measured-container"
import { useState } from 'react'

// Prosty Toolbar - tylko nagłówki i podstawowe formatowanie
const SimpleToolbar = ({ editor }: { editor: Editor }) => (
  <div className="border-border flex h-12 shrink-0 overflow-x-auto border-b p-2">
    <div className="flex w-max items-center gap-px">
      {/* Tylko nagłówki H1-H3 */}
      <SectionOne editor={editor} activeLevels={[1, 2, 3]} />

      <Separator orientation="vertical" className="mx-2" />

      {/* Tylko Bold i Italic */}
      <SectionTwo
        editor={editor}
        activeActions={["bold", "italic"]}
        mainActionCount={2}
      />
    </div>
  </div>
)

interface TiptapProps {
  value?: Content
  onChange?: (value: Content) => void
}

const Tiptap = ({ value: externalValue, onChange: externalOnChange }: TiptapProps = {}) => {
  const [internalValue, setInternalValue] = useState<Content>("")
  
  const value = externalValue !== undefined ? externalValue : internalValue
  const onChange = externalOnChange || setInternalValue

  const editor = useMinimalTiptapEditor({
    value,
    onUpdate: onChange,
    output: "json",
    placeholder: "Enter your description...",
    autofocus: true,
    editable: true,
    immediatelyRender: false,
  })

  if (!editor) {
    return null
  }

  return (
    <EditorContext.Provider value={{ editor }}>
      <MeasuredContainer
        as="div"
        name="editor"
        className={cn(
          "border-input min-data-[orientation=vertical]:h-72 flex h-auto w-full flex-col rounded-md border shadow-xs",
          "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]"
        )}
      >
        <SimpleToolbar editor={editor} />
        <EditorContent
          editor={editor}
          className={cn("minimal-tiptap-editor p-5")}
        />
        <LinkBubbleMenu editor={editor} />
      </MeasuredContainer>
    </EditorContext.Provider>
  )
}

export default Tiptap