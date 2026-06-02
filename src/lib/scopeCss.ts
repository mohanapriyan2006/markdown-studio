/**
 * Scope raw CSS so every selector targets descendants of `scopeSelector`.
 * `:root`, `html`, and `body` are rewritten to `scopeSelector`.
 * `@media`, `@supports`, `@document` are recursed into.
 * `@keyframes`, `@font-face`, `@import`, `@charset` are left untouched.
 */
export function scopeCss(css: string, scopeSelector: string): string {
  const cleaned = stripComments(css)
  return processBlocks(cleaned, scopeSelector)
}

function stripComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, '')
}

function processBlocks(css: string, scopeSelector: string): string {
  let result = ''
  let depth = 0
  let buffer = ''

  for (let i = 0; i < css.length; i++) {
    const char = css[i]
    buffer += char

    if (char === '{') {
      depth++
    } else if (char === '}') {
      depth--
      if (depth === 0) {
        result += transformBlock(buffer.trim(), scopeSelector) + '\n'
        buffer = ''
      }
    }
  }

  // Append any trailing content (e.g. stray text or partial rules)
  if (buffer.trim()) {
    result += buffer
  }

  return result
}

function transformBlock(block: string, scopeSelector: string): string {
  const openIdx = block.indexOf('{')
  if (openIdx === -1) return block

  const prelude = block.slice(0, openIdx).trim()
  const body = block.slice(openIdx + 1, -1).trim() // strip surrounding braces

  // Pass-through at-rules that should not be scoped
  if (
    prelude.startsWith('@import') ||
    prelude.startsWith('@charset') ||
    prelude.startsWith('@namespace')
  ) {
    return block
  }

  if (prelude.startsWith('@keyframes') || prelude.startsWith('@font-face')) {
    return block
  }

  // Recurse into container at-rules
  if (
    prelude.startsWith('@media') ||
    prelude.startsWith('@supports') ||
    prelude.startsWith('@document')
  ) {
    return `${prelude} {\n${processBlocks(body, scopeSelector)}\n}`
  }

  // Regular selectors — prepend scope
  const scopedSelectors = prelude
    .split(',')
    .map((s) => {
      const trimmed = s.trim()
      if (trimmed === ':root' || trimmed === 'html' || trimmed === 'body') {
        return scopeSelector
      }
      return `${scopeSelector} ${trimmed}`
    })
    .join(', ')

  return `${scopedSelectors} {\n${body}\n}`
}
