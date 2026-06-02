import React, { useState } from 'react'
import {
  Settings2, Zap, ChevronDown, Eye, EyeOff,
  CheckCircle2, XCircle, Loader2, Save, RotateCcw, Shield, Sparkles,
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
    demoMode, setDemoMode,
  } = useAIStore()

  const [showKey, setShowKey] = useState(false)
  const [localConfig, setLocalConfig] = useState({ ...config })
  const [customModel, setCustomModel] = useState(() => {
    const currentPreset = PROVIDER_PRESETS[config.provider]
    return config.provider === 'custom' || !currentPreset.models.includes(config.model)
  })

  const preset = PROVIDER_PRESETS[localConfig.provider]

  const handleProviderChange = (provider: AIProvider) => {
    const p = PROVIDER_PRESETS[provider]
    setCustomModel(provider === 'custom')
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

  const handleUseDemo = () => {
    setDemoMode(true)
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
        {/* Demo AI */}
        <button
          className="ai-btn-save"
          onClick={handleUseDemo}
          style={{ width: '100%', justifyContent: 'center' }}
          title="Use demo Gemini key (may be unavailable)"
        >
          <Sparkles size={13} />
          Use Demo AI — Limited
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

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
          <span className="ai-hint">
            <Shield size={10} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            For security, settings are stored locally in your browser only — never on a server.
          </span>
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
          {!customModel && preset.models.length > 0 ? (
            <div className="ai-select-wrapper">
              <select
                className="ai-select"
                value={localConfig.model}
                onChange={(e) => {
                  if (e.target.value === '__custom__') {
                    setCustomModel(true)
                    setLocalConfig((c) => ({ ...c, model: '' }))
                  } else {
                    setLocalConfig((c) => ({ ...c, model: e.target.value }))
                  }
                }}
              >
                {preset.models.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
                <option value="__custom__">Custom (enter manually)</option>
              </select>
              <ChevronDown size={13} className="ai-select-icon" />
            </div>
          ) : (
            <div className="ai-input-wrapper" style={{ display: 'flex', gap: 8 }}>
              <input
                className="ai-input"
                value={localConfig.model}
                onChange={(e) => setLocalConfig((c) => ({ ...c, model: e.target.value }))}
                placeholder="model-name"
                spellCheck={false}
                style={{ flex: 1 }}
              />
              {preset.models.length > 0 && (
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    setCustomModel(false)
                    setLocalConfig((c) => ({ ...c, model: preset.model }))
                  }}
                  type="button"
                  title="Back to preset models"
                >
                  Presets
                </button>
              )}
            </div>
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
