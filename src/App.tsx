import { useEffect, useState } from 'react';
import { useStore } from './store';
import { isLightColor } from './lib/format';
import type { ActivePage } from './lib/navigation';
import NavRail from './components/NavRail';
import LeadsRail from './components/LeadsRail';
import LeadDetailPanel from './components/LeadDetailPanel';
import IOSCommPanel from './components/IOSCommPanel';
import MessagesView from './components/MessagesView';
import StatementViewerOverlay from './components/StatementViewerOverlay';
import DialerBanner from './components/DialerBanner';
import SettingsModal from './components/SettingsModal';

export default function App() {
  const {
    leads, fontFamily, fontOffset, uiScale, bgCanvas, bgConsole,
    dialerPinned, dialerVisible, navMode, setTheme, toggleDialerPin, setDialerVisible, setNavMode
  } = useStore();

  const [selectedId, setSelectedId] = useState(leads[0]?.id);
  const [activePage, setActivePage] = useState<ActivePage>('crm');
  const [showSettings, setShowSettings] = useState(false);
  const [viewerDocIndex, setViewerDocIndex] = useState<number | null>(null);
  const [dialerNumber, setDialerNumber] = useState('');
  const [messageNumber, setMessageNumber] = useState('');

  const lead = leads.find(l => l.id === selectedId) || leads[0];

  useEffect(() => {
    document.documentElement.style.setProperty('--font-family-main', fontFamily);
    document.documentElement.style.setProperty('--ui-scale', String(uiScale));
    document.documentElement.style.setProperty('--font-offset', `${fontOffset}px`);
    document.documentElement.style.setProperty('--bg-canvas', bgCanvas);
  }, [fontFamily, uiScale, fontOffset, bgCanvas]);

  useEffect(() => {
    if (!lead) return;
    setDialerNumber(lead.mobiles[0]?.n ?? lead.landlines[0]?.n ?? '');
    setMessageNumber(lead.mobiles[0]?.n ?? '');
  }, [lead?.id]);

  const isTop = navMode === 'topbar';
  const isWide = navMode === 'sidebar-wide';
  const isLight = isLightColor(bgConsole);

  const cycleNavMode = () => {
    if (navMode === 'sidebar-slim') setNavMode('sidebar-wide');
    else if (navMode === 'sidebar-wide') setNavMode('topbar');
    else setNavMode('sidebar-slim');
  };

  const openDialer = (number?: string) => {
    if (number) setDialerNumber(number);
    else if (lead) setDialerNumber(lead.mobiles[0]?.n ?? lead.landlines[0]?.n ?? '');
    setDialerVisible(true);
  };

  const openMessages = (number?: string) => {
    if (number) setMessageNumber(number);
    else if (lead) setMessageNumber(lead.mobiles[0]?.n ?? '');
    setActivePage('messages');
  };

  const handlePageChange = (page: ActivePage) => {
    if (page === 'messages' && lead) setMessageNumber(lead.mobiles[0]?.n ?? '');
    setActivePage(page);
  };

  const minStmtIndex = lead?.mtd ? -1 : 0;
  const maxStmtIndex = lead ? lead.stmts.length - 1 : 0;

  return (
    <div className={`flex h-full w-full min-w-0 overflow-hidden bg-[var(--bg-canvas)] text-[var(--text-primary)] ${isTop ? 'flex-col gap-[2px]' : 'flex-row gap-[2px]'}`}>
      <NavRail
        isTop={isTop}
        isWide={isWide}
        isLight={isLight}
        bgConsole={bgConsole}
        activePage={activePage}
        setActivePage={handlePageChange}
        cycleNavMode={cycleNavMode}
        onOpenSettings={() => setShowSettings(true)}
      />

      <div className="flex flex-1 min-w-0 overflow-hidden relative gap-[2px]">
        {activePage === 'crm' && lead && (
          <>
            <LeadsRail leads={leads} selectedId={selectedId} setSelectedId={setSelectedId} />
            <div data-panel="lead-detail" className="flex flex-1 basis-0 min-w-0 overflow-hidden">
              <LeadDetailPanel
                lead={lead}
                onOpenDialer={openDialer}
                onOpenMessages={openMessages}
                setViewerDocIndex={setViewerDocIndex}
              />
            </div>
            <div data-panel="communications" className="flex flex-1 basis-0 min-w-0 overflow-hidden">
              <IOSCommPanel lead={lead} preferredMobile={messageNumber} fullWidth />
            </div>
          </>
        )}

        {activePage === 'messages' && (
          <MessagesView
            leads={leads}
            selectedLeadId={selectedId}
            setSelectedLeadId={setSelectedId}
            preferredNumber={messageNumber}
            setPreferredNumber={setMessageNumber}
          />
        )}
      </div>

      {lead && viewerDocIndex !== null && (
        <StatementViewerOverlay
          lead={lead}
          viewerDocIndex={viewerDocIndex}
          setViewerDocIndex={setViewerDocIndex}
          minStmtIndex={minStmtIndex}
          maxStmtIndex={maxStmtIndex}
        />
      )}

      {lead && (
        <DialerBanner
          lead={lead}
          number={dialerNumber}
          bgConsole={bgConsole}
          isLight={isLight}
          dialerVisible={dialerVisible}
          dialerPinned={dialerPinned}
          toggleDialerPin={toggleDialerPin}
          setDialerVisible={setDialerVisible}
        />
      )}

      {showSettings && (
        <SettingsModal
          theme={{ fontFamily, uiScale, bgCanvas, bgConsole, fontOffset }}
          setTheme={setTheme}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
