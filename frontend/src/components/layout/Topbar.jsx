import { Bell, User } from 'lucide-react'

export default function Topbar() {
  return (
    <header className="h-16 bg-white border-b border-[#e3eaf7] flex items-center justify-between px-6 shrink-0 z-10 sticky top-0">
      <div className="flex items-center gap-2">
        <span className="text-[#8899b0] font-medium">Adamas Tech</span>
        <span className="text-[#8899b0]">/</span>
        <span className="text-[#1a2340] font-semibold">Overview</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="bg-[#e8f1ff] text-[#1a6fcf] text-xs font-semibold px-2 py-1 rounded-full">
          PINT AE v1.0
        </div>
        <button className="text-[#5a6a85] hover:text-[#1a6fcf] transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-[#e53e3e] rounded-full border border-white"></span>
        </button>
        <div className="h-12 pl-6 pr-2 border-l border-[#e3eaf7] flex items-center">
          <img 
            src="assets/adamas-logo.png" 
            alt="Adamas Tech Consulting"
            className="h-12 max-w-[200px] object-contain"
          />
        </div>
      </div>
    </header>
  )
}
