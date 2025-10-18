'use client'

import { useState, useRef } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [showToolbar, setShowToolbar] = useState(false)

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const handleFocus = () => {
    setShowToolbar(true)
  }

  const handleBlur = () => {
    // Delay to allow toolbar button clicks
    setTimeout(() => setShowToolbar(false), 200)
  }

  const toolbarButtons: Array<{ divider?: boolean; command?: string; value?: string; icon?: string; title?: string }> = [
    { command: 'bold', icon: 'B', title: 'Bold' },
    { command: 'italic', icon: 'I', title: 'Italic' },
    { command: 'underline', icon: 'U', title: 'Underline' },
    { command: 'strikeThrough', icon: 'S', title: 'Strikethrough' },
    { divider: true },
    { command: 'formatBlock', value: 'h1', icon: 'H1', title: 'Heading 1' },
    { command: 'formatBlock', value: 'h2', icon: 'H2', title: 'Heading 2' },
    { command: 'formatBlock', value: 'h3', icon: 'H3', title: 'Heading 3' },
    { command: 'formatBlock', value: 'p', icon: 'P', title: 'Paragraph' },
    { divider: true },
    { command: 'insertUnorderedList', icon: '•', title: 'Bullet List' },
    { command: 'insertOrderedList', icon: '1.', title: 'Numbered List' },
    { divider: true },
    { command: 'justifyLeft', icon: '≡', title: 'Align Left' },
    { command: 'justifyCenter', icon: '≡', title: 'Align Center' },
    { command: 'justifyRight', icon: '≡', title: 'Align Right' },
    { divider: true },
    { command: 'createLink', icon: '🔗', title: 'Insert Link' },
    { command: 'unlink', icon: '🔗⃠', title: 'Remove Link' },
    { divider: true },
    { command: 'removeFormat', icon: '✖', title: 'Clear Formatting' },
  ]

  const handleLinkInsert = () => {
    const url = prompt('Enter URL:')
    if (url) {
      execCommand('createLink', url)
    }
  }

  return (
    <div className="rich-text-editor border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      {showToolbar && (
        <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
          {toolbarButtons.map((btn, idx) => {
            if (btn.divider) {
              return <div key={idx} className="w-px bg-gray-300 mx-1" />
            }

            return (
              <button
                key={idx}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault()
                  if (btn.command === 'createLink') {
                    handleLinkInsert()
                  } else if (btn.command) {
                    execCommand(btn.command, btn.value)
                  }
                }}
                className="px-2 py-1 text-sm font-medium bg-white hover:bg-gray-100 border border-gray-300 rounded transition"
                title={btn.title}
                style={
                  btn.command === 'bold'
                    ? { fontWeight: 'bold' }
                    : btn.command === 'italic'
                    ? { fontStyle: 'italic' }
                    : btn.command === 'underline'
                    ? { textDecoration: 'underline' }
                    : {}
                }
              >
                {btn.icon}
              </button>
            )
          })}
        </div>
      )}

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        dangerouslySetInnerHTML={{ __html: value }}
        className="p-4 min-h-[200px] focus:outline-none prose max-w-none"
        data-placeholder={placeholder}
      />

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
        }
      `}</style>
    </div>
  )
}
