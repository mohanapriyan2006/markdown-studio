export interface SavedDocument {
  title: string
  markdown: string
  customCss: string
  savedAt: number // timestamp
}

const STORAGE_KEY = 'markdown-studio-saved-docs'

export function getAllSavedDocs(): SavedDocument[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const docs = JSON.parse(raw) as SavedDocument[]
    // Sort newest first
    return docs.sort((a, b) => b.savedAt - a.savedAt)
  } catch {
    return []
  }
}

function persistDocs(docs: SavedDocument[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs))
}

export function saveDoc(title: string, markdown: string, customCss: string): SavedDocument {
  const docs = getAllSavedDocs()
  // Remove existing doc with same title (overwrite)
  const filtered = docs.filter((d) => d.title !== title)
  const doc: SavedDocument = { title, markdown, customCss, savedAt: Date.now() }
  filtered.push(doc)
  persistDocs(filtered)
  return doc
}

export function renameDoc(oldTitle: string, newTitle: string): SavedDocument | null {
  const docs = getAllSavedDocs()
  const idx = docs.findIndex((d) => d.title === oldTitle)
  if (idx === -1) return null
  // Remove any doc with newTitle collision
  const withoutCollision = docs.filter((d) => d.title !== newTitle)
  const doc = docs[idx]
  const renamed: SavedDocument = { ...doc, title: newTitle, savedAt: Date.now() }
  // Re-insert at same position in the filtered array
  withoutCollision.splice(withoutCollision.findIndex((d) => d.title === oldTitle), 1, renamed)
  persistDocs(withoutCollision)
  return renamed
}

export function deleteDoc(title: string): void {
  const docs = getAllSavedDocs()
  persistDocs(docs.filter((d) => d.title !== title))
}

export function loadDoc(title: string): SavedDocument | null {
  const docs = getAllSavedDocs()
  return docs.find((d) => d.title === title) ?? null
}