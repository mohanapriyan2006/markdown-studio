import React from 'react'
import { useAIStore } from '../../stores/aiStore'
import { AISettingsPanel } from './AISettingsPanel'
import { AIChatPanel } from './AIChatPanel'

export function AICopilot() {
  const { showSettings, isConfigured } = useAIStore()

  // Show settings if not configured, or if user explicitly opened settings
  if (showSettings || !isConfigured) {
    return <AISettingsPanel />
  }

  return <AIChatPanel />
}
