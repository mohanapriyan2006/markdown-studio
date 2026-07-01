import React, { useState, useRef, useEffect } from 'react'
import { BookMarked, FileDown, Pencil, Trash2, ChevronDown } from 'lucide-react'
import { getAllSavedDocs, saveDoc, renameDoc, deleteDoc, type SavedDocument } from '../services/savedDocs'
import { PromptModal, ConfirmModal } from './PromptModal'

interface SavedDocsManagerProps {
  onLoad: (doc: SavedDocument) => void
}

export function SavedDocsManager({ onLoad }: SavedDocsManagerProps) {
  const [open, setOpen] = useState(false)
  const [docs, setDocs] = useState<SavedDocument[]>([])
  const ref = useRef<HTMLDivElement>(null)

  // Rename modal state
  const [renameTarget, setRenameTarget] = useState<string | null>(null)
  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const refreshDocs = () => {
    setDocs(getAllSavedDocs())
  }

  const handleToggle = () => {
    if (!open) refreshDocs()
    setOpen((o) => !o)
  }

  const handleLoad = (doc: SavedDocument) => {
    onLoad(doc)
    setOpen(false)
  }

  const handleRenameStart = (title: string) => {
    setRenameTarget(title)
    setOpen(false)
  }

  const handleRenameConfirm = (newTitle: string) => {
    if (renameTarget) {
      renameDoc(renameTarget, newTitle)
      setRenameTarget(null)
      refreshDocs()
    }
  }

  const handleDeleteStart = (title: string) => {
    setDeleteTarget(title)
    setOpen(false)
  }

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      deleteDoc(deleteTarget)
      setDeleteTarget(null)
      refreshDocs()
    }
  }

  return (
    <>
      <div className="dropdown" ref={ref}>
        <button
          className="btn btn-outline"
          onClick={handleToggle}
          id="saved-docs-btn"
          aria-haspopup="true"
          aria-expanded={open}
          title="Saved Documents"
        >
          <BookMarked size={14} />
          <span className="btn-label">Saved Docs</span>
          <ChevronDown size={12} style={{ opacity: 0.7, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>

        {open && (
          <div className="dropdown-menu saved-docs-menu" role="menu">
            <div className="dropdown-label">
              Saved Documents {docs.length > 0 && <span style={{ fontWeight: 400 }}>({docs.length})</span>}
            </div>

            {docs.length === 0 ? (
              <div className="dropdown-empty">
                No saved documents yet
              </div>
            ) : (
              docs.map((doc) => (
                <div key={doc.title} className="saved-doc-item" role="menuitem">
                  <button
                    className="saved-doc-load"
                    onClick={() => handleLoad(doc)}
                    title={`Load "${doc.title}"`}
                  >
                    <FileDown size={13} />
                    <span className="saved-doc-title">{doc.title}</span>
                    <span className="saved-doc-date">
                      {new Date(doc.savedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </button>
                  <div className="saved-doc-actions">
                    <button
                      className="saved-doc-action-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRenameStart(doc.title)
                      }}
                      title="Rename"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      className="saved-doc-action-btn saved-doc-action-btn-danger"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteStart(doc.title)
                      }}
                      title="Delete"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Rename modal */}
      <PromptModal
        open={renameTarget !== null}
        title="Rename Document"
        label="New title:"
        initialValue={renameTarget ?? ''}
        placeholder="Enter new title"
        confirmLabel="Rename"
        onConfirm={handleRenameConfirm}
        onCancel={() => setRenameTarget(null)}
      />

      {/* Delete confirm modal */}
      <ConfirmModal
        open={deleteTarget !== null}
        title="Delete Document"
        message={`Are you sure you want to delete "${deleteTarget}"? This cannot be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  )
}