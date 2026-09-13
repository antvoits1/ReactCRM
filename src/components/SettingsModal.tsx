import { SETTINGS_FONTS, THEME_COLORS, SIDEBAR_COLORS } from '../lib/theme-options';
import { ThemeSettings } from '../store';

interface SettingsModalProps {
  theme: ThemeSettings;
  setTheme: (theme: Partial<ThemeSettings>) => void;
  onClose: () => void;
}

export default function SettingsModal({ theme, setTheme, onClose }: SettingsModalProps) {
  const { fontFamily, uiScale, bgCanvas, bgConsole, fontOffset } = theme;

  return (
    <div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="bg-[var(--bg-canvas)] w-full max-w-md rounded-lg shadow-2xl flex flex-col border border-slate-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="h-16 flex items-center px-6 border-b border-slate-200 bg-slate-50 rounded-t-lg">
          <h2 className="font-bold text-[calc(15px+var(--font-offset))] text-slate-900">Advanced Settings</h2>
        </div>
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">

          <div>
            <label className="block text-[calc(11px+var(--font-offset))] font-bold uppercase tracking-wider text-slate-500 mb-2">Typography</label>
            <select
              className="w-full border border-slate-200 rounded-lg p-3 text-[calc(14px+var(--font-offset))] bg-slate-50 outline-none text-slate-900 font-medium shadow-sm hover:border-black/20 hover:bg-slate-100 transition-colors"
              value={fontFamily}
              onChange={e => setTheme({ fontFamily: e.target.value })}
            >
              {SETTINGS_FONTS.map(f => <option key={f.name} value={f.val}>{f.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[calc(11px+var(--font-offset))] font-bold uppercase tracking-wider text-slate-500 mb-2">UI Scale (Ultrawide)</label>
            <input
              type="range" min="0.75" max="1.5" step="0.05"
              value={uiScale}
              onChange={e => setTheme({ uiScale: parseFloat(e.target.value) })}
              className="w-full accent-slate-800"
            />
            <div className="text-right text-[calc(12px+var(--font-offset))] text-slate-500 mt-1 font-medium">{Math.round(uiScale * 100)}%</div>
          </div>

          <div>
            <label className="block text-[calc(11px+var(--font-offset))] font-bold uppercase tracking-wider text-slate-500 mb-2">Main Background Color</label>
            <select
              className="w-full border border-slate-200 rounded-lg p-3 text-[calc(14px+var(--font-offset))] bg-slate-50 outline-none text-slate-900 font-medium shadow-sm hover:border-slate-300 transition-colors mb-4"
              value={bgCanvas}
              onChange={e => setTheme({ bgCanvas: e.target.value })}
            >
              {THEME_COLORS.map(c => <option key={c.name} value={c.val}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[calc(11px+var(--font-offset))] font-bold uppercase tracking-wider text-slate-500 mb-2">Sidebar & Dialer Background</label>
            <select
              className="w-full border border-slate-200 rounded-lg p-3 text-[calc(14px+var(--font-offset))] bg-slate-50 outline-none text-slate-900 font-medium shadow-sm hover:border-slate-300 transition-colors"
              value={bgConsole}
              onChange={e => setTheme({ bgConsole: e.target.value })}
            >
              {SIDEBAR_COLORS.map(c => <option key={c.name} value={c.val}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[calc(11px+var(--font-offset))] font-bold uppercase tracking-wider text-slate-500 mb-2">Global Font Scaler</label>
            <div className="flex items-center gap-4">
              <button onClick={() => setTheme({ fontOffset: Math.max(-4, fontOffset - 0.5) })} className="w-12 h-10 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 font-bold text-slate-900 shadow-sm transition-colors">-</button>
              <span className="text-[calc(14px+var(--font-offset))] font-bold font-mono text-slate-900 w-16 text-center">{fontOffset > 0 ? '+' : ''}{fontOffset}px</span>
              <button onClick={() => setTheme({ fontOffset: Math.min(20, fontOffset + 0.5) })} className="w-12 h-10 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 font-bold text-slate-900 shadow-sm transition-colors">+</button>
            </div>
            <div className="text-[calc(11px+var(--font-offset))] text-slate-500 mt-2">Scales all text up or down by 0.5px increments.</div>
          </div>

        </div>
      </div>
    </div>
  );
}
