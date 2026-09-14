import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
const root=path.resolve(path.dirname(url.fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const files={
  app:read('src/App.tsx'), nav:read('src/components/NavRail.tsx'), leads:read('src/components/LeadsRail.tsx'),
  detail:read('src/components/LeadDetailPanel.tsx'), comm:read('src/components/IOSCommPanel.tsx'),
  messages:read('src/components/MessagesView.tsx'), settings:read('src/components/SettingsModal.tsx'),
  statement:read('src/components/StatementDocument.tsx'), viewer:read('src/components/StatementViewerOverlay.tsx'),
  store:read('src/store.ts'), html:read('index.html')
};
const css=['src/index.css','src/styles/base.css','src/styles/leads.css','src/styles/detail.css','src/styles/communications.css','src/styles/auxiliary.css'].map(read).join('\n');
const pkg=JSON.parse(read('package.json')); const lock=JSON.parse(read('package-lock.json'));
const ui=Object.values(files).join('\n')+css;
let pass=0; const test=(name,ok)=>{if(!ok) throw new Error(`FAIL: ${name}`); console.log(`PASS ${String(++pass).padStart(2,'0')} ${name}`)};
const has=(s,n)=>s.includes(n);

test('package and lock versions match',pkg.version===lock.version&&pkg.version===lock.packages[''].version);
test('build metadata is v16',has(files.html,'ReactCRM-016-20260914-DashboardPalette-React'));
test('1200px pinch-zoom viewport is enabled',/width=1200/.test(files.html)&&/user-scalable=yes/.test(files.html));
test('Inter is loaded and global',/family=Inter/.test(files.html)&&has(css,"--font-family-main: 'Inter'"));
test('reference page color is exact',has(css,'--bg-canvas: #F2F4F8;'));
test('reference white surface is exact',has(css,'--surface: #FFFFFF;'));
test('reference soft panel color is exact',has(css,'--soft: #F7F8FC;'));
test('reference navy is exact',has(css,'--navy: #1E2235;'));
test('reference blue accent is exact',has(css,'--accent-blue: #3B6FD4;'));
test('reference amber accent is exact',has(css,'--accent-amber: #C97B2A;'));
test('reference green accent is exact',has(css,'--accent-green: #1A8F7A;'));
test('reference borders are exact',has(css,'--line: #E2E6F0;')&&has(css,'--line-strong: #D8DDE8;'));
test('no purple or pink accents',!/#(?:6B4EBC|7C3AED|8B5CF6|A855F7|EC4899|F43F5E|DB2777)/i.test(ui));
test('no red accents',!/#(?:C43B3B|DC2626|EF4444|F05C55)/i.test(ui)&&!/text-red-/i.test(files.statement));
test('no gradients or glow styling',!/linear-gradient|radial-gradient|glow/i.test(ui));
test('topbar and sidebar render together',has(files.app,'<NavRail variant="topbar"')&&has(files.app,'<NavRail variant="sidebar"'));
test('sidebar one-click collapse is wired',has(files.app,"setNavMode(isWide ? 'sidebar-slim' : 'sidebar-wide')")&&has(files.nav,'onClick={toggleSidebar}'));
test('sidebar wide and slim widths exist',has(css,'.forge-sidebar.wide { width: 220px; }')&&has(css,'.forge-sidebar.slim { width: 54px; }'));
test('account uses icon instead of initials',has(files.nav,'<UserRound')&&!has(files.nav,'>CB<'));
test('no avatar or initials UI',!/avatar|initials?/i.test(files.nav+files.leads+files.detail+files.comm));
test('no status pills',!/status-pill|stage-pill|\bpill\b/i.test(files.nav+files.leads+files.detail+files.comm+css));
test('middle detail is one continuous panel',has(files.detail,'<div className="detail-scroll">')&&has(files.app,'data-panel="lead-detail" className="forge-panel-surface"'));
test('middle header is not a separate surface',!/detail-header[^>]*forge-panel-surface/.test(files.detail));
test('12px draggable panel dividers remain',has(files.app,'const DIVIDER_WIDTH = 12;')&&(files.app.match(/onPointerDown=/g)||[]).length===2);
test('saved panel widths remain',has(files.app,'saveWidth(PANEL_KEYS.leads, leadsWidth)')&&has(files.app,'saveWidth(PANEL_KEYS.comms, commsWidth)'));
test('lead search and revenue sort remain',has(files.leads,'Search leads')&&has(files.leads,'Sort by revenue'));
test('contact call SMS WhatsApp email actions remain',has(files.detail,'title="Call"')&&has(files.detail,'title="SMS"')&&has(files.detail,'title="WhatsApp"')&&has(files.detail,'title="Email"'));
test('statements bank sales pitch and activity remain',has(files.detail,'Statements')&&has(files.detail,'Bank Account')&&has(files.detail,'Sales Pitch')&&has(files.detail,'Latest Activity'));
test('communications tabs remain complete',has(files.comm,"['all','messages','calls','contacts','email']"));
test('message and email composers remain',has(files.comm,'className="comm-composer"')&&has(files.comm,'className="comm-email-compose"'));
test('call handoff uses adapter and event',has(files.app,'ForgeTelephonyAdapter')&&has(files.app,"new CustomEvent('forge:call-request'"));
test('obsolete internal dialer is absent',!/dialer|dtmf|keypad/i.test(files.app+files.nav+files.comm+css));
test('statement viewer navigation remains',has(files.viewer,'View newer statement')&&has(files.viewer,'View older statement'));
test('MTD statement support remains',has(files.detail,'lead.mtd')&&has(files.statement,'index === -1'));
test('scrollbars are skinny and hover-only',has(css,'scrollbar-color: transparent transparent')&&has(css,'width: 4px; height: 4px;'));
test('no forms can submit and reload page',!/<form\b/i.test(ui));
console.log(`TOTAL ${pass}/${pass} PASS`);
