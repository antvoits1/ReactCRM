import { useMemo, useState } from 'react';
import { Search, Filter, MessageSquareText, Mail } from 'lucide-react';
import { Lead } from '../data';
import IOSCommPanel from './IOSCommPanel';

interface MessagesViewProps {
  leads: Lead[];
  selectedLeadId: string | undefined;
  setSelectedLeadId: (id: string) => void;
  preferredNumber: string;
  setPreferredNumber: (number: string) => void;
}

function smsHref(number: string): string {
  return `sms:${number.replace(/[^\d+]/g, '')}`;
}

function whatsappHref(number: string): string {
  const digits = number.replace(/\D/g, '');
  const normalized = digits.length === 10 ? `1${digits}` : digits;
  return `https://wa.me/${normalized}`;
}

export default function MessagesView({ leads, selectedLeadId, setSelectedLeadId, preferredNumber, setPreferredNumber }: MessagesViewProps) {
  const selectedLead = leads.find(l => l.id === selectedLeadId) || leads[0];
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');
  const [sortByRevenue, setSortByRevenue] = useState(false);

  const visibleLeads = useMemo(() => {
    let result = leads;
    const q = query.trim().toLowerCase();
    if (q) result = result.filter(l => l.contact.toLowerCase().includes(q) || l.company.toLowerCase().includes(q));
    if (sortByRevenue) result = [...result].sort((a, b) => b.avg - a.avg);
    return result;
  }, [leads, query, sortByRevenue]);

  if (!selectedLead) return <div className="flex-1 bg-white" />;

  const activeNumber = selectedLead.mobiles.some(p => p.n === preferredNumber)
    ? preferredNumber
    : (selectedLead.mobiles[0]?.n ?? '');

  const selectLead = (nextLead: Lead) => {
    setSelectedLeadId(nextLead.id);
    setPreferredNumber(nextLead.mobiles[0]?.n ?? '');
  };

  return (
    <div className="grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.7fr)_minmax(0,0.75fr)] flex-1 min-w-0 overflow-hidden h-full gap-[2px]">
      <div className="bg-white flex flex-col min-w-0 z-10 relative">
        <div className="h-[68px] flex items-center justify-between px-5 border-b border-[#E2E8F0] flex-shrink-0 bg-[#F8FAFC]">
          <h2 className="font-bold text-[calc(24px+var(--font-offset))] tracking-tight text-[#0F172A]">Messages</h2>
          <div className="flex gap-1.5 text-[#007AFF]">
            <button type="button" onClick={() => setShowSearch(v => !v)} title="Search" className={`p-1.5 rounded-full transition-colors ${showSearch ? 'bg-[#007AFF] text-white' : 'hover:bg-[#F8FAFC]'}`}><Search size={22} strokeWidth={1.5}/></button>
            <button type="button" onClick={() => setSortByRevenue(v => !v)} title="Sort by revenue" className={`p-1.5 rounded-full transition-colors ${sortByRevenue ? 'bg-[#007AFF] text-white' : 'hover:bg-[#F8FAFC]'}`}><Filter size={22} strokeWidth={1.5}/></button>
          </div>
        </div>

        {showSearch && (
          <div className="px-4 py-3 border-b border-[#E2E8F0] bg-white flex-shrink-0">
            <input autoFocus type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search contact or company..." className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-[calc(13px+var(--font-offset))] outline-none text-[#0F172A] focus:border-[#007AFF]" />
          </div>
        )}

        <div className="flex-1 overflow-y-auto min-w-0">
          {visibleLeads.length === 0 && <div className="px-5 py-8 text-center text-[calc(13px+var(--font-offset))] text-[#94A3B8]">No conversations match "{query}"</div>}
          {visibleLeads.map((l) => {
            const latestSms = l.sms[l.sms.length - 1];
            const latestMail = l.mails[0];
            const latestCall = l.calls[0];
            const preview = latestSms?.txt || latestMail?.preview || latestCall?.note || 'No communication history';
            const when = latestSms?.t || latestMail?.when || latestCall?.when || '';
            return (
              <button
                type="button"
                key={l.id}
                onClick={() => selectLead(l)}
                className={`w-full text-left flex flex-col px-5 py-3 cursor-pointer transition-all border-b border-[#F1F5F9] ${selectedLeadId === l.id ? 'bg-[#007AFF] text-white' : 'bg-transparent hover:bg-[#F8FAFC] text-[#0F172A]'}`}
              >
                <div className="flex justify-between items-start mb-1 w-full min-w-0">
                  <div className="font-semibold text-[calc(16px+var(--font-offset))] truncate pr-2 min-w-0">{l.contact}</div>
                  <div className={`text-[calc(13px+var(--font-offset))] whitespace-nowrap mt-0.5 ${selectedLeadId === l.id ? 'text-white/80' : 'text-[#64748B]'}`}>{when}</div>
                </div>
                <div className={`text-[calc(14px+var(--font-offset))] line-clamp-2 leading-snug ${selectedLeadId === l.id ? 'text-white/90' : 'text-[#64748B]'}`}>{preview}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex min-w-0 overflow-hidden">
        <IOSCommPanel lead={selectedLead} preferredMobile={activeNumber} fullWidth />
      </div>

      <div className="bg-white flex flex-col min-w-0">
        <div className="h-[68px] flex items-center justify-center px-4 border-b border-[#E2E8F0] flex-shrink-0 bg-[#F8FAFC]"><span className="text-[calc(15px+var(--font-offset))] font-semibold">Details</span></div>
        <div className="flex-1 p-5 flex flex-col items-center min-w-0 overflow-y-auto">
          <h3 className="text-[calc(20px+var(--font-offset))] font-bold text-[#0F172A] mb-1 text-center break-words">{selectedLead.contact}</h3>
          <div className="text-[calc(14px+var(--font-offset))] text-[#007AFF] mb-6 text-center">{activeNumber || 'No mobile number'}</div>

          {selectedLead.mobiles.length > 1 && (
            <div className="w-full mb-4">
              <label className="block text-[calc(11px+var(--font-offset))] font-bold uppercase tracking-wider text-slate-500 mb-2">Mobile line</label>
              <select
                value={activeNumber}
                onChange={e => setPreferredNumber(e.target.value)}
                className="w-full border border-[#E2E8F0] rounded-lg px-2.5 py-2 text-[calc(13px+var(--font-offset))] text-slate-900 bg-white outline-none"
              >
                {selectedLead.mobiles.map(phone => <option key={`${phone.l}-${phone.n}`} value={phone.n}>{phone.l}: {phone.n}</option>)}
              </select>
            </div>
          )}

          <div className="w-full bg-[#F8FAFC] rounded-xl p-4 flex flex-col gap-3 min-w-0">
            {activeNumber && (
              <>
                <a href={whatsappHref(activeNumber)} target="_blank" rel="noreferrer" className="flex items-center gap-3 border-b border-[#F1F5F9] pb-3 hover:opacity-80 transition-opacity min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#34C759] flex items-center justify-center text-white flex-shrink-0"><MessageSquareText size={16} /></div>
                  <div className="text-[calc(15px+var(--font-offset))] font-medium truncate">WhatsApp</div>
                </a>
                <a href={smsHref(activeNumber)} className="flex items-center gap-3 border-b border-[#F1F5F9] pb-3 hover:opacity-80 transition-opacity min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#007AFF] flex items-center justify-center text-white flex-shrink-0"><MessageSquareText size={16} /></div>
                  <div className="text-[calc(15px+var(--font-offset))] font-medium truncate">Messages</div>
                </a>
              </>
            )}
            {selectedLead.emails[0] && (
              <a href={`mailto:${selectedLead.emails[0].n}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#007AFF] flex items-center justify-center text-white flex-shrink-0"><Mail size={16} /></div>
                <div className="text-[calc(14px+var(--font-offset))] font-medium break-all min-w-0">{selectedLead.emails[0].n}</div>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
