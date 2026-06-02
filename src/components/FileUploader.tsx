import React, { useRef, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload } from 'lucide-react'

interface FileUploaderProps {
  onFileLoad: (content: string) => void
}

export function FileUploader({ onFileLoad }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        if (content) onFileLoad(content)
      }
      reader.readAsText(file)
    },
    [onFileLoad]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/markdown': ['.md', '.markdown'], 'text/plain': ['.md', '.markdown'] },
    multiple: false,
    noClick: true,
  })

  const handleButtonClick = () => inputRef.current?.click()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      const content = evt.target?.result as string
      if (content) onFileLoad(content)
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <>
      <div {...getRootProps()} style={{ display: 'contents' }}>
        <input {...getInputProps()} />
        {isDragActive && (
          <div className="drop-overlay" style={{
            position: 'fixed', inset: 0, zIndex: 999,
            background: 'rgba(99,102,241,0.08)',
            border: '2px dashed var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(4px)',
          }}>
            <div className="drop-overlay-content">
              <Upload size={40} strokeWidth={1.5} />
              <p style={{ fontSize: 18, fontWeight: 700 }}>Drop your Markdown file here</p>
              <p style={{ fontSize: 13, opacity: 0.7 }}>Supports .md and .markdown</p>
            </div>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".md,.markdown,text/markdown"
        style={{ display: 'none' }}
        onChange={handleInputChange}
        id="file-upload-input"
      />
      <button
        className="btn btn-outline"
        onClick={handleButtonClick}
        title="Upload Markdown file (drag & drop anywhere)"
        id="upload-file-btn"
      >
        <Upload size={14} />
        Upload
      </button>
    </>
  )
}
