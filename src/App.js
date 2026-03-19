import React from 'react';
import {
  Sun, Moon, Bell, Settings, Database, Search, MessageSquare,
  CheckCircle, XCircle, AlertTriangle, Clock, ChevronRight,
  RefreshCw, Terminal, Plus, Trash2, Play, Eye, Filter,
  TrendingUp, TrendingDown, Minus, Zap, Shield, Activity,
  BarChart2, FileText, GitBranch, Lock, ChevronDown, X,
  ArrowRight, Check, Loader, Hash, Table, Columns
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────
const API = "https://intentwise-backend-production.up.railway.app";

// ─── Theme definitions ───────────────────────────────────────────────────────
// Each theme: bg, surface, card, border, border2, text, text2, muted, dim,
//             accent, accentL, green, greenL, yellow, red, orange, purple, cyan,
//             isDark, name, font, monoFont, sidebarBg, navActiveBg, navActiveText

const THEMES = {
  light: {
    name:"Light", isDark:false,
    bg:"#FAFAFA", surface:"#FFFFFF", card:"#FFFFFF",
    border:"#F0F0F0", border2:"#E0E0E0",
    text:"#111111", text2:"#333333", muted:"#666666", dim:"#999999",
    accent:"#EAB308", accentL:"#FCD34D",
    green:"#16A34A", greenL:"#22C55E", yellow:"#D97706",
    red:"#DC2626", orange:"#EA580C", purple:"#9333EA", cyan:"#0891B2",
    sidebarBg:"#1C1917", navActiveBg:"rgba(234,179,8,0.15)",
    navActiveText:"#FCD34D", navInactiveText:"rgba(255,255,255,0.38)",
    font:"'DM Sans',sans-serif",
    monoFont:"'JetBrains Mono',monospace",
    googleFonts:"DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500",
    wallpaper:"PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc1MjAnIGhlaWdodD0nNTIwJz48Y2lyY2xlIGN4PSc1MjAnIGN5PScwJyByPScxMjAnIGZpbGw9J25vbmUnIHN0cm9rZT0ncmdiYSgyMzQsMTc5LDgsMC4wOCknIHN0cm9rZS13aWR0aD0nMScvPjxjaXJjbGUgY3g9JzUyMCcgY3k9JzAnIHI9JzIyMCcgZmlsbD0nbm9uZScgc3Ryb2tlPSdyZ2JhKDIzNCwxNzksOCwwLjA2KScgc3Ryb2tlLXdpZHRoPScxJy8+PGNpcmNsZSBjeD0nNTIwJyBjeT0nMCcgcj0nMzQwJyBmaWxsPSdub25lJyBzdHJva2U9J3JnYmEoMjM0LDE3OSw4LDAuMDQpJyBzdHJva2Utd2lkdGg9JzEnLz48Y2lyY2xlIGN4PSc1MjAnIGN5PScwJyByPSc0NjAnIGZpbGw9J25vbmUnIHN0cm9rZT0ncmdiYSgyMzQsMTc5LDgsMC4wMjUpJyBzdHJva2Utd2lkdGg9JzEnLz48L3N2Zz4=",
  },
  solar: {
    name:"Solar", isDark:false,
    bg:"#FFFBEB", surface:"#FFFFFF", card:"#FFFFFF",
    border:"#FEF3C7", border2:"#FDE68A",
    text:"#1C1917", text2:"#292524", muted:"#6B5B3E", dim:"#92807A",
    accent:"#F59E0B", accentL:"#FBBF24",
    green:"#059669", greenL:"#10B981", yellow:"#D97706",
    red:"#DC2626", orange:"#EA580C", purple:"#7C3AED", cyan:"#0891B2",
    sidebarBg:"#1C1400", navActiveBg:"rgba(251,191,36,0.18)",
    navActiveText:"#FEF08A", navInactiveText:"rgba(255,255,255,0.36)",
    font:"'Nunito',sans-serif",
    monoFont:"'JetBrains Mono',monospace",
    googleFonts:"Nunito:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500",
    wallpaper:"PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc1NjAnIGhlaWdodD0nNDAwJz48cmFkaWFsR3JhZGllbnQgaWQ9J2cnIGN4PSc4NSUnIGN5PScxNSUnIHI9JzQwJSc+PHN0b3Agb2Zmc2V0PScwJScgc3RvcC1jb2xvcj0ncmdiYSgyNTEsMTkxLDM2LDAuMTgpJy8+PHN0b3Agb2Zmc2V0PScxMDAlJyBzdG9wLWNvbG9yPSdyZ2JhKDI1MSwxOTEsMzYsMCknLz48L3JhZGlhbEdyYWRpZW50PjxyZWN0IHdpZHRoPSc1NjAnIGhlaWdodD0nNDAwJyBmaWxsPSd1cmwoI2cpJy8+PGNpcmNsZSBjeD0nNDgwJyBjeT0nNDgnIHI9JzYwJyBmaWxsPSdub25lJyBzdHJva2U9J3JnYmEoMjUxLDE5MSwzNiwwLjEwKScgc3Ryb2tlLXdpZHRoPScyJy8+PGNpcmNsZSBjeD0nNDgwJyBjeT0nNDgnIHI9JzkwJyBmaWxsPSdub25lJyBzdHJva2U9J3JnYmEoMjUxLDE5MSwzNiwwLjA2KScgc3Ryb2tlLXdpZHRoPScxLjUnLz48Y2lyY2xlIGN4PSc0ODAnIGN5PSc0OCcgcj0nMTMwJyBmaWxsPSdub25lJyBzdHJva2U9J3JnYmEoMjUxLDE5MSwzNiwwLjA0KScgc3Ryb2tlLXdpZHRoPScxJy8+PC9zdmc+",
  },
  flame: {
    name:"Flame", isDark:false,
    bg:"#FFF7F5", surface:"#FFFFFF", card:"#FFFFFF",
    border:"#FFE4DC", border2:"#FFC9B8",
    text:"#1C0A05", text2:"#3D1A10", muted:"#7A3020", dim:"#A05040",
    accent:"#F97316", accentL:"#FB923C",
    green:"#059669", greenL:"#10B981", yellow:"#D97706",
    red:"#DC2626", orange:"#F97316", purple:"#9333EA", cyan:"#0891B2",
    sidebarBg:"#1A0800", navActiveBg:"rgba(249,115,22,0.16)",
    navActiveText:"#FED7AA", navInactiveText:"rgba(255,255,255,0.36)",
    font:"'Syne',sans-serif",
    monoFont:"'Fira Code',monospace",
    googleFonts:"Syne:wght@400;500;600;700;800&family=Fira+Code:wght@400;500",
    wallpaper:"PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc0ODAnIGhlaWdodD0nNTIwJz48cGF0aCBkPSdNNDgwIDAgUTM4MCA4MCAzNjAgMjAwIFEzNDAgMzEwIDQyMCA0MDAnIHN0cm9rZT0ncmdiYSgyNDksMTE1LDIyLDAuMTApJyBzdHJva2Utd2lkdGg9JzIuNScgZmlsbD0nbm9uZScgc3Ryb2tlLWxpbmVjYXA9J3JvdW5kJy8+PHBhdGggZD0nTTQ4MCA0MCBRNDAwIDEwMCAzOTAgMjIwJyBzdHJva2U9J3JnYmEoMjQ5LDExNSwyMiwwLjA3KScgc3Ryb2tlLXdpZHRoPScxLjgnIGZpbGw9J25vbmUnLz48cGF0aCBkPSdNNDgwIDEwMCBRNDIwIDE1MCA0MTAgMjYwIFE0MDAgMzQwIDQ2MCA0MjAnIHN0cm9rZT0ncmdiYSgyMzksNjgsNjgsMC4wNyknIHN0cm9rZS13aWR0aD0nMS41JyBmaWxsPSdub25lJy8+PGNpcmNsZSBjeD0nMzYwJyBjeT0nMjAwJyByPSc0JyBmaWxsPSdyZ2JhKDI0OSwxMTUsMjIsMC4xMiknLz48Y2lyY2xlIGN4PSc0MjAnIGN5PSc0MDAnIHI9JzMnIGZpbGw9J3JnYmEoMjM5LDY4LDY4LDAuMTApJy8+PC9zdmc+",
  },
  citrus: {
    name:"Citrus", isDark:false,
    bg:"#F7FDEF", surface:"#FFFFFF", card:"#FFFFFF",
    border:"#ECFCCB", border2:"#D9F99D",
    text:"#1A2A00", text2:"#2D4A00", muted:"#4A7010", dim:"#6A9030",
    accent:"#84CC16", accentL:"#A3E635",
    green:"#059669", greenL:"#10B981", yellow:"#CA8A04",
    red:"#DC2626", orange:"#EA580C", purple:"#7C3AED", cyan:"#0891B2",
    sidebarBg:"#0F1A00", navActiveBg:"rgba(132,204,22,0.16)",
    navActiveText:"#D9F99D", navInactiveText:"rgba(255,255,255,0.36)",
    font:"'Outfit',sans-serif",
    monoFont:"'Source Code Pro',monospace",
    googleFonts:"Outfit:wght@300;400;500;600;700&family=Source+Code+Pro:wght@400;500",
    wallpaper:"PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc1MDAnIGhlaWdodD0nNTAwJz48cG9seWdvbiBwb2ludHM9JzUwMCwwIDMyMCwwIDUwMCwxODAnIGZpbGw9J3JnYmEoMTMyLDIwNCwyMiwwLjA2KScvPjxwb2x5Z29uIHBvaW50cz0nNTAwLDAgNTAwLDIyMCAyODAsMCcgZmlsbD0ncmdiYSgxMzIsMjA0LDIyLDAuMDQpJy8+PHBvbHlnb24gcG9pbnRzPSc1MDAsMCAzNjAsMTQwIDUwMCwzMjAnIGZpbGw9J3JnYmEoMTMyLDIwNCwyMiwwLjAzKScvPjxsaW5lIHgxPSc1MDAnIHkxPScwJyB4Mj0nMjQwJyB5Mj0nMjAwJyBzdHJva2U9J3JnYmEoMTMyLDIwNCwyMiwwLjA3KScgc3Ryb2tlLXdpZHRoPScxJy8+PGxpbmUgeDE9JzUwMCcgeTE9JzAnIHgyPSczMDAnIHkyPSczMjAnIHN0cm9rZT0ncmdiYSgxMzIsMjA0LDIyLDAuMDUpJyBzdHJva2Utd2lkdGg9JzEnLz48Y2lyY2xlIGN4PScyNDAnIGN5PScyMDAnIHI9JzMnIGZpbGw9J3JnYmEoMTMyLDIwNCwyMiwwLjEyKScvPjwvc3ZnPg==",
  },
  berry: {
    name:"Berry", isDark:false,
    bg:"#FDF4FF", surface:"#FFFFFF", card:"#FFFFFF",
    border:"#FAE8FF", border2:"#F0ABFC",
    text:"#2D0040", text2:"#4A006A", muted:"#7A2090", dim:"#9A40B0",
    accent:"#D946EF", accentL:"#E879F9",
    green:"#059669", greenL:"#10B981", yellow:"#CA8A04",
    red:"#DC2626", orange:"#EA580C", purple:"#7C3AED", cyan:"#06B6D4",
    sidebarBg:"#1A0028", navActiveBg:"rgba(217,70,239,0.16)",
    navActiveText:"#F0ABFC", navInactiveText:"rgba(255,255,255,0.36)",
    font:"'Cormorant Garamond',serif",
    monoFont:"'IBM Plex Mono',monospace",
    googleFonts:"Cormorant+Garamond:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500",
    wallpaper:"PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc0ODAnIGhlaWdodD0nNDgwJz48Y2lyY2xlIGN4PSc0ODAnIGN5PScwJyByPScxMDAnIGZpbGw9J25vbmUnIHN0cm9rZT0ncmdiYSgyMTcsNzAsMjM5LDAuMDgpJyBzdHJva2Utd2lkdGg9JzEuNScvPjxjaXJjbGUgY3g9JzQ4MCcgY3k9JzAnIHI9JzE4MCcgZmlsbD0nbm9uZScgc3Ryb2tlPSdyZ2JhKDIxNyw3MCwyMzksMC4wNSknIHN0cm9rZS13aWR0aD0nMScvPjxjaXJjbGUgY3g9JzQ4MCcgY3k9JzAnIHI9JzI4MCcgZmlsbD0nbm9uZScgc3Ryb2tlPSdyZ2JhKDEyNCw1OCwyMzcsMC4wNCknIHN0cm9rZS13aWR0aD0nMScvPjxwYXRoIGQ9J000ODAgMCBRMzYwIDgwIDMyMCAyMDAnIHN0cm9rZT0ncmdiYSgyMTcsNzAsMjM5LDAuMDgpJyBzdHJva2Utd2lkdGg9JzEuMicgZmlsbD0nbm9uZScvPjxwYXRoIGQ9J000ODAgNjAgUTM4MCAxMjAgMzQwIDI1MCcgc3Ryb2tlPSdyZ2JhKDEyNCw1OCwyMzcsMC4wNiknIHN0cm9rZS13aWR0aD0nMScgZmlsbD0nbm9uZScvPjxjaXJjbGUgY3g9JzMyMCcgY3k9JzIwMCcgcj0nMycgZmlsbD0ncmdiYSgyMTcsNzAsMjM5LDAuMTIpJy8+PC9zdmc+",
  },
  ocean: {
    name:"Ocean", isDark:false,
    bg:"#F0FDFF", surface:"#FFFFFF", card:"#FFFFFF",
    border:"#CFFAFE", border2:"#A5F3FC",
    text:"#0A2030", text2:"#0E3050", muted:"#0E6080", dim:"#1A80A0",
    accent:"#06B6D4", accentL:"#22D3EE",
    green:"#059669", greenL:"#10B981", yellow:"#CA8A04",
    red:"#DC2626", orange:"#EA580C", purple:"#7C3AED", cyan:"#06B6D4",
    sidebarBg:"#041520", navActiveBg:"rgba(6,182,212,0.16)",
    navActiveText:"#A5F3FC", navInactiveText:"rgba(255,255,255,0.36)",
    font:"'IBM Plex Sans',sans-serif",
    monoFont:"'IBM Plex Mono',monospace",
    googleFonts:"IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500",
    wallpaper:"PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc1ODAnIGhlaWdodD0nMzYwJz48cGF0aCBkPSdNMjAwIDAgUTMyMCA2MCA0MDAgMTQwIFE0NjAgMjAwIDUyMCAyMDAgTDU4MCAyMDAgTDU4MCAwIFonIGZpbGw9J3JnYmEoNiwxODIsMjEyLDAuMDQpJy8+PHBhdGggZD0nTTMwMCAwIFE0MDAgNTAgNDYwIDEyMCBRNTEwIDE3MCA1ODAgMTYwIEw1ODAgMCBaJyBmaWxsPSdyZ2JhKDYsMTgyLDIxMiwwLjA0KScvPjxwYXRoIGQ9J000MjAgMCBRNDgwIDQwIDUyMCAxMDAgTDU4MCAxMDAgTDU4MCAwIFonIGZpbGw9J3JnYmEoNiwxODIsMjEyLDAuMDUpJy8+PHBhdGggZD0nTTAgMCBRMTAwIDgwIDIwMCA2MCBRMzAwIDQwIDQwMCAxMDAgUTQ2MCAxMzAgNTgwIDEyMCcgc3Ryb2tlPSdyZ2JhKDYsMTgyLDIxMiwwLjA3KScgc3Ryb2tlLXdpZHRoPScxLjUnIGZpbGw9J25vbmUnLz48L3N2Zz4=",
  },
};

// backwards compat
const LIGHT = THEMES.light;
const DARK  = THEMES.dark;

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useLocal(key, def) {
  const [v, setV] = React.useState(() => {
    try { const s = localStorage.getItem(key); return s !== null ? JSON.parse(s) : def; }
    catch { return def; }
  });
  const set = React.useCallback(fn => setV(prev => {
    const next = typeof fn === 'function' ? fn(prev) : fn;
    try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
    return next;
  }), [key]);
  return [v, set];
}
function useSession(key, def) {
  const [v, setV] = React.useState(() => {
    try { const s = sessionStorage.getItem(key); return s !== null ? JSON.parse(s) : def; }
    catch { return def; }
  });
  const set = React.useCallback(fn => setV(prev => {
    const next = typeof fn === 'function' ? fn(prev) : fn;
    try { sessionStorage.setItem(key, JSON.stringify(next)); } catch {}
    return next;
  }), [key]);
  const clear = React.useCallback(() => {
    try { sessionStorage.removeItem(key); } catch {}
    setV(def);
  }, [key]);
  return [v, set, clear];
}

// ─── Theme Context ────────────────────────────────────────────────────────────
const ThemeCtx = React.createContext(LIGHT);
const useT = () => React.useContext(ThemeCtx);

// ─── Shared UI atoms ──────────────────────────────────────────────────────────
function Badge({ label, color, pulse }) {
  const T = useT();
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:5,
      padding:"2px 9px", borderRadius:99, fontSize:10, fontWeight:700,
      letterSpacing:"0.04em", textTransform:"uppercase",
      background:`${color || T.accent}18`, color: color || T.accent,
      border:`1px solid ${color || T.accent}30`,
    }}>
      {pulse && <span style={{
        width:6,height:6,borderRadius:"50%",background:color||T.accent,
        animation:"pulse 1.5s infinite"
      }}/>}
      {label}
    </span>
  );
}

function Card({ children, style, onClick, hoverable }) {
  const T = useT();
  const [hov, setHov] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={()=>hoverable&&setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{
        background:T.card, border:`1px solid ${hov?T.border2:T.border}`,
        borderRadius:10, transition:"all 0.15s",
        boxShadow: hov ? "0 4px 16px rgba(0,0,0,0.06)" : "none",
        cursor: onClick ? "pointer" : "default",
        ...style
      }}
    >{children}</div>
  );
}

function Btn({ children, onClick, variant="primary", size="md", disabled, style }) {
  const T = useT();
  const [hov, setHov] = React.useState(false);
  const base = {
    display:"inline-flex", alignItems:"center", gap:6,
    border:"none", borderRadius:7, fontWeight:600,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    transition:"all 0.15s",
    fontSize: size==="sm" ? 11 : size==="lg" ? 14 : 12,
    padding: size==="sm" ? "4px 10px" : size==="lg" ? "10px 22px" : "6px 14px",
  };
  const variants = {
    primary: { background: hov&&!disabled ? T.accentL : T.accent, color:"white" },
    ghost:   { background: hov&&!disabled ? `${T.accent}12` : "transparent", color:T.accent, border:`1px solid ${T.accent}30` },
    danger:  { background: hov&&!disabled ? "#EF4444" : "#DC2626", color:"white" },
    success: { background: hov&&!disabled ? T.greenL : T.green, color:"white" },
    muted:   { background: hov&&!disabled ? T.border2 : T.border, color:T.muted },
  };
  return (
    <button onClick={!disabled?onClick:undefined}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{...base,...variants[variant],...style}}>
      {children}
    </button>
  );
}

function StatusDot({ status }) {
  const T = useT();
  const colors = {
    healthy:"#10B981", clean:"#10B981", fixed:"#10B981", pass:"#10B981",
    warning:"#F59E0B", pending:"#F59E0B", awaiting_approval:"#F59E0B",
    critical:"#EF4444", error:"#EF4444", failed:"#EF4444", fail:"#EF4444",
    running:"#3B82F6", scanning:"#3B82F6",
    idle:T.dim,
  };
  const c = colors[status] || T.dim;
  return (
    <span style={{
      display:"inline-block", width:8, height:8, borderRadius:"50%",
      background:c, flexShrink:0,
      animation: status==="running"||status==="scanning" ? "pulse 1.5s infinite" : "none"
    }}/>
  );
}

function Spinner({ size=14, color }) {
  const T = useT();
  return (
    <div style={{
      width:size, height:size, borderRadius:"50%",
      border:`2px solid ${color||T.border2}`,
      borderTopColor: color||T.accent,
      animation:"spin 0.7s linear infinite", flexShrink:0,
    }}/>
  );
}

function EmptyState({ icon: Icon, title, desc, action }) {
  const T = useT();
  return (
    <div style={{ textAlign:"center", padding:"48px 24px" }}>
      <div style={{ width:48, height:48, borderRadius:12, background:T.border,
        display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
        <Icon size={22} color={T.muted}/>
      </div>
      <div style={{ fontSize:14, fontWeight:700, color:T.text, marginBottom:6 }}>{title}</div>
      <div style={{ fontSize:12, color:T.muted, marginBottom:action?16:0 }}>{desc}</div>
      {action}
    </div>
  );
}


// ─── Global CSS ───────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  /* fonts loaded dynamically per theme via <link> */
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  body { -webkit-font-smoothing:antialiased; text-rendering:optimizeLegibility; }
  /* scrollbar */
  @keyframes spin { to { transform:rotate(360deg); } }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideIn { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
  ::-webkit-scrollbar { width:5px; height:5px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:rgba(128,128,128,0.25); border-radius:99px; }
  .fade-in { animation:fadeIn 0.25s ease; }
  .mono { font-family:'IBM Plex Mono', monospace; }
`;


// ─── Nav items ────────────────────────────────────────────────────────────────
const NAV = [
  { id:"brief",     label:"Morning Brief",  icon:Zap,          shortcut:"1" },
  { id:"monitor",   label:"Monitor",        icon:Activity,     shortcut:"2" },
  { id:"triage",    label:"Triage",         icon:AlertTriangle,shortcut:"3" },
  { id:"workflows", label:"Workflows",      icon:GitBranch,    shortcut:"4" },
  { id:"approvals", label:"Approvals",       icon:Lock,         shortcut:"A" },
  { id:"history",   label:"Fix History",    icon:Shield,       shortcut:"5" },
  { id:"notifs",    label:"Notifications",  icon:Bell,         shortcut:"N" },
  { id:"chat",      label:"Ask WiziAgent",  icon:MessageSquare,shortcut:"6" },
  { id:"config",    label:"Configure",      icon:Settings,     shortcut:"7" },
  { id:"query",     label:"Data Viewer & Editor", icon:Terminal,     shortcut:"8" },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ active, setActive, pendingCount, themeKey, setThemeKey }) {
  const T = useT();
  const [showThemes, setShowThemes] = React.useState(false);

  const THEME_LIST = [
    { key:"light",  label:"Light",  dot:"#FAFAFA", dot2:"#EAB308" },
    { key:"solar",  label:"Solar",  dot:"#FFFBEB", dot2:"#F59E0B" },
    { key:"flame",  label:"Flame",  dot:"#FFF7F5", dot2:"#F97316" },
    { key:"citrus", label:"Citrus", dot:"#F7FDEF", dot2:"#84CC16" },
    { key:"berry",  label:"Berry",  dot:"#FDF4FF", dot2:"#D946EF" },
    { key:"ocean",  label:"Ocean",  dot:"#F0FDFF", dot2:"#06B6D4" },
  ];

  return (
    <aside style={{
      width:220, flexShrink:0,
      background: T.sidebarBg || T.surface,
      borderRight:`1px solid ${T.border}`,
      display:"flex", flexDirection:"column",
      height:"100vh", position:"sticky", top:0,
    }}>
      {/* Logo */}
      <div style={{ padding:"20px 16px 14px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{
            width:34, height:34, borderRadius:9, flexShrink:0,
            background:`linear-gradient(135deg, ${T.accent}, ${T.purple})`,
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:`0 4px 12px ${T.accent}40`,
          }}>
            <Zap size={16} color="white" strokeWidth={2.5}/>
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:700,
              color: T.isDark ? T.text : "#FFFFFF",
              letterSpacing:"-0.01em", fontFamily:T.font }}>
              WiziAgent
            </div>
            <div style={{ fontSize:10, color: T.isDark ? T.dim : "rgba(255,255,255,0.4)",
              marginTop:1 }}>
              QA Platform
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height:1, background:`rgba(255,255,255,0.06)`, margin:"0 12px 8px" }}/>

      {/* Nav items */}
      <nav style={{ flex:1, padding:"4px 8px", overflowY:"auto" }}>
        {NAV.map(item => {
          const Icon = item.icon;
          const isActive = active === item.id;
          const approvalCount = item.id === "approvals" ? pendingCount : 0;
          const hasBadge = (item.id === "triage" && pendingCount > 0) || (item.id === "approvals" && pendingCount > 0);
          return (
            <button key={item.id}
              onClick={() => setActive(item.id)}
              style={{
                width:"100%", display:"flex", alignItems:"center", gap:10,
                padding:"8px 10px", borderRadius:7, border:"none",
                background: isActive
                  ? (T.navActiveBg || `${T.accent}18`)
                  : "transparent",
                color: isActive
                  ? (T.navActiveText || T.accent)
                  : (T.navInactiveText || "rgba(255,255,255,0.35)"),
                cursor:"pointer", marginBottom:1,
                transition:"all 0.12s", textAlign:"left",
                fontFamily:T.font,
              }}
              onMouseEnter={e => {
                if(!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                if(!isActive) e.currentTarget.style.color = T.isDark ? T.text : "rgba(255,255,255,0.7)";
              }}
              onMouseLeave={e => {
                if(!isActive) e.currentTarget.style.background = "transparent";
                if(!isActive) e.currentTarget.style.color = T.navInactiveText || "rgba(255,255,255,0.35)";
              }}
            >
              <Icon size={14} strokeWidth={isActive?2.5:1.8}/>
              <span style={{ fontSize:12, fontWeight:isActive?600:400, flex:1 }}>
                {item.label}
              </span>
              {hasBadge && (
                <span style={{
                  minWidth:18, height:18, borderRadius:99, padding:"0 5px",
                  background:T.red, color:"white", fontSize:9, fontWeight:700,
                  display:"flex", alignItems:"center", justifyContent:"center"
                }}>{pendingCount}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div style={{ height:1, background:"rgba(255,255,255,0.06)", margin:"0 12px 8px" }}/>

      {/* Theme picker */}
      <div style={{ padding:"4px 8px 16px" }}>
        <button
          onClick={() => setShowThemes(p => !p)}
          style={{
            width:"100%", display:"flex", alignItems:"center", gap:8,
            padding:"7px 10px", borderRadius:7, border:"none",
            background: showThemes ? "rgba(255,255,255,0.08)" : "transparent",
            color:"rgba(255,255,255,0.4)",
            cursor:"pointer", fontFamily:T.font, fontSize:12,
            transition:"all 0.12s",
          }}
          onMouseEnter={e=>e.currentTarget.style.color="rgba(255,255,255,0.65)"}
          onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.4)"}
        >
          {/* Current theme preview dot */}
          <div style={{ display:"flex", gap:3, alignItems:"center" }}>
            {(() => {
              const th = THEMES[themeKey];
              return (
                <>
                  <div style={{ width:10, height:10, borderRadius:3,
                    background:th?.bg || "#fff", border:"1px solid rgba(255,255,255,0.2)" }}/>
                  <div style={{ width:6, height:10, borderRadius:2,
                    background:th?.accent || "#3b82f6" }}/>
                </>
              );
            })()}
          </div>
          <span style={{ flex:1 }}>{THEMES[themeKey]?.name || "Theme"}</span>
          <ChevronDown size={12} style={{
            transform: showThemes ? "rotate(180deg)" : "rotate(0)",
            transition:"transform 0.2s"
          }}/>
        </button>

        {showThemes && (
          <div style={{
            marginTop:4, padding:"6px",
            background:"rgba(0,0,0,0.25)", borderRadius:8,
            border:"1px solid rgba(255,255,255,0.08)",
            animation:"fadeIn 0.15s ease",
          }}>
            {THEME_LIST.map(th => (
              <button key={th.key}
                onClick={() => { setThemeKey(th.key); setShowThemes(false); }}
                style={{
                  width:"100%", display:"flex", alignItems:"center", gap:8,
                  padding:"6px 8px", borderRadius:6, border:"none",
                  background: themeKey===th.key ? "rgba(255,255,255,0.1)" : "transparent",
                  cursor:"pointer", fontFamily:T.font, fontSize:11,
                  color: themeKey===th.key ? "white" : "rgba(255,255,255,0.5)",
                  transition:"all 0.1s", textAlign:"left",
                }}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.06)"}
                onMouseLeave={e=>e.currentTarget.style.background=themeKey===th.key?"rgba(255,255,255,0.1)":"transparent"}
              >
                {/* Mini theme preview */}
                <div style={{ display:"flex", gap:2, flexShrink:0 }}>
                  <div style={{ width:12, height:14, borderRadius:3,
                    background:th.dot, border:"1px solid rgba(255,255,255,0.15)" }}/>
                  <div style={{ width:5, height:14, borderRadius:2,
                    background:th.dot2, opacity:0.9 }}/>
                </div>
                {th.label}
                {themeKey===th.key && <Check size={10} style={{ marginLeft:"auto", color:T.accentL }}/>}
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

// ─── Health Sparkline ─────────────────────────────────────────────────────────
function HealthSparkline({ brief, isHealthy, T }) {
  const [history] = useLocal("wz_healthHistory", []);
  // Build 7-point history from localStorage — updated on each scan
  const points = React.useMemo(() => {
    const recent = history.slice(-7);
    // Pad to 7
    while (recent.length < 7) recent.unshift(null);
    return recent;
  }, [history]);

  const w = 320, h = 40, pad = 8;
  const xs = points.map((_,i) => pad + (i / (points.length-1)) * (w - pad*2));

  return (
    <div style={{ display:"flex", alignItems:"center", gap:16 }}>
      <svg width={w} height={h} style={{ overflow:"visible" }}>
        {/* Baseline */}
        <line x1={pad} y1={h-4} x2={w-pad} y2={h-4}
          stroke={T.border} strokeWidth={1}/>
        {/* Data line */}
        <polyline
          points={points.map((p,i) => {
            const score = p === null ? null : (p.clean ? 100 : Math.max(20, 100 - p.issueCount*15));
            return score !== null ? `${xs[i]},${h-4 - (score/100)*(h-8)}` : null;
          }).filter(Boolean).join(" ")}
          fill="none"
          stroke={isHealthy?T.green:T.orange}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Dots */}
        {points.map((p, i) => {
          const score = p === null ? null : (p.clean ? 100 : Math.max(20, 100 - p.issueCount*15));
          if (score === null) return null;
          const y = h-4 - (score/100)*(h-8);
          return (
            <circle key={i} cx={xs[i]} cy={y} r={3}
              fill={score===100?T.green:T.orange}
              stroke={T.surface} strokeWidth={1.5}/>
          );
        })}
      </svg>
      <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
        {["7 scans ago","","","","","","Now"].map((l,i) => (
          l ? <span key={i} style={{ fontSize:9, color:T.dim }}>{l}</span>
            : <span key={i} style={{ fontSize:9 }}>&nbsp;</span>
        ))}
      </div>
    </div>
  );
}


function MorningBriefTab({ onNavigate, onIssueFound }) {
  const T = useT();
  const [brief,       setBrief]       = useSession("wz_brief", null);
  const [loading,     setLoading]     = React.useState(!brief);
  const [error,       setError]       = React.useState(null);
  const [lastFetch,   setLastFetch]   = useLocal("wz_briefTs", null);
  const [fixHistory,  setFixHistory]  = useSession("wz_history", []);
  const [monTables,   setMonTables]   = useSession("wz_monTables",
    [{ schema:"mws", table:"report", label:"mws.report", primary:true, checks:[] }]
  );
  const [tableResults,setTableResults]= useSession("wz_monResults", {});
  const [slackUrl]                    = useLocal("wz_slack", "");

  // ── Compute time since last fetch ────────────────────────────────────────
  const [ageSec, setAgeSec] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => {
      if (lastFetch) setAgeSec(Math.floor((Date.now() - new Date(lastFetch)) / 1000));
    }, 10000);
    if (lastFetch) setAgeSec(Math.floor((Date.now() - new Date(lastFetch)) / 1000));
    return () => clearInterval(id);
  }, [lastFetch]);

  const ageLabel = ageSec < 60 ? "just now"
    : ageSec < 3600 ? `${Math.floor(ageSec/60)}m ago`
    : `${Math.floor(ageSec/3600)}h ago`;

  // ── Compute time-to-fix from history ─────────────────────────────────────
  const avgFixMin = React.useMemo(() => {
    const timed = fixHistory.filter(h => h.durationMs);
    if (!timed.length) return null;
    return Math.round(timed.reduce((s,h) => s + h.durationMs, 0) / timed.length / 60000);
  }, [fixHistory]);

  // ── Build Slack preview message ───────────────────────────────────────────
  const slackPreview = React.useMemo(() => {
    if (!brief) return null;
    const issues = brief.issues || [];
    if (issues.length === 0) return `✅ mws.report is healthy — all checks passed (${brief.total_rows?.toLocaleString()} rows scanned)`;
    return `⚠️ mws.report: ${issues.length} issue(s) — ` + issues.map(i=>`${i.id}: ${i.count} rows`).join(", ");
  }, [brief]);

  const load = React.useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res  = await fetch(`${API}/api/report/triage`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setBrief(data);
      setLastFetch(new Date().toISOString());
      // Save health data point for sparkline
      try {
        const hist = JSON.parse(localStorage.getItem("wz_healthHistory")||"[]");
        hist.push({ clean:!data.issues?.length, issueCount:data.issues?.length||0,
          ts:new Date().toISOString() });
        localStorage.setItem("wz_healthHistory", JSON.stringify(hist.slice(-14)));
      } catch {}
      if (data.issues?.length > 0 && onIssueFound) onIssueFound(data.issues);
    } catch(e) { setError(e.message); }
    setLoading(false);
  }, []);

  React.useEffect(() => { load(); }, []);

  const issues     = brief?.issues || [];
  const totalRows  = brief?.total_rows || 0;
  const isHealthy  = issues.length === 0 && !loading && brief;
  const scannedAt  = brief?.scanned_at ? new Date(brief.scanned_at).toLocaleTimeString() : null;
  const SEV_COLOR  = { critical:T.red, high:T.orange, medium:T.yellow, low:T.cyan };
  const SEV_RANK   = { critical:0, high:1, medium:2, low:3 };
  const sorted     = [...issues].sort((a,b)=>(SEV_RANK[a.severity]||9)-(SEV_RANK[b.severity]||9));

  // Non-primary monitored tables
  const otherTables = monTables.filter(t => !t.primary);

  return (
    <div className="fade-in" style={{ padding:"28px 32px", maxWidth:1000 }}>
      {/* Header row */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:28 }}>
        <div>
          <div style={{ fontSize:22, fontWeight:700, color:T.text, letterSpacing:"-0.02em" }}>
            Morning Brief
          </div>
          <div style={{ fontSize:13, color:T.muted, marginTop:4, display:"flex", alignItems:"center", gap:10 }}>
            {loading ? "Scanning mws.report…" : scannedAt
              ? <><span>Scanned at {scannedAt}</span><span style={{color:T.dim}}>·</span><span>{ageLabel}</span></>
              : "mws.report health overview"
            }
            {avgFixMin !== null && (
              <span style={{ padding:"1px 8px", borderRadius:99, fontSize:10,
                background:`${T.green}12`, color:T.green, fontWeight:600 }}>
                avg fix: {avgFixMin}m
              </span>
            )}
          </div>
        </div>
        <Btn onClick={load} disabled={loading} variant="ghost" size="sm">
          {loading ? <Spinner size={12}/> : <RefreshCw size={12}/>}
          {loading ? "Scanning…" : "Refresh"}
        </Btn>
      </div>

      {error && (
        <Card style={{ padding:"14px 18px", marginBottom:20,
          borderColor:`${T.red}40`, background:`${T.red}06` }}>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <XCircle size={16} color={T.red}/>
            <div style={{ fontSize:12, color:T.red }}>{error}</div>
            <Btn onClick={load} size="sm" variant="ghost" style={{ marginLeft:"auto" }}>Retry</Btn>
          </div>
        </Card>
      )}

      {/* Summary banner */}
      {!loading && brief && (
        <Card style={{ padding:"18px 22px", marginBottom:20,
          background: isHealthy ? `${T.green}08` : `${T.red}06`,
          borderColor: isHealthy ? `${T.green}30` : `${T.red}30` }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            {isHealthy
              ? <CheckCircle size={26} color={T.green} strokeWidth={1.5}/>
              : <AlertTriangle size={26} color={T.red} strokeWidth={1.5}/>
            }
            <div style={{ flex:1 }}>
              <div style={{ fontSize:15, fontWeight:700,
                color: isHealthy ? T.green : T.red }}>
                {isHealthy ? "All checks passed — mws.report is healthy"
                           : `${issues.length} issue${issues.length>1?"s":""} require attention`}
              </div>
              <div style={{ fontSize:12, color:T.muted, marginTop:2 }}>
                {totalRows.toLocaleString()} rows · {scannedAt}
              </div>
            </div>
            {!isHealthy && (
              <Btn onClick={()=>onNavigate("triage")} size="sm">
                Review Issues <ArrowRight size={12}/>
              </Btn>
            )}
          </div>
        </Card>
      )}

      {/* Loading skeletons */}
      {loading && !brief && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ height:68, borderRadius:10, background:T.border,
              animation:"pulse 1.5s infinite", animationDelay:`${i*0.1}s` }}/>
          ))}
        </div>
      )}

      {/* Issue cards */}
      {!loading && sorted.length > 0 && (
        <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
          {sorted.map(issue => {
            const color = SEV_COLOR[issue.severity] || T.muted;
            return (
              <Card key={issue.id} hoverable style={{ padding:"14px 18px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                  <div style={{ width:38, height:38, borderRadius:9, flexShrink:0,
                    background:`${color}12`,
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <AlertTriangle size={17} color={color} strokeWidth={1.5}/>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                      <span style={{ fontSize:13, fontWeight:600, color:T.text }}>{issue.title}</span>
                      <Badge label={issue.severity} color={color}/>
                      <span style={{ fontSize:10, color:T.dim, fontFamily:T.monoFont }}>{issue.id}</span>
                    </div>
                    <div style={{ fontSize:12, color:T.muted }}>{issue.description}</div>
                    {issue.breakdown?.length > 0 && (
                      <div style={{ display:"flex", gap:5, marginTop:5, flexWrap:"wrap" }}>
                        {issue.breakdown.map(b => (
                          <span key={b.status} style={{ fontSize:10, padding:"1px 7px",
                            background:T.border, color:T.muted, borderRadius:4,
                            fontFamily:T.monoFont }}>{b.status}: {b.count}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontSize:22, fontWeight:700, color,
                      fontFamily:T.monoFont }}>{issue.count.toLocaleString()}</div>
                    <div style={{ fontSize:9, color:T.muted, textTransform:"uppercase",
                      letterSpacing:"0.04em" }}>rows</div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:5, marginLeft:6 }}>
                    <Btn size="sm" onClick={()=>onNavigate("triage")}>
                      Fix <ArrowRight size={11}/>
                    </Btn>
                    <Btn size="sm" variant="ghost" onClick={()=>onNavigate("chat")}>
                      Ask AI
                    </Btn>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Health score trend sparkline */}
      {!loading && brief && (
        <Card style={{ padding:"14px 20px", marginBottom:14 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
            <div style={{ fontSize:11, fontWeight:700, color:T.muted,
              textTransform:"uppercase", letterSpacing:"0.06em" }}>
              mws.report Health — Last 7 Scans
            </div>
            <span style={{ fontSize:11, color:isHealthy?T.green:T.orange, fontWeight:600 }}>
              {isHealthy?"100":"<100"} / 100
            </span>
          </div>
          <HealthSparkline brief={brief} isHealthy={isHealthy} T={T}/>
        </Card>
      )}

      {/* Bottom grid: Health checks + Multi-table summary + Slack preview */}
      {!loading && brief && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          {/* Health checks */}
          <Card style={{ padding:"16px 20px" }}>
            <div style={{ fontSize:11, fontWeight:700, color:T.muted, marginBottom:12,
              textTransform:"uppercase", letterSpacing:"0.06em" }}>
              Health Checks — mws.report
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {[
                { label:"All status = processed",        pass:!issues.find(i=>i.id==="RPT-001"), check:"status != 'processed'" },
                { label:"All copy_status = REPLICATED",  pass:!issues.find(i=>i.id==="RPT-002"), check:"copy_status != 'REPLICATED'" },
                { label:"No reports stuck in copy >2h",  pass:!issues.find(i=>i.id==="RPT-003"), check:"processed, copy pending >2h" },
              ].map(c => (
                <div key={c.label} style={{ display:"flex", alignItems:"center", gap:10,
                  padding:"8px 12px", borderRadius:7,
                  background: c.pass ? `${T.green}08` : `${T.red}06`,
                  border:`1px solid ${c.pass ? T.green : T.red}20` }}>
                  {c.pass
                    ? <CheckCircle size={13} color={T.green} strokeWidth={2}/>
                    : <XCircle size={13} color={T.red} strokeWidth={2}/>
                  }
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:11, fontWeight:600,
                      color: c.pass ? T.green : T.red }}>{c.label}</div>
                    <div style={{ fontSize:9, color:T.dim, fontFamily:T.monoFont, marginTop:1 }}>
                      {c.check}
                    </div>
                  </div>
                  <StatusDot status={c.pass?"healthy":"critical"}/>
                </div>
              ))}
            </div>
          </Card>

          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {/* Other monitored tables */}
            {otherTables.length > 0 && (
              <Card style={{ padding:"16px 20px" }}>
                <div style={{ fontSize:11, fontWeight:700, color:T.muted, marginBottom:12,
                  textTransform:"uppercase", letterSpacing:"0.06em" }}>
                  Other Monitored Tables
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {otherTables.map(t => {
                    const key    = `${t.schema}.${t.table}`;
                    const res    = tableResults[key];
                    const alerts = res?.alerts?.length || 0;
                    const status = !res ? "idle" : alerts > 0 ? "warning" : "healthy";
                    return (
                      <div key={key} style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <StatusDot status={status}/>
                        <span style={{ fontSize:12, color:T.text, fontFamily:T.monoFont, flex:1 }}>{key}</span>
                        {res && (
                          <span style={{ fontSize:11, color: alerts>0?T.orange:T.green }}>
                            {alerts > 0 ? `${alerts} issue${alerts>1?"s":""}` : "clean"}
                          </span>
                        )}
                        {!res && <span style={{ fontSize:11, color:T.dim }}>not scanned</span>}
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* Slack preview */}
            {slackPreview && (
              <Card style={{ padding:"16px 20px" }}>
                <div style={{ fontSize:11, fontWeight:700, color:T.muted, marginBottom:10,
                  textTransform:"uppercase", letterSpacing:"0.06em" }}>
                  Slack Digest Preview
                  {slackUrl
                    ? <Badge label="webhook set" color={T.green} style={{ marginLeft:8 }}/>
                    : <span style={{ marginLeft:8, fontSize:9, color:T.dim }}>(no webhook configured)</span>
                  }
                </div>
                <div style={{ padding:"10px 12px", borderRadius:7,
                  background: T.isDark ? "#0D1117" : "#F8FAFC",
                  border:`1px solid ${T.border}`,
                  fontSize:11, color:T.text2, fontFamily:T.monoFont,
                  lineHeight:1.6 }}>
                  {slackPreview}
                </div>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function TriageTab({ initialIssues }) {
  const T = useT();
  const [triageResult, setTriageResult] = useSession("wz_triage", null);
  const [loading,      setLoading]      = React.useState(false);
  const [dryRuns,      setDryRuns]      = useSession("wz_dryRuns", {});
  const [fixResults,   setFixResults]   = useSession("wz_fixResults", {});
  const [fixing,       setFixing]       = React.useState({});
  const [expanded,     setExpanded]     = useSession("wz_expanded", {});
  const [log,          setLog]          = useSession("wz_triageLog", []);
  const [agentRunning, setAgentRunning] = React.useState(false);
  const [agentResult,  setAgentResult]  = useSession("wz_agentResult", null);
  const [scanTs,       setScanTs]       = useSession("wz_triageScanTs", null);
  const [fixHistory,   setFixHistory]   = useSession("wz_history", []);

  const addLog = (msg, level="info") =>
    setLog(p => [...p.slice(-80), { ts:new Date().toLocaleTimeString(), msg, level }]);

  // ── Confidence score heuristic ──────────────────────────────────────────
  const confidence = (issue, dryRun) => {
    if (!dryRun || dryRun==="loading" || dryRun==="error") return null;
    const pct = dryRun.rows_affected / Math.max(dryRun.before, 1) * 100;
    if (issue.fix_action === "recopy")       return 98; // always safe
    if (issue.fix_action === "redrive_copy") return 95; // safe
    if (issue.fix_action === "redrive")      return pct < 10 ? 92 : pct < 30 ? 80 : 65;
    return 85;
  };

  // ── Issue age label from first-seen ts ──────────────────────────────────
  const issueAge = (issueId) => {
    if (!scanTs) return null;
    const secs = Math.floor((Date.now() - new Date(scanTs)) / 1000);
    if (secs < 60) return "just now";
    if (secs < 3600) return `${Math.floor(secs/60)}m ago`;
    return `${Math.floor(secs/3600)}h ago`;
  };

  const scan = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/report/triage`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setTriageResult(data);
      setScanTs(new Date().toISOString());
      setFixResults({}); setDryRuns({});
      addLog(`Scanned — ${data.total_rows?.toLocaleString()} rows, ${data.issues?.length||0} issue(s)`, "info");
    } catch(e) { addLog(`Scan failed: ${e.message}`, "error"); }
    setLoading(false);
  };

  const reScan = async () => {
    try {
      const res  = await fetch(`${API}/api/report/triage`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setTriageResult(data);
      setScanTs(new Date().toISOString());
      const remaining = data.issues?.length || 0;
      addLog(remaining === 0 ? "✓ Re-scan complete — all issues resolved" : `Re-scan: ${remaining} issue(s) remain`, remaining===0?"success":"warning");
    } catch(e) { addLog(`Re-scan failed: ${e.message}`, "error"); }
  };

  const dryRun = async (issue) => {
    setDryRuns(p => ({...p,[issue.id]:"loading"}));
    try {
      const res  = await fetch(`${API}/api/report/fix`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ fix_action:issue.fix_action, dry_run:true })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setDryRuns(p => ({...p,[issue.id]:data}));
      addLog(`Dry run ${issue.id}: ${data.rows_affected} rows would be affected`, "info");
    } catch(e) {
      setDryRuns(p => ({...p,[issue.id]:"error"}));
      addLog(`Dry run failed: ${e.message}`, "error");
    }
  };

  const fix = async (issue) => {
    const dr = dryRuns[issue.id];
    const conf = confidence(issue, dr);
    if (!window.confirm(
      `Fix mws.report — ${issue.fix_action}\nRows affected: ${dr?.rows_affected}\nConfidence: ${conf}%\n\nProceed?`
    )) return;
    setFixing(p => ({...p,[issue.id]:true}));
    const fixStart = Date.now();
    addLog(`Executing fix: ${issue.fix_action}…`);
    try {
      const res  = await fetch(`${API}/api/report/fix`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ fix_action:issue.fix_action, dry_run:false })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setFixResults(p => ({...p,[issue.id]:data}));
      const durationMs = Date.now() - fixStart;
      addLog(`✓ Fixed: before ${data.before} → after ${data.after}`, "success");
      setFixHistory(p => [...p, {
        action: issue.fix_action, table:"mws.report",
        rows_affected: data.rows_affected, before:data.before, after:data.after,
        success:true, ts:new Date().toLocaleTimeString(), durationMs
      }]);
      // Auto re-scan after fix
      await reScan();
    } catch(e) { addLog(`Fix failed: ${e.message}`, "error"); }
    setFixing(p => ({...p,[issue.id]:false}));
  };

  // ── Batch approve: dry-run and fix all low-risk issues ───────────────────
  const batchApprove = async () => {
    const issues = triageResult?.issues || [];
    const lowRisk = issues.filter(i =>
      i.fix_action === "recopy" || i.fix_action === "redrive_copy"
    );
    if (!lowRisk.length) return;
    if (!window.confirm(`Batch fix ${lowRisk.length} low-risk issue(s)?\n${lowRisk.map(i=>i.fix_action).join(", ")}`)) return;
    for (const issue of lowRisk) {
      await fix(issue);
    }
  };

  const runWiziAgent = async () => {
    setAgentRunning(true); setAgentResult(null);
    addLog("✨ WiziAgent starting…");
    try {
      const res  = await fetch(`${API}/api/wizi-agent/run`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ threshold:50 })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAgentResult(data);
      (data.trace||[]).forEach(t => addLog(`[${t.node}] ${t.msg}`, t.level));
      if (data.issues) setTriageResult(p => p ? {...p, issues:data.issues} : null);
      if (data.status !== "awaiting_approval") await reScan();
    } catch(e) { addLog(`WiziAgent failed: ${e.message}`, "error"); }
    setAgentRunning(false);
  };

  const approveAgent = async (decision) => {
    const token = agentResult?.approval_token;
    if (!token) return;
    await fetch(`${API}/api/wizi-agent/approve`, {
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ token, decision })
    });
    addLog(`Approval ${decision}ed`, decision==="approve"?"success":"warning");
    setAgentResult(p => ({...p, approval_status:decision==="approve"?"approved":"rejected"}));
  };

  const issues     = triageResult?.issues || [];
  const SEV_COLOR  = { critical:T.red, high:T.orange, medium:T.yellow, low:T.cyan };
  const lowRiskCount = issues.filter(i =>
    i.fix_action==="recopy" || i.fix_action==="redrive_copy"
  ).length;

  return (
    <div className="fade-in" style={{ padding:"28px 32px", maxWidth:1100 }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
        <div>
          <div style={{ fontSize:22, fontWeight:700, color:T.text, letterSpacing:"-0.02em" }}>Triage</div>
          <div style={{ fontSize:13, color:T.muted, marginTop:3 }}>
            {triageResult
              ? `${triageResult.total_rows?.toLocaleString()} rows scanned · ${issues.length} issue${issues.length!==1?"s":""}`
              : "Review issues, approve fixes, run WiziAgent"}
          </div>
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {lowRiskCount > 1 && triageResult && (
            <Btn onClick={batchApprove} variant="ghost" size="sm">
              <CheckCircle size={12}/> Batch Fix ({lowRiskCount})
            </Btn>
          )}
          <Btn onClick={scan} disabled={loading} variant="ghost" size="sm">
            {loading ? <Spinner size={12}/> : <RefreshCw size={12}/>} Scan
          </Btn>
          <Btn onClick={runWiziAgent} disabled={agentRunning} size="sm"
            style={{ background: agentRunning?T.border:`linear-gradient(135deg,${T.accent},${T.purple})`,
              color:"white", border:"none" }}>
            {agentRunning ? <Spinner size={12} color="white"/> : <Zap size={12}/>}
            {agentRunning ? "WiziAgent running…" : "✨ Run WiziAgent"}
          </Btn>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:16 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {/* Empty / clean states */}
          {!triageResult && !loading && (
            <EmptyState icon={Shield} title="No scan yet"
              desc="Click Scan or Run WiziAgent to check mws.report"
              action={<Btn onClick={scan} size="sm">Scan Now</Btn>}/>
          )}
          {triageResult?.clean && (
            <Card style={{ padding:"24px", background:`${T.green}06`,
              borderColor:`${T.green}30`, textAlign:"center" }}>
              <CheckCircle size={30} color={T.green} strokeWidth={1.5}
                style={{ margin:"0 auto 10px", display:"block" }}/>
              <div style={{ fontSize:14, fontWeight:700, color:T.green }}>mws.report is clean</div>
              <div style={{ fontSize:12, color:T.muted, marginTop:4 }}>
                All {triageResult.total_rows?.toLocaleString()} rows passed all 3 checks
              </div>
            </Card>
          )}

          {/* WiziAgent approval gate */}
          {agentResult?.status === "awaiting_approval" && agentResult.approval_status === "pending" && (
            <Card style={{ padding:"16px 20px", borderColor:`${T.yellow}50`,
              background:`${T.yellow}06` }}>
              <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                <Lock size={19} color={T.yellow} style={{ flexShrink:0, marginTop:2 }}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:T.yellow, marginBottom:4 }}>
                    WiziAgent — Approval Required
                  </div>
                  <div style={{ fontSize:12, color:T.muted, marginBottom:12 }}>
                    {agentResult.classification?.risk_reason || "High-risk fix detected"}{" "}
                    <span style={{ fontFamily:T.monoFont, color:T.cyan, fontSize:11 }}>
                      token: {agentResult.approval_token}
                    </span>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <Btn onClick={()=>approveAgent("approve")} variant="success" size="sm">
                      <Check size={12}/> Approve Fix
                    </Btn>
                    <Btn onClick={()=>approveAgent("reject")} variant="danger" size="sm">
                      <X size={12}/> Reject
                    </Btn>
                    <span style={{ fontSize:11, color:T.dim, alignSelf:"center" }}>
                      Times out in 10 min
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* WiziAgent result */}
          {agentResult && agentResult.status !== "awaiting_approval" && (
            <Card style={{ padding:"14px 18px",
              borderColor: agentResult.status==="fixed"?`${T.green}40`:`${T.yellow}40`,
              background:  agentResult.status==="fixed"?`${T.green}06`:`${T.yellow}06` }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                <Zap size={14} color={agentResult.status==="fixed"?T.green:T.yellow}/>
                <span style={{ fontSize:13, fontWeight:700,
                  color:agentResult.status==="fixed"?T.green:T.yellow }}>
                  WiziAgent — {agentResult.status?.toUpperCase()}
                </span>
                <button onClick={()=>setAgentResult(null)}
                  style={{ marginLeft:"auto", background:"none", border:"none",
                    color:T.muted, cursor:"pointer" }}><X size={13}/></button>
              </div>
              {(agentResult.fix_results||[]).map((r,i) => (
                <div key={i} style={{ fontSize:11, color:T.green, fontFamily:T.monoFont, marginBottom:2 }}>
                  ✓ {r.action}: {r.rows_affected} rows ({r.before} → {r.after})
                </div>
              ))}
              {agentResult.verify_attempts > 0 && (
                <div style={{ fontSize:11, color:T.muted, marginTop:4 }}>
                  Verified in {agentResult.verify_attempts} attempt(s)
                </div>
              )}
            </Card>
          )}

          {/* Issue cards */}
          {issues.map(issue => {
            const color  = SEV_COLOR[issue.severity] || T.muted;
            const dr     = dryRuns[issue.id];
            const fr     = fixResults[issue.id];
            const isExp  = expanded[issue.id];
            const conf   = confidence(issue, dr);
            const age    = issueAge(issue.id);
            const isFixed = !!fr;

            return (
              <Card key={issue.id} style={{ overflow:"hidden" }}>
                {/* Main row */}
                <div style={{ padding:"14px 18px", display:"flex", alignItems:"center", gap:12 }}>
                  <StatusDot status={isFixed?"healthy":issue.severity==="critical"?"critical":"warning"}/>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:2 }}>
                      <span style={{ fontSize:13, fontWeight:600,
                        color:isFixed?T.green:T.text }}>
                        {isFixed?"✓ Fixed — ":""}{issue.title}
                      </span>
                      <Badge label={issue.severity} color={color}/>
                      {age && !isFixed && (
                        <span style={{ fontSize:10, color:T.dim }}>· {age}</span>
                      )}
                    </div>
                    <div style={{ fontSize:11, color:T.muted }}>{issue.description}</div>
                  </div>
                  <div style={{ fontFamily:T.monoFont, fontSize:19, fontWeight:700,
                    color:isFixed?T.green:color, flexShrink:0 }}>
                    {isFixed ? `${fr.before}→${fr.after}` : issue.count.toLocaleString()}
                  </div>
                  <div style={{ display:"flex", gap:5, flexShrink:0 }}>
                    {issue.samples?.length > 0 && (
                      <Btn size="sm" variant="muted"
                        onClick={()=>setExpanded(p=>({...p,[issue.id]:!p[issue.id]}))}>
                        <Eye size={11}/> {isExp?"Hide":"Rows"}
                      </Btn>
                    )}
                    {!isFixed && !dr && (
                      <Btn size="sm" variant="ghost" onClick={()=>dryRun(issue)}>
                        Dry run
                      </Btn>
                    )}
                    {dr && dr!=="loading" && dr!=="error" && !isFixed && (
                      <Btn size="sm" variant="danger"
                        onClick={()=>fix(issue)} disabled={fixing[issue.id]}>
                        {fixing[issue.id]?<Spinner size={11} color="white"/>:null}
                        Fix {dr.rows_affected} rows
                      </Btn>
                    )}
                    {dr==="loading" && <Spinner size={14}/>}
                  </div>
                </div>

                {/* Dry run confidence + before/after preview */}
                {dr && dr!=="loading" && dr!=="error" && !isFixed && (
                  <div style={{ padding:"10px 18px", borderTop:`1px solid ${T.border}`,
                    background:T.isDark?`rgba(0,0,0,0.2)`:`${T.accent}04`,
                    display:"flex", alignItems:"center", gap:16 }}>
                    {/* Before / After */}
                    <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                      <div style={{ textAlign:"center" }}>
                        <div style={{ fontSize:16, fontWeight:700, color:T.text,
                          fontFamily:T.monoFont }}>{dr.before?.toLocaleString()}</div>
                        <div style={{ fontSize:9, color:T.muted, textTransform:"uppercase",
                          letterSpacing:"0.05em" }}>before</div>
                      </div>
                      <ArrowRight size={14} color={T.muted}/>
                      <div style={{ textAlign:"center" }}>
                        <div style={{ fontSize:16, fontWeight:700, color:T.green,
                          fontFamily:T.monoFont }}>
                          {(dr.before - dr.rows_affected)?.toLocaleString()}
                        </div>
                        <div style={{ fontSize:9, color:T.muted, textTransform:"uppercase",
                          letterSpacing:"0.05em" }}>after</div>
                      </div>
                      <div style={{ padding:"2px 8px", borderRadius:5,
                        background:`${color}15`, border:`1px solid ${color}30` }}>
                        <span style={{ fontSize:11, fontWeight:700, color,
                          fontFamily:T.monoFont }}>
                          -{dr.rows_affected?.toLocaleString()} rows
                        </span>
                      </div>
                    </div>
                    {/* Confidence */}
                    {conf !== null && (
                      <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:6 }}>
                        <div style={{ width:48, height:4, borderRadius:99, background:T.border,
                          overflow:"hidden" }}>
                          <div style={{ height:"100%", borderRadius:99,
                            width:`${conf}%`,
                            background: conf>=90?T.green:conf>=75?T.yellow:T.orange }}/>
                        </div>
                        <span style={{ fontSize:11, fontWeight:600,
                          color:conf>=90?T.green:conf>=75?T.yellow:T.orange }}>
                          {conf}% safe
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Sample rows */}
                {isExp && issue.samples?.length > 0 && (
                  <div style={{ borderTop:`1px solid ${T.border}`, overflowX:"auto",
                    padding:"10px 18px" }}>
                    <table style={{ borderCollapse:"collapse", fontSize:10,
                      fontFamily:T.monoFont, width:"100%" }}>
                      <thead>
                        <tr>
                          {Object.keys(issue.samples[0]).map(k => (
                            <th key={k} style={{ padding:"3px 10px", textAlign:"left",
                              color:T.muted, fontWeight:600, fontSize:9,
                              borderBottom:`1px solid ${T.border}`,
                              textTransform:"uppercase", letterSpacing:"0.04em",
                              whiteSpace:"nowrap" }}>{k}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {issue.samples.map((row,i) => (
                          <tr key={i} style={{ borderBottom:`1px solid ${T.border}40` }}>
                            {Object.values(row).map((v,j) => (
                              <td key={j} style={{ padding:"5px 10px", whiteSpace:"nowrap",
                                color: v===null?T.red:String(v).includes("fail")?T.orange:T.text2 }}>
                                {v===null?<span style={{color:T.red,fontWeight:700}}>NULL</span>:String(v)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Log panel */}
        <div>
          <Card style={{ padding:"14px 16px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
              marginBottom:10 }}>
              <div style={{ fontSize:11, fontWeight:700, color:T.muted,
                textTransform:"uppercase", letterSpacing:"0.06em" }}>Activity Log</div>
              {log.length>0 && (
                <button onClick={()=>setLog([])}
                  style={{ background:"none", border:"none", color:T.dim,
                    cursor:"pointer", fontSize:10 }}>Clear</button>
              )}
            </div>
            <div style={{ height:420, overflowY:"auto", display:"flex",
              flexDirection:"column", gap:2 }}>
              {log.length === 0
                ? <div style={{ fontSize:11, color:T.dim }}>No activity yet</div>
                : log.map((l,i) => (
                  <div key={i} style={{ fontFamily:T.monoFont, fontSize:10, lineHeight:1.6,
                    color: l.level==="success"?T.green:l.level==="error"?T.red:
                           l.level==="warning"?T.yellow:T.muted }}>
                    <span style={{ color:T.dim, marginRight:5 }}>{l.ts}</span>{l.msg}
                  </div>
                ))
              }
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── Notification Center ──────────────────────────────────────────────────────
// Persistent unified activity feed — every WiziAgent action, fix, gate, Slack msg
function NotificationCenterTab() {
  const T = useT();
  const [feed,     setFeed]     = useSession("wz_notifFeed", []);
  const [filter,   setFilter]   = React.useState("all");
  const [unread,   setUnread]   = useSession("wz_notifUnread", 0);

  // Mark all read on open
  React.useEffect(() => { setUnread(0); }, []);

  const FILTERS = ["all","fix","gate","workflow","slack","error"];
  const ICONS = {
    fix:"🔧", gate:"🔒", workflow:"⚡", slack:"💬", error:"🔴", info:"ℹ️"
  };

  // Pull from existing session states to populate feed
  React.useEffect(() => {
    const triageLog = (() => {
      try { return JSON.parse(sessionStorage.getItem("wz_triageLog")||"[]"); } catch { return []; }
    })();
    const wfHistory = (() => {
      try { return JSON.parse(sessionStorage.getItem("wz_wfHistory")||"[]"); } catch { return []; }
    })();
    const fixHistory = (() => {
      try { return JSON.parse(sessionStorage.getItem("wz_history")||"[]"); } catch { return []; }
    })();

    const events = [];

    // From fix history
    fixHistory.forEach(h => events.push({
      id:`fix-${h.ts}`, type:"fix", level:h.success?"success":"error",
      title:`Fix: ${h.action}`,
      detail:`${h.table} · ${h.rows_affected} rows (${h.before}→${h.after})`,
      ts:h.ts, ts_raw: h.ts,
    }));

    // From workflow runs
    wfHistory.forEach(r => events.push({
      id:`wf-${r.run_id}`, type:"workflow",
      level:r.status==="clean"?"success":r.status==="error"?"error":"warning",
      title:`Workflow: Daily Brief #${r.run_id}`,
      detail:`${r.status?.toUpperCase()} · ${r.issues?.length||0} issue(s) · ${r.started_at}`,
      ts:r.started_at, ts_raw: r.started_at,
    }));

    // From triage log
    triageLog.forEach(l => events.push({
      id:`triage-${l.ts}-${Math.random()}`,
      type: l.msg?.includes("Gate")?"gate": l.msg?.includes("fix")?"fix":"info",
      level: l.level,
      title: l.msg,
      detail: `Triage · ${l.ts}`,
      ts: l.ts, ts_raw: l.ts,
    }));

    if (events.length > 0) {
      setFeed(events.sort((a,b) => b.ts_raw?.localeCompare(a.ts_raw||"")));
    }
  }, []);

  const filtered = filter==="all" ? feed : feed.filter(e => e.type===filter);

  const levelColor = { success:T.green, error:T.red, warning:T.yellow, info:T.muted };

  return (
    <div className="fade-in" style={{ padding:"28px 32px", maxWidth:840 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <div style={{ fontSize:22, fontWeight:700, color:T.text, letterSpacing:"-0.02em" }}>
            Notifications
          </div>
          <div style={{ fontSize:13, color:T.muted, marginTop:3 }}>
            Unified activity feed — all WiziAgent actions, fixes, gates, and alerts
          </div>
        </div>
        <div style={{ display:"flex", gap:6 }}>
          <Btn onClick={()=>setFeed([])} variant="muted" size="sm">Clear</Btn>
        </div>
      </div>

      {/* Filter pills */}
      <div style={{ display:"flex", gap:6, marginBottom:16, flexWrap:"wrap" }}>
        {FILTERS.map(f => (
          <button key={f} onClick={()=>setFilter(f)}
            style={{ padding:"4px 12px", borderRadius:99, fontSize:11, fontWeight:600,
              cursor:"pointer", border:"none", transition:"all 0.12s",
              background: filter===f?T.accent:`${T.accent}10`,
              color: filter===f?"white":T.muted }}>
            {f.charAt(0).toUpperCase()+f.slice(1)}
            {f==="all" && feed.length>0 && (
              <span style={{ marginLeft:5, fontSize:10,
                background:"rgba(255,255,255,0.25)", padding:"0 5px",
                borderRadius:99 }}>{feed.length}</span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0
        ? <EmptyState icon={Bell} title="No notifications yet"
            desc="Activity from WiziAgent runs, fixes, gate approvals, and workflows will appear here"/>
        : (
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {filtered.map(event => (
              <Card key={event.id} style={{ padding:"12px 16px" }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
                  <div style={{ width:32, height:32, borderRadius:8, flexShrink:0,
                    background:`${levelColor[event.level]||T.muted}14`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:15 }}>
                    {ICONS[event.type]||"ℹ️"}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2 }}>
                      <span style={{ fontSize:12, fontWeight:600, color:T.text }}>
                        {event.title}
                      </span>
                      <Badge label={event.type} color={levelColor[event.level]||T.muted}/>
                    </div>
                    <div style={{ fontSize:11, color:T.muted }}>{event.detail}</div>
                  </div>
                  <span style={{ fontSize:10, color:T.dim, flexShrink:0, fontFamily:T.monoFont }}>
                    {event.ts}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )
      }
    </div>
  );
}

// ─── Approval Queue Tab ───────────────────────────────────────────────────────
// All pending approvals across all workflows in one place
function ApprovalQueueTab({ onNavigate }) {
  const T = useT();

  // Read pending approvals from all sources
  const [sopResult]    = useSession("wz_sopResult", null);
  const [agentResult]  = useSession("wz_agentResult", null);
  const [triageResult] = useSession("wz_triage", null);

  const approvals = React.useMemo(() => {
    const items = [];

    // SOP gates
    if (sopResult) {
      for (let i = 1; i <= 5; i++) {
        const token    = sopResult[`gate${i}_token`];
        const decision = sopResult[`gate${i}_decision`];
        if (token && decision === "pending") {
          items.push({
            id:`sop-gate${i}`, type:"sop_gate",
            title:`Ads SOP — Gate ${i}`,
            detail: ["Pause Mage Jobs","Data Available","Proceed with Refreshes",
                     "Run Product Summary","Resume Mage & GDS Copies"][i-1],
            token, source:"ads-sop", urgency:"high",
          });
        }
      }
    }

    // WiziAgent approval
    if (agentResult?.status === "awaiting_approval" &&
        agentResult?.approval_status === "pending") {
      items.push({
        id:"wizi-approval", type:"wizi_agent",
        title:"WiziAgent — Fix Approval",
        detail: agentResult.classification?.risk_reason || "High-risk fix awaiting approval",
        token: agentResult.approval_token, source:"triage", urgency:"critical",
      });
    }

    // Triage manual fixes (dry run done, not yet fixed)
    if (triageResult?.issues?.length > 0) {
      const dryRuns = (() => {
        try { return JSON.parse(sessionStorage.getItem("wz_dryRuns")||"{}"); } catch { return {}; }
      })();
      const fixResults = (() => {
        try { return JSON.parse(sessionStorage.getItem("wz_fixResults")||"{}"); } catch { return {}; }
      })();
      triageResult.issues.forEach(issue => {
        const dr = dryRuns[issue.id];
        if (dr && dr !== "loading" && dr !== "error" && !fixResults[issue.id]) {
          items.push({
            id:`triage-${issue.id}`, type:"triage_fix",
            title:`Triage Fix Ready — ${issue.title}`,
            detail:`${dr.rows_affected} rows · ${issue.fix_action} · confidence pending`,
            token:null, source:"triage", urgency:issue.severity,
          });
        }
      });
    }

    return items;
  }, [sopResult, agentResult, triageResult]);

  const urgencyColor = { critical:T.red, high:T.orange, medium:T.yellow, low:T.cyan };

  return (
    <div className="fade-in" style={{ padding:"28px 32px", maxWidth:800 }}>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:22, fontWeight:700, color:T.text, letterSpacing:"-0.02em" }}>
          Approval Queue
        </div>
        <div style={{ fontSize:13, color:T.muted, marginTop:3 }}>
          All pending approvals across workflows, triage fixes, and WiziAgent runs
        </div>
      </div>

      {approvals.length === 0
        ? <EmptyState icon={CheckCircle} title="Queue is clear"
            desc="No approvals pending — all gates resolved, no dry runs waiting"/>
        : (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {approvals.map(item => (
              <Card key={item.id} style={{ padding:"16px 20px",
                borderColor:`${urgencyColor[item.urgency]||T.muted}40`,
                background:`${urgencyColor[item.urgency]||T.muted}06` }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:36, height:36, borderRadius:9, flexShrink:0,
                    background:`${urgencyColor[item.urgency]||T.muted}15`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:16 }}>
                    {item.type==="sop_gate"?"🔒":item.type==="wizi_agent"?"⚡":"🔧"}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                      <span style={{ fontSize:13, fontWeight:700, color:T.text }}>
                        {item.title}
                      </span>
                      <Badge label={item.urgency} color={urgencyColor[item.urgency]||T.muted}/>
                      <Badge label={item.type.replace("_"," ")} color={T.muted}/>
                    </div>
                    <div style={{ fontSize:11, color:T.muted }}>{item.detail}</div>
                    {item.token && (
                      <div style={{ fontSize:10, color:T.dim, fontFamily:T.monoFont, marginTop:3 }}>
                        token: {item.token}
                      </div>
                    )}
                  </div>
                  <Btn onClick={()=>onNavigate(item.source)} size="sm">
                    Go to {item.source} <ArrowRight size={11}/>
                  </Btn>
                </div>
              </Card>
            ))}
          </div>
        )
      }
    </div>
  );
}


function FixHistoryTab() {
  const T = useT();
  const [history, setHistory] = useSession("wz_history", []);

  return (
    <div className="fade-in" style={{ padding:"28px 32px", maxWidth:900 }}>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:22, fontWeight:700, color:T.text, letterSpacing:"-0.02em" }}>
          Fix History
        </div>
        <div style={{ fontSize:13, color:T.muted, marginTop:3 }}>
          Audit log of all fixes executed by WiziAgent and manually
        </div>
      </div>
      {history.length === 0 ? (
        <EmptyState icon={Shield} title="No fixes yet"
          desc="Fix history will appear here after you run Triage or WiziAgent"/>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {[...history].reverse().map((h,i) => (
            <Card key={i} style={{ padding:"12px 18px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <StatusDot status={h.success?"healthy":"error"}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:T.text }}>{h.action}</div>
                  <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>
                    {h.table} · {h.rows_affected} rows · {h.ts}
                  </div>
                </div>
                <div className="mono" style={{ fontSize:11, color:T.muted }}>
                  {h.before} → {h.after}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Ask WiziAgent Tab ────────────────────────────────────────────────────────
// WiziAgent can DO things from chat — not just answer.
// Supported actions embedded in AI response:
//   ACTION:RUN_FIX:{fix_action}          → calls /api/report/fix
//   ACTION:SHOW_ROWS:{schema}.{table}    → calls /api/preview
//   ACTION:ADD_MONITOR:{schema}.{table}  → adds to Monitor tab
//   ACTION:SAVE_RULE:{json_rule}         → saves to custom rules
function AskWiziTab({ onAddMonitor, onSaveRule }) {
  const T = useT();
  const [messages,  setMessages]  = useSession("wz_chat", []);
  const [input,     setInput]     = React.useState("");
  const [loading,   setLoading]   = React.useState(false);
  const [actions,   setActions]   = React.useState([]);  // pending action confirmations
  const [monTables, setMonTables] = useSession("wz_monTables",
    [{ schema:"mws", table:"report", label:"mws.report", primary:true, checks:[] }]
  );
  const [customRules, setCustomRules] = useSession("wz_customRules", []);
  const bottomRef = React.useRef(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [messages, actions]);

  // ── Parse action tags from AI response ────────────────────────────────────
  const parseActions = (text) => {
    const found = [];
    const patterns = [
      { re:/ACTION:RUN_FIX:(\w+)/g,             type:"fix" },
      { re:/ACTION:SHOW_ROWS:([\w.]+)/g,         type:"rows" },
      { re:/ACTION:ADD_MONITOR:([\w.]+)/g,        type:"monitor" },
      { re:/ACTION:SAVE_RULE:(\{[^}]+\})/g,      type:"rule" },
    ];
    for (const { re, type } of patterns) {
      let m;
      while ((m = re.exec(text)) !== null) {
        found.push({ type, value: m[1], id: Math.random().toString(36).slice(2) });
      }
    }
    return found;
  };

  // Strip action tags from display text
  const cleanText = (text) =>
    text.replace(/ACTION:[A-Z_]+:[^\s]+/g, "").trim();

  // ── Execute an action ──────────────────────────────────────────────────────
  const executeAction = async (action) => {
    setActions(p => p.filter(a => a.id !== action.id));
    let resultMsg = "";

    if (action.type === "fix") {
      try {
        const res  = await fetch(`${API}/api/report/fix`, {
          method:"POST", headers:{"Content-Type":"application/json"},
          body:JSON.stringify({ fix_action:action.value, dry_run:false })
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        resultMsg = `✓ Fix executed: \`${action.value}\` — ${data.rows_affected} rows affected (${data.before} → ${data.after})`;
      } catch(e) { resultMsg = `✗ Fix failed: ${e.message}`; }
    }

    else if (action.type === "rows") {
      try {
        const [schema, table] = action.value.includes(".")
          ? action.value.split(".") : ["mws", action.value];
        const res  = await fetch(
          `${API}/api/preview?schema=${schema}&table=${table}&limit=5`
        );
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        const cols = data.columns || (data.rows?.[0] ? Object.keys(data.rows[0]) : []);
        const rows = data.rows || [];
        resultMsg = `Showing ${rows.length} row(s) from \`${action.value}\`:\n` + cols.join(" | ") + "\n" + rows.map(r=>cols.map(c=>String(r[c]??'NULL')).join(" | ")).join("\n");
      } catch(e) { resultMsg = `✗ Could not fetch rows: ${e.message}`; }
    }

    else if (action.type === "monitor") {
      const [schema, table] = action.value.includes(".")
        ? action.value.split(".") : ["mws", action.value];
      const key = `${schema}.${table}`;
      setMonTables(p => {
        if (p.find(t => `${t.schema}.${t.table}` === key)) return p;
        return [...p, { schema, table, label:key, primary:false, checks:[] }];
      });
      resultMsg = `✓ Added \`${key}\` to Monitor tab`;
    }

    else if (action.type === "rule") {
      try {
        const rule = JSON.parse(action.value);
        const newRule = { ...rule, id:`RULE-${Date.now()}`, created:new Date().toISOString() };
        setCustomRules(p => [...p, newRule]);
        resultMsg = `✓ Rule saved: "${rule.name || rule.check}"`;
      } catch(e) { resultMsg = `✗ Could not parse rule: ${e.message}`; }
    }

    if (resultMsg) {
      setMessages(p => [...p, {
        role:"system", content:resultMsg,
        ts:new Date().toLocaleTimeString()
      }]);
    }
  };

  // ── Send message ───────────────────────────────────────────────────────────
  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const userMsg = { role:"user", content:text, ts:new Date().toLocaleTimeString() };
    setMessages(p => [...p, userMsg]);
    setLoading(true);

    const system = `You are WiziAgent, an autonomous data quality and pipeline operations agent for Intentwise.

SCHEMA — mws.report columns:
request_id, report_id, report_type, period_start_date, period_end_date,
requested_date, download_date, report_processing_time, tries, status,
account, period_start_time, period_end_time, precheck_status, copy_status

STATUS values: pending | processed | failed
COPY_STATUS values: REPLICATED | NOT_REPLICATED | null
HEALTHY = status='processed' AND copy_status='REPLICATED' AND not stuck >2h

OTHER mws TABLES: orders, inventory, sales_and_traffic_by_date, sales_and_traffic_by_asin

FIX ACTIONS available:
- redrive: reset failed downloads (status=failed → pending, tries=0)
- recopy: re-trigger replication (copy_status=null → NOT_REPLICATED)
- redrive_copy: fix stuck copies (processed, copy_status=null, download_date >2h ago)

IMPORTANT — when you decide to DO something, embed action tags IN your response:
- To run a fix:              ACTION:RUN_FIX:redrive (or recopy or redrive_copy)
- To show sample rows:       ACTION:SHOW_ROWS:mws.report (or any schema.table)
- To add a table to monitor: ACTION:ADD_MONITOR:mws.orders
- To save a custom rule:     ACTION:SAVE_RULE:{"name":"rule name","table":"mws.report","check":"SQL check","severity":"high"}

The user will see action buttons to confirm before anything executes.
Always explain what you're doing and why before embedding an action tag.
Keep responses concise. Use markdown. Be direct and practical.`;

    try {
      const history = messages.slice(-8).map(m => ({
        role: m.role === "system" ? "assistant" : m.role,
        content: m.content
      }));
      const res  = await fetch(`${API}/api/ai/chat`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          system,
          messages:[...history, { role:"user", content:text }],
          max_tokens:800
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || data.error || "No response";
      const found = parseActions(reply);
      const clean = cleanText(reply);
      setMessages(p => [...p, {
        role:"assistant", content:clean,
        ts:new Date().toLocaleTimeString()
      }]);
      if (found.length > 0) setActions(found);
    } catch(e) {
      setMessages(p => [...p, {
        role:"assistant",
        content:`Error: ${e.message}`,
        ts:new Date().toLocaleTimeString()
      }]);
    }
    setLoading(false);
  };

  const suggestions = [
    "What's wrong with mws.report right now?",
    "Show me sample rows from mws.report",
    "Fix the failed downloads",
    "Add mws.orders to monitoring",
    "Suggest a rule for detecting stale data",
  ];

  const actionLabels = {
    fix:     (v) => `Run fix: ${v} on mws.report`,
    rows:    (v) => `Show sample rows from ${v}`,
    monitor: (v) => `Add ${v} to Monitor tab`,
    rule:    (v) => `Save custom rule`,
  };

  return (
    <div className="fade-in" style={{
      display:"flex", flexDirection:"column",
      height:"calc(100vh - 1px)", overflow:"hidden",
    }}>
      {/* Header */}
      <div style={{ padding:"20px 32px 16px", borderBottom:`1px solid ${T.border}`,
        flexShrink:0 }}>
        <div style={{ fontSize:18, fontWeight:700, color:T.text, letterSpacing:"-0.02em" }}>
          Ask WiziAgent
        </div>
        <div style={{ fontSize:12, color:T.muted, marginTop:2 }}>
          Ask questions · request fixes · add monitoring · save rules
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:"auto", padding:"16px 32px" }}>
        {messages.length === 0 && (
          <div>
            <div style={{ textAlign:"center", padding:"28px 0 20px" }}>
              <div style={{
                width:48, height:48, borderRadius:13, margin:"0 auto 12px",
                background:`linear-gradient(135deg,${T.accent},${T.purple})`,
                display:"flex", alignItems:"center", justifyContent:"center"
              }}>
                <Zap size={22} color="white"/>
              </div>
              <div style={{ fontSize:15, fontWeight:700, color:T.text }}>
                What do you need?
              </div>
              <div style={{ fontSize:12, color:T.muted, marginTop:4, maxWidth:400, margin:"6px auto 0" }}>
                I can scan your data, explain issues, run fixes, add tables to monitoring, and save custom rules
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:7,
              maxWidth:520, margin:"0 auto" }}>
              {suggestions.map(s => (
                <button key={s} onClick={()=>setInput(s)}
                  style={{
                    padding:"9px 13px", background:T.surface,
                    border:`1px solid ${T.border}`, borderRadius:8,
                    cursor:"pointer", fontSize:12, color:T.text2,
                    textAlign:"left", fontFamily:"inherit", lineHeight:1.4,
                  }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=T.accent; e.currentTarget.style.color=T.accent;}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border; e.currentTarget.style.color=T.text2;}}
                >{s}</button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m,i) => (
          <div key={i} style={{
            display:"flex", gap:10, marginBottom:14,
            justifyContent: m.role==="user" ? "flex-end" : "flex-start",
          }}>
            {m.role !== "user" && (
              <div style={{
                width:26, height:26, borderRadius:7, flexShrink:0,
                background: m.role==="system"
                  ? `${T.green}20`
                  : `linear-gradient(135deg,${T.accent},${T.purple})`,
                display:"flex", alignItems:"center", justifyContent:"center",
                marginTop:1
              }}>
                {m.role==="system"
                  ? <Check size={12} color={T.green}/>
                  : <Zap size={12} color="white"/>
                }
              </div>
            )}
            <div style={{
              maxWidth:"76%", padding:"9px 13px", borderRadius:10,
              background: m.role==="user" ? T.accent
                        : m.role==="system" ? `${T.green}10`
                        : T.card,
              color: m.role==="user" ? "white" : T.text,
              border: m.role==="user" ? "none"
                    : m.role==="system" ? `1px solid ${T.green}30`
                    : `1px solid ${T.border}`,
              fontSize:13, lineHeight:1.65, whiteSpace:"pre-wrap",
              fontFamily: m.content.includes("```") ? T.monoFont : "inherit",
            }}>
              {m.content}
              <div style={{ fontSize:10, marginTop:3,
                color: m.role==="user" ? "rgba(255,255,255,0.5)" : T.dim }}>
                {m.ts}
              </div>
            </div>
          </div>
        ))}

        {/* Pending action confirmations */}
        {actions.length > 0 && (
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:11, fontWeight:700, color:T.muted,
              marginBottom:8, textTransform:"uppercase", letterSpacing:"0.05em" }}>
              WiziAgent wants to:
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
              {actions.map(a => (
                <div key={a.id} style={{
                  display:"flex", alignItems:"center", gap:10,
                  padding:"10px 14px", borderRadius:9,
                  background:`${T.yellow}08`, border:`1px solid ${T.yellow}30`
                }}>
                  <Zap size={13} color={T.yellow}/>
                  <span style={{ flex:1, fontSize:12, color:T.text2 }}>
                    {actionLabels[a.type]?.(a.value)}
                  </span>
                  <Btn onClick={()=>executeAction(a)} size="sm" variant="success">
                    <Check size={11}/> Confirm
                  </Btn>
                  <Btn onClick={()=>setActions(p=>p.filter(x=>x.id!==a.id))}
                    size="sm" variant="muted">
                    <X size={11}/>
                  </Btn>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div style={{ display:"flex", gap:10, marginBottom:14 }}>
            <div style={{
              width:26, height:26, borderRadius:7, flexShrink:0,
              background:`linear-gradient(135deg,${T.accent},${T.purple})`,
              display:"flex", alignItems:"center", justifyContent:"center"
            }}>
              <Zap size={12} color="white"/>
            </div>
            <div style={{ padding:"10px 14px", background:T.card,
              border:`1px solid ${T.border}`, borderRadius:10,
              display:"flex", gap:5, alignItems:"center" }}>
              {[0,1,2].map(d => (
                <div key={d} style={{
                  width:5, height:5, borderRadius:"50%", background:T.muted,
                  animation:"pulse 1.2s infinite",
                  animationDelay:`${d*0.2}s`
                }}/>
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Input bar */}
      <div style={{
        padding:"12px 32px 20px", borderTop:`1px solid ${T.border}`,
        background:T.bg, flexShrink:0,
        display:"flex", gap:8, alignItems:"flex-end",
      }}>
        <textarea
          value={input}
          onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); send(); } }}
          placeholder="Ask WiziAgent… (Enter to send)"
          rows={2}
          style={{
            flex:1, padding:"9px 13px", borderRadius:8, resize:"none",
            border:`1px solid ${T.border}`, background:T.surface,
            color:T.text, fontSize:13, fontFamily:"'IBM Plex Sans',sans-serif",
            outline:"none", lineHeight:1.5,
          }}
          onFocus={e=>e.target.style.borderColor=T.accent}
          onBlur={e=>e.target.style.borderColor=T.border}
        />
        <Btn onClick={send} disabled={loading||!input.trim()} size="md"
          style={{ alignSelf:"stretch", paddingLeft:16, paddingRight:16 }}>
          {loading ? <Spinner size={13} color="white"/> : <ArrowRight size={14}/>}
        </Btn>
        {messages.length>0 && (
          <Btn onClick={()=>{setMessages([]); setActions([]);}}
            variant="muted" size="md" style={{ alignSelf:"stretch" }}>
            <Trash2 size={13}/>
          </Btn>
        )}
      </div>
    </div>
  );
}

// ─── Monitor Tab ──────────────────────────────────────────────────────────────
function MonitorTab() {
  const T = useT();
  const [tables,   setTables]   = useSession("wz_monTables",
    [{ schema:"mws", table:"report", label:"mws.report", primary:true,
       checks:["status='processed'","copy_status='REPLICATED'","no stuck >2h"] }]
  );
  const [results,  setResults]  = useSession("wz_monResults", {});
  const [scanning, setScanning] = React.useState({});
  const [addOpen,  setAddOpen]  = React.useState(false);
  const [newTable, setNewTable] = React.useState({ schema:"mws", table:"" });

  const scan = async (t) => {
    const key = `${t.schema}.${t.table}`;
    setScanning(p => ({...p,[key]:true}));
    try {
      const res  = await fetch(`${API}/api/wizi-agent/run-table`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ schema:t.schema, table:t.table, dry_run:true })
      });
      const data = await res.json();
      setResults(p => ({...p,[key]:data}));
    } catch(e) {
      setResults(p => ({...p,[key]:{error:e.message}}));
    }
    setScanning(p => ({...p,[key]:false}));
  };

  const addTable = () => {
    if (!newTable.table.trim()) return;
    setTables(p => [...p, {
      schema:newTable.schema, table:newTable.table,
      label:`${newTable.schema}.${newTable.table}`, primary:false, checks:[]
    }]);
    setNewTable({ schema:"mws", table:"" });
    setAddOpen(false);
  };

  const removeTable = (key) => {
    setTables(p => p.filter(t => `${t.schema}.${t.table}` !== key));
    setResults(p => { const n={...p}; delete n[key]; return n; });
  };

  return (
    <div className="fade-in" style={{ padding:"28px 32px", maxWidth:900 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
        <div>
          <div style={{ fontSize:22, fontWeight:700, color:T.text, letterSpacing:"-0.02em" }}>Monitor</div>
          <div style={{ fontSize:13, color:T.muted, marginTop:3 }}>
            Tables under active monitoring — add any schema.table
          </div>
        </div>
        <Btn onClick={()=>setAddOpen(true)} size="sm"><Plus size={12}/> Add Table</Btn>
      </div>

      {addOpen && (
        <Card style={{ padding:"16px 20px", marginBottom:16,
          borderColor:T.accent, background:`${T.accent}06` }}>
          <div style={{ fontSize:12, fontWeight:700, color:T.text, marginBottom:12 }}>
            Add table to monitoring
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <input value={newTable.schema}
              onChange={e=>setNewTable(p=>({...p,schema:e.target.value}))}
              placeholder="schema"
              style={{ width:90, padding:"6px 10px", borderRadius:6,
                border:`1px solid ${T.border}`, background:T.surface, color:T.text,
                fontSize:12, fontFamily:T.monoFont }}/>
            <span style={{ color:T.muted }}>.</span>
            <input value={newTable.table}
              onChange={e=>setNewTable(p=>({...p,table:e.target.value}))}
              placeholder="table_name"
              style={{ flex:1, padding:"6px 10px", borderRadius:6,
                border:`1px solid ${T.border}`, background:T.surface, color:T.text,
                fontSize:12, fontFamily:T.monoFont }}/>
            <Btn onClick={addTable} size="sm"><Check size={12}/> Add</Btn>
            <Btn onClick={()=>setAddOpen(false)} size="sm" variant="muted"><X size={12}/></Btn>
          </div>
        </Card>
      )}

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {tables.map(t => {
          const key    = `${t.schema}.${t.table}`;
          const res    = results[key];
          const busy   = scanning[key];
          const alerts = res?.alerts || [];
          const score  = res?.quality_score;
          const status = !res ? "idle" : res.error ? "error" :
                         alerts.length > 0 ? "warning" : "healthy";

          return (
            <Card key={key} style={{ padding:"16px 20px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <StatusDot status={status}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                    <span style={{ fontSize:13, fontWeight:600, color:T.text,
                      fontFamily:T.monoFont }}>{key}</span>
                    {t.primary && <Badge label="primary" color={T.accent}/>}
                    {score !== undefined && (
                      <span style={{ fontSize:11, color:score>=80?T.green:T.yellow }}>
                        quality: {score}/100
                      </span>
                    )}
                  </div>
                  {t.checks.length > 0 && (
                    <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                      {t.checks.map(c => (
                        <span key={c} style={{ fontSize:9, padding:"1px 6px",
                          background:T.border, color:T.muted, borderRadius:3,
                          fontFamily:T.monoFont }}>{c}</span>
                      ))}
                    </div>
                  )}
                  {alerts.length > 0 && (
                    <div style={{ marginTop:5, display:"flex", gap:5, flexWrap:"wrap" }}>
                      {alerts.slice(0,3).map(a => (
                        <Badge key={a.id} label={a.title} color={T.orange}/>
                      ))}
                      {alerts.length>3 && <span style={{fontSize:10,color:T.muted}}>+{alerts.length-3} more</span>}
                    </div>
                  )}
                  {res?.error && <div style={{ fontSize:11, color:T.red, marginTop:3 }}>{res.error}</div>}
                  {res?.total_rows !== undefined && (
                    <div style={{ fontSize:11, color:T.dim, marginTop:3 }}>
                      {res.total_rows.toLocaleString()} rows scanned
                    </div>
                  )}
                </div>
                <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                  <Btn onClick={()=>scan(t)} disabled={busy} size="sm" variant="ghost">
                    {busy ? <Spinner size={11}/> : <RefreshCw size={11}/>}
                    {busy ? "Scanning…" : "Scan"}
                  </Btn>
                  {!t.primary && (
                    <Btn onClick={()=>removeTable(key)} size="sm" variant="muted">
                      <Trash2 size={11}/>
                    </Btn>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── Configure Tab ────────────────────────────────────────────────────────────
function ConfigureTab() {
  const T = useT();
  const [slackUrl, setSlackUrl] = useLocal("wz_slack", "");
  const [saved,    setSaved]    = React.useState(false);
  const [threshold,setThreshold]= useLocal("wz_threshold", "50");

  const save = () => { setSaved(true); setTimeout(()=>setSaved(false), 2000); };

  return (
    <div className="fade-in" style={{ padding:"28px 32px", maxWidth:680 }}>
      <div style={{ marginBottom:28 }}>
        <div style={{ fontSize:22, fontWeight:700, color:T.text, letterSpacing:"-0.02em" }}>Configure</div>
        <div style={{ fontSize:13, color:T.muted, marginTop:3 }}>Data sources, notifications and WiziAgent settings</div>
      </div>

      <Card style={{ padding:"20px 24px", marginBottom:14 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
          <Database size={15} color={T.cyan}/>
          <span style={{ fontSize:13, fontWeight:700, color:T.text }}>Redshift Staging</span>
          <Badge label="connected" color={T.green}/>
        </div>
        <div style={{ fontSize:11, color:T.muted, fontFamily:T.monoFont }}>
          host: Railway env · schema: mws · ssl: required
        </div>
        <div style={{ fontSize:11, color:T.dim, marginTop:5 }}>
          Managed via Railway environment variables (REDSHIFT_HOST, REDSHIFT_USER, REDSHIFT_PASSWORD, etc.)
        </div>
      </Card>

      <Card style={{ padding:"20px 24px", marginBottom:14 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
          <MessageSquare size={15} color={T.purple}/>
          <span style={{ fontSize:13, fontWeight:700, color:T.text }}>Slack Notifications</span>
          <Badge label={slackUrl ? "configured" : "not set"} color={slackUrl?T.green:T.muted}/>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <input value={slackUrl} onChange={e=>setSlackUrl(e.target.value)}
            placeholder="https://hooks.slack.com/services/…"
            style={{ flex:1, padding:"8px 12px", borderRadius:7,
              border:`1px solid ${T.border}`, background:T.surface,
              color:T.text, fontSize:12, fontFamily:"inherit", outline:"none" }}
            onFocus={e=>e.target.style.borderColor=T.accent}
            onBlur={e=>e.target.style.borderColor=T.border}
          />
          <Btn onClick={save} size="sm" variant={saved?"success":"primary"}>
            {saved ? <Check size={12}/> : null}{saved ? "Saved" : "Save"}
          </Btn>
        </div>
        <div style={{ fontSize:11, color:T.dim, marginTop:8 }}>
          Also add SLACK_WEBHOOK_URL to Railway env vars for the backend agent.
        </div>
      </Card>

      <Card style={{ padding:"20px 24px", marginBottom:14 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
          <Zap size={15} color={T.accent}/>
          <span style={{ fontSize:13, fontWeight:700, color:T.text }}>WiziAgent Settings</span>
        </div>
        <div>
          <label style={{ fontSize:11, fontWeight:600, color:T.text2, display:"block", marginBottom:4 }}>
            Approval threshold (rows)
          </label>
          <input value={threshold} onChange={e=>setThreshold(e.target.value)}
            style={{ width:100, padding:"6px 10px", borderRadius:6,
              border:`1px solid ${T.border}`, background:T.surface,
              color:T.text, fontSize:12, fontFamily:T.monoFont }}/>
          <div style={{ fontSize:10, color:T.dim, marginTop:4 }}>
            Fixes affecting more than this many rows require human approval before executing.
          </div>
        </div>
      </Card>

      <Card style={{ padding:"20px 24px" }}>
        <div style={{ fontSize:13, fontWeight:700, color:T.text, marginBottom:12 }}>
          Additional Data Sources
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          {[
            { label:"Excel / CSV Upload",  icon:"📊" },
            { label:"Google Sheets",       icon:"📋" },
            { label:"BigQuery",            icon:"🔵" },
            { label:"Snowflake",           icon:"❄️"  },
          ].map(s => (
            <div key={s.label} style={{ padding:"10px 12px", borderRadius:8,
              border:`1px dashed ${T.border}`, display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:16 }}>{s.icon}</span>
              <span style={{ fontSize:11, fontWeight:600, color:T.text2, flex:1 }}>{s.label}</span>
              <Badge label="soon" color={T.muted}/>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── Query Tab ────────────────────────────────────────────────────────────────
function QueryTab() {
  const T = useT();
  const [sql,          setSql]          = useSession("wz_sql", "SELECT * FROM mws.report LIMIT 20");
  const [results,      setResults]      = useSession("wz_sqlResults", null);
  const [running,      setRunning]      = React.useState(false);
  const [error,        setError]        = React.useState(null);
  const [schema,       setSchema]       = useSession("wz_schema", []);
  const [savedQueries, setSavedQueries] = useLocal("wz_savedQueries", [
    { id:1, name:"Failed downloads",     sql:"SELECT status, COUNT(*) cnt FROM mws.report WHERE status != 'processed' GROUP BY status ORDER BY cnt DESC" },
    { id:2, name:"Not replicated",       sql:"SELECT copy_status, COUNT(*) cnt FROM mws.report WHERE copy_status != 'REPLICATED' OR copy_status IS NULL GROUP BY copy_status" },
    { id:3, name:"Stuck copies >2h",     sql:"SELECT request_id, report_type, status, copy_status, download_date FROM mws.report WHERE status='processed' AND (copy_status IS NULL OR copy_status='NOT_REPLICATED') AND download_date < CURRENT_TIMESTAMP - INTERVAL '2 hours' LIMIT 20" },
    { id:4, name:"Recent report activity", sql:"SELECT report_type, status, copy_status, COUNT(*) cnt FROM mws.report WHERE requested_date >= CURRENT_DATE - 3 GROUP BY 1,2,3 ORDER BY cnt DESC" },
  ]);
  const [history,      setHistory]      = useSession("wz_queryHistory", []);
  const [saveModalOpen,setSaveModal]    = React.useState(false);
  const [saveName,     setSaveName]     = React.useState("");
  const [aiLoading,    setAiLoading]    = React.useState(false);
  const [aiInput,      setAiInput]      = React.useState("");
  const [expandedSchema, setExpandedSchema] = useSession("wz_queryExpandedSchema", {});

  // Load schema on first visit
  React.useEffect(() => {
    if (schema.length > 0) return;
    fetch(`${API}/api/tables`).then(r=>r.json()).then(data => {
      if (Array.isArray(data)) setSchema(data);
    }).catch(()=>{});
  }, []);

  const run = async (sqlToRun) => {
    const q = sqlToRun || sql;
    setRunning(true); setError(null); setResults(null);
    try {
      const res  = await fetch(`${API}/api/query?sql=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResults(data);
      // Add to history (dedupe)
      setHistory(p => {
        const filtered = p.filter(h => h.sql !== q);
        return [{ sql:q, ts:new Date().toLocaleTimeString(), rows:data.rows?.length||0 },
                ...filtered].slice(0, 20);
      });
    } catch(e) { setError(e.message); }
    setRunning(false);
  };

  const exportCsv = () => {
    if (!results?.rows?.length) return;
    const cols = results.columns || [];
    const rows = results.rows;
    const csv  = [
      cols.join(","),
      ...rows.map(r => cols.map(c => {
        const v = r[c] == null ? "" : String(r[c]);
        return v.includes(",") || v.includes('"') ? `"${v.replace(/"/g,'""')}"` : v;
      }).join(","))
    ].join("\n");
    const blob = new Blob([csv], { type:"text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "wizi-query.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const aiGenerateSql = async () => {
    if (!aiInput.trim() || aiLoading) return;
    setAiLoading(true);
    try {
      const res  = await fetch(`${API}/api/ai/chat`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          system:`You are a Redshift SQL expert for Intentwise. 
Schema: mws.report (request_id, report_id, report_type, period_start_date, period_end_date, requested_date, download_date, report_processing_time, tries, status, account, period_start_time, period_end_time, precheck_status, copy_status).
Status values: pending | processed | failed. Copy_status: REPLICATED | NOT_REPLICATED | NULL.
Other tables: mws.orders, mws.inventory, mws.sales_and_traffic_by_date, mws.sales_and_traffic_by_asin.
Return ONLY valid Redshift SQL, no explanation, no markdown, no backticks.`,
          messages:[{ role:"user", content:aiInput }],
          max_tokens:400
        })
      });
      const data = await res.json();
      const generatedSql = data.content?.[0]?.text?.trim() || "";
      if (generatedSql) {
        setSql(generatedSql);
        setAiInput("");
      }
    } catch(e) { console.error(e); }
    setAiLoading(false);
  };

  const saveQuery = () => {
    if (!saveName.trim()) return;
    setSavedQueries(p => [...p, { id:Date.now(), name:saveName.trim(), sql }]);
    setSaveName(""); setSaveModal(false);
  };

  const deleteQuery = (id) => setSavedQueries(p => p.filter(q => q.id !== id));

  // Group schema by schema name with column info
  const grouped = React.useMemo(() => schema.reduce((acc, t) => {
    const s = t.table_schema || t.schema || "?";
    const n = t.table_name   || t.name   || "";
    const c = t.column_count || 0;
    if (!acc[s]) acc[s] = [];
    acc[s].push({ name:n, cols:c });
    return acc;
  }, {}), [schema]);

  return (
    <div className="fade-in" style={{ display:"flex", height:"calc(100vh - 1px)", overflow:"hidden" }}>
      {/* Left panel: schema tree + saved queries */}
      <div style={{ width:220, flexShrink:0, borderRight:`1px solid ${T.border}`,
        overflowY:"auto", display:"flex", flexDirection:"column" }}>
        {/* Schema tree */}
        <div style={{ padding:"14px 8px 8px" }}>
          <div style={{ fontSize:9, fontWeight:700, color:T.dim, marginBottom:8,
            paddingLeft:8, textTransform:"uppercase", letterSpacing:"0.08em" }}>Schema</div>
          {Object.entries(grouped).map(([sc, tables]) => {
            const isExp = expandedSchema[sc] !== false; // expanded by default
            return (
              <div key={sc} style={{ marginBottom:4 }}>
                <button onClick={()=>setExpandedSchema(p=>({...p,[sc]:!isExp}))}
                  style={{ width:"100%", display:"flex", alignItems:"center", gap:6,
                    padding:"3px 8px", background:"none", border:"none", cursor:"pointer",
                    borderRadius:5, textAlign:"left" }}>
                  <span style={{ fontSize:9, color:T.dim }}>{isExp?"▾":"▸"}</span>
                  <span style={{ fontSize:10, fontWeight:700, color:T.accent,
                    fontFamily:T.monoFont }}>{sc}</span>
                  <span style={{ fontSize:9, color:T.dim, marginLeft:"auto" }}>
                    {tables.length}
                  </span>
                </button>
                {isExp && tables.map(t => (
                  <button key={t.name}
                    onClick={()=>setSql(`SELECT * FROM ${sc}.${t.name} LIMIT 20`)}
                    style={{ width:"100%", display:"flex", alignItems:"center", gap:0,
                      padding:"2px 8px 2px 20px", background:"none", border:"none",
                      cursor:"pointer", borderRadius:4, textAlign:"left",
                      transition:"background 0.1s" }}
                    onMouseEnter={e=>e.currentTarget.style.background=`${T.accent}10`}
                    onMouseLeave={e=>e.currentTarget.style.background="none"}>
                    <span style={{ fontSize:11, color:T.muted, fontFamily:T.monoFont,
                      flex:1 }}>{t.name}</span>
                    {t.cols > 0 && (
                      <span style={{ fontSize:9, color:T.dim }}>{t.cols}c</span>
                    )}
                  </button>
                ))}
              </div>
            );
          })}
          {Object.keys(grouped).length === 0 && (
            <div style={{ fontSize:11, color:T.dim, padding:"4px 8px" }}>Loading…</div>
          )}
        </div>

        {/* Divider */}
        <div style={{ height:1, background:T.border, margin:"4px 0" }}/>

        {/* Saved queries */}
        <div style={{ padding:"8px 8px 12px", flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
            paddingLeft:8, marginBottom:6 }}>
            <span style={{ fontSize:9, fontWeight:700, color:T.dim,
              textTransform:"uppercase", letterSpacing:"0.08em" }}>Saved Queries</span>
            <button onClick={()=>setSaveModal(true)}
              style={{ background:"none", border:"none", cursor:"pointer",
                color:T.accent, fontSize:16, lineHeight:1, padding:"0 4px" }}>+</button>
          </div>
          {savedQueries.map(q => (
            <div key={q.id} style={{ display:"flex", alignItems:"center", gap:0,
              borderRadius:5, transition:"background 0.1s" }}
              onMouseEnter={e=>e.currentTarget.style.background=`${T.accent}10`}
              onMouseLeave={e=>e.currentTarget.style.background="none"}>
              <button onClick={()=>setSql(q.sql)}
                style={{ flex:1, padding:"4px 8px 4px 12px", background:"none",
                  border:"none", cursor:"pointer", textAlign:"left",
                  fontSize:11, color:T.text2, fontFamily:"inherit",
                  overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {q.name}
              </button>
              <button onClick={()=>deleteQuery(q.id)}
                style={{ background:"none", border:"none", cursor:"pointer",
                  color:T.dim, padding:"4px 8px", fontSize:12, flexShrink:0 }}>×</button>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height:1, background:T.border }}/>

        {/* Query history */}
        <div style={{ padding:"8px 8px 12px" }}>
          <div style={{ fontSize:9, fontWeight:700, color:T.dim, marginBottom:6,
            paddingLeft:8, textTransform:"uppercase", letterSpacing:"0.08em" }}>
            History
          </div>
          {history.slice(0,8).map((h,i) => (
            <button key={i} onClick={()=>setSql(h.sql)}
              style={{ width:"100%", padding:"3px 8px 3px 12px", background:"none",
                border:"none", cursor:"pointer", textAlign:"left", borderRadius:4,
                transition:"background 0.1s" }}
              onMouseEnter={e=>e.currentTarget.style.background=`${T.accent}10`}
              onMouseLeave={e=>e.currentTarget.style.background="none"}>
              <div style={{ fontSize:10, color:T.muted, fontFamily:T.monoFont,
                overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {h.sql.slice(0,40)}…
              </div>
              <div style={{ fontSize:9, color:T.dim }}>{h.ts} · {h.rows} rows</div>
            </button>
          ))}
          {history.length === 0 && (
            <div style={{ fontSize:11, color:T.dim, paddingLeft:12 }}>No history yet</div>
          )}
        </div>
      </div>

      {/* Right: editor + results */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* AI SQL generator */}
        <div style={{ padding:"10px 16px", borderBottom:`1px solid ${T.border}`,
          background:`${T.accent}04`, display:"flex", gap:8, alignItems:"center" }}>
          <Zap size={12} color={T.accent}/>
          <input value={aiInput} onChange={e=>setAiInput(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&aiGenerateSql()}
            placeholder="Describe query in plain English… (e.g. 'show failed downloads from last 7 days')"
            style={{ flex:1, padding:"6px 10px", borderRadius:6,
              border:`1px solid ${T.border}`, background:T.surface,
              color:T.text, fontSize:12, fontFamily:"inherit", outline:"none" }}
            onFocus={e=>e.target.style.borderColor=T.accent}
            onBlur={e=>e.target.style.borderColor=T.border}
          />
          <Btn onClick={aiGenerateSql} disabled={aiLoading||!aiInput.trim()} size="sm">
            {aiLoading?<Spinner size={11} color="white"/>:<Zap size={11}/>}
            {aiLoading?"Generating…":"Generate SQL"}
          </Btn>
        </div>

        {/* SQL editor */}
        <div style={{ padding:"12px 16px", borderBottom:`1px solid ${T.border}` }}>
          <textarea value={sql} onChange={e=>setSql(e.target.value)}
            onKeyDown={e=>{ if((e.ctrlKey||e.metaKey)&&e.key==="Enter"){e.preventDefault();run();} }}
            rows={5}
            style={{ width:"100%", padding:"10px 14px", borderRadius:8, resize:"vertical",
              border:`1px solid ${T.border}`, background:T.surface, color:T.text,
              fontSize:12, fontFamily:T.monoFont, outline:"none", lineHeight:1.6 }}
            onFocus={e=>e.target.style.borderColor=T.accent}
            onBlur={e=>e.target.style.borderColor=T.border}
          />
          <div style={{ display:"flex", gap:8, marginTop:8, alignItems:"center" }}>
            <Btn onClick={()=>run()} disabled={running} size="sm">
              {running?<Spinner size={12} color="white"/>:<Play size={12}/>}
              {running?"Running…":"Run (Ctrl+↵)"}
            </Btn>
            <Btn onClick={()=>setSaveModal(true)} size="sm" variant="ghost">
              Save
            </Btn>
            {results?.rows?.length > 0 && (
              <>
                <span style={{ fontSize:11, color:T.muted }}>
                  {results.rows.length} rows
                </span>
                <Btn onClick={exportCsv} size="sm" variant="muted">
                  ↓ CSV
                </Btn>
              </>
            )}
          </div>
        </div>

        {/* Results */}
        <div style={{ flex:1, overflow:"auto", padding:"12px 16px" }}>
          {error && (
            <div style={{ padding:"10px 14px", background:`${T.red}08`,
              border:`1px solid ${T.red}30`, borderRadius:8,
              fontSize:12, color:T.red, fontFamily:T.monoFont }}>{error}</div>
          )}
          {results?.rows?.length > 0 && (
            <div style={{ overflowX:"auto" }}>
              <table style={{ borderCollapse:"collapse", fontSize:11,
                fontFamily:T.monoFont, width:"100%", minWidth:"max-content" }}>
                <thead>
                  <tr style={{ background:T.surface, position:"sticky", top:0 }}>
                    {results.columns?.map(c => (
                      <th key={c} style={{ padding:"6px 14px", textAlign:"left",
                        color:T.muted, fontWeight:700, fontSize:9,
                        textTransform:"uppercase", letterSpacing:"0.05em",
                        borderBottom:`2px solid ${T.border}`, whiteSpace:"nowrap",
                        userSelect:"none" }}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.rows.map((row,i) => (
                    <tr key={i} style={{ borderBottom:`1px solid ${T.border}30` }}
                      onMouseEnter={e=>e.currentTarget.style.background=`${T.accent}06`}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      {(results.columns||[]).map(c => (
                        <td key={c} style={{ padding:"5px 14px", whiteSpace:"nowrap",
                          color: row[c]===null?T.red:
                            String(row[c]).includes("fail")?T.orange:T.text2 }}>
                          {row[c]===null ? <span style={{color:T.red,fontWeight:700}}>NULL</span>
                                         : String(row[c])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {results?.rows?.length === 0 && (
            <div style={{ fontSize:12, color:T.muted, padding:"16px 0" }}>
              Query returned 0 rows
            </div>
          )}
          {!results && !error && !running && (
            <EmptyState icon={Terminal} title="Ready to query"
              desc="Write SQL above or describe it in plain English, click a table in the schema tree, or load a saved query"/>
          )}
        </div>
      </div>

      {/* Save modal */}
      {saveModalOpen && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)",
          display:"flex", alignItems:"center", justifyContent:"center", zIndex:50 }}>
          <Card style={{ padding:"24px", width:360 }}>
            <div style={{ fontSize:14, fontWeight:700, color:T.text, marginBottom:14 }}>
              Save Query
            </div>
            <input value={saveName} onChange={e=>setSaveName(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&saveQuery()}
              placeholder="Query name…"
              autoFocus
              style={{ width:"100%", padding:"8px 12px", borderRadius:7,
                border:`1px solid ${T.border}`, background:T.surface,
                color:T.text, fontSize:13, fontFamily:"inherit",
                outline:"none", marginBottom:14, boxSizing:"border-box" }}
              onFocus={e=>e.target.style.borderColor=T.accent}
              onBlur={e=>e.target.style.borderColor=T.border}
            />
            <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
              <Btn onClick={()=>{setSaveModal(false);setSaveName("");}} variant="muted" size="sm">
                Cancel
              </Btn>
              <Btn onClick={saveQuery} size="sm" disabled={!saveName.trim()}>
                Save
              </Btn>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── Workflows Tab ────────────────────────────────────────────────────────────
// ─── Ads SOP Tab ──────────────────────────────────────────────────────────────
// Runs the Ads Download Failure SOP as a multi-agent LangGraph workflow.
// Timeline: Data expected 3:30 PM → Downstream 4:00 PM → Complete ~7:00 PM IST
const SOP_PHASES = [
  { id:"detection",    label:"Detection",      icon:"🔍", agents:["DataAvailabilityAgent"] },
  { id:"pause",        label:"Pause Mage",     icon:"⏸",  agents:["Manual checklist"] },
  { id:"confirm",      label:"Data Confirm",   icon:"✅",  agents:["AdsTeamConfirmation"] },
  { id:"validation",   label:"Validation",     icon:"🔬", agents:["ValidationAgent"] },
  { id:"refresh",      label:"Refresh",        icon:"🔄", agents:["Manual checklist"] },
  { id:"resume_copy",  label:"Resume & Copy",  icon:"▶",  agents:["Manual checklist"] },
  { id:"finalize",     label:"Finalize",       icon:"🎉", agents:["FinalizationAgent"] },
];

const SOP_GATES = [
  { num:1, label:"Pause Mage Jobs",           phase:"pause"       },
  { num:2, label:"Data Available",            phase:"confirm"     },
  { num:3, label:"Proceed with Refreshes",    phase:"refresh"     },
  { num:4, label:"Run Product Summary",       phase:"resume_copy" },
  { num:5, label:"Resume Mage & GDS Copies",  phase:"finalize"    },
];

function AdsSopTab() {
  const T = useT();
  const [running,    setRunning]   = React.useState(false);
  const [result,     setResult]    = useSession("wz_sopResult", null);
  const [gateInputs, setGateInputs]= React.useState({});  // token → decision in flight
  const [submitting, setSubmitting]= React.useState({});

  // ── Derive current phase from result ──────────────────────────────────────
  const currentPhase = React.useMemo(() => {
    if (!result) return null;
    const g = result;
    if (g.gate5_decision === "approved")  return "finalize";
    if (g.gate5_decision === "pending")   return "finalize";
    if (g.gate4_decision === "approved")  return "resume_copy";
    if (g.gate4_decision === "pending")   return "resume_copy";
    if (g.gate3_decision === "approved")  return "refresh";
    if (g.gate3_decision === "pending")   return "refresh";
    if (g.gate2_decision === "approved")  return "validation";
    if (g.gate2_decision === "pending")   return "confirm";
    if (g.gate1_decision === "approved")  return "pause";
    if (g.gate1_decision === "pending")   return "pause";
    if (result.detection_result)          return "detection";
    return null;
  }, [result]);

  const phaseStatus = (phaseId) => {
    if (!result) return "idle";
    const order = ["detection","pause","confirm","validation","refresh","resume_copy","finalize"];
    const ci = order.indexOf(currentPhase);
    const pi = order.indexOf(phaseId);
    if (pi < ci)  return "done";
    if (pi === ci) return "active";
    return "idle";
  };

  // ── Run SOP ────────────────────────────────────────────────────────────────
  const runSop = async () => {
    setRunning(true); setResult(null);
    try {
      const res  = await fetch(`${API}/api/workflow/ads-sop`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({})
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch(e) {
      setResult({ error:e.message, status:"error", trace:[{node:"sop",ts:"",msg:e.message,level:"error"}] });
    }
    setRunning(false);
  };

  // ── Submit gate decision ───────────────────────────────────────────────────
  const submitGate = async (token, decision) => {
    if (!token) return;
    setSubmitting(p => ({...p,[token]:true}));
    try {
      const res  = await fetch(`${API}/api/workflow/sop-gate`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ token, decision })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      // Optimistically update result
      setResult(p => {
        if (!p) return p;
        const updated = {...p};
        for (let i = 1; i <= 5; i++) {
          if (p[`gate${i}_token`] === token) {
            updated[`gate${i}_decision`] = decision;
          }
        }
        return updated;
      });
    } catch(e) { alert(`Gate submit failed: ${e.message}`); }
    setSubmitting(p => ({...p,[token]:false}));
  };

  // ── Render helpers ─────────────────────────────────────────────────────────
  const GatePanel = ({ gateNum, token, decision, label }) => {
    if (!token || decision === "skipped") return null;
    const isPending  = decision === "pending";
    const isApproved = decision === "approved";
    const isRejected = decision === "rejected";
    const busy = submitting[token];

    return (
      <Card style={{ padding:"14px 18px", marginBottom:10,
        borderColor: isPending?`${T.yellow}50`:isApproved?`${T.green}40`:`${T.red}40`,
        background:  isPending?`${T.yellow}06`:isApproved?`${T.green}06`:`${T.red}06` }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:32, height:32, borderRadius:8, flexShrink:0,
            background: isPending?`${T.yellow}15`:isApproved?`${T.green}15`:`${T.red}15`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:14, fontWeight:800,
            color: isPending?T.yellow:isApproved?T.green:T.red }}>
            {gateNum}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, fontWeight:700,
              color: isPending?T.yellow:isApproved?T.green:T.red }}>
              🔒 Gate {gateNum}: {label}
            </div>
            <div style={{ fontSize:11, color:T.muted, marginTop:2, fontFamily:T.monoFont }}>
              token: {token}
              {isApproved && " · approved"}
              {isRejected && " · rejected — SOP stopped"}
            </div>
          </div>
          {isPending && (
            <div style={{ display:"flex", gap:6, flexShrink:0 }}>
              <Btn onClick={()=>submitGate(token,"approve")} variant="success" size="sm"
                disabled={busy}>
                {busy?<Spinner size={11} color="white"/>:<Check size={11}/>} Approve
              </Btn>
              <Btn onClick={()=>submitGate(token,"reject")} variant="danger" size="sm"
                disabled={busy}>
                <X size={11}/> Reject
              </Btn>
            </div>
          )}
          {isApproved && <Badge label="approved" color={T.green}/>}
          {isRejected && <Badge label="rejected" color={T.red}/>}
        </div>
      </Card>
    );
  };

  const Checklist = ({ title, items, icon }) => {
    const [checked, setChecked] = React.useState({});
    if (!items?.length) return null;
    const done = Object.values(checked).filter(Boolean).length;
    return (
      <Card style={{ padding:"14px 18px", marginBottom:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
          <span style={{ fontSize:16 }}>{icon}</span>
          <span style={{ fontSize:12, fontWeight:700, color:T.text }}>{title}</span>
          <span style={{ fontSize:11, color:T.muted, marginLeft:"auto" }}>
            {done}/{items.length} done
          </span>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
          {items.map((item, i) => {
            const key  = item.name || item;
            const isDone = checked[i];
            return (
              <div key={i} onClick={()=>setChecked(p=>({...p,[i]:!p[i]}))}
                style={{ display:"flex", alignItems:"flex-start", gap:10, cursor:"pointer",
                  padding:"6px 8px", borderRadius:6, transition:"background 0.1s",
                  background: isDone?`${T.green}08`:"transparent" }}
                onMouseEnter={e=>e.currentTarget.style.background=isDone?`${T.green}10`:`${T.accent}06`}
                onMouseLeave={e=>e.currentTarget.style.background=isDone?`${T.green}08`:"transparent"}>
                <div style={{ width:16, height:16, borderRadius:4, flexShrink:0, marginTop:1,
                  border:`1.5px solid ${isDone?T.green:T.border2}`,
                  background: isDone?T.green:"transparent",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  transition:"all 0.15s" }}>
                  {isDone && <Check size={10} color="white" strokeWidth={3}/>}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, color:isDone?T.muted:T.text,
                    textDecoration:isDone?"line-through":"none" }}>
                    {item.name || item}
                  </div>
                  {item.org && (
                    <div style={{ fontSize:10, color:T.dim }}>
                      {item.org} · Pause by: {item.pauseBy}
                    </div>
                  )}
                  {item.duration && (
                    <div style={{ fontSize:10, color:T.dim }}>Duration: {item.duration}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    );
  };

  const ValidationTable = ({ results }) => {
    if (!results?.length) return null;
    return (
      <Card style={{ padding:"14px 18px", marginBottom:10 }}>
        <div style={{ fontSize:12, fontWeight:700, color:T.text, marginBottom:10 }}>
          🔬 Validation Results
        </div>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${T.border}` }}>
              {["Table","Status","Profiles Today","Recent Dates"].map(h => (
                <th key={h} style={{ padding:"4px 10px", textAlign:"left",
                  fontSize:9, fontWeight:700, color:T.muted,
                  textTransform:"uppercase", letterSpacing:"0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((r,i) => (
              <tr key={i} style={{ borderBottom:`1px solid ${T.border}30` }}>
                <td style={{ padding:"6px 10px", fontFamily:T.monoFont,
                  fontSize:10, color:T.text2 }}>{r.name}</td>
                <td style={{ padding:"6px 10px" }}>
                  <Badge label={r.status}
                    color={r.status==="PASS"?T.green:r.status==="FAIL"?T.red:T.yellow}/>
                </td>
                <td style={{ padding:"6px 10px", fontFamily:T.monoFont,
                  color:r.has_today?T.green:T.red }}>
                  {r.profile_count || (r.has_today?"✓":"—")}
                </td>
                <td style={{ padding:"6px 10px", fontFamily:T.monoFont,
                  fontSize:10, color:T.muted }}>
                  {r.recent_dates?.join(", ") || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    );
  };

  return (
    <div className="fade-in" style={{ padding:"28px 32px", maxWidth:1100 }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24 }}>
        <div>
          <div style={{ fontSize:22, fontWeight:700, color:T.text, letterSpacing:"-0.02em" }}>
            Ads Download SOP
          </div>
          <div style={{ fontSize:13, color:T.muted, marginTop:3 }}>
            6 agents · 5 approval gates · Triggered when ads data download fails
          </div>
        </div>
        <Btn onClick={runSop} disabled={running} size="sm"
          style={{ background:running?T.border:`linear-gradient(135deg,${T.accent},${T.purple})`,
            color:"white", border:"none" }}>
          {running?<Spinner size={12} color="white"/>:<Play size={12}/>}
          {running?"Running SOP…":"▶ Trigger SOP"}
        </Btn>
      </div>

      {/* Timeline bar */}
      <Card style={{ padding:"14px 20px", marginBottom:20 }}>
        <div style={{ fontSize:10, fontWeight:700, color:T.muted, marginBottom:10,
          textTransform:"uppercase", letterSpacing:"0.06em" }}>
          SOP Timeline (IST)
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:0 }}>
          {SOP_PHASES.map((ph, i) => {
            const st = result ? phaseStatus(ph.id) : "idle";
            const isLast = i === SOP_PHASES.length - 1;
            return (
              <React.Fragment key={ph.id}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
                  <div style={{
                    width:34, height:34, borderRadius:"50%",
                    background: st==="done"?T.green:st==="active"?T.accent:T.border,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:15, transition:"all 0.3s",
                    boxShadow: st==="active"?`0 0 0 3px ${T.accent}30`:"none",
                    animation: st==="active"&&running?"pulse 1.5s infinite":"none",
                  }}>
                    {st==="done"
                      ? <Check size={14} color="white" strokeWidth={2.5}/>
                      : <span>{ph.icon}</span>
                    }
                  </div>
                  <span style={{ fontSize:9, color:st==="done"?T.green:st==="active"?T.accent:T.dim,
                    fontWeight:st==="active"?700:400, whiteSpace:"nowrap" }}>
                    {ph.label}
                  </span>
                </div>
                {!isLast && (
                  <div style={{ flex:1, height:2, margin:"0 4px", marginBottom:18,
                    background: st==="done"?T.green:T.border,
                    transition:"background 0.3s" }}/>
                )}
              </React.Fragment>
            );
          })}
        </div>
        {/* Time labels */}
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:6,
          fontSize:9, color:T.dim }}>
          <span>3:30 PM</span><span>4:20 PM</span><span>4:30 PM</span>
          <span>5:00 PM</span><span>5:30 PM</span><span>6:30 PM</span><span>~7:00 PM</span>
        </div>
      </Card>

      {/* Empty state */}
      {!result && !running && (
        <EmptyState icon={GitBranch}
          title="SOP not yet triggered"
          desc="Click ▶ Trigger SOP to start the Ads Download Failure workflow. The agent will detect issues, walk through all 5 approval gates, and guide you step by step."
          action={<Btn onClick={runSop} size="sm">▶ Trigger SOP</Btn>}
        />
      )}

      {/* Running state */}
      {running && (
        <Card style={{ padding:"20px 24px", textAlign:"center" }}>
          <Spinner size={32} style={{ margin:"0 auto 12px" }}/>
          <div style={{ fontSize:14, fontWeight:700, color:T.text }}>
            Detection agent running…
          </div>
          <div style={{ fontSize:12, color:T.muted, marginTop:4 }}>
            Checking mws.report and public.tbl_amzn_campaign_report
          </div>
        </Card>
      )}

      {/* Result */}
      {result && !running && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:16 }}>
          {/* Main flow */}
          <div>
            {/* Error */}
            {result.error && (
              <Card style={{ padding:"14px 18px", marginBottom:10,
                borderColor:`${T.red}40`, background:`${T.red}06` }}>
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  <XCircle size={16} color={T.red}/>
                  <span style={{ fontSize:12, color:T.red }}>{result.error}</span>
                </div>
              </Card>
            )}

            {/* Detection result */}
            {result.detection_result && (
              <Card style={{ padding:"14px 18px", marginBottom:10,
                borderColor: result.detection_result.missing?`${T.orange}40`:`${T.green}30`,
                background:  result.detection_result.missing?`${T.orange}06`:`${T.green}06` }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                  <span style={{ fontSize:16 }}>🔍</span>
                  <span style={{ fontSize:13, fontWeight:700,
                    color:result.detection_result.missing?T.orange:T.green }}>
                    Detection — {result.detection_result.missing?"Issues Found":"Clean"}
                  </span>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                  {result.detection_result.details?.map((d,i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:8, fontSize:11 }}>
                      <Badge label={d.status}
                        color={d.status==="PASS"?T.green:d.status==="FAIL"?T.red:T.yellow}/>
                      <span style={{ color:T.text2 }}>{d.check}</span>
                      <span style={{ color:T.muted }}>— {d.detail}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Gates and checklists in order */}
            <GatePanel gateNum={1} token={result.gate1_token}
              decision={result.gate1_decision} label="Pause Mage Jobs"/>

            <Checklist title="Pause Mage Packages — Manual Action Required"
              icon="⏸" items={result.mage_checklist}/>

            <GatePanel gateNum={2} token={result.gate2_token}
              decision={result.gate2_decision} label="Data Available"/>

            <ValidationTable results={result.validation_results}/>

            <GatePanel gateNum={3} token={result.gate3_token}
              decision={result.gate3_decision} label="Proceed with Refreshes"/>

            <Checklist title="Trigger Refreshes — Manual Action Required"
              icon="🔄" items={result.refresh_checklist}/>

            <GatePanel gateNum={4} token={result.gate4_token}
              decision={result.gate4_decision} label="Run Product Summary"/>

            <Checklist title="Resume Mage & GDS BigQuery Copies"
              icon="▶" items={result.copy_checklist}/>

            <GatePanel gateNum={5} token={result.gate5_token}
              decision={result.gate5_decision} label="Resume Mage & GDS Copies"/>

            {/* Completion */}
            {result.completion_summary && (
              <Card style={{ padding:"16px 20px",
                borderColor:`${T.green}40`, background:`${T.green}06` }}>
                <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:6 }}>
                  <span style={{ fontSize:18 }}>🎉</span>
                  <span style={{ fontSize:13, fontWeight:700, color:T.green }}>SOP Complete</span>
                  {result.notified && <Badge label="Slack notified" color={T.green}/>}
                </div>
                <pre style={{ fontSize:11, color:T.text2, fontFamily:T.monoFont,
                  whiteSpace:"pre-wrap", margin:0 }}>
                  {result.completion_summary}
                </pre>
              </Card>
            )}
          </div>

          {/* Trace panel */}
          <Card style={{ padding:"14px 16px", alignSelf:"start",
            position:"sticky", top:20 }}>
            <div style={{ fontSize:11, fontWeight:700, color:T.muted, marginBottom:10,
              textTransform:"uppercase", letterSpacing:"0.06em" }}>
              Execution Trace
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:4,
              maxHeight:500, overflowY:"auto" }}>
              {(result.trace||[]).length === 0
                ? <div style={{ fontSize:11, color:T.dim }}>No trace yet</div>
                : (result.trace||[]).map((t,i) => (
                  <div key={i} style={{ fontSize:10, lineHeight:1.6 }}>
                    <div style={{ display:"flex", gap:6, alignItems:"baseline" }}>
                      <span style={{ color:T.dim, fontFamily:T.monoFont,
                        fontSize:9, flexShrink:0 }}>{t.ts}</span>
                      <span style={{ padding:"0 5px", borderRadius:3, fontSize:9,
                        fontWeight:700, background:`${T.accent}12`,
                        color:T.accentL, flexShrink:0 }}>{t.node}</span>
                    </div>
                    <div style={{ paddingLeft:4, marginTop:1,
                      color:t.level==="success"?T.green:t.level==="error"?T.red:
                            t.level==="warning"?T.yellow:T.muted,
                      fontSize:10 }}>{t.msg}</div>
                  </div>
                ))
              }
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}


// ─── Workflow Run Timeline ────────────────────────────────────────────────────
// Gantt-style view of a single workflow run's trace nodes
function WorkflowRunTimeline({ run, onClose }) {
  const T = useT();
  if (!run) return null;

  const trace = run.trace || [];

  // Parse trace into nodes with durations
  const nodes = React.useMemo(() => {
    const result = [];
    trace.forEach((t, i) => {
      const prev = trace[i - 1];
      // Parse HH:MM:SS into seconds
      const toSec = (ts) => {
        if (!ts) return 0;
        const parts = ts.split(":").map(Number);
        return parts[0] * 3600 + parts[1] * 60 + (parts[2] || 0);
      };
      const startSec = prev ? toSec(prev.ts) : toSec(t.ts);
      const endSec   = toSec(t.ts);
      const duration = Math.max(endSec - startSec, 1);
      result.push({ ...t, startSec, endSec, duration });
    });
    return result;
  }, [trace]);

  const totalDuration = nodes.length
    ? nodes[nodes.length - 1].endSec - nodes[0].startSec || 1
    : 1;

  const levelColor = {
    success: T.green, error: T.red, warning: T.yellow, info: T.accent
  };

  const statusColor = {
    clean: T.green, fixed: T.green, error: T.red,
    escalated: T.yellow, running: T.accent,
  };

  return (
    <div className="fade-in" style={{ padding:"28px 32px", maxWidth:960 }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
        <Btn onClick={onClose} variant="ghost" size="sm">← Back</Btn>
        <div>
          <div style={{ fontSize:18, fontWeight:700, color:T.text }}>
            Run #{run.run_id} — Timeline
          </div>
          <div style={{ fontSize:12, color:T.muted, marginTop:2 }}>
            {run.started_at} ·{" "}
            <span style={{ color: statusColor[run.status] || T.muted,
              fontWeight:600 }}>
              {run.status?.toUpperCase()}
            </span>
            {run.notified && <span style={{ marginLeft:8,
              color:T.green, fontSize:11 }}>· Slack notified</span>}
          </div>
        </div>
      </div>

      {trace.length === 0 ? (
        <div style={{ fontSize:13, color:T.muted, padding:"24px 0" }}>
          No trace data available for this run.
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
          {/* Header */}
          <div style={{ display:"grid", gridTemplateColumns:"140px 1fr 80px 70px",
            gap:8, padding:"6px 10px", borderBottom:`1px solid ${T.border}`,
            fontSize:9, fontWeight:700, color:T.dim,
            textTransform:"uppercase", letterSpacing:"0.06em" }}>
            <span>Node</span><span>Timeline</span><span>Status</span><span>Time</span>
          </div>

          {nodes.map((node, i) => {
            const barLeft  = totalDuration > 0
              ? ((node.startSec - nodes[0].startSec) / totalDuration) * 100
              : 0;
            const barWidth = Math.max((node.duration / totalDuration) * 100, 1.5);
            const color    = levelColor[node.level] || T.muted;

            return (
              <div key={i} style={{
                display:"grid", gridTemplateColumns:"140px 1fr 80px 70px",
                gap:8, padding:"8px 10px", alignItems:"center",
                borderBottom:`1px solid ${T.border}30`,
                background: i % 2 === 0 ? "transparent" : `${T.accent}03`,
                transition:"background 0.1s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = `${T.accent}06`}
              onMouseLeave={e => e.currentTarget.style.background = i%2===0?"transparent":`${T.accent}03`}
              >
                {/* Node name */}
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <div style={{ width:7, height:7, borderRadius:"50%",
                    background:color, flexShrink:0 }}/>
                  <span style={{ fontSize:11, fontWeight:600, color:T.text,
                    fontFamily:T.monoFont, overflow:"hidden",
                    textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {node.node}
                  </span>
                </div>

                {/* Bar */}
                <div style={{ position:"relative", height:22,
                  background:T.border, borderRadius:4, overflow:"hidden" }}>
                  <div style={{
                    position:"absolute", top:2, bottom:2,
                    left:`${barLeft}%`, width:`${barWidth}%`,
                    background:`${color}90`, borderRadius:3,
                    minWidth:4,
                  }}/>
                  {/* Message label inside bar */}
                  <div style={{ position:"absolute", inset:0, display:"flex",
                    alignItems:"center", paddingLeft:`calc(${barLeft}% + 8px)`,
                    fontSize:9, color:T.text, overflow:"hidden",
                    whiteSpace:"nowrap", textOverflow:"ellipsis" }}>
                    {node.msg}
                  </div>
                </div>

                {/* Level badge */}
                <div>
                  <Badge label={node.level} color={color}/>
                </div>

                {/* Timestamp */}
                <span style={{ fontSize:10, color:T.dim,
                  fontFamily:T.monoFont }}>{node.ts}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary footer */}
      {run.root_cause_analysis?.root_cause &&
       run.root_cause_analysis.root_cause !== "none" && (
        <div style={{ marginTop:20, padding:"12px 16px", borderRadius:8,
          background:`${T.yellow}08`, border:`1px solid ${T.yellow}30` }}>
          <span style={{ fontSize:12, fontWeight:700, color:T.yellow }}>
            Root cause:{" "}
          </span>
          <span style={{ fontSize:12, color:T.text2 }}>
            {run.root_cause_analysis.root_cause}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Workflow Templates Library ───────────────────────────────────────────────
const WF_TEMPLATES = [
  {
    id:"tpl-freshness", name:"Daily Table Freshness Check",
    desc:"Checks that today's data is present in all selected tables. Alerts if any table is stale.",
    trigger:"scheduled", schedule:"8:00 AM IST",
    agents:["Freshness Agent","Notification Agent"],
    tables:["mws.report","mws.orders","mws.inventory"],
    category:"monitoring",
  },
  {
    id:"tpl-post-download", name:"Post-Download Validation",
    desc:"Runs after ads data downloads — validates row counts, profile coverage, and date completeness across all report tables.",
    trigger:"event", schedule:"After download completes",
    agents:["Download Monitor","Validation Agent","Pipeline Analyst"],
    tables:["public.tbl_amzn_campaign_report","public.tbl_amzn_keyword_report",
            "public.tbl_amzn_product_ad_report","public.tbl_amzn_targets_report"],
    category:"validation",
  },
  {
    id:"tpl-integrity", name:"Weekly Integrity Scan",
    desc:"Full NULL, duplicate, and range check across all mws tables. Runs weekly to catch accumulating data quality issues.",
    trigger:"scheduled", schedule:"Monday 7:00 AM IST",
    agents:["Integrity Agent","Root Cause Analyst","Notification Agent"],
    tables:["mws.orders","mws.inventory","mws.sales_and_traffic_by_date"],
    category:"quality",
  },
  {
    id:"tpl-sla", name:"Custom SLA Monitor",
    desc:"Alerts if row count in any monitored table falls below a configurable threshold — catches partial loads before they reach downstream.",
    trigger:"scheduled", schedule:"Every 2 hours",
    agents:["Row Count Monitor","Threshold Checker","Alert Agent"],
    tables:["mws.report"],
    category:"monitoring",
  },
  {
    id:"tpl-replication", name:"Replication Health Check",
    desc:"Verifies that Redshift data matches expected counts from the source system. Flags replication lag or missed jobs.",
    trigger:"scheduled", schedule:"5:00 PM IST",
    agents:["Replication Monitor","Lag Detector","Notification Agent"],
    tables:["mws.report","mws.orders"],
    category:"pipeline",
  },
  {
    id:"tpl-anomaly", name:"Statistical Anomaly Detector",
    desc:"Establishes a 14-day baseline per table and flags any metric that deviates by more than 2 standard deviations — catches unusual drops or spikes.",
    trigger:"scheduled", schedule:"9:00 AM IST",
    agents:["Baseline Builder","Anomaly Detector","Pipeline Analyst (LLM)"],
    tables:["mws.report","mws.orders","mws.sales_and_traffic_by_date"],
    category:"analytics",
  },
];

const TPL_CATEGORY_COLOR = {
  monitoring:"#3B82F6", validation:"#10B981",
  quality:"#F59E0B", pipeline:"#F97316",
  analytics:"#8B5CF6",
};

function WorkflowTemplatesView({ onSelect, onCancel }) {
  const T = useT();
  const [filter, setFilter] = React.useState("all");
  const categories = ["all","monitoring","validation","quality","pipeline","analytics"];

  const filtered = filter === "all"
    ? WF_TEMPLATES
    : WF_TEMPLATES.filter(t => t.category === filter);

  return (
    <div className="fade-in" style={{ padding:"28px 32px", maxWidth:1000 }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <Btn onClick={onCancel} variant="ghost" size="sm">← Back</Btn>
        <div>
          <div style={{ fontSize:20, fontWeight:700, color:T.text,
            letterSpacing:"-0.02em" }}>Workflow Templates</div>
          <div style={{ fontSize:12, color:T.muted, marginTop:2 }}>
            Pick a template to get started — customise agents, tables, and schedule
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div style={{ display:"flex", gap:6, marginBottom:20, flexWrap:"wrap" }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            style={{ padding:"4px 14px", borderRadius:99, fontSize:11,
              fontWeight:600, cursor:"pointer", border:"none",
              background: filter===cat ? T.accent : `${T.accent}12`,
              color: filter===cat ? "white" : T.muted,
              transition:"all 0.12s" }}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        {filtered.map(tpl => {
          const catColor = TPL_CATEGORY_COLOR[tpl.category] || T.accent;
          return (
            <Card key={tpl.id} hoverable style={{ padding:"18px 20px",
              cursor:"pointer" }} onClick={() => onSelect(tpl)}>
              <div style={{ display:"flex", alignItems:"flex-start",
                justifyContent:"space-between", marginBottom:8 }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center",
                    gap:7, marginBottom:4 }}>
                    <span style={{ fontSize:13, fontWeight:700,
                      color:T.text }}>{tpl.name}</span>
                    <Badge label={tpl.category} color={catColor}/>
                  </div>
                  <div style={{ fontSize:11, color:T.muted,
                    lineHeight:1.5 }}>{tpl.desc}</div>
                </div>
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:4,
                marginBottom:8 }}>
                {tpl.agents.map((a,i) => (
                  <span key={a} style={{ fontSize:9, padding:"2px 7px",
                    background:`${catColor}12`, color:catColor,
                    borderRadius:3, border:`1px solid ${catColor}20` }}>
                    {i+1}. {a}
                  </span>
                ))}
              </div>
              <div style={{ display:"flex", alignItems:"center",
                justifyContent:"space-between" }}>
                <span style={{ fontSize:10, color:T.muted }}>
                  <Clock size={10} style={{ marginRight:3,
                    verticalAlign:"middle" }}/>
                  {tpl.schedule}
                </span>
                <Btn size="sm" style={{ background:catColor,
                  color:"white", border:"none" }}>
                  Use Template →
                </Btn>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── Real-time Workflow Status ────────────────────────────────────────────────
// Polls /api/workflow/history every 30s to detect running workflows
function WorkflowLiveStatus({ onViewRun }) {
  const T = useT();
  const [liveRun,  setLiveRun]  = React.useState(null);
  const [polling,  setPolling]  = React.useState(false);
  const [lastPoll, setLastPoll] = React.useState(null);
  const [nextIn,   setNextIn]   = React.useState(30);

  // Poll every 30 seconds
  React.useEffect(() => {
    let interval, countdown;
    const poll = async () => {
      setPolling(true);
      try {
        const res  = await fetch(`${API}/api/workflow/history`);
        const data = await res.json();
        const runs = data.runs || [];
        // Find any run in the last 5 minutes that's still running
        const recent = runs.find(r => {
          if (r.status !== "running") return false;
          const ts = new Date(r.started_at);
          return (Date.now() - ts) < 5 * 60 * 1000;
        });
        setLiveRun(recent || null);
        setLastPoll(new Date().toLocaleTimeString());
        setNextIn(30);
      } catch {}
      setPolling(false);
    };
    poll();
    interval = setInterval(poll, 30000);
    countdown = setInterval(() => setNextIn(p => Math.max(0, p - 1)), 1000);
    return () => { clearInterval(interval); clearInterval(countdown); };
  }, []);

  if (!liveRun) {
    return (
      <div style={{ display:"flex", alignItems:"center", gap:8,
        padding:"8px 12px", borderRadius:8,
        background:T.border, fontSize:11, color:T.muted }}>
        <div style={{ width:6, height:6, borderRadius:"50%",
          background:T.green }}/>
        No workflow running
        {lastPoll && (
          <span style={{ marginLeft:4, color:T.dim }}>
            · polled {lastPoll} · next in {nextIn}s
          </span>
        )}
        {polling && <Spinner size={10}/>}
      </div>
    );
  }

  return (
    <div style={{ padding:"10px 14px", borderRadius:8,
      background:`${T.accent}08`, border:`1px solid ${T.accent}30`,
      display:"flex", alignItems:"center", gap:10 }}>
      <Spinner size={13} color={T.accent}/>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:12, fontWeight:700, color:T.accent }}>
          Workflow running — #{liveRun.run_id}
        </div>
        <div style={{ fontSize:10, color:T.muted }}>
          Started {liveRun.started_at}
          {lastPoll && ` · last checked ${lastPoll}`}
        </div>
      </div>
      <Btn onClick={() => onViewRun(liveRun)} size="sm" variant="ghost">
        View <ArrowRight size={11}/>
      </Btn>
    </div>
  );
}

function WorkflowsTab() {
  const T = useT();

  // view: "list" | "sop" | "builder" | "edit" | "timeline" | "templates"
  const [view,          setView]          = React.useState("list");
  const [editingWf,     setEditingWf]     = React.useState(null);
  const [timelineRun,   setTimelineRun]   = React.useState(null);   // run to show in timeline

  // Daily run state
  const [running,       setRunning]       = React.useState(false);
  const [result,        setResult]        = useSession("wz_wfResult", null);
  const [runHistory,    setRunHistory]    = useSession("wz_wfHistory", []);
  const [selected,      setSelected]      = React.useState(null);

  // Custom workflows stored in localStorage
  const [customWfs,     setCustomWfs]     = useLocal("wz_customWorkflows", []);

  // AI suggestions
  const [aiLoading,     setAiLoading]     = React.useState(false);
  const [aiSuggestions, setAiSuggestions] = useSession("wz_wfSuggestions", []);
  const [aiOptimizing,  setAiOptimizing]  = React.useState(null); // wf id being optimized
  const [aiOptResult,   setAiOptResult]   = useSession("wz_wfOptResult", null);

  // ── Built-in workflows ─────────────────────────────────────────────────────
  const BUILTIN_WFS = [
    {
      id:"daily-brief", builtin:true,
      name:"Daily Data Brief",
      desc:"3 sub-agents scan mws.report (downloads, freshness, integrity), Pipeline Analyst correlates root cause via GPT-4o. All issues flagged — nothing auto-fixes.",
      schedule:"4:30 PM IST", trigger:"scheduled",
      agents:["Download Monitor","Freshness Agent","Integrity Agent","Pipeline Analyst (LLM)"],
      tables:["mws.report"], endpoint:"/api/workflow/daily-run",
      color:T.accent,
    },
    {
      id:"ads-sop", builtin:true,
      name:"Ads Download SOP",
      desc:"6 agents · 5 approval gates · Full download failure runbook from detection through validation, refresh, and GDS copy jobs.",
      schedule:"On demand", trigger:"manual",
      agents:["Detection","Pause Mage","Validation","Refresh","Resume & Copy","Finalize"],
      tables:["mws.report","public.tbl_amzn_*"], endpoint:"/api/workflow/ads-sop",
      color:T.orange,
    },
  ];

  const allWorkflows = [...BUILTIN_WFS, ...customWfs];

  // ── Run daily workflow ─────────────────────────────────────────────────────
  const runDaily = async () => {
    setRunning(true); setResult(null);
    try {
      const res  = await fetch(`${API}/api/workflow/daily-run`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ tables_to_check:["mws.report"], threshold:50 })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      setRunHistory(p => [data,...p].slice(0,20));
      setSelected(data.run_id);
    } catch(e) { setResult({ error:e.message, status:"error" }); }
    setRunning(false);
  };

  // ── AI: suggest new workflows ──────────────────────────────────────────────
  const getSuggestions = async () => {
    setAiLoading(true);
    const existingNames = allWorkflows.map(w => w.name).join(", ");
    try {
      const res  = await fetch(`${API}/api/ai/chat`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          system:`You are WiziAgent, a data pipeline automation expert for Intentwise.
The user has these existing workflows: ${existingNames}.
Available tables: mws.report, mws.orders, mws.inventory, mws.sales_and_traffic_by_date, mws.sales_and_traffic_by_asin, public.tbl_amzn_campaign_report, public.tbl_amzn_keyword_report, public.tbl_amzn_product_ad_report, public.tbl_amzn_targets_report.
Suggest 3 NEW workflows that would automate common Intentwise data quality or ops tasks not already covered.
Respond ONLY with JSON array, no markdown:
[{"name":"...","desc":"...","trigger":"scheduled|manual|event","schedule":"...","agents":["agent1","agent2"],"tables":["schema.table"],"why":"one sentence on the value this adds"}]`,
          messages:[{ role:"user", content:"Suggest 3 new workflows I should add" }],
          max_tokens:800
        })
      });
      const data  = await res.json();
      const text  = data.content?.[0]?.text || "[]";
      const clean = text.replace(/```json|```/g,"").trim();
      const suggs = JSON.parse(clean);
      setAiSuggestions(suggs.map((s,i) => ({...s, id:`ai-suggest-${Date.now()}-${i}`})));
    } catch(e) { console.error(e); }
    setAiLoading(false);
  };

  // ── AI: optimize existing workflow ────────────────────────────────────────
  const optimizeWorkflow = async (wf) => {
    setAiOptimizing(wf.id); setAiOptResult(null);
    try {
      const res  = await fetch(`${API}/api/ai/chat`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          system:`You are WiziAgent, a workflow optimization expert for Intentwise data pipelines.
Analyze this workflow and suggest concrete improvements.
Respond ONLY with JSON, no markdown:
{"summary":"2 sentence assessment","optimizations":[{"type":"add_agent|remove_step|change_schedule|add_check|add_gate","title":"...","detail":"...","impact":"high|medium|low"}],"suggested_agents":["new agent name if any"],"suggested_schedule":"new schedule if applicable or null"}`,
          messages:[{ role:"user", content:`Optimize this workflow: ${JSON.stringify(wf)}` }],
          max_tokens:600
        })
      });
      const data  = await res.json();
      const text  = data.content?.[0]?.text || "{}";
      const clean = text.replace(/```json|```/g,"").trim();
      setAiOptResult({ wfId:wf.id, ...JSON.parse(clean) });
    } catch(e) { setAiOptResult({ wfId:wf.id, error:e.message }); }
    setAiOptimizing(null);
  };

  // ── Add suggested workflow as custom ──────────────────────────────────────
  const addSuggestion = (s) => {
    const newWf = {
      id:`custom-${Date.now()}`, builtin:false,
      name:s.name, desc:s.desc, trigger:s.trigger,
      schedule:s.schedule || "On demand",
      agents:s.agents || [], tables:s.tables || [],
      endpoint:null, color:T.purple,
      createdAt: new Date().toISOString(),
    };
    setCustomWfs(p => [...p, newWf]);
    setAiSuggestions(p => p.filter(x => x.id !== s.id));
  };

  // ── Delete custom workflow ─────────────────────────────────────────────────
  const deleteWf = (id) => setCustomWfs(p => p.filter(w => w.id !== id));

  // ── Save workflow from builder ─────────────────────────────────────────────
  const saveBuilderWf = (wf) => {
    if (wf.id && customWfs.find(w => w.id === wf.id)) {
      setCustomWfs(p => p.map(w => w.id === wf.id ? wf : w));
    } else {
      setCustomWfs(p => [...p, { ...wf, id:`custom-${Date.now()}`, builtin:false,
        createdAt:new Date().toISOString() }]);
    }
    setView("list");
    setEditingWf(null);
  };

  const SEV = { critical:T.red, high:T.orange, medium:T.yellow, low:T.cyan };

  // ── Views ──────────────────────────────────────────────────────────────────
  if (view === "timeline") return (
    <WorkflowRunTimeline
      run={timelineRun}
      onClose={()=>{ setView("list"); setTimelineRun(null); }}
    />
  );

  if (view === "templates") return (
    <WorkflowTemplatesView
      onSelect={(tpl) => {
        setEditingWf({
          name:tpl.name, desc:tpl.desc, trigger:tpl.trigger,
          schedule:tpl.schedule, agents:[...tpl.agents], tables:[...tpl.tables]
        });
        setView("builder");
      }}
      onCancel={() => setView("list")}
    />
  );

  if (view === "sop") return (
    <div className="fade-in" style={{ padding:"16px 32px 0" }}>
      <Btn onClick={()=>setView("list")} variant="ghost" size="sm" style={{ marginBottom:16 }}>
        ← Back to Workflows
      </Btn>
      <AdsSopTab/>
    </div>
  );

  if (view === "builder" || view === "edit") return (
    <WorkflowBuilder
      initial={editingWf}
      onSave={saveBuilderWf}
      onCancel={()=>{ setView("list"); setEditingWf(null); }}
    />
  );

  // ── List view ──────────────────────────────────────────────────────────────
  return (
    <div className="fade-in" style={{ padding:"28px 32px", maxWidth:1100 }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
        <div>
          <div style={{ fontSize:22, fontWeight:700, color:T.text, letterSpacing:"-0.02em" }}>
            Workflows
          </div>
          <div style={{ fontSize:13, color:T.muted, marginTop:3 }}>
            {allWorkflows.length} workflow{allWorkflows.length!==1?"s":""} · {customWfs.length} custom
          </div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <Btn onClick={getSuggestions} disabled={aiLoading} variant="ghost" size="sm">
            {aiLoading?<Spinner size={11}/>:<Zap size={11}/>}
            {aiLoading?"Thinking…":"✨ AI Suggest"}
          </Btn>
          <Btn onClick={()=>setView("templates")} variant="ghost" size="sm">
            <FileText size={12}/> Templates
          </Btn>
          <Btn onClick={()=>{ setEditingWf(null); setView("builder"); }} size="sm">
            <Plus size={12}/> New Workflow
          </Btn>
        </div>
      </div>

      {/* Live status polling banner */}
      <div style={{ marginBottom:16 }}>
        <WorkflowLiveStatus
          onViewRun={(run) => { setTimelineRun(run); setView("timeline"); }}
        />
      </div>

      {/* AI Suggestions */}
      {aiSuggestions.length > 0 && (
        <Card style={{ padding:"16px 20px", marginBottom:20,
          borderColor:`${T.purple}40`, background:`${T.purple}06` }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
            <Zap size={14} color={T.purple}/>
            <span style={{ fontSize:12, fontWeight:700, color:T.purple }}>
              AI Workflow Suggestions
            </span>
            <button onClick={()=>setAiSuggestions([])}
              style={{ marginLeft:"auto", background:"none", border:"none",
                color:T.dim, cursor:"pointer" }}><X size={13}/></button>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {aiSuggestions.map(s => (
              <div key={s.id} style={{ padding:"10px 14px", borderRadius:8,
                background:T.surface, border:`1px solid ${T.border}`,
                display:"flex", alignItems:"flex-start", gap:12 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:T.text }}>{s.name}</div>
                  <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>{s.desc}</div>
                  <div style={{ fontSize:10, color:T.purple, marginTop:4,
                    fontStyle:"italic" }}>💡 {s.why}</div>
                  <div style={{ display:"flex", gap:4, marginTop:6, flexWrap:"wrap" }}>
                    {s.agents?.map(a => (
                      <span key={a} style={{ fontSize:9, padding:"1px 6px",
                        background:`${T.purple}12`, color:T.purple, borderRadius:3 }}>{a}</span>
                    ))}
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:5, flexShrink:0 }}>
                  <Btn onClick={()=>addSuggestion(s)} size="sm" variant="success">
                    <Plus size={10}/> Add
                  </Btn>
                  <Btn onClick={()=>{
                    setEditingWf({
                      name:s.name, desc:s.desc, trigger:s.trigger,
                      schedule:s.schedule||"", agents:s.agents||[], tables:s.tables||[]
                    });
                    setView("builder");
                  }} size="sm" variant="ghost">
                    Edit first
                  </Btn>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* AI Optimization result */}
      {aiOptResult && (
        <Card style={{ padding:"16px 20px", marginBottom:20,
          borderColor:`${T.cyan}40`, background:`${T.cyan}06` }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
            <Zap size={14} color={T.cyan}/>
            <span style={{ fontSize:12, fontWeight:700, color:T.cyan }}>
              Optimization Suggestions
            </span>
            <button onClick={()=>setAiOptResult(null)}
              style={{ marginLeft:"auto", background:"none", border:"none",
                color:T.dim, cursor:"pointer" }}><X size={13}/></button>
          </div>
          {aiOptResult.error
            ? <div style={{ fontSize:12, color:T.red }}>{aiOptResult.error}</div>
            : <>
              <div style={{ fontSize:12, color:T.text2, marginBottom:10 }}>
                {aiOptResult.summary}
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {(aiOptResult.optimizations||[]).map((o,i) => (
                  <div key={i} style={{ display:"flex", gap:10, padding:"7px 10px",
                    borderRadius:6, background:T.surface, border:`1px solid ${T.border}` }}>
                    <Badge label={o.impact} color={o.impact==="high"?T.red:o.impact==="medium"?T.yellow:T.cyan}/>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:11, fontWeight:600, color:T.text }}>{o.title}</div>
                      <div style={{ fontSize:10, color:T.muted }}>{o.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
              {aiOptResult.suggested_schedule && (
                <div style={{ fontSize:11, color:T.cyan, marginTop:8 }}>
                  💡 Suggested schedule: {aiOptResult.suggested_schedule}
                </div>
              )}
            </>
          }
        </Card>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:24 }}>
        {/* Built-in + custom workflow cards */}
        {allWorkflows.map(wf => (
          <Card key={wf.id} style={{ padding:"18px 20px" }}>
            <div style={{ display:"flex", alignItems:"flex-start",
              justifyContent:"space-between", marginBottom:10 }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:3 }}>
                  <span style={{ fontSize:13, fontWeight:700, color:T.text }}>{wf.name}</span>
                  {wf.builtin && <Badge label="built-in" color={T.muted}/>}
                  {!wf.builtin && <Badge label="custom" color={T.purple}/>}
                </div>
                <div style={{ fontSize:11, color:T.muted, lineHeight:1.5 }}>{wf.desc}</div>
              </div>
            </div>

            {/* Agents */}
            <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:10 }}>
              {wf.agents.map((a,i) => (
                <span key={a} style={{ fontSize:9, padding:"2px 7px",
                  background:`${wf.color||T.accent}12`,
                  color:wf.color||T.accent, borderRadius:3,
                  border:`1px solid ${wf.color||T.accent}20` }}>
                  {i+1}. {a}
                </span>
              ))}
            </div>

            {/* Schedule + actions */}
            <div style={{ display:"flex", alignItems:"center",
              justifyContent:"space-between", flexWrap:"wrap", gap:6 }}>
              <span style={{ fontSize:10, color:T.muted }}>
                <Clock size={10} style={{ marginRight:3, verticalAlign:"middle" }}/>
                {wf.schedule}
              </span>
              <div style={{ display:"flex", gap:5 }}>
                <Btn onClick={()=>optimizeWorkflow(wf)} size="sm" variant="ghost"
                  disabled={aiOptimizing===wf.id}>
                  {aiOptimizing===wf.id?<Spinner size={10}/>:<Zap size={10}/>}
                  Optimize
                </Btn>
                {!wf.builtin && (
                  <>
                    <Btn onClick={()=>{ setEditingWf(wf); setView("edit"); }} size="sm" variant="ghost">
                      Edit
                    </Btn>
                    <Btn onClick={()=>deleteWf(wf.id)} size="sm" variant="muted">
                      <Trash2 size={10}/>
                    </Btn>
                  </>
                )}
                {wf.id==="daily-brief" && (
                  <Btn onClick={runDaily} disabled={running} size="sm"
                    style={{ background:running?T.border:`linear-gradient(135deg,${T.accent},${T.purple})`,
                      color:"white", border:"none" }}>
                    {running?<Spinner size={10} color="white"/>:<Play size={10}/>}
                    {running?"Running…":"Run"}
                  </Btn>
                )}
                {wf.id==="ads-sop" && (
                  <Btn onClick={()=>setView("sop")} size="sm"
                    style={{ background:`linear-gradient(135deg,${T.orange},${T.red})`,
                      color:"white", border:"none" }}>
                    <Play size={10}/> Open
                  </Btn>
                )}
                {!wf.builtin && wf.endpoint && (
                  <Btn size="sm"
                    style={{ background:`linear-gradient(135deg,${T.accent},${T.purple})`,
                      color:"white", border:"none" }}>
                    <Play size={10}/> Run
                  </Btn>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Run history + results */}
      {(runHistory.length > 0 || result) && (
        <div style={{ display:"grid", gridTemplateColumns:"240px 1fr", gap:16 }}>
          <Card style={{ padding:"14px 16px" }}>
            <div style={{ fontSize:11, fontWeight:700, color:T.muted, marginBottom:10,
              textTransform:"uppercase", letterSpacing:"0.06em" }}>Run History</div>
            <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
              {runHistory.slice(0,10).map(r => (
                <button key={r.run_id} onClick={()=>setSelected(r.run_id)}
                  style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 8px",
                    borderRadius:6, cursor:"pointer", textAlign:"left", fontFamily:"inherit",
                    border:`1px solid ${selected===r.run_id?T.accent:T.border}`,
                    background:selected===r.run_id?`${T.accent}08`:"transparent" }}>
                  <StatusDot status={r.status==="clean"?"healthy":r.status==="critical"?"critical":"warning"}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:10, fontWeight:600, color:T.text, fontFamily:T.monoFont }}>
                      #{r.run_id}
                    </div>
                    <div style={{ fontSize:9, color:T.muted }}>{r.started_at}</div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                    <Badge label={r.status}
                      color={r.status==="clean"?T.green:r.status==="critical"?T.red:T.orange}/>
                    <button onClick={(e)=>{ e.stopPropagation(); setTimelineRun(r); setView("timeline"); }}
                      title="View timeline"
                      style={{ background:"none", border:"none", cursor:"pointer",
                        color:T.dim, padding:"1px 3px", fontSize:12, lineHeight:1 }}>
                      ▤
                    </button>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Selected run detail */}
          {(() => {
            const sel = result?.run_id===selected ? result : runHistory.find(r=>r.run_id===selected);
            if (!sel || running) return null;
            return (
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                <Card style={{ padding:"14px 18px",
                  background:sel.status==="clean"?`${T.green}06`:`${T.orange}06`,
                  borderColor:sel.status==="clean"?`${T.green}30`:`${T.orange}30` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    {sel.status==="clean"
                      ?<CheckCircle size={20} color={T.green} strokeWidth={1.5}/>
                      :<AlertTriangle size={20} color={T.orange} strokeWidth={1.5}/>
                    }
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:700,
                        color:sel.status==="clean"?T.green:T.orange }}>
                        #{sel.run_id} — {sel.status?.toUpperCase()}
                      </div>
                      <div style={{ fontSize:11, color:T.muted }}>
                        {sel.started_at} · {sel.issues?.length||0} issue(s)
                      </div>
                    </div>
                    {sel.notified && <Badge label="Slack sent" color={T.green}/>}
                  </div>
                  {sel.root_cause_analysis?.root_cause && sel.root_cause_analysis.root_cause!=="none" && (
                    <div style={{ marginTop:8, padding:"7px 10px", borderRadius:6,
                      background:`${T.orange}10`, fontSize:11, color:T.text2 }}>
                      <strong>Root cause:</strong> {sel.root_cause_analysis.root_cause}
                    </div>
                  )}
                </Card>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                  {[["📥","Download Monitor","download_findings"],
                    ["🕐","Freshness","freshness_findings"],
                    ["🔍","Integrity","integrity_findings"]].map(([icon,label,key]) => {
                    const findings = sel[key]||[];
                    const clean = findings.length===0;
                    return (
                      <Card key={key} style={{ padding:"10px 12px",
                        borderColor:clean?`${T.green}30`:`${T.orange}30`,
                        background:clean?`${T.green}04`:`${T.orange}04` }}>
                        <div style={{ fontSize:11, fontWeight:600,
                          color:clean?T.green:T.orange, marginBottom:5 }}>
                          {icon} {label}
                        </div>
                        {clean
                          ? <div style={{ fontSize:10, color:T.green }}>✓ Clean</div>
                          : findings.map(f=>(
                            <div key={f.id} style={{ fontSize:10, color:T.text2,
                              fontFamily:T.monoFont }}>[{f.id}] {f.count}</div>
                          ))
                        }
                      </Card>
                    );
                  })}
                </div>
                <Card style={{ padding:"12px 14px" }}>
                  <div style={{ fontSize:10, fontWeight:700, color:T.muted, marginBottom:6,
                    textTransform:"uppercase", letterSpacing:"0.06em" }}>Trace</div>
                  <div style={{ maxHeight:140, overflowY:"auto", display:"flex",
                    flexDirection:"column", gap:2 }}>
                    {(sel.trace||[]).map((t,i)=>(
                      <div key={i} style={{ display:"flex", gap:6, fontSize:10 }}>
                        <span style={{ color:T.dim, fontFamily:T.monoFont,
                          fontSize:9, flexShrink:0 }}>[{t.ts}]</span>
                        <span style={{ padding:"0 5px", borderRadius:3, fontSize:8,
                          fontWeight:700, background:`${T.accent}12`, color:T.accentL,
                          flexShrink:0 }}>{t.node}</span>
                        <span style={{ color:t.level==="success"?T.green:
                          t.level==="error"?T.red:t.level==="warning"?T.yellow:T.muted }}>
                          {t.msg}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

// ─── Workflow Builder ─────────────────────────────────────────────────────────
function WorkflowBuilder({ initial, onSave, onCancel }) {
  const T = useT();
  const blank = { name:"", desc:"", trigger:"manual", schedule:"",
                  agents:[], tables:[], endpoint:"" };
  const [wf,       setWf]       = React.useState(initial || blank);
  const [agentIn,  setAgentIn]  = React.useState("");
  const [tableIn,  setTableIn]  = React.useState("");
  const [aiLoading,setAiLoading]= React.useState(false);
  const [aiHints,  setAiHints]  = React.useState(null);

  const field = (key, val) => setWf(p => ({...p, [key]:val}));

  const addAgent = () => {
    if (!agentIn.trim()) return;
    setWf(p => ({...p, agents:[...p.agents, agentIn.trim()]}));
    setAgentIn("");
  };
  const removeAgent = (i) => setWf(p=>({...p, agents:p.agents.filter((_,j)=>j!==i)}));

  const addTable = () => {
    if (!tableIn.trim()) return;
    setWf(p => ({...p, tables:[...p.tables, tableIn.trim()]}));
    setTableIn("");
  };
  const removeTable = (i) => setWf(p=>({...p, tables:p.tables.filter((_,j)=>j!==i)}));

  const getAiHelp = async () => {
    if (!wf.name && !wf.desc) return;
    setAiLoading(true); setAiHints(null);
    try {
      const res  = await fetch(`${API}/api/ai/chat`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          system:`You are WiziAgent helping a user design a new data workflow for Intentwise.
Available mws tables: mws.report, mws.orders, mws.inventory, mws.sales_and_traffic_by_date, mws.sales_and_traffic_by_asin, public.tbl_amzn_campaign_report, public.tbl_amzn_keyword_report, public.tbl_amzn_product_ad_report, public.tbl_amzn_targets_report.
Based on the workflow name/desc, suggest agents, tables, and schedule.
Respond ONLY with JSON:
{"suggested_agents":["agent1","agent2"],"suggested_tables":["mws.report"],"suggested_schedule":"4:30 PM IST","suggested_trigger":"scheduled|manual|event","tips":["tip1","tip2"]}`,
          messages:[{ role:"user",
            content:`Workflow: "${wf.name}" — ${wf.desc}. Current agents: ${wf.agents.join(", ")||"none"}` }],
          max_tokens:400
        })
      });
      const data  = await res.json();
      const text  = data.content?.[0]?.text||"{}";
      setAiHints(JSON.parse(text.replace(/```json|```/g,"").trim()));
    } catch(e) { console.error(e); }
    setAiLoading(false);
  };

  const applyHints = () => {
    if (!aiHints) return;
    setWf(p => ({
      ...p,
      agents:   [...new Set([...p.agents, ...(aiHints.suggested_agents||[])])],
      tables:   [...new Set([...p.tables, ...(aiHints.suggested_tables||[])])],
      schedule: aiHints.suggested_schedule || p.schedule,
      trigger:  aiHints.suggested_trigger  || p.trigger,
    }));
    setAiHints(null);
  };

  const inputStyle = {
    width:"100%", padding:"8px 12px", borderRadius:7, outline:"none",
    border:`1px solid ${T.border}`, background:T.surface,
    color:T.text, fontSize:12, fontFamily:"inherit", boxSizing:"border-box",
  };

  return (
    <div className="fade-in" style={{ padding:"28px 32px", maxWidth:760 }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
        <Btn onClick={onCancel} variant="ghost" size="sm">← Back</Btn>
        <div style={{ fontSize:20, fontWeight:700, color:T.text, letterSpacing:"-0.02em" }}>
          {initial ? "Edit Workflow" : "New Workflow"}
        </div>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {/* Name + desc */}
        <Card style={{ padding:"18px 20px" }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.muted, marginBottom:12,
            textTransform:"uppercase", letterSpacing:"0.06em" }}>Basic Info</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <div>
              <label style={{ fontSize:11, fontWeight:600, color:T.text2,
                display:"block", marginBottom:4 }}>Workflow Name *</label>
              <input value={wf.name} onChange={e=>field("name",e.target.value)}
                placeholder="e.g. Inventory Freshness Check"
                style={inputStyle}
                onFocus={e=>e.target.style.borderColor=T.accent}
                onBlur={e=>e.target.style.borderColor=T.border}/>
            </div>
            <div>
              <label style={{ fontSize:11, fontWeight:600, color:T.text2,
                display:"block", marginBottom:4 }}>Description</label>
              <textarea value={wf.desc} onChange={e=>field("desc",e.target.value)}
                placeholder="What does this workflow do and why?"
                rows={2}
                style={{...inputStyle, resize:"vertical"}}
                onFocus={e=>e.target.style.borderColor=T.accent}
                onBlur={e=>e.target.style.borderColor=T.border}/>
            </div>
          </div>
        </Card>

        {/* Schedule */}
        <Card style={{ padding:"18px 20px" }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.muted, marginBottom:12,
            textTransform:"uppercase", letterSpacing:"0.06em" }}>Schedule</div>
          <div style={{ display:"flex", gap:10 }}>
            <div style={{ flex:1 }}>
              <label style={{ fontSize:11, fontWeight:600, color:T.text2,
                display:"block", marginBottom:4 }}>Trigger</label>
              <select value={wf.trigger} onChange={e=>field("trigger",e.target.value)}
                style={{...inputStyle}}>
                <option value="manual">Manual</option>
                <option value="scheduled">Scheduled</option>
                <option value="event">Event-driven</option>
              </select>
            </div>
            {wf.trigger==="scheduled" && (
              <div style={{ flex:1 }}>
                <label style={{ fontSize:11, fontWeight:600, color:T.text2,
                  display:"block", marginBottom:4 }}>Time (IST)</label>
                <input value={wf.schedule} onChange={e=>field("schedule",e.target.value)}
                  placeholder="e.g. 4:30 PM IST"
                  style={inputStyle}
                  onFocus={e=>e.target.style.borderColor=T.accent}
                  onBlur={e=>e.target.style.borderColor=T.border}/>
              </div>
            )}
          </div>
        </Card>

        {/* AI assistant */}
        <Card style={{ padding:"18px 20px",
          borderColor:`${T.purple}30`, background:`${T.purple}04` }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
            <Zap size={13} color={T.purple}/>
            <span style={{ fontSize:11, fontWeight:700, color:T.purple }}>
              AI Assistant
            </span>
            <Btn onClick={getAiHelp} disabled={aiLoading||(!wf.name&&!wf.desc)}
              size="sm" variant="ghost" style={{ marginLeft:"auto" }}>
              {aiLoading?<Spinner size={10}/>:<Zap size={10}/>}
              {aiLoading?"Thinking…":"Suggest agents & tables"}
            </Btn>
          </div>
          {aiHints && (
            <div style={{ padding:"10px 14px", borderRadius:7,
              background:T.surface, border:`1px solid ${T.border}` }}>
              <div style={{ display:"flex", flexDirection:"column", gap:4, marginBottom:8 }}>
                {aiHints.tips?.map((tip,i)=>(
                  <div key={i} style={{ fontSize:11, color:T.text2 }}>💡 {tip}</div>
                ))}
              </div>
              <div style={{ fontSize:11, color:T.muted, marginBottom:6 }}>
                Suggested agents: <strong style={{color:T.text}}>
                  {aiHints.suggested_agents?.join(", ")}
                </strong>
              </div>
              <div style={{ fontSize:11, color:T.muted, marginBottom:8 }}>
                Suggested tables: <strong style={{color:T.text,fontFamily:T.monoFont,fontSize:10}}>
                  {aiHints.suggested_tables?.join(", ")}
                </strong>
              </div>
              <Btn onClick={applyHints} size="sm" variant="success">
                <Check size={10}/> Apply suggestions
              </Btn>
            </div>
          )}
          {!aiHints && !aiLoading && (
            <div style={{ fontSize:11, color:T.dim }}>
              Fill in a name and description, then click "Suggest agents & tables"
            </div>
          )}
        </Card>

        {/* Agents */}
        <Card style={{ padding:"18px 20px" }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.muted, marginBottom:12,
            textTransform:"uppercase", letterSpacing:"0.06em" }}>Sub-agents</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:10 }}>
            {wf.agents.map((a,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:4,
                padding:"3px 8px", borderRadius:5,
                background:`${T.accent}12`, border:`1px solid ${T.accent}20` }}>
                <span style={{ fontSize:11, color:T.accentL }}>{i+1}. {a}</span>
                <button onClick={()=>removeAgent(i)}
                  style={{ background:"none", border:"none", cursor:"pointer",
                    color:T.muted, padding:0, lineHeight:1 }}>×</button>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <input value={agentIn} onChange={e=>setAgentIn(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&addAgent()}
              placeholder="Agent name (e.g. NullCheckAgent)"
              style={{...inputStyle, flex:1}}
              onFocus={e=>e.target.style.borderColor=T.accent}
              onBlur={e=>e.target.style.borderColor=T.border}/>
            <Btn onClick={addAgent} size="sm"><Plus size={11}/></Btn>
          </div>
        </Card>

        {/* Tables */}
        <Card style={{ padding:"18px 20px" }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.muted, marginBottom:12,
            textTransform:"uppercase", letterSpacing:"0.06em" }}>Tables to Check</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:10 }}>
            {wf.tables.map((t,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:4,
                padding:"3px 8px", borderRadius:5, fontFamily:T.monoFont,
                background:`${T.cyan}10`, border:`1px solid ${T.cyan}20` }}>
                <span style={{ fontSize:11, color:T.cyan }}>{t}</span>
                <button onClick={()=>removeTable(i)}
                  style={{ background:"none", border:"none", cursor:"pointer",
                    color:T.muted, padding:0, lineHeight:1 }}>×</button>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <input value={tableIn} onChange={e=>setTableIn(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&addTable()}
              placeholder="schema.table (e.g. mws.orders)"
              style={{...inputStyle, flex:1, fontFamily:T.monoFont, fontSize:11}}
              onFocus={e=>e.target.style.borderColor=T.accent}
              onBlur={e=>e.target.style.borderColor=T.border}/>
            <Btn onClick={addTable} size="sm"><Plus size={11}/></Btn>
          </div>
        </Card>

        {/* Save / Cancel */}
        <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
          <Btn onClick={onCancel} variant="muted" size="sm">Cancel</Btn>
          <Btn onClick={()=>onSave(wf)} disabled={!wf.name.trim()} size="sm">
            <Check size={12}/> Save Workflow
          </Btn>
        </div>
      </div>
    </div>
  );
}

export default function WiziAgentApp() {
  const [themeKey,  setThemeKey]  = useLocal("wz_theme", "light");
  const [activeTab, setActiveTab] = useLocal("wz_tab",   "brief");
  const [issues,    setIssues]    = useSession("wz_pendingIssues", []);

  const T = THEMES[themeKey] || THEMES.light;
  // Content area always bright white for readability — only left nav is themed
  const TC = {
    ...T,
    bg:      "#F8FAFC",
    surface: "#FFFFFF",
    card:    "#FFFFFF",
    text:    "#0D1117",
    text2:   "#374151",
    muted:   "#6B7280",
    dim:     "#9CA3AF",
    border:  "#E8ECF0",
    border2: "#D1D9E0",
  };

  React.useEffect(() => {
    const id = "wizi-font-link";
    let el = document.getElementById(id);
    if (!el) { el = document.createElement("link"); el.id=id; el.rel="stylesheet"; document.head.appendChild(el); }
    el.href = `https://fonts.googleapis.com/css2?family=${T.googleFonts}&display=swap`;
    document.body.style.fontFamily = T.font;
  }, [T.googleFonts, T.font]);

  const pendingCount = issues.filter(i =>
    i.severity==="critical" || i.severity==="high"
  ).length;

  return (
    <ThemeCtx.Provider value={T}>
      <style>{GLOBAL_CSS}</style>
      <div style={{
        display:"flex", minHeight:"100vh",
        background:T.bg, color:T.text,
        fontFamily:T.font,
      }}>
        <Sidebar
          active={activeTab}
          setActive={setActiveTab}
          pendingCount={pendingCount}
          themeKey={themeKey}
          setThemeKey={setThemeKey}
        />
        <ThemeCtx.Provider value={TC}>
        <main style={{
          flex:1, overflowY:"auto", minWidth:0, position:"relative",
          background:"#F8FAFC",
          backgroundImage: T.wallpaper ? `url("data:image/svg+xml;base64,${T.wallpaper}")` : "none",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top right",
          backgroundAttachment: "local",
          backgroundSize: "auto",
        }}>
          {activeTab==="brief"     && <MorningBriefTab onNavigate={setActiveTab} onIssueFound={setIssues}/>}
          {activeTab==="monitor"   && <MonitorTab/>}
          {activeTab==="triage"    && <TriageTab initialIssues={issues}/>}
          {activeTab==="workflows" && <WorkflowsTab/>}
          {activeTab==="approvals" && <ApprovalQueueTab onNavigate={setActiveTab}/>}
          {activeTab==="history"   && <FixHistoryTab/>}
          {activeTab==="notifs"    && <NotificationCenterTab/>}
          {activeTab==="chat"      && <AskWiziTab onAddMonitor={()=>{}} onSaveRule={()=>{}}/>}
          {activeTab==="config"    && <ConfigureTab/>}
          {activeTab==="query"     && <QueryTab/>}
        </main>
        </ThemeCtx.Provider>
      </div>
    </ThemeCtx.Provider>
  );
}
