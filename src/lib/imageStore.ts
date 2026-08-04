const STORAGE_KEY = 'md-studio-images'
const MAX_IMAGES = 50
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024

const imageMap = new Map<string, string>()

export function generateImageKey(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let key = ''
  for (let i = 0; i < 8; i++) {
    key += chars[Math.floor(Math.random() * chars.length)]
  }
  return key
}

export function getImageCount(): number {
  return imageMap.size
}

export function addImage(dataUrl: string): string {
  while (imageMap.size >= MAX_IMAGES) {
    const oldest = imageMap.keys().next().value
    if (oldest === undefined) break
    imageMap.delete(oldest)
  }
  let key = generateImageKey()
  while (imageMap.has(key)) {
    key = generateImageKey()
  }
  imageMap.set(key, dataUrl)
  return key
}

export function getImage(key: string): string | undefined {
  return imageMap.get(key)
}

export function hasImage(key: string): boolean {
  return imageMap.has(key)
}

export function resolveImageRefs(md: string): string {
  return md.replace(/img:([a-z0-9]{8,16})/g, (match, key) => {
    const dataUrl = imageMap.get(key)
    return dataUrl || match
  })
}

export function persistImages(markdown?: string): void {
  if (markdown) {
    const referenced = new Set<string>()
    const regex = /img:([a-z0-9]{8,16})/g
    let match
    while ((match = regex.exec(markdown)) !== null) {
      referenced.add(match[1])
    }
    imageMap.forEach((_, key) => {
      if (!referenced.has(key)) {
        imageMap.delete(key)
      }
    })
  }

  const obj: Record<string, string> = {}
  imageMap.forEach((dataUrl, key) => {
    obj[key] = dataUrl
  })
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj))
  } catch {
    // localStorage may be full — images remain in memory for the session
  }
}

export function restoreImages(): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const obj = JSON.parse(raw) as Record<string, string>
    Object.entries(obj).forEach(([key, dataUrl]) => {
      if (!imageMap.has(key)) {
        imageMap.set(key, dataUrl)
      }
    })
  } catch {
    // ignore parse errors
  }
}
