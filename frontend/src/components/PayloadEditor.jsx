import { useState } from 'react'
import { Copy, Check, RotateCcw } from 'lucide-react'
import { SAMPLES, DEMO_API_KEY } from '../constants/samplePayloads'

export default function PayloadEditor({ value, onChange, apiKey, onApiKeyChange }) {
  const [copied, setCopied] = useState(false)
  const [jsonError, setJsonError] = useState(null)

  const handleChange = (val) => {
    onChange(val)
    try { JSON.parse(val); setJsonError(null) }
    catch (e) { setJsonError(e.message) }
  }

  const loadSample = (key) => {
    const json = JSON.stringify(SAMPLES[key].payload, null, 2)
    handleChange(json)
  }

  const copyPayload = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const formatJson = () => {
    try {
      const formatted = JSON.stringify(JSON.parse(value), null, 2)
      handleChange(formatted)
    } catch {}
  }

  return (
    <div className="flex flex-col h-full gap-3">

      {/* Sample loaders */}
      <div>
        <p className="text-xs text-[#5a6a85] mb-2 font-medium uppercase tracking-wider">Load sample</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(SAMPLES).map(([key, { label, color }]) => (
            <button
              key={key}
              onClick={() => loadSample(key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md border border-[#e3eaf7] hover:border-slate-500 bg-white hover:bg-[#f8faff] transition-all ${color}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* API key */}
      <div className="flex items-center gap-2">
        <label className="text-xs text-[#5a6a85] whitespace-nowrap font-medium">API key</label>
        <input
          type="text"
          value={apiKey}
          onChange={e => onApiKeyChange(e.target.value)}
          placeholder="demo-key-123"
          className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#e3eaf7] rounded-md text-[#1a2340] placeholder-slate-600 focus:outline-none focus:border-sky-500 font-mono"
        />
      </div>

      {/* Editor header */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#5a6a85] font-medium uppercase tracking-wider">Payload JSON</span>
        <div className="flex items-center gap-1">
          {jsonError && (
            <span className="text-xs text-red-400 mr-2 max-w-48 truncate" title={jsonError}>
              ✗ {jsonError}
            </span>
          )}
          <button onClick={formatJson} className="p-1.5 text-[#5a6a85] hover:text-[#1a2340] hover:bg-[#f8faff] rounded transition-colors" title="Format JSON">
            <RotateCcw size={13} />
          </button>
          <button onClick={copyPayload} className="p-1.5 text-[#5a6a85] hover:text-[#1a2340] hover:bg-[#f8faff] rounded transition-colors" title="Copy">
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          </button>
        </div>
      </div>

      {/* Textarea */}
      <div className="flex-1 relative">
        <textarea
          className="json-editor"
          style={{ height: '100%', minHeight: '360px' }}
          value={value}
          onChange={e => handleChange(e.target.value)}
          spellCheck={false}
          autoComplete="off"
        />
        {jsonError && (
          <div className="absolute bottom-3 left-3 right-3 h-0.5 bg-red-500/40 rounded" />
        )}
      </div>

    </div>
  )
}
