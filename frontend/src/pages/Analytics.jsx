import { useState, useEffect } from 'react'
import Card from '../components/ui/Card'
import TrendChart from '../components/charts/TrendChart'
import DonutChart from '../components/charts/DonutChart'
import { API_BASE } from '../constants/api'

export default function Analytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/api/v1/analytics/summary`, { 
          headers: { 
            'X-API-Key': 'demo-key-123',
            'ngrok-skip-browser-warning': 'true'
          } 
        })
        const json = await res.json()
        setData(json)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className="p-8 text-[#5a6a85]">Loading analytics...</div>
  if (!data) return <div className="p-8 text-[#e53e3e]">Failed to load analytics</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1a2340]">Analytics Overview</h1>
        <p className="text-sm text-[#5a6a85] mt-1">Validation performance and error hotspots</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-sm font-semibold text-[#8899b0] uppercase tracking-wider mb-4">Pass Rate Trend (7 days)</h2>
          <TrendChart data={data.trend} />
        </Card>

        <Card className="p-6">
          <h2 className="text-sm font-semibold text-[#8899b0] uppercase tracking-wider mb-4">Error Breakdown by Category</h2>
          <DonutChart data={data.by_category} />
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-sm font-semibold text-[#8899b0] uppercase tracking-wider mb-4">Top Failing Fields</h2>
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[#f8faff] text-[#5a6a85]">
            <tr>
              <th className="px-4 py-3 font-medium rounded-l-lg">Field Name / Rule</th>
              <th className="px-4 py-3 font-medium text-right rounded-r-lg">Failure Count</th>
            </tr>
          </thead>
          <tbody>
            {data.top_errors.map((err, i) => (
              <tr key={i}>
                <td className="px-4 py-4 font-medium text-[#1a2340] border-b border-[#e3eaf7]">{err.field}</td>
                <td className="px-4 py-4 text-right text-[#e53e3e] font-semibold border-b border-[#e3eaf7]">{err.count}</td>
              </tr>
            ))}
            {data.top_errors.length === 0 && (
              <tr>
                <td colSpan={2} className="px-4 py-4 text-center text-[#5a6a85]">No errors recorded yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
