import { useMemo, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Lead } from '../data';
import { formatAgo } from '../lib/format';

interface LeadsRailProps {
  leads: Lead[];
  selectedId: string;
  setSelectedId: (id: string) => void;
}

export default function LeadsRail({ leads, selectedId, setSelectedId }: LeadsRailProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');
  const [sortByRevenue, setSortByRevenue] = useState(false);

  const visibleLeads = useMemo(() => {
    let result = leads;
    const q = query.trim().toLowerCase();
    if (q) {
      result = result.filter(l => l.company.toLowerCase().includes(q) || l.contact.toLowerCase().includes(q));
    }
    if (sortByRevenue) {
      result = [...result].sort((a, b) => b.avg - a.avg);
    }
    return result;
  }, [leads, query, sortByRevenue]);

  return (
    <div className="w-[320px] bg-white flex flex-col flex-shrink-0 z-10 overflow-hidden relative">
      <div className="h-[68px] flex items-center justify-between px-5 border-b border-slate-200 flex-shrink-0 bg-slate-50">
        <h2 className="font-semibold text-[calc(14px+var(--font-offset))] tracking-wide text-slate-900">LEADS <span className="text-slate-500 text-[calc(12px+var(--font-offset))] ml-1">({visibleLeads.length})</span></h2>
        <div className="flex gap-1.5 text-slate-500">
          <button
            onClick={() => setShowSearch(v => !v)}
            title="Search leads"
            className={`p-1.5 rounded-lg transition-colors border ${showSearch ? 'bg-slate-900 text-white border-slate-900' : 'hover:bg-slate-100 hover:text-slate-900 border-transparent hover:border-slate-200'}`}
          >
            <Search size={16} strokeWidth={2}/>
          </button>
          <button
            onClick={() => setSortByRevenue(v => !v)}
            title="Sort by revenue (high to low)"
            className={`p-1.5 rounded-lg transition-colors border ${sortByRevenue ? 'bg-slate-900 text-white border-slate-900' : 'hover:bg-slate-100 hover:text-slate-900 border-transparent hover:border-slate-200'}`}
          >
            <Filter size={16} strokeWidth={2}/>
          </button>
        </div>
      </div>
      {showSearch && (
        <div className="px-4 py-3 border-b border-slate-200 bg-white flex-shrink-0">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search company or contact..."
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[calc(13px+var(--font-offset))] outline-none text-slate-900 focus:border-slate-400"
          />
        </div>
      )}
      <div className="flex-1 overflow-y-auto bg-white">
        {visibleLeads.length === 0 && (
          <div className="px-5 py-8 text-center text-[calc(13px+var(--font-offset))] text-slate-400">No leads match "{query}"</div>
        )}
        {visibleLeads.map((l) => (
          <div
            key={l.id}
            onClick={() => setSelectedId(l.id)}
            className={`flex items-center justify-between px-5 py-4 cursor-pointer transition-all border-b border-slate-200 ${selectedId === l.id ? 'bg-slate-100 border-l-[3px] border-l-blue-500' : 'bg-transparent border-l-[3px] border-l-transparent hover:bg-slate-50'}`}
          >
            <div className="flex-1 min-w-0 pr-3">
              <div className="font-semibold text-[calc(14px+var(--font-offset))] truncate leading-tight mb-1 text-slate-900">{l.company}</div>
              <div className="text-[calc(13px+var(--font-offset))] text-slate-500 truncate">{l.contact}</div>
            </div>
            <div className="text-right flex-shrink-0 flex flex-col items-end">
              <div className="text-[calc(14px+var(--font-offset))] text-slate-900 font-semibold">${(l.avg / 1000).toFixed(0)}k</div>
              <div className="text-[calc(12px+var(--font-offset))] text-slate-500 mt-1 font-medium">{formatAgo(l.lastAgo)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
