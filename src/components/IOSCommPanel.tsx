import { Fragment, useMemo, useRef, useState } from 'react';
import {
  Video, Info, Plus, ArrowUp,
  Mic, Camera, ArrowLeft, PhoneIncoming, PhoneOutgoing,
  MessageSquareText, Search, ChevronDown, Reply
} from 'lucide-react';
import { Lead } from '../data';

interface IOSCommPanelProps {
  lead?: Lead;
  onBack?: () => void;
  fullWidth?: boolean;
  preferredMobile?: string;
}

function digitsOnly(value: string): string {
  return value.replace(/[^\d+]/g, '');
}

export default function IOSCommPanel({ lead, onBack, fullWidth = false, preferredMobile }: IOSCommPanelProps) {
  const [activeTab, setActiveTab] = useState<'messages' | 'calls' | 'contacts' | 'email'>('messages');
  const [inputText, setInputText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [contactSearch, setContactSearch] = useState('');
  const replyRef = useRef<HTMLTextAreaElement>(null);

  const contactName = lead?.contact || 'Unknown Contact';
  const contactEmail = lead?.emails[0]?.n || '';
  const contactMobile = (preferredMobile && lead?.mobiles.some(p => p.n === preferredMobile)) ? preferredMobile : (lead?.mobiles[0]?.n || '');

  const messages = useMemo(() => (
    lead?.sms.map(msg => ({
      from: msg.dir === 'out' ? 'me' as const : 'them' as const,
      text: msg.txt,
      time: msg.t,
    })) ?? []
  ), [lead]);

  const emailThread = useMemo(() => (
    lead?.mails.map(mail => ({
      from: mail.from,
      fromMe: mail.from.toLowerCase().includes('cole') || mail.from.toLowerCase().includes('avery') || mail.from.toLowerCase().includes('maya'),
      subject: mail.sub,
      time: mail.when,
      body: mail.preview,
    })) ?? []
  ), [lead]);

  const filteredContacts = useMemo(() => {
    if (!lead) return [];
    const rows = [
      ...lead.mobiles.map(p => ({ kind: p.l, value: p.n })),
      ...lead.landlines.map(p => ({ kind: p.l, value: p.n })),
      ...lead.emails.map(p => ({ kind: p.l, value: p.n })),
    ];
    const q = contactSearch.trim().toLowerCase();
    return q ? rows.filter(row => `${row.kind} ${row.value}`.toLowerCase().includes(q)) : rows;
  }, [lead, contactSearch]);

  const openSmsComposer = () => {
    const text = inputText.trim();
    if (!contactMobile || !text) return;
    window.location.href = `sms:${digitsOnly(contactMobile)}?body=${encodeURIComponent(text)}`;
  };

  const openEmailComposer = () => {
    const text = replyText.trim();
    if (!contactEmail || !text) return;
    const subject = emailThread[0]?.subject?.startsWith('Re:') ? emailThread[0].subject : `Re: ${emailThread[0]?.subject || 'Follow-up'}`;
    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
  };

  return (
    <div className={`flex flex-col h-full bg-white ${fullWidth ? 'w-full' : 'w-full max-w-[400px] overflow-hidden'}`}>
      <div className="h-[68px] bg-white/80 backdrop-blur-xl border-b border-slate-200 flex items-center px-4 justify-between flex-shrink-0 z-20">
        <div className="flex items-center gap-2">
          {onBack ? (
            <button type="button" onClick={onBack} className="text-[#007AFF] flex items-center font-medium text-[calc(15px+var(--font-offset))]">
              <ArrowLeft size={22} className="mr-1" /> Back
            </button>
          ) : (
            <div className="flex items-center text-[#007AFF] text-[calc(15px+var(--font-offset))]">
              <MessageSquareText size={22} className="mr-1" />
            </div>
          )}
        </div>

        {activeTab === 'email' ? (
          <div className="flex flex-col items-center justify-center -ml-4">
            <div className="text-[calc(15px+var(--font-offset))] font-bold text-slate-900 leading-tight">Inbox</div>
            <div className="text-[calc(11px+var(--font-offset))] font-medium text-slate-500">Lead email history</div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center -ml-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-b from-slate-300 to-slate-400 flex items-center justify-center text-white text-xs font-bold shadow-sm mb-1">
              {contactName.split(' ').map(n => n[0]).join('').substring(0, 2)}
            </div>
            <div className="text-[calc(10px+var(--font-offset))] font-medium text-slate-900">{contactName}</div>
          </div>
        )}

        <div className="flex items-center gap-4 text-[#007AFF]">
          {activeTab === 'email' ? (
            <button type="button" onClick={() => replyRef.current?.focus()} title="Reply"><Plus size={24} strokeWidth={1.5} /></button>
          ) : (
            <>
              <button type="button" disabled title="Video calling requires a connected communications service" className="opacity-35 cursor-not-allowed"><Video size={24} strokeWidth={1.5} /></button>
              <button type="button" onClick={() => setActiveTab('contacts')} title="Contact info"><Info size={24} strokeWidth={1.5} /></button>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-center p-2 bg-white border-b border-slate-200">
        <div className="bg-[#F1F5F9] p-0.5 rounded-lg flex w-full max-w-[320px]">
          {(['messages', 'calls', 'contacts', 'email'] as const).map(tab => (
            <button
              type="button"
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-[calc(12px+var(--font-offset))] font-semibold py-1 rounded-md transition-all capitalize ${activeTab === tab ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-[#F2F2F7] flex flex-col relative">
        {activeTab === 'messages' && (
          <div className="flex-1 flex flex-col p-4 gap-4 pb-20 justify-end min-h-full">
            <div className="text-center text-[calc(11px+var(--font-offset))] font-medium text-slate-400 my-4 uppercase tracking-wide">Lead message history</div>
            {messages.length === 0 && <div className="text-center text-slate-400 text-sm my-auto">No messages on file.</div>}
            {messages.map((msg, i) => (
              <Fragment key={`${msg.time}-${i}`}>
                <div className={`flex items-end gap-2 max-w-[85%] ${msg.from === 'me' ? 'self-end' : 'self-start'}`}>
                  {msg.from === 'them' && (
                    <div className="w-7 h-7 rounded-full bg-slate-300 flex-shrink-0 flex items-center justify-center text-white text-[calc(10px+var(--font-offset))] font-bold">{contactName.charAt(0)}</div>
                  )}
                  <div className={`px-4 py-2.5 rounded-2xl text-[calc(15px+var(--font-offset))] leading-relaxed ${msg.from === 'me' ? 'bg-[#007AFF] text-white rounded-br-sm shadow-sm' : 'bg-[#E5E5EA] text-slate-900 rounded-bl-sm'}`}>{msg.text}</div>
                </div>
                <div className={`text-[calc(11px+var(--font-offset))] text-slate-400 -mt-3 ${msg.from === 'me' ? 'text-right pr-2' : 'text-left pl-9'}`}>{msg.time}</div>
              </Fragment>
            ))}
          </div>
        )}

        {activeTab === 'calls' && (
          <div className="flex-1 flex flex-col bg-white">
            <h1 className="text-[calc(28px+var(--font-offset))] font-bold px-4 pt-4 pb-2 text-slate-900">Recent</h1>
            <div className="flex-1 overflow-y-auto px-4 divide-y divide-black/5">
              {(lead?.calls ?? []).length === 0 && <div className="py-10 text-center text-slate-400">No calls on file.</div>}
              {(lead?.calls ?? []).map((call, i) => (
                <div key={`${call.when}-${i}`} className="py-3 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {call.dir === 'out' ? <PhoneOutgoing className="text-slate-400" size={18} /> : <PhoneIncoming className="text-slate-400" size={18} />}
                    <div>
                      <div className="text-[calc(16px+var(--font-offset))] font-semibold text-slate-900">{call.who}</div>
                      <div className="text-[calc(13px+var(--font-offset))] text-slate-500 mt-0.5">{call.n} · {call.dur}</div>
                    </div>
                  </div>
                  <span className="text-[calc(14px+var(--font-offset))] text-slate-500">{call.when}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="flex-1 flex flex-col bg-white">
            <div className="px-4 py-2">
              <div className="bg-[#767680]/10 rounded-xl px-3 py-1.5 flex items-center gap-2">
                <Search size={16} className="text-slate-500" />
                <input
                  type="text"
                  value={contactSearch}
                  onChange={e => setContactSearch(e.target.value)}
                  placeholder="Search"
                  className="bg-transparent border-none outline-none text-[calc(15px+var(--font-offset))] w-full text-slate-900 placeholder:text-slate-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-4 px-4 py-3 border-b border-slate-200">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center shadow-sm text-[#007AFF] text-xs font-bold">Forge</div>
              <div>
                <h2 className="text-[calc(22px+var(--font-offset))] font-semibold text-slate-900">{contactName}</h2>
                <div className="text-[calc(14px+var(--font-offset))] text-slate-500">{lead?.company ?? 'Lead contact'}</div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 mt-2">
              {filteredContacts.map((row, i) => (
                <div key={`${row.kind}-${row.value}-${i}`} className="py-2.5 border-b border-slate-200">
                  <div className="text-[calc(12px+var(--font-offset))] text-slate-500">{row.kind}</div>
                  <div className="text-[calc(16px+var(--font-offset))] text-slate-900 font-medium mt-0.5">{row.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'email' && (
          <div className="flex-1 flex flex-col bg-white">
            <div className="px-4 py-2 border-b border-slate-200 bg-white text-[calc(13px+var(--font-offset))] font-medium text-slate-500">To: {contactName}</div>
            <div className="flex-1 overflow-y-auto">
              {emailThread.length === 0 && <div className="py-10 text-center text-slate-400">No email history on file.</div>}
              {emailThread.map((mail, i) => (
                <div key={`${mail.time}-${i}`} className="p-4 border-b border-slate-200">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${mail.fromMe ? 'bg-[#007AFF] text-white' : 'bg-blue-100 text-[#007AFF]'}`}>{mail.from.charAt(0).toUpperCase()}</div>
                      <div>
                        <div className="font-semibold text-[calc(15px+var(--font-offset))] text-slate-900">{mail.fromMe ? 'You' : mail.from}</div>
                        <div className="text-[calc(13px+var(--font-offset))] text-slate-500">{mail.fromMe ? `To: ${contactEmail}` : 'Lead email'}</div>
                      </div>
                    </div>
                    <div className="text-[calc(13px+var(--font-offset))] text-slate-500 flex items-center gap-3">{mail.time} <Reply size={16} className="text-slate-400" /></div>
                  </div>
                  <h3 className="font-semibold text-[calc(15px+var(--font-offset))] text-slate-900 mt-2 mb-1">{mail.subject}</h3>
                  <p className="text-[calc(15px+var(--font-offset))] text-slate-900 leading-relaxed whitespace-pre-line">{mail.body}</p>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-200 bg-white">
              <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
                <div className="text-[calc(14px+var(--font-offset))] text-slate-500">From:</div>
                <button type="button" disabled className="flex items-center gap-1 text-[calc(14px+var(--font-offset))] text-slate-900 font-medium cursor-default">sales@forgecrm.com <ChevronDown size={14} className="text-slate-400" /></button>
              </div>
              <textarea
                ref={replyRef}
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Reply..."
                className="w-full text-[calc(15px+var(--font-offset))] resize-none outline-none h-24 placeholder:text-slate-400 text-slate-900"
              />
              <div className="flex justify-between items-center mt-2">
                <button type="button" disabled title="Attachments require an email integration" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 cursor-not-allowed opacity-60"><Plus size={18} /></button>
                <button
                  type="button"
                  onClick={openEmailComposer}
                  disabled={!replyText.trim() || !contactEmail}
                  title="Open your email app"
                  className="px-4 py-1.5 rounded-full bg-[#007AFF] text-white font-semibold text-[calc(14px+var(--font-offset))] shadow-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Open Email
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {activeTab === 'messages' && (
        <div className="bg-white border-t border-slate-200 px-3 py-2 pb-6 flex items-end gap-3 z-10 flex-shrink-0">
          <button type="button" disabled title="Attachments require a messaging integration" className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 flex-shrink-0 mb-1 cursor-not-allowed opacity-60"><Plus size={20} strokeWidth={2.5} /></button>
          <div className="flex-1 bg-white border border-slate-200 rounded-2xl flex items-end px-3 py-1.5 min-h-[36px]">
            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); openSmsComposer(); } }}
              placeholder="Message"
              className="flex-1 bg-transparent outline-none resize-none text-[calc(15px+var(--font-offset))] max-h-[100px] py-0.5 placeholder:text-slate-400"
              rows={1}
            />
            {inputText.trim().length === 0 && <button type="button" disabled title="Voice messages require a messaging integration" className="text-slate-400 p-0.5 mb-0.5 ml-1 cursor-not-allowed opacity-60"><Mic size={20} /></button>}
          </div>
          {inputText.trim().length > 0 ? (
            <button type="button" onClick={openSmsComposer} title="Open Messages app" className="w-8 h-8 rounded-full bg-[#007AFF] flex items-center justify-center text-white shadow-sm flex-shrink-0 mb-1 transition-transform active:scale-95"><ArrowUp size={18} strokeWidth={3} /></button>
          ) : (
            <button type="button" disabled title="Camera requires a messaging integration" className="w-8 h-8 rounded-full text-[#007AFF] flex items-center justify-center flex-shrink-0 mb-1 cursor-not-allowed opacity-40"><Camera size={26} strokeWidth={1.5} /></button>
          )}
        </div>
      )}
    </div>
  );
}
