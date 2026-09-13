import { useState } from 'react';
import {
  Phone, ChevronRight, Mic, PhoneOff, Pin, LayoutGrid,
  Pause, ArrowRight, UserPlus, CircleDot
} from 'lucide-react';
import { Lead } from '../data';

interface DialerBannerProps {
  lead: Lead;
  number: string;
  bgConsole: string;
  isLight: boolean;
  dialerVisible: boolean;
  dialerPinned: boolean;
  toggleDialerPin: () => void;
  setDialerVisible: (visible: boolean) => void;
}

const KEYPAD_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

export default function DialerBanner({ lead, number, bgConsole, isLight, dialerVisible, dialerPinned, toggleDialerPin, setDialerVisible }: DialerBannerProps) {
  const [showKeypad, setShowKeypad] = useState(false);
  const [dialedDigits, setDialedDigits] = useState('');

  const toggleDialer = () => {
    if (dialerVisible && !dialerPinned) setDialerVisible(false);
    else setDialerVisible(true);
  };

  const hideDialer = () => {
    if (!dialerPinned) setDialerVisible(false);
  };

  const idleBtn = isLight ? 'bg-slate-100 text-slate-400' : 'bg-white/10 text-white/35';
  const keypadBtn = isLight ? 'bg-slate-100 hover:bg-black/10 text-slate-900' : 'bg-white/10 hover:bg-white/20 text-white';

  return (
    <div
      className={`fixed bottom-8 right-8 flex items-center z-50 transition-transform duration-300 ease-out shadow-2xl ${dialerVisible ? 'translate-x-0' : 'translate-x-[calc(100%+48px)]'}`}
    >
      {!dialerVisible && (
        <button
          type="button"
          onClick={toggleDialer}
          aria-label="Open dialer"
          title="Open dialer"
          className={`absolute -left-12 bottom-0 w-12 h-12 border ${isLight ? 'border-slate-200 text-slate-900' : 'border-[#273B5E] text-white'} flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity rounded-l-xl`}
          style={{ backgroundColor: bgConsole }}
        >
          <Phone size={18} />
        </button>
      )}

      {showKeypad && (
        <div
          className={`absolute bottom-full right-0 mb-2 w-[220px] rounded-xl border shadow-2xl p-3 ${isLight ? 'border-slate-200' : 'border-[#273B5E]'}`}
          style={{ backgroundColor: bgConsole }}
        >
          <div className={`text-center text-[calc(15px+var(--font-offset))] font-mono mb-2 min-h-[22px] ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {dialedDigits || <span className="opacity-40">Dial pad</span>}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {KEYPAD_KEYS.map(k => (
              <button
                type="button"
                key={k}
                onClick={() => setDialedDigits(d => d + k)}
                className={`h-9 rounded-lg font-semibold text-[calc(14px+var(--font-offset))] transition-colors ${keypadBtn}`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={`w-[580px] h-[76px] border ${isLight ? 'border-slate-200' : 'border-[#273B5E]'} rounded-xl shadow-2xl flex items-center p-2 overflow-hidden`} style={{ backgroundColor: bgConsole }}>
        <div className={`w-[180px] h-full px-5 flex flex-col justify-center relative border-r ${isLight ? 'border-slate-200' : 'border-[#273B5E]'} flex-shrink-0`}>
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-1.5 text-[calc(10px+var(--font-offset))] font-bold uppercase tracking-widest text-[#FF9F0A]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF9F0A]" /> Not connected
            </div>
            <div className="text-slate-500 text-[calc(11px+var(--font-offset))]">--:--</div>
          </div>
          <div className={`${isLight ? 'text-slate-900' : 'text-white'} font-semibold text-[calc(15px+var(--font-offset))] truncate leading-tight`}>{lead.contact}</div>
          <div className="text-slate-500 text-[calc(12px+var(--font-offset))] truncate mt-0.5">{number || 'No phone number'}</div>
        </div>

        <button
          type="button"
          onClick={toggleDialerPin}
          title={dialerPinned ? 'Unpin dialer' : 'Pin dialer open'}
          className={`w-8 h-full flex items-center justify-center transition-colors border-r ${isLight ? 'border-slate-200' : 'border-[#273B5E]'} ${dialerPinned ? 'text-[#007AFF]' : (isLight ? 'text-slate-400 hover:text-slate-900' : 'text-[#8C9BB4] hover:text-white')}`}
        >
          <Pin size={16} strokeWidth={1.5} fill={dialerPinned ? 'currentColor' : 'none'} />
        </button>

        <div className="flex flex-1 items-center justify-around px-3">
          <button type="button" disabled title="Requires phone integration" className={`w-[42px] h-[42px] rounded-full flex items-center justify-center ${idleBtn}`}><Mic size={18} strokeWidth={1.5}/></button>
          <button
            type="button"
            onClick={() => setShowKeypad(v => !v)}
            className={`w-[42px] h-[42px] rounded-full flex items-center justify-center transition-colors shadow-sm ${showKeypad ? 'bg-[#007AFF] text-white' : keypadBtn}`}
            title="Keypad"
          >
            <LayoutGrid size={18} strokeWidth={1.5}/>
          </button>
          <button type="button" disabled title="Requires phone integration" className={`w-[42px] h-[42px] rounded-full flex items-center justify-center ${idleBtn}`}><Pause size={18} strokeWidth={1.5}/></button>
          <button type="button" disabled title="Requires phone integration" className={`w-[42px] h-[42px] rounded-full flex items-center justify-center ${idleBtn}`}><ArrowRight size={18} strokeWidth={1.5}/></button>
          <button type="button" disabled title="Requires phone integration" className={`w-[42px] h-[42px] rounded-full flex items-center justify-center ${idleBtn}`}><UserPlus size={18} strokeWidth={1.5}/></button>
          <button type="button" disabled title="Requires phone integration" className={`w-[42px] h-[42px] rounded-full flex items-center justify-center ${idleBtn}`}><CircleDot size={18} strokeWidth={1.5}/></button>
          <button type="button" disabled title="No active call" className="w-12 h-12 rounded-full bg-[#FF3B30] text-white/60 flex items-center justify-center shadow-lg ml-2 cursor-not-allowed opacity-60"><PhoneOff size={20} strokeWidth={2}/></button>
        </div>

        <button
          type="button"
          onClick={hideDialer}
          disabled={dialerPinned}
          aria-label="Hide dialer"
          title={dialerPinned ? 'Unpin the dialer before hiding it' : 'Hide dialer'}
          className={`w-8 h-full flex items-center justify-center transition-colors border-l ${isLight ? 'border-slate-200' : 'border-white/5'} ${dialerPinned ? 'text-slate-500/40 cursor-not-allowed' : (isLight ? 'text-slate-400 hover:text-slate-900' : 'text-[#8C9BB4] hover:text-white')}`}
        >
          <ChevronRight size={18} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
