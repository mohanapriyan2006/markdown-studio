import React, { useState } from 'react'
import {
  Settings2, Zap, ChevronDown, Eye, EyeOff,
  CheckCircle2, XCircle, Loader2, Save, RotateCcw,
} from 'lucide-react'
import { useAIStore } from '../../stores/aiStore'
import { PROVIDER_PRESETS } from '../../types/ai'
import type { AIProvider } from '../../types/ai'
import { testAIConnection } from '../../services/ai/aiService'

const PROVIDERS: AIProvider[] = ['openai', 'anthropic', 'gemini', 'groq', 'openrouter', 'custom']

export function AISettingsPanel() {
  const {
    config, setConfig, setProvider,
    connectionStatus, connectionError,
    setConnectionStatus, setShowSettings,
    isConfigured, resetConfig,
  } = useAIStore()

  const [showKey, setShowKey] = useState(false)
  const [localConfig, setLocalConfig] = useState({ ...config })

  const preset = PROVIDER_PRESETS[localConfig.provider]

  const handleProviderChange = (provider: AIProvider) => {
    const p = PROVIDER_PRESETS[provider]
    setLocalConfig((c) => ({
      ...c,
      provider,
      endpoint: p.endpoint,
      model: p.model,
    }))
  }

  const handleSave = () => {
    setConfig(localConfig)
    if (localConfig.apiKey.trim() && localConfig.endpoint.trim()) {
      setShowSettings(false)
    }
  }

  const handleTest = async () => {
    setConnectionStatus('testing')
    try {
      await testAIConnection(localConfig)
      setConfig(localConfig)
      setConnectionStatus('success')
      setTimeout(() => setConnectionStatus('idle'), 3000)
    } catch (err) {
      setConnectionStatus('error', err instanceof Error ? err.message : 'Connection failed')
    }
  }

  return (
    <div className="ai-settings-panel">
      <div className="ai-settings-header">
        <div className="ai-settings-title">
          <Settings2 size={14} />
          AI Configuration
        </div>
        {isConfigured && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setShowSettings(false)}
            title="Back to chat"
          >
            Back to Chat
          </button>
        )}
      </div>

      <div className="ai-settings-body">
        {/* Provider */}
        <div className="ai-field">
          <label className="ai-label">Provider</label>
          <div className="ai-select-wrapper">
            <select
              className="ai-select"
              value={localConfig.provider}
              onChange={(e) => handleProviderChange(e.target.value as AIProvider)}
            >
              {PROVIDERS.map((p) => (
                <option key={p} value={p}>
                  {PROVIDER_PRESETS[p].label}
                </option>
              ))}
            </select>
            <ChevronDown size={13} className="ai-select-icon" />
          </div>
        </div>

        {/* API Key */}
        <div className="ai-field">
          <label className="ai-label">API Key</label>
          <div className="ai-input-wrapper">
            <input
              className="ai-input"
              type={showKey ? 'text' : 'password'}
              value={localConfig.apiKey}
              onChange={(e) => setLocalConfig((c) => ({ ...c, apiKey: e.target.value }))}
              placeholder="sk-..."
              autoComplete="off"
              spellCheck={false}
            />
            <button
              className="ai-input-suffix"
              onClick={() => setShowKey((v) => !v)}
              type="button"
              title={showKey ? 'Hide key' : 'Show key'}
            >
              {showKey ? <EyeOff size={13} /> : <Eye size={13} />}
            </button>
          </div>
          <span className="ai-hint">Stored locally in your browser only</span>
        </div>

        {/* Endpoint */}
        <div className="ai-field">
          <label className="ai-label">Endpoint</label>
          <input
            className="ai-input"
            type="url"
            value={localConfig.endpoint}
            onChange={(e) => setLocalConfig((c) => ({ ...c, endpoint: e.target.value }))}
            placeholder="https://api.openai.com/v1/chat/completions"
            spellCheck={false}
          />
        </div>

        {/* Model */}
        <div className="ai-field">
          <label className="ai-label">Model</label>
          {preset.models.length > 0 && localConfig.provider !== 'custom' ? (
            <div className="ai-select-wrapper">
              <select
                className="ai-select"
                value={localConfig.model}
                onChange={(e) => setLocalConfig((c) => ({ ...c, model: e.target.value }))}
              >
                {preset.models.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <ChevronDown size={13} className="ai-select-icon" />
            </div>
          ) : (
            <input
              className="ai-input"
              value={localConfig.model}
              onChange={(e) => setLocalConfig((c) => ({ ...c, model: e.target.value }))}
              placeholder="model-name"
              spellCheck={false}
            />
          )}
        </div>


        {/* Connection status */}
        {connectionStatus !== 'idle' && (
          <div className={`ai-connection-status ai-connection-${connectionStatus}`}>
            {connectionStatus === 'testing' && <Loader2 size={13} className="ai-spin" />}
            {connectionStatus === 'success' && <CheckCircle2 size={13} />}
            {connectionStatus === 'error' && <XCircle size={13} />}
            <span>
              {connectionStatus === 'testing' && 'Testing connection...'}
              {connectionStatus === 'success' && 'Connection successful!'}
              {connectionStatus === 'error' && (connectionError ?? 'Connection failed')}
            </span>
          </div>
        )}

        {/* Buttons */}
        <div className="ai-settings-actions">
          <button
            className="ai-btn-test"
            onClick={handleTest}
            disabled={connectionStatus === 'testing' || !localConfig.apiKey.trim()}
            id="ai-test-connection-btn"
          >
            {connectionStatus === 'testing' ? (
              <><Loader2 size={13} className="ai-spin" /> Testing...</>
            ) : (
              <><Zap size={13} /> Test Connection</>
            )}
          </button>

          <button
            className="ai-btn-save"
            onClick={handleSave}
            disabled={!localConfig.apiKey.trim() || !localConfig.endpoint.trim()}
            id="ai-save-config-btn"
          >
            <Save size={13} />
            Save & Start Chatting
          </button>
        </div>

        <button
          className="btn btn-ghost btn-sm"
          onClick={resetConfig}
          style={{ alignSelf: 'center', marginTop: 4, color: 'var(--text-muted)', fontSize: 11 }}
        >
          <RotateCcw size={10} />
          Reset to defaults
        </button>
      </div>
    </div>
  )
}
