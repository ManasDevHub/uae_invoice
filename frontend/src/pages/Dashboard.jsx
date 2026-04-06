import { useState, useEffect } from 'react'
import Card from '../components/ui/Card'
import TrendChart from '../components/charts/TrendChart'
import Pill from '../components/ui/Pill'
import { Link } from 'react-router-dom'
import { FileText, CheckCircle, XCircle, ShieldCheck } from 'lucide-react'

export default function Dashboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/v1/analytics/summary', { 
          headers: { 
            'X-API-Key': 'demo-key-123',
            'ngrok-skip-browser-warning': 'true'
          } 
        })
        const json = await res.json()
        setData(json)
      } catch (e) {
        console.error(e)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a2340]">Welcome back, Admin</h1>
          <p className="text-sm text-[#5a6a85] mt-1">UAE PINT AE E-Invoice Engine · {new Date().toLocaleDateString('en-AE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI Cards */}
        <Card className="p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <FileText className="w-16 h-16 text-[#1a6fcf]" />
          </div>
          <div className="text-xs font-semibold text-[#8899b0] uppercase tracking-wider mb-2">Total Invoices</div>
          <div className="text-3xl font-bold text-[#1a2340]">{data?.total || 0}</div>
          <div className="text-xs text-[#22c55e] font-medium mt-2">↑ Active processing</div>
        </Card>

        <Card className="p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CheckCircle className="w-16 h-16 text-[#22c55e]" />
          </div>
          <div className="text-xs font-semibold text-[#8899b0] uppercase tracking-wider mb-2">Pass Rate</div>
          <div className="text-3xl font-bold text-[#1a2340]">{data?.pass_rate || 0}%</div>
          <div className="text-xs text-[#5a6a85] font-medium mt-2">Based on total volume</div>
        </Card>

        <Card className="p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <XCircle className="w-16 h-16 text-[#e53e3e]" />
          </div>
          <div className="text-xs font-semibold text-[#8899b0] uppercase tracking-wider mb-2">Failures</div>
          <div className="text-3xl font-bold text-[#1a2340]">{data?.failures || 0}</div>
          <div className="text-xs text-[#e53e3e] font-medium mt-2">Requires attention</div>
        </Card>

        <Card className="p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShieldCheck className="w-16 h-16 text-[#e07b00]" />
          </div>
          <div className="text-xs font-semibold text-[#8899b0] uppercase tracking-wider mb-2">Rule Checks</div>
          <div className="text-3xl font-bold text-[#1a2340]">51</div>
          <div className="text-xs text-[#e07b00] font-medium mt-2">PINT AE fields covered</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-[#1a2340]">Validation trend</h2>
            <Pill variant="blue">Live</Pill>
          </div>
          {data?.trend ? <TrendChart data={data.trend} /> : <div className="h-[200px] flex items-center justify-center text-[#8899b0]">No data</div>}
        </Card>

        <Card className="p-6 bg-gradient-to-br from-white to-[#f8faff] border-[#e3eaf7]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-[#1a2340]">Compliance timeline</h2>
            <Pill variant="green">On Track</Pill>
          </div>
          <div className="space-y-6">
            <div className="relative pl-6 border-l-2 border-[#22c55e]">
              <div className="absolute w-4 h-4 bg-[#22c55e] rounded-full -left-[9px] top-1 border-2 border-white flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-semibold text-[#1a2340]">ASP pre-approval</h3>
                  <p className="text-xs text-[#5a6a85] mt-0.5">Ministry of Finance</p>
                </div>
                <Pill variant="green">COMPLETED</Pill>
              </div>
            </div>
            <div className="relative pl-6 border-l-2 border-[#22c55e]">
              <div className="absolute w-4 h-4 bg-[#22c55e] rounded-full -left-[9px] top-1 border-2 border-white flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-semibold text-[#1a2340]">Legislative updates</h3>
                  <p className="text-xs text-[#5a6a85] mt-0.5">E-invoicing law published</p>
                </div>
                <Pill variant="green">COMPLETED</Pill>
              </div>
            </div>
            <div className="relative pl-6 border-l-2 border-[#1a6fcf] border-dashed">
              <div className="absolute w-4 h-4 bg-[#1a6fcf] rounded-full -left-[9px] top-1 border-2 border-white animate-pulse"></div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-semibold text-[#1a2340]">Phase 1 go-live</h3>
                  <p className="text-xs text-[#1a6fcf] font-medium mt-0.5">Integration period active</p>
                </div>
                <Pill variant="blue">JUL 2026</Pill>
              </div>
            </div>
            <div className="relative pl-6">
              <div className="absolute w-4 h-4 bg-[#e07b00] rounded-full -left-[9px] top-1 border-2 border-white"></div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-semibold text-[#1a2340]">Full mandate</h3>
                  <p className="text-xs text-[#5a6a85] mt-0.5">All UAE businesses</p>
                </div>
                <Pill variant="warning">JUL 2027+</Pill>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-[#1a2340]">Recent runs</h2>
          <Link to="/history" className="text-sm text-[#1a6fcf] hover:underline font-medium">View all history</Link>
        </div>
        
        {data?.latest_runs && data.latest_runs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#f8faff] text-[#5a6a85]">
                <tr>
                  <th className="px-4 py-2 font-medium">Invoice #</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                  <th className="px-4 py-2 font-medium">Compliance</th>
                  <th className="px-4 py-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3eaf7]">
                {data.latest_runs.map((r) => (
                  <tr key={r.id} className="hover:bg-[#f8faff]">
                    <td className="px-4 py-3 font-medium text-[#1a2340]">{r.invoice_number}</td>
                    <td className="px-4 py-3">
                      <Pill variant={r.is_valid ? 'green' : 'red'}>
                        {r.is_valid ? 'PASSED' : 'FAILED'}
                      </Pill>
                    </td>
                    <td className="px-4 py-3 text-[#5a6a85]">{r.pass_percentage || 0}%</td>
                    <td className="px-4 py-3 text-[#8899b0] text-xs">
                      {new Date(r.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-[#5a6a85] py-8 border-2 border-dashed border-[#e3eaf7] rounded-lg">
            Connect your system or run a manual validation to see real-time data here.
          </div>
        )}
      </Card>
      
    </div>
  )
}
