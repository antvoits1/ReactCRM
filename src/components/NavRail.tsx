import { Users, MessageSquareText, Mail, ScanLine, TerminalSquare, Bell, Settings } from 'lucide-react';
import type { ActivePage } from '../lib/navigation';

interface NavRailProps {
  isTop: boolean;
  isWide: boolean;
  isLight: boolean;
  bgConsole: string;
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  cycleNavMode: () => void;
  onOpenSettings: () => void;
}

const NAV_ITEMS = [
  { id: 'crm', icon: Users, label: 'Leads', enabled: true },
  { id: 'messages', icon: MessageSquareText, label: 'Messages', enabled: true },
  { id: 'email', icon: Mail, label: 'Email', enabled: false },
  { id: 'scanner', icon: ScanLine, label: 'Scanner', enabled: false },
  { id: 'command', icon: TerminalSquare, label: 'Command', enabled: false },
  { id: 'alerts', icon: Bell, label: 'Alerts', enabled: false },
] as const;

export default function NavRail({ isTop, isWide, isLight, bgConsole, activePage, setActivePage, cycleNavMode, onOpenSettings }: NavRailProps) {
  return (
    <div
      className={`${isTop ? 'w-full h-[60px] flex-row px-5' : (isWide ? 'w-[200px]' : 'w-[64px]') + ' flex-col py-5'} flex items-center z-30 flex-shrink-0 shadow-md transition-all duration-300 ease-in-out`}
      style={{ backgroundColor: bgConsole }}
    >
      <button
        type="button"
        className={`flex gap-1.5 cursor-pointer hover:opacity-80 transition-opacity ${isTop ? 'mr-8' : 'mb-8'}`}
        onClick={cycleNavMode}
        title="Cycle navigation layout"
        aria-label="Cycle navigation layout"
      >
        <span className="w-3 h-3 rounded-full bg-[#ff5f57] border border-slate-200" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e] border border-slate-200" />
        <span className="w-3 h-3 rounded-full bg-[#28c840] border border-slate-200" />
      </button>

      <div className={`flex-1 flex ${isTop ? 'flex-row space-x-2' : 'flex-col space-y-3 w-full px-2'}`}>
        {NAV_ITEMS.map((item) => {
          const disabledTone = isLight ? 'text-slate-300' : 'text-white/25';
          return (
            <button
              key={item.id}
              type="button"
              disabled={!item.enabled}
              onClick={() => item.enabled && setActivePage(item.id)}
              title={item.enabled ? item.label : `${item.label} is not available in this build`}
              className={`${isTop ? 'w-11 h-11 justify-center' : 'w-full h-11 px-3 ' + (isWide ? 'justify-start' : 'justify-center')} flex items-center transition-all duration-200 rounded-lg relative ${
                !item.enabled
                  ? `${disabledTone} cursor-not-allowed opacity-55`
                  : activePage === item.id
                    ? (isLight ? 'text-slate-900 bg-black/10 shadow-sm' : 'text-white bg-white/10 shadow-sm')
                    : (isLight ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100' : 'text-[#8C9BB4] hover:text-white hover:bg-white/5')
              }`}
            >
              <item.icon size={20} strokeWidth={1.5} className="flex-shrink-0" />
              {(!isTop && isWide) && (
                <span className="ml-3 text-[calc(13px+var(--font-offset))] font-medium tracking-wide whitespace-nowrap">{item.label}</span>
              )}
            </button>
          );
        })}
      </div>

      <div className={`flex ${isTop ? 'items-center space-x-2 ml-8' : 'flex-col space-y-3 mt-auto w-full px-2'}`}>
        <button
          type="button"
          onClick={onOpenSettings}
          title="Settings"
          className={`${isTop ? 'w-11 h-11 justify-center' : 'w-full h-11 px-3 ' + (isWide ? 'justify-start' : 'justify-center')} flex items-center ${isLight ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100' : 'text-[#8C9BB4] hover:text-white hover:bg-white/5'} transition-colors rounded-lg`}
        >
          <Settings size={20} strokeWidth={1.5} className="flex-shrink-0" />
          {(!isTop && isWide) && (
            <span className="ml-3 text-[calc(13px+var(--font-offset))] font-medium tracking-wide whitespace-nowrap">Settings</span>
          )}
        </button>
      </div>
    </div>
  );
}
