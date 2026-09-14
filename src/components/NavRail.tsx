import { useEffect, useRef, useState } from 'react';
import { Bell, Mail, MessageSquareText, PanelLeftClose, PanelLeftOpen, ScanLine, Settings, TerminalSquare, UserRound, Users } from 'lucide-react';
import type { ActivePage } from '../lib/navigation';

interface Props {
  variant: 'topbar' | 'sidebar';
  isWide: boolean;
  navColor: string;
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  toggleSidebar: () => void;
  onOpenSettings: () => void;
}

const NAV_ITEMS = [
  { id: 'crm' as const, icon: Users, label: 'Leads' },
  { id: 'messages' as const, icon: MessageSquareText, label: 'Messages' },
  { id: 'email' as const, icon: Mail, label: 'Email' },
  { id: 'scanner' as const, icon: ScanLine, label: 'Scanner' },
  { id: 'command' as const, icon: TerminalSquare, label: 'Command' },
];

export default function NavRail({ variant, isWide, navColor, activePage, setActivePage, toggleSidebar, onOpenSettings }: Props) {
  const [accountOpen, setAccountOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setAccountOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  if (variant === 'topbar') {
    return (
      <header className="forge-topbar">
        <div className="forge-brand">Forge<span>CRM</span></div>
        <div className="forge-topbar-spacer"/>
        <button type="button" className={`forge-tool ${activePage === 'alerts' ? 'active' : ''}`} onClick={() => setActivePage('alerts')} title="Notifications" aria-label="Notifications">
          <Bell size={18} strokeWidth={1.8}/>
        </button>
        <div className="forge-account" ref={menuRef}>
          <button type="button" className="forge-account-button" onClick={() => setAccountOpen(v => !v)} aria-expanded={accountOpen} aria-label="Account menu">
            <UserRound size={18} strokeWidth={1.8}/>
          </button>
          {accountOpen && (
            <div className="forge-account-menu">
              <button type="button" onClick={() => { setAccountOpen(false); onOpenSettings(); }}>Settings</button>
              <button type="button" disabled title="No authentication service is connected to this build">Log Out</button>
            </div>
          )}
        </div>
      </header>
    );
  }

  return (
    <aside className={`forge-sidebar ${isWide ? 'wide' : 'slim'}`} style={{ backgroundColor: navColor }}>
      <div className="forge-sidebar-head">
        <button type="button" className="forge-sidebar-toggle" onClick={toggleSidebar} title={isWide ? 'Minimize sidebar' : 'Expand sidebar'} aria-label={isWide ? 'Minimize sidebar' : 'Expand sidebar'}>
          {isWide ? <PanelLeftClose size={18} strokeWidth={1.8}/> : <PanelLeftOpen size={18} strokeWidth={1.8}/>} 
        </button>
        {isWide && <div className="forge-workspace-label">WORKSPACE</div>}
      </div>
      <nav className="forge-sidebar-nav" aria-label="Primary">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          return (
            <button key={item.id} type="button" onClick={() => setActivePage(item.id)} className={`forge-side-tab ${activePage === item.id ? 'active' : ''}`} title={item.label}>
              <Icon size={18} strokeWidth={1.8}/>{isWide && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>
      <div className="forge-sidebar-bottom">
        <button type="button" onClick={onOpenSettings} className="forge-side-tab" title="Settings">
          <Settings size={18} strokeWidth={1.8}/>{isWide && <span>Settings</span>}
        </button>
      </div>
    </aside>
  );
}
