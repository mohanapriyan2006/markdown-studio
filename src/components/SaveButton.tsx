import React, { useState } from 'react'
import { Save } from 'lucide-react'
import { saveDoc } from '../services/savedDocs'
import { PromptModal } from './PromptModal'
import { useEditorStore } from '../stores/editorStore'

export function SaveButton() {
  const [showModal, setShowModal] = useState(false)
  const { markdown, customCss, markSaved } = useEditorStore()

  const handleSave = (title: string) => {
    saveDoc(title, markdown, customCss)
    markSaved()
    setShowModal(false)
  }

  return (
    <>
      <button
        className="btn btn-primary"
        onClick={() => setShowModal(true)}
        title="Save Document"
      >
        <Save size={14} />
        <span className="btn-label">Save</span>
      </button>

      <PromptModal
        open={showModal}
        title="Save Document"
        label="Document title:"
        placeholder="My Document"
        confirmLabel="Save"
        onConfirm={handleSave}
        onCancel={() => setShowModal(false)}
      />
    </>
  )
}