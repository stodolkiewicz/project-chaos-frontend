import "./styles/index.css"

import type { Content, Editor } from "@tiptap/react"
import type { UseMinimalTiptapEditorProps } from "./hooks/use-minimal-tiptap"
import { EditorContent, EditorContext } from "@tiptap/react"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { SectionOne } from "./components/section/one"
import { SectionTwo } from "./components/section/two"
import { SectionThree } from "./components/section/three"
import { SectionFour } from "./components/section/four"
import { SectionFive } from "./components/section/five"
import { LinkBubbleMenu } from "./components/bubble-menu/link-bubble-menu"
import { useMinimalTiptapEditor } from "./hooks/use-minimal-tiptap"
import { MeasuredContainer } from "./components/measured-container"
import { useTiptapEditor } from "./hooks/use-tiptap-editor"

export interface CustomTiptapEditorProps extends Omit<
  UseMinimalTiptapEditorProps,
  "onUpdate"
> {
  value?: Content
  onChange?: (value: Content) => void
  className?: string
  editorContentClassName?: string
  enabledSections?: ('headings' | 'formatting' | 'colors' | 'lists' | 'blocks')[]
}

const CustomToolbar = ({ 
  editor, 
  enabledSections = ['headings', 'formatting', 'colors', 'lists', 'blocks'] 
}: { 
  editor: Editor
  enabledSections?: ('headings' | 'formatting' | 'colors' | 'lists' | 'blocks')[]
}) => {
  const sections = []
  
  if (enabledSections.includes('headings')) {
    sections.push(<SectionOne key="headings" editor={editor} activeLevels={[1, 2, 3, 4, 5, 6]} />)
  }
  
  if (enabledSections.includes('formatting')) {
    if (sections.length > 0) sections.push(<Separator key="sep1" orientation="vertical" className="mx-2" />)
    sections.push(
      <SectionTwo
        key="formatting"
        editor={editor}
        activeActions={[
          "bold",
          "italic",
          "underline",
        ]}
        mainActionCount={3}
      />
    )
  }
  
  if (enabledSections.includes('colors')) {
    if (sections.length > 0) sections.push(<Separator key="sep2" orientation="vertical" className="mx-2" />)
    sections.push(<SectionThree key="colors" editor={editor} />)
  }
  
  if (enabledSections.includes('lists')) {
    if (sections.length > 0) sections.push(<Separator key="sep3" orientation="vertical" className="mx-2" />)
    sections.push(
      <SectionFour
        key="lists"
        editor={editor}
        activeActions={["orderedList", "bulletList"]}
        mainActionCount={0}
      />
    )
  }
  
  if (enabledSections.includes('blocks')) {
    if (sections.length > 0) sections.push(<Separator key="sep4" orientation="vertical" className="mx-2" />)
    sections.push(
      <SectionFive
        key="blocks"
        editor={editor}
        activeActions={["codeBlock", "blockquote", "horizontalRule"]}
        mainActionCount={0}
      />
    )
  }

  return (
    <div className="border-border flex h-12 shrink-0 overflow-x-auto border-b p-2">
      <div className="flex w-max items-center gap-px">
        {sections}
      </div>
    </div>
  )
}

export const CustomTiptapEditor = ({
  value,
  onChange,
  className,
  editorContentClassName,
  enabledSections,
  ...props
}: CustomTiptapEditorProps) => {
  const editor = useMinimalTiptapEditor({
    value,
    onUpdate: onChange,
    ...props,
  })

  if (!editor) {
    return null
  }

  return (
    <EditorContext.Provider value={{ editor }}>
      <MainCustomTiptapEditor
        editor={editor}
        className={className}
        editorContentClassName={editorContentClassName}
        enabledSections={enabledSections}
      />
    </EditorContext.Provider>
  )
}

CustomTiptapEditor.displayName = "CustomTiptapEditor"

export default CustomTiptapEditor

export const MainCustomTiptapEditor = ({
  editor: providedEditor,
  className,
  editorContentClassName,
  enabledSections,
}: CustomTiptapEditorProps & { editor: Editor }) => {
  const { editor } = useTiptapEditor(providedEditor)

  if (!editor) {
    return null
  }

  return (
    <MeasuredContainer
      as="div"
      name="editor"
      className={cn(
        "border-input min-data-[orientation=vertical]:h-72 flex h-auto w-full flex-col rounded-md border shadow-xs",
        "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
        className
      )}
    >
      <CustomToolbar editor={editor} enabledSections={enabledSections} />
      <EditorContent
        editor={editor}
        className={cn("minimal-tiptap-editor", editorContentClassName)}
      />
      <LinkBubbleMenu editor={editor} />
    </MeasuredContainer>
  )
}