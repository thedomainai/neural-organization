"use client";

import { useState } from "react";
import { Layout, UserCircle, Briefcase, ChevronRight } from "lucide-react";
import { SidebarLeft } from "@/features/dashboard/components/SidebarLeft";
import { SidebarRight } from "@/features/dashboard/components/SidebarRight";
import { ReportView } from "@/features/dashboard/components/ReportView";
import { ResearchConsole } from "@/features/dashboard/components/ResearchConsole";
import { MOCK_ARTICLES, MOCK_REPORTS, CATEGORIES } from "@/lib/data";

export default function DashboardPage() {
  const [activeReportId, setActiveReportId] = useState<string>(MOCK_REPORTS[0].id);

  const activeReport = MOCK_REPORTS.find((r) => r.id === activeReportId);

  return (
    <div className="flex h-screen flex-col text-slate-800 bg-slate-100 overflow-hidden font-sans">
      {/* Header - Styled after SyncLine */}
      <header className="h-14 bg-slate-900 flex items-center justify-between px-4 shadow-lg shrink-0 z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-white">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Layout size={18} />
            </div>
            <span className="font-bold text-lg tracking-tight">Executive Intelligence</span>
          </div>
          <div className="h-8 w-px bg-slate-700 mx-2 hidden md:block"></div>
          
          {/* Mock Client Selector style */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-white/90 text-sm">
            <Briefcase size={16} className="text-indigo-400" />
            <span className="font-semibold">All Domains</span>
            <ChevronRight size={14} className="opacity-50" />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white border-2 border-slate-800">
                <UserCircle size={20} />
           </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: 12-col grid equivalent ~col-span-2 */}
        <div className="w-64 shrink-0 h-full overflow-hidden border-r border-slate-200">
          <SidebarLeft 
            reports={MOCK_REPORTS} 
            activeReportId={activeReportId} 
            onSelectReport={setActiveReportId} 
          />
        </div>

        {/* Center Workspace: ~col-span-7 */}
        <div className="flex-1 h-full overflow-hidden flex flex-col relative bg-white">
            <div className="flex-1 overflow-y-auto">
                <ReportView report={activeReport} />
            </div>
            
            {/* Bottom Sheet Console */}
            <div className="absolute bottom-0 left-0 right-0 z-20">
                <ResearchConsole />
            </div>
        </div>

        {/* Right Panel: ~col-span-3 */}
        <div className="w-80 shrink-0 h-full overflow-hidden bg-slate-50 border-l border-slate-200">
          <SidebarRight 
            articles={MOCK_ARTICLES} 
            categories={CATEGORIES} 
          />
        </div>
      </div>
    </div>
  );
}