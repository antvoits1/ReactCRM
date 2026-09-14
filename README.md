# ReactCRM-016 · Dashboard Palette React

Clean React/Vite build based on ReactCRM-015, with the approved dashboard color/line system applied without changing lead content or CRM workflows.

## Design changes
- Always-visible white topbar plus dark navy sidenav.
- One-click sidenav collapse: wide navigation or skinny icon bar.
- Reference palette: page `#F2F4F8`, white surfaces, soft `#F7F8FC`, navy `#1E2235`, blue `#3B6FD4`, amber `#C97B2A`, green `#1A8F7A`.
- Thin `#E2E6F0` / `#D8DDE8` divider and border system.
- No neon, purple, pink, red visual accents, gradients, or glow effects.
- No initials/avatar circles, lead status pills, or added content.
- Middle record header and content stay inside one continuous panel.
- Inter remains the global font.
- Existing 12px draggable panel divider spacing and saved panel widths are preserved.
- Fixed 1200px mobile viewport with pinch zoom remains enabled.

## Existing functionality preserved
- Leads selection/search/revenue sorting.
- Draggable Leads and Communications panel widths with local persistence/reset.
- Contact call/SMS/WhatsApp/email quick actions.
- Statements, bank account, sales pitch, latest activity, and statement viewer.
- Communications All / Messages / Calls / Contacts / Email views and composers.
- External call handoff through `ForgeTelephonyAdapter` or `forge:call-request`.

## Commands
```bash
npm ci
npm run audit
npm run lint
npm run build
npm run dev
```
