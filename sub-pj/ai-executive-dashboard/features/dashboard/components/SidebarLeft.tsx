import { FileText, Calendar, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Report } from "@/lib/types";

interface SidebarLeftProps {
  reports: Report[];
  activeReportId?: string;
  onSelectReport: (id: string) => void;
}

export function SidebarLeft({ reports, activeReportId, onSelectReport }: SidebarLeftProps) {
  const sortedReports = [...reports].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h2 className="font-bold text-slate-700 flex items-center gap-2 text-sm">
          <Calendar size={18} className="text-indigo-500" />
          レポート一覧
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-slate-50/30">
        {sortedReports.map((report) => (
          <button
            key={report.id}
            onClick={() => onSelectReport(report.id)}
            className={cn(
                "w-full text-left p-3 rounded-lg border transition-all duration-200",
                activeReportId === report.id
                  ? 'bg-white border-indigo-400 shadow-md ring-1 ring-indigo-100'
                  : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50'
            )}
          >
            <div className="text-[10px] text-slate-500 mb-1 font-mono uppercase tracking-wider">
              Week {report.week}, {report.year}
            </div>
            <div className={cn(
                "text-sm font-semibold truncate",
                activeReportId === report.id ? 'text-indigo-700' : 'text-slate-800'
            )}>
              {report.title}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {new Date(report.createdAt).toLocaleDateString('ja-JP')}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
