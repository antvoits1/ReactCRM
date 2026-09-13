import { Phone, Mail, MessageSquareText, Users, FileText } from 'lucide-react';
import { Lead } from '../data';
import { formatFinancialUp, generateSalesPitch } from '../lib/format';

interface LeadDetailPanelProps {
  lead: Lead;
  onOpenDialer: (number?: string) => void;
  onOpenMessages: (number?: string) => void;
  setViewerDocIndex: (index: number) => void;
}

export default function LeadDetailPanel({ lead, onOpenDialer, onOpenMessages, setViewerDocIndex }: LeadDetailPanelProps) {
  const latestStmt = lead.stmts && lead.stmts.length > 0 ? lead.stmts[0] : null;
  const latestDocIndex = lead.mtd ? -1 : 0;

  const scrollToContact = () => {
    document.getElementById('lead-contact-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden bg-white relative">
      <div className="pb-32 flex flex-col min-h-full">

        {/* Record Header */}
        <div className="px-8 pt-8 pb-6 relative z-10 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="min-w-0">
              <h1 className="text-[calc(28px+var(--font-offset))] font-bold tracking-tight text-slate-900 leading-none">{lead.company}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => onOpenDialer(lead.mobiles[0]?.n ?? lead.landlines[0]?.n)} className="flex items-center justify-center w-10 h-10 rounded-full bg-[#007AFF] text-white hover:opacity-90 shadow-sm transition-opacity" title="Open dialer">
                <Phone size={18} fill="currentColor" />
              </button>
              <button className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-[#007AFF] hover:bg-slate-200 shadow-sm transition-colors" title="Message" onClick={() => onOpenMessages(lead.mobiles[0]?.n)}>
                <MessageSquareText size={18} fill="currentColor" className="text-[#007AFF]" />
              </button>
              <button className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-[#007AFF] hover:bg-slate-200 shadow-sm transition-colors" title="Email" onClick={() => { window.location.href = `mailto:${lead.emails[0].n}`; }}>
                <Mail size={18} fill="currentColor" className="text-[#007AFF]" />
              </button>
              <button className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-[#007AFF] hover:bg-slate-200 shadow-sm transition-colors" title="Jump to contacts" onClick={scrollToContact}>
                <Users size={18} fill="currentColor" className="text-[#007AFF]" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[calc(14px+var(--font-offset))] font-medium">
            <span className="text-slate-900">{lead.contact}</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">{lead.mobiles[0].n}</span>
          </div>
        </div>

        <div className="h-px w-full bg-slate-100"></div>

        {/* Stat Boxes */}
        <div className="px-8 py-6 flex gap-4 border-b border-slate-200">
          {/* REVENUE */}
          <div className="flex-1 flex flex-col items-center justify-center py-5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-[calc(10px+var(--font-offset))] font-bold uppercase tracking-widest text-slate-500 mb-1">REVENUE</div>
            <div className="text-[calc(20px+var(--font-offset))] font-bold text-slate-900">{formatFinancialUp(lead.avg)}</div>
          </div>
          {/* DEPOSITS */}
          <div className="relative group flex-1 flex flex-col items-center justify-center py-5 bg-slate-50 border border-slate-200 rounded-xl cursor-default">
            <div className="text-[calc(10px+var(--font-offset))] font-bold uppercase tracking-widest text-slate-500 mb-1">DEPOSITS</div>
            <div className="text-[calc(20px+var(--font-offset))] font-bold text-slate-900">{formatFinancialUp(latestStmt ? latestStmt.dep : 0)}</div>
            {latestStmt && (
              <div className="absolute -bottom-10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity bg-slate-800 text-white text-[calc(11px+var(--font-offset))] font-medium px-2.5 py-1.5 rounded shadow-lg whitespace-nowrap z-50">
                {latestStmt.m.split(' ')[0]} Deposits
              </div>
            )}
          </div>
          {/* BALANCE */}
          <div className="relative group flex-1 flex flex-col items-center justify-center py-5 bg-slate-50 border border-slate-200 rounded-xl cursor-default">
            <div className="text-[calc(10px+var(--font-offset))] font-bold uppercase tracking-widest text-slate-500 mb-1">BALANCE</div>
            <div className="text-[calc(20px+var(--font-offset))] font-bold text-slate-900">{formatFinancialUp(latestStmt ? (latestStmt.bal ?? latestStmt.end) : 0)}</div>
            {latestStmt && (
              <div className="absolute -bottom-10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity bg-slate-800 text-white text-[calc(11px+var(--font-offset))] font-medium px-2.5 py-1.5 rounded shadow-lg whitespace-nowrap z-50">
                {latestStmt.m.split(' ')[0]} Balance
              </div>
            )}
          </div>
          {/* APPROVAL */}
          <div className="flex-1 flex flex-col items-center justify-center py-5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-[calc(10px+var(--font-offset))] font-bold uppercase tracking-widest text-slate-500 mb-1">APPROVAL</div>
            <div className="text-[calc(20px+var(--font-offset))] font-bold text-slate-900">{formatFinancialUp(lead.avg + 150000)}</div>
          </div>
        </div>

        {/* ROW 1: Contact & Business */}
        <div className="grid grid-cols-2 border-b border-slate-200">

          <div id="lead-contact-section" className="p-8 border-r border-slate-200">
            <h3 className="text-[calc(11px+var(--font-offset))] font-bold tracking-widest uppercase text-slate-500 mb-6 flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span> Contact
            </h3>

            <div className="mb-6">
              <h4 className="text-[calc(10px+var(--font-offset))] font-bold uppercase tracking-widest text-slate-500 mb-3">Mobile</h4>
              {lead.mobiles.map((m, i) => (
                <div key={i} className="flex justify-between items-center py-1.5 group">
                  <span className="text-[calc(13.5px+var(--font-offset))] text-slate-900 font-medium">{m.n}</span>
                  <div className="lead-quick-actions flex gap-2">
                    <button onClick={() => onOpenDialer(m.n)} title="Open dialer" className="w-7 h-7 rounded bg-slate-100 border border-slate-200 hover:bg-black/10 flex items-center justify-center text-slate-500 transition-colors"><Phone size={13} strokeWidth={2}/></button>
                    <button onClick={() => onOpenMessages(m.n)} title="Message" className="w-7 h-7 rounded bg-slate-100 border border-slate-200 hover:bg-black/10 flex items-center justify-center text-slate-500 transition-colors"><MessageSquareText size={13} strokeWidth={2}/></button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <h4 className="text-[calc(10px+var(--font-offset))] font-bold uppercase tracking-widest text-slate-500 mb-3">Landline</h4>
              {lead.landlines.length ? lead.landlines.map((m, i) => (
                <div key={i} className="flex justify-between items-center py-1.5 group">
                  <span className="text-[calc(13.5px+var(--font-offset))] text-slate-900 font-medium">{m.n}</span>
                  <button onClick={() => onOpenDialer(m.n)} title="Open dialer" className="lead-quick-actions w-7 h-7 rounded bg-slate-100 border border-slate-200 hover:bg-black/10 flex items-center justify-center text-slate-500 transition-colors"><Phone size={13} strokeWidth={2}/></button>
                </div>
              )) : <div className="text-[calc(12.5px+var(--font-offset))] text-slate-500 font-medium">None provided</div>}
            </div>

            <div>
              <h4 className="text-[calc(10px+var(--font-offset))] font-bold uppercase tracking-widest text-slate-500 mb-3">Email</h4>
              {lead.emails.map((e, i) => (
                <div key={i} className="flex justify-between items-center py-1.5 group">
                  <span className="text-[calc(13.5px+var(--font-offset))] text-slate-900 font-medium truncate pr-4">{e.n}</span>
                  <button onClick={() => { window.location.href = `mailto:${e.n}`; }} title="Email" className="lead-quick-actions w-7 h-7 rounded bg-slate-100 border border-slate-200 hover:bg-black/10 flex items-center justify-center text-slate-500 transition-colors"><Mail size={13} strokeWidth={2}/></button>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8">
            <h3 className="text-[calc(11px+var(--font-offset))] font-bold tracking-widest uppercase text-slate-500 mb-6 flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-700 mr-2"></span> Business
            </h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
              <div>
                <div className="text-[calc(10px+var(--font-offset))] font-bold uppercase tracking-widest text-slate-500 mb-1.5">DBA</div>
                <div className="text-[calc(13.5px+var(--font-offset))] text-slate-900 font-medium">{lead.dba}</div>
              </div>
              <div>
                <div className="text-[calc(10px+var(--font-offset))] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Industry</div>
                <div className="text-[calc(13.5px+var(--font-offset))] text-slate-900 font-medium">{lead.industry.split('·')[0]}</div>
              </div>
              <div>
                <div className="text-[calc(10px+var(--font-offset))] font-bold uppercase tracking-widest text-slate-500 mb-1.5">EIN</div>
                <div className="text-[calc(13.5px+var(--font-offset))] text-slate-900 font-medium">{lead.ein}</div>
              </div>
              <div>
                <div className="text-[calc(10px+var(--font-offset))] font-bold uppercase tracking-widest text-slate-500 mb-1.5">SSN</div>
                <div className="text-[calc(13.5px+var(--font-offset))] text-slate-900 font-medium">{lead.ssn}</div>
              </div>
              <div>
                <div className="text-[calc(10px+var(--font-offset))] font-bold uppercase tracking-widest text-slate-500 mb-1.5">DOB</div>
                <div className="text-[calc(13.5px+var(--font-offset))] text-slate-900 font-medium">{lead.dob}</div>
              </div>
              <div>
                <div className="text-[calc(10px+var(--font-offset))] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Time in Biz</div>
                <div className="text-[calc(13.5px+var(--font-offset))] text-slate-900 font-medium">{lead.tib}</div>
              </div>
              <div>
                <div className="text-[calc(10px+var(--font-offset))] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Entity</div>
                <div className="text-[calc(13.5px+var(--font-offset))] text-slate-900 font-medium">{lead.entity}</div>
              </div>
              <div>
                <div className="text-[calc(10px+var(--font-offset))] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Employees</div>
                <div className="text-[calc(13.5px+var(--font-offset))] text-slate-900 font-medium">{lead.employees}</div>
              </div>
              <div className="col-span-2">
                <div className="text-[calc(10px+var(--font-offset))] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Address</div>
                <div className="text-[calc(13.5px+var(--font-offset))] text-slate-900 font-medium">{lead.address}</div>
              </div>
              <div className="col-span-2">
                <div className="text-[calc(10px+var(--font-offset))] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Website</div>
                <a href={`https://${lead.website}`} target="_blank" rel="noreferrer" className="text-[calc(13.5px+var(--font-offset))] text-[#2563EB] hover:underline font-medium">{lead.website}</a>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: Statements & Bank */}
        <div className="grid grid-cols-2 border-b border-slate-200">

          <div className="p-8 border-r border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[calc(11px+var(--font-offset))] font-bold tracking-widest uppercase text-slate-500 m-0 flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mr-2"></span> Statements
              </h3>
              <button onClick={() => setViewerDocIndex(latestDocIndex)} title="View latest statement" className="w-7 h-7 rounded bg-slate-100 border border-slate-200 hover:bg-black/10 flex items-center justify-center text-slate-500 transition-colors"><FileText size={14} strokeWidth={2}/></button>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="text-[calc(10px+var(--font-offset))] font-bold uppercase tracking-widest text-slate-500 pb-3 border-b border-slate-200 pl-2">Month</th>
                  <th className="text-[calc(10px+var(--font-offset))] font-bold uppercase tracking-widest text-slate-500 pb-3 border-b border-slate-200 text-right">Deposits</th>
                  <th className="text-[calc(10px+var(--font-offset))] font-bold uppercase tracking-widest text-slate-500 pb-3 border-b border-slate-200 text-right pr-2">Ending</th>
                </tr>
              </thead>
              <tbody>
                {lead.stmts.slice(0,3).map((s, i) => (
                  <tr
                    key={i}
                    className="group cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => setViewerDocIndex(i)}
                    title="Click to view statement"
                  >
                    <td className="py-2.5 border-b border-slate-200 text-[calc(13.5px+var(--font-offset))] font-medium text-[#2563EB] group-hover:underline pl-2">{s.m}</td>
                    <td className="py-2.5 border-b border-slate-200 text-[calc(13.5px+var(--font-offset))] font-medium text-slate-900 text-right">${s.dep.toLocaleString()}</td>
                    <td className="py-2.5 border-b border-slate-200 text-[calc(13.5px+var(--font-offset))] font-medium text-slate-900 text-right pr-2">${s.end.toLocaleString()}</td>
                  </tr>
                ))}
                {lead.mtd && (
                  <tr
                    className="bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                    onClick={() => setViewerDocIndex(-1)}
                    title="Click to view interim statement"
                  >
                    <td className="py-2.5 px-2 text-[calc(13.5px+var(--font-offset))] text-[#2563EB] hover:underline font-bold uppercase rounded-l-md">{lead.mtd.m.slice(0,3)} • MTD</td>
                    <td className="py-2.5 px-2 text-[calc(13.5px+var(--font-offset))] font-medium text-slate-900 text-right">${lead.mtd.dep.toLocaleString()}</td>
                    <td className="py-2.5 px-2 text-[calc(13.5px+var(--font-offset))] font-medium text-slate-900 text-right rounded-r-md">${(lead.mtd.bal ?? lead.mtd.end).toLocaleString()}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-8">
            <h3 className="text-[calc(11px+var(--font-offset))] font-bold tracking-widest uppercase text-slate-500 mb-6 flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></span> Bank
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[calc(10.5px+var(--font-offset))] font-bold uppercase tracking-widest text-slate-500">Bank</span>
                <span className="text-[calc(13.5px+var(--font-offset))] text-slate-900 font-medium">{lead.bank.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[calc(10.5px+var(--font-offset))] font-bold uppercase tracking-widest text-slate-500">Account</span>
                <span className="text-[calc(13.5px+var(--font-offset))] text-slate-900 font-medium">{lead.bank.acct}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[calc(10.5px+var(--font-offset))] font-bold uppercase tracking-widest text-slate-500">Routing</span>
                <span className="text-[calc(13.5px+var(--font-offset))] text-slate-900 font-medium">{lead.bank.routing}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[calc(10.5px+var(--font-offset))] font-bold uppercase tracking-widest text-slate-500">Type</span>
                <span className="text-[calc(13.5px+var(--font-offset))] text-slate-900 font-medium">{lead.bank.type}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                <span className="text-[calc(10.5px+var(--font-offset))] font-bold uppercase tracking-widest text-slate-500">Avg daily balance</span>
                <span className="text-[calc(14px+var(--font-offset))] text-slate-900 font-bold">${lead.bank.adb.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[calc(10.5px+var(--font-offset))] font-bold uppercase tracking-widest text-slate-500">Current balance</span>
                <span className="text-[calc(14px+var(--font-offset))] text-slate-900 font-bold">${lead.bank.bal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 3: Pitch & Activity */}
        <div className="grid grid-cols-2 flex-1">
          <div className="p-8 border-r border-slate-200">
            <h3 className="text-[calc(11px+var(--font-offset))] font-bold tracking-widest uppercase text-slate-500 mb-5">
              PITCH
            </h3>
            <div className="relative pl-4 border-l-2 border-[#0F766E]">
              <p className="text-[calc(13.5px+var(--font-offset))] leading-relaxed text-slate-900 font-medium">
                {generateSalesPitch(lead)}
              </p>
            </div>
          </div>

          <div className="p-8">
            <h3 className="text-[calc(11px+var(--font-offset))] font-bold tracking-widest uppercase text-slate-500 mb-5">
              ACTIVITY
            </h3>
            <div className="space-y-4">
              {lead.activity.map((a, i) => (
                <div key={i} className="flex gap-4 pb-4 border-b border-slate-200 last:border-0 last:pb-0">
                  <div className="w-16 text-[calc(11px+var(--font-offset))] font-medium text-slate-500 pt-0.5">{a.when}</div>
                  <div className="text-[calc(13px+var(--font-offset))] text-slate-900 font-medium">{a.what}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
