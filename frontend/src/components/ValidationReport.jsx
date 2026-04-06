import { CheckCircle2, XCircle, AlertTriangle, Copy, Check } from 'lucide-react'
import { useState } from 'react'

const SEV_STYLE = {
  HIGH:   'bg-red-950 text-red-400 border-red-900',
  MEDIUM: 'bg-amber-950 text-amber-400 border-amber-900',
  LOW:    'bg-[#f8faff] text-[#8899b0] border-[#e3eaf7]',
}
const CAT_STYLE = {
  FORMAT:      'bg-violet-950 text-violet-400',
  CALCULATION: 'bg-orange-950 text-orange-400',
  COMPLIANCE:  'bg-sky-950 text-sky-400',
}

function MetricsBar({ metrics }) {
  if (!metrics) return null
  const pct = Math.round(metrics.pass_percentage ?? 0)
  const color = pct === 100 ? 'bg-emerald-500' : pct >= 70 ? 'bg-amber-500' : 'bg-red-500'

  return (
    <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-[#e3eaf7]">
      <div className="flex-1">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-[#8899b0]">Pass rate</span>
          <span className="font-semibold text-[#1a2340]">{pct}%</span>
        </div>
        <div className="h-1.5 bg-[#f8faff] rounded-full overflow-hidden">
          <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="flex gap-3 text-xs">
        {[
          { label: 'Total', val: metrics.total_checks, cls: 'text-[#1a2340]' },
          { label: 'Passed', val: metrics.passed_checks, cls: 'text-emerald-400' },
          { label: 'Failed', val: metrics.failed_checks, cls: 'text-red-400' },
        ].map(m => (
          <div key={m.label} className="text-center">
            <div className={`font-bold text-base ${m.cls}`}>{m.val}</div>
            <div className="text-slate-600">{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ErrorList({ items, title, icon: Icon, iconClass }) {
  if (!items?.length) return null
  return (
    <div>
      <div className={`flex items-center gap-1.5 text-xs font-medium mb-2 ${iconClass}`}>
        <Icon size={13} /> {title} ({items.length})
      </div>
      <div className="flex flex-col gap-1.5">
        {items.map((e, i) => (
          <div key={i} className={`rounded-lg border px-3 py-2 text-xs ${SEV_STYLE[e.severity] || SEV_STYLE.LOW}`}>
            <div className="flex items-start justify-between gap-2">
              <span className="font-mono font-medium">{e.field}</span>
              <div className="flex gap-1 flex-shrink-0">
                {e.severity && (
                  <span className={`px-1.5 py-0.5 rounded text-xs border ${SEV_STYLE[e.severity]}`}>{e.severity}</span>
                )}
                {e.category && (
                  <span className={`px-1.5 py-0.5 rounded text-xs ${CAT_STYLE[e.category] || 'bg-[#f8faff] text-[#8899b0]'}`}>{e.category}</span>
                )}
              </div>
            </div>
            <p className="mt-1 text-[#8899b0] leading-relaxed">{e.error}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function JsonCollapse({ data, label }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const json = JSON.stringify(data, null, 2)

  const copy = async () => {
    await navigator.clipboard.writeText(json)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="border border-[#e3eaf7] rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2 text-xs text-[#8899b0] hover:bg-white transition-colors"
      >
        <span className="font-medium">{label}</span>
        <span>{open ? '▲' : '▼'} raw JSON</span>
      </button>
      {open && (
        <div className="relative">
          <button onClick={copy} className="absolute top-2 right-2 p-1 text-[#5a6a85] hover:text-[#1a2340]">
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          </button>
          <pre className="json-editor text-xs p-3 overflow-x-auto rounded-none border-t border-[#e3eaf7]" style={{ minHeight: 'unset', height: 'auto' }}>
            {json}
          </pre>
        </div>
      )}
    </div>
  )
}

function StageResult({ stageKey, label, result, stage }) {
  if (stage === 'idle') return null

  const report = result?.report
  const isValid = report?.is_valid

  return (
    <div className={`rounded-xl border p-4 flex flex-col gap-3 stage-${stage}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {stage === 'success'
            ? <CheckCircle2 size={16} className="text-emerald-400" />
            : <XCircle size={16} className="text-red-400" />
          }
          <span className="font-semibold text-sm">{label}</span>
          {report?.invoice_number && (
            <span className="text-xs text-[#5a6a85] font-mono">#{report.invoice_number}</span>
          )}
        </div>
        {report && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isValid ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'}`}>
            {isValid ? 'VALID' : 'INVALID'}
          </span>
        )}
      </div>

      {report?.metrics && <MetricsBar metrics={report.metrics} />}

      <ErrorList items={report?.errors}   title="Errors"   icon={XCircle}       iconClass="text-red-400" />
      <ErrorList items={report?.warnings} title="Warnings" icon={AlertTriangle}  iconClass="text-amber-400" />

      {result?.clearance_id && (
        <div className="flex items-center gap-2 p-3 bg-emerald-950/50 border border-emerald-900 rounded-lg">
          <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
          <div className="text-xs">
            <span className="text-emerald-400 font-semibold">Clearance ID: </span>
            <span className="font-mono text-emerald-300">{result.clearance_id}</span>
          </div>
        </div>
      )}

      {result?.asp_status && !result?.clearance_id && (
        <div className="text-xs text-[#8899b0]">
          ASP status: <span className="text-sky-400 font-medium">{result.asp_status}</span>
          {result.message && <span className="ml-2 text-[#5a6a85]">{result.message}</span>}
        </div>
      )}

      <JsonCollapse data={result} label={label} />
    </div>
  )
}

export default function ValidationReport({ stages, results, error }) {
  const allIdle = Object.values(stages).every(s => s === 'idle')

  if (allIdle) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-600">
        <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#e3eaf7] flex items-center justify-center mb-3">
          <Play size={18} className="text-slate-700" />
        </div>
        <p className="text-sm">Load a sample and run the pipeline</p>
        <p className="text-xs mt-1 text-slate-700">Results appear here</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-950 border border-red-900 rounded-lg text-sm text-red-400">
          <XCircle size={15} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <StageResult stageKey="validate" label="Internal validation" result={results.validate} stage={stages.validate} />
      <StageResult stageKey="asp"      label="ASP mock validation"  result={results.asp}      stage={stages.asp} />
      <StageResult stageKey="submit"   label="FTA mock submission"  result={results.submit}   stage={stages.submit} />
    </div>
  )
}

// Fix missing import
function Play({ size, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  )
}
