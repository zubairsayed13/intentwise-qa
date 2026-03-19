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

// ─── Live schema context (fetched once from /api/tables) ─────────────────────
const SchemaCtx = React.createContext("");
const useSchema = () => React.useContext(SchemaCtx);

// Compact schema string: "schema.table(col1,col2,...); ..."  — max 120 cols total
function buildSchemaStr(tables) {
  if (!tables || tables.length === 0) return "";
  // Group by schema.table
  const grouped = {};
  for (const row of tables) {
    const key = `${row.table_schema}.${row.table_name}`;
    if (!grouped[key]) grouped[key] = [];
    if (row.column_name) grouped[key].push(row.column_name);
  }
  return Object.entries(grouped)
    .map(([tbl, cols]) => cols.length ? `${tbl}(${cols.join(",")})` : tbl)
    .join("; ");
}

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
  { id:"activity",  label:"Activity",        icon:Bell,         shortcut:"5" },
  { id:"chat",      label:"Ask WiziAgent",  icon:MessageSquare,shortcut:"6" },
  { id:"config",    label:"Configure",      icon:Settings,     shortcut:"7" },
  { id:"query",     label:"Data Explorer", icon:Database,     shortcut:"8" },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────
// ─── HelpTip — inline contextual help ────────────────────────────────────────
function HelpTip({ children }) {
  const T = useT();
  const [open, setOpen] = React.useState(false);
  return (
    <span style={{ display:"inline-flex", alignItems:"center" }}>
      <button onClick={()=>setOpen(p=>!p)}
        style={{ background:"none", border:`1px solid ${T.border}`, borderRadius:99,
          width:16, height:16, display:"inline-flex", alignItems:"center",
          justifyContent:"center", cursor:"pointer", color:T.muted,
          fontSize:9, fontWeight:700, marginLeft:6, flexShrink:0,
          transition:"all 0.12s" }}
        onMouseEnter={e=>{e.currentTarget.style.borderColor=T.accent; e.currentTarget.style.color=T.accent;}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border; e.currentTarget.style.color=T.muted;}}>
        ?
      </button>
      {open && (
        <div style={{ position:"absolute", zIndex:200, marginTop:4,
          maxWidth:320, padding:"10px 14px", borderRadius:9,
          background:"#1C2333", border:"1px solid rgba(255,255,255,0.1)",
          boxShadow:"0 8px 32px rgba(0,0,0,0.3)",
          fontSize:12, color:"#E2E8F0", lineHeight:1.6 }}>
          {children}
          <button onClick={()=>setOpen(false)}
            style={{ display:"block", marginTop:8, fontSize:10, color:"rgba(255,255,255,0.4)",
              background:"none", border:"none", cursor:"pointer", padding:0 }}>
            Close
          </button>
        </div>
      )}
    </span>
  );
}

function CommandPalette({ onNavigate, onClose }) {
  const T = useT();
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef(null);

  React.useEffect(() => { inputRef.current?.focus(); }, []);

  // Close on Escape
  React.useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const COMMANDS = [
    { label:"Morning Brief",        tab:"brief",     icon:"⚡", desc:"View daily pipeline health" },
    { label:"Monitor",              tab:"monitor",   icon:"📊", desc:"Watch tables for issues" },
    { label:"Triage",               tab:"triage",    icon:"🔍", desc:"Scan and fix issues" },
    { label:"Workflows",            tab:"workflows", icon:"🔀", desc:"Run and manage workflows" },
    { label:"Approvals",            tab:"approvals", icon:"🔒", desc:"Pending fix approvals" },
    { label:"Activity",             tab:"activity",  icon:"🔔", desc:"Alerts, fix log + AI insight" },
    { label:"Ask WiziAgent",        tab:"chat",      icon:"💬", desc:"Chat with WiziAgent" },
    { label:"Configure",            tab:"config",    icon:"⚙️", desc:"Slack, thresholds, sources" },
    { label:"Data Explorer", tab:"query",     icon:"🖥", desc:"SQL editor with AI generation" },
  ];

  const filtered = query.trim()
    ? COMMANDS.filter(c =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.desc.toLowerCase().includes(query.toLowerCase()))
    : COMMANDS;

  const [selected, setSelected] = React.useState(0);

  React.useEffect(() => { setSelected(0); }, [query]);

  const execute = (cmd) => { onNavigate(cmd.tab); onClose(); };

  const handleKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSelected(p => Math.min(p+1, filtered.length-1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setSelected(p => Math.max(p-1, 0)); }
    if (e.key === "Enter" && filtered[selected]) execute(filtered[selected]);
  };

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:9999,
      background:"rgba(0,0,0,0.45)", display:"flex",
      alignItems:"flex-start", justifyContent:"center", paddingTop:120,
    }} onClick={onClose}>
      <div style={{
        width:520, borderRadius:14, overflow:"hidden",
        background:"#FFFFFF", boxShadow:"0 24px 80px rgba(0,0,0,0.25)",
        border:"1px solid #E8ECF0",
      }} onClick={e=>e.stopPropagation()}>
        {/* Search input */}
        <div style={{ display:"flex", alignItems:"center", gap:10,
          padding:"14px 18px", borderBottom:"1px solid #E8ECF0" }}>
          <Search size={15} color="#9CA3AF"/>
          <input ref={inputRef}
            value={query} onChange={e=>setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Jump to tab, search actions…"
            style={{ flex:1, border:"none", outline:"none", fontSize:14,
              color:"#0D1117", background:"transparent", fontFamily:"inherit" }}
          />
          <kbd style={{ fontSize:10, color:"#9CA3AF", background:"#F3F4F6",
            border:"1px solid #E5E7EB", borderRadius:4, padding:"2px 6px" }}>
            ESC
          </kbd>
        </div>
        {/* Results */}
        <div style={{ maxHeight:360, overflowY:"auto" }}>
          {filtered.length === 0 && (
            <div style={{ padding:"20px", textAlign:"center", fontSize:13, color:"#9CA3AF" }}>
              No results for "{query}"
            </div>
          )}
          {filtered.map((cmd, i) => (
            <div key={cmd.tab}
              onClick={() => execute(cmd)}
              onMouseEnter={() => setSelected(i)}
              style={{
                display:"flex", alignItems:"center", gap:12,
                padding:"10px 18px", cursor:"pointer",
                background: i===selected ? "#F0F4FF" : "transparent",
                borderLeft: i===selected ? "3px solid #6366F1" : "3px solid transparent",
                transition:"background 0.1s",
              }}>
              <span style={{ fontSize:16, width:22, textAlign:"center" }}>{cmd.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color:"#0D1117" }}>{cmd.label}</div>
                <div style={{ fontSize:11, color:"#6B7280", marginTop:1 }}>{cmd.desc}</div>
              </div>
              <kbd style={{ fontSize:9, color:"#9CA3AF", background:"#F3F4F6",
                border:"1px solid #E5E7EB", borderRadius:4, padding:"2px 5px" }}>
                ↵
              </kbd>
            </div>
          ))}
        </div>
        <div style={{ padding:"8px 18px", borderTop:"1px solid #E8ECF0",
          display:"flex", gap:16, fontSize:10, color:"#9CA3AF" }}>
          <span><kbd style={{background:"#F3F4F6",border:"1px solid #E5E7EB",
            borderRadius:3,padding:"1px 4px",fontSize:9}}>↑↓</kbd> navigate</span>
          <span><kbd style={{background:"#F3F4F6",border:"1px solid #E5E7EB",
            borderRadius:3,padding:"1px 4px",fontSize:9}}>↵</kbd> open</span>
          <span><kbd style={{background:"#F3F4F6",border:"1px solid #E5E7EB",
            borderRadius:3,padding:"1px 4px",fontSize:9}}>ESC</kbd> close</span>
          <span style={{marginLeft:"auto"}}>⌘K to open</span>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ active, setActive, pendingCount, themeKey, setThemeKey }) {
  const T = useT();
  const [showThemes, setShowThemes] = React.useState(false);
  const [collapsed, setCollapsed]   = useLocal("wz_sidebarCollapsed", false);

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
      width: collapsed ? 52 : 220, flexShrink:0,
      background: T.sidebarBg || T.surface,
      borderRight:`1px solid ${T.border}`,
      display:"flex", flexDirection:"column",
      height:"100vh", position:"sticky", top:0,
      transition:"width 0.2s ease", overflow:"hidden",
    }}>
      {/* Logo + collapse toggle */}
      <div style={{ padding: collapsed ? "16px 9px 14px" : "20px 16px 14px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, justifyContent: collapsed ? "center" : "flex-start" }}>
          <div style={{
            width:34, height:34, borderRadius:9, flexShrink:0,
            background:`linear-gradient(135deg, ${T.accent}, ${T.purple})`,
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:`0 4px 12px ${T.accent}40`,
            cursor:"pointer",
          }} onClick={() => setCollapsed(p => !p)} title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
            <Zap size={16} color="white" strokeWidth={2.5}/>
          </div>
          {!collapsed && (
            <div style={{ flex:1 }}>
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
          )}
          {!collapsed && (
            <button onClick={() => setCollapsed(true)}
              title="Collapse sidebar"
              style={{ background:"none", border:"none", cursor:"pointer", padding:3,
                color:"rgba(255,255,255,0.3)", borderRadius:4,
                display:"flex", alignItems:"center" }}>
              <ChevronRight size={13}/>
            </button>
          )}
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
          // Read anomaly + workflow issue counts from session for badge display
          const anomalyCount = (() => {
            try {
              const a = JSON.parse(sessionStorage.getItem("wz_anomalies")||"null");
              return a?.tables_with_anomalies || 0;
            } catch { return 0; }
          })();
          const cwfIssueCount = (() => {
            try {
              const h = JSON.parse(sessionStorage.getItem("wz_cwfHistory")||"[]");
              return h.filter(r => r.total_issues > 0).length;
            } catch { return 0; }
          })();
          const badgeCount =
            item.id === "approvals" ? pendingCount :
            item.id === "triage"    ? pendingCount :
            item.id === "brief"     ? anomalyCount :
            item.id === "workflows" ? cwfIssueCount :
            item.id === "activity"  ? (pendingCount + anomalyCount) :
            0;
          const hasBadge = badgeCount > 0;
          return (
            <button key={item.id}
              onClick={() => setActive(item.id)}
              title={collapsed ? `${item.label} (${item.shortcut})` : ""}
              style={{
                width:"100%", display:"flex", alignItems:"center",
                gap: collapsed ? 0 : 10,
                padding: collapsed ? "8px 0" : "8px 10px",
                justifyContent: collapsed ? "center" : "flex-start",
                borderRadius:7, border:"none",
                background: isActive
                  ? (T.navActiveBg || `${T.accent}18`)
                  : "transparent",
                color: isActive
                  ? (T.navActiveText || T.accent)
                  : (T.navInactiveText || "rgba(255,255,255,0.35)"),
                cursor:"pointer", marginBottom:1,
                transition:"all 0.12s", textAlign:"left",
                fontFamily:T.font, position:"relative",
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
              <div style={{ position:"relative", flexShrink:0 }}>
                <Icon size={14} strokeWidth={isActive?2.5:1.8}/>
                {hasBadge && collapsed && (
                  <div style={{ position:"absolute", top:-4, right:-4,
                    width:8, height:8, borderRadius:99, background:T.red }}/>
                )}
              </div>
              {!collapsed && (
                <>
                  <span style={{ fontSize:12, fontWeight:isActive?600:400, flex:1 }}>
                    {item.label}
                  </span>
                  {hasBadge && (
                    <span style={{
                      minWidth:18, height:18, borderRadius:99, padding:"0 5px",
                      background:T.red, color:"white", fontSize:9, fontWeight:700,
                      display:"flex", alignItems:"center", justifyContent:"center"
                    }}>{badgeCount}</span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div style={{ height:1, background:"rgba(255,255,255,0.06)", margin:"0 12px 8px" }}/>

      {/* Cmd+K hint */}
      {!collapsed && (
        <div style={{ padding:"0 8px 4px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:6,
            padding:"5px 10px", borderRadius:6,
            color:"rgba(255,255,255,0.22)", fontSize:10,
            cursor:"default" }}>
            <Search size={10}/>
            <span style={{ flex:1 }}>Search & navigate</span>
            <kbd style={{ fontSize:9, background:"rgba(255,255,255,0.08)",
              border:"1px solid rgba(255,255,255,0.12)",
              borderRadius:3, padding:"1px 4px", color:"rgba(255,255,255,0.3)" }}>
              ⌘K
            </kbd>
          </div>
        </div>
      )}

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
          {!collapsed && <span style={{ flex:1 }}>{THEMES[themeKey]?.name || "Theme"}</span>}
          {!collapsed && <ChevronDown size={12} style={{
            transform: showThemes ? "rotate(180deg)" : "rotate(0)",
            transition:"transform 0.2s"
          }}/>}
        </button>

        {showThemes && !collapsed && (
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
  const [checklist, setChecklist] = useLocal("wz_onboarding", {
    scanned:false, monitored:false, slack:false, workflow:false, triage:false
  });
  const [checklistDismissed, setChecklistDismissed] = useLocal("wz_onboarding_done", false);

  const allDone = Object.values(checklist).every(Boolean);
  const [brief,       setBrief]       = useSession("wz_brief", null);
  const [loading,     setLoading]     = React.useState(!brief);
  const [error,       setError]       = React.useState(null);
  const [lastFetch,   setLastFetch]   = useLocal("wz_briefTs", null);
  const [fixHistory,  setFixHistory]  = useLocal("wz_history", []);
  const [monTables,   setMonTables]   = useLocal("wz_monTables",
    [{ schema:"mws", table:"report", label:"mws.report", primary:true, checks:[] }]
  );
  const [tableResults,setTableResults]= useSession("wz_monResults", {});
  const [slackUrl]                    = useLocal("wz_slack", "");
  const [anomalies,    setAnomalies]   = useSession("wz_anomalies", null);
  const [anomalyLoading, setAnomalyLoading] = React.useState(false);

  const runAnomalyCheck = async () => {
    setAnomalyLoading(true);
    try {
      const res  = await fetch(`${API}/api/anomaly/check`);
      const data = await res.json();
      setAnomalies(data);
    } catch(e) { console.error(e); }
    setAnomalyLoading(false);
  };

  const buildBaselines = async () => {
    setAnomalyLoading(true);
    try {
      await fetch(`${API}/api/anomaly/baseline`, { method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({}) });
      await runAnomalyCheck();
    } catch(e) { console.error(e); }
    setAnomalyLoading(false);
  };

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
      setChecklist(p => ({...p, scanned:true}));
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

      {/* ── Onboarding checklist ── */}
      {!checklistDismissed && (
        <Card style={{ padding:"18px 22px", marginBottom:20,
          borderColor: allDone ? `${T.green}40` : `${T.accent}30`,
          background: allDone ? `${T.green}05` : `${T.accent}04` }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              {allDone
                ? <CheckCircle size={15} color={T.green}/>
                : <Zap size={15} color={T.accent}/>}
              <span style={{ fontSize:13, fontWeight:700, color: allDone ? T.green : T.text }}>
                {allDone ? "You're all set! 🎉" : "Getting started with WiziAgent"}
              </span>
              <span style={{ fontSize:11, color:T.muted }}>
                {Object.values(checklist).filter(Boolean).length}/{Object.values(checklist).length} done
              </span>
            </div>
            <button onClick={()=>setChecklistDismissed(true)}
              style={{ background:"none", border:"none", cursor:"pointer",
                color:T.muted, fontSize:14 }}>×</button>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {[
              { key:"scanned",   label:"Run your first scan",          desc:"Click Refresh to scan mws.report",          tab:"brief",     done:checklist.scanned },
              { key:"monitored", label:"Add a table to Monitor",       desc:"Go to Monitor → Add Table",                  tab:"monitor",   done:checklist.monitored },
              { key:"slack",     label:"Set up Slack notifications",   desc:"Go to Configure → Slack Notifications",     tab:"config",    done:checklist.slack },
              { key:"workflow",  label:"Schedule your first workflow", desc:"Go to Workflows → New Workflow",            tab:"workflows", done:checklist.workflow },
              { key:"triage",    label:"Triage an issue",              desc:"Go to Triage → Scan → fix an issue",        tab:"triage",    done:checklist.triage },
            ].map(step => (
              <div key={step.key} style={{ display:"flex", alignItems:"center", gap:10,
                padding:"7px 10px", borderRadius:7, cursor: step.done ? "default" : "pointer",
                background: step.done ? `${T.green}08` : T.surface,
                border:`1px solid ${step.done ? T.green+"30" : T.border}`,
                opacity: step.done ? 0.7 : 1,
              }}
                onClick={() => { if (!step.done) onNavigate(step.tab); }}>
                <div style={{ width:18, height:18, borderRadius:99, flexShrink:0,
                  background: step.done ? T.green : T.border,
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {step.done
                    ? <Check size={10} color="white"/>
                    : <span style={{ width:6, height:6, borderRadius:99,
                        background:"white", display:"block" }}/>}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:600,
                    color: step.done ? T.green : T.text,
                    textDecoration: step.done ? "line-through" : "none" }}>
                    {step.label}
                  </div>
                  {!step.done && (
                    <div style={{ fontSize:10, color:T.muted }}>{step.desc}</div>
                  )}
                </div>
                {!step.done && <ArrowRight size={11} color={T.muted}/>}
                {step.done && (
                  <button onClick={e=>{e.stopPropagation(); setChecklist(p=>({...p,[step.key]:false}));}}
                    style={{ background:"none", border:"none", cursor:"pointer",
                      fontSize:10, color:T.dim }}>undo</button>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

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

            {/* Anomaly Detection */}
            <Card style={{ padding:"16px 20px",
              borderColor: anomalies?.tables_with_anomalies > 0 ? `${T.orange}40` : `${T.purple}20`,
              background: anomalies?.tables_with_anomalies > 0 ? `${T.orange}04` : `${T.purple}03` }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                <div style={{ fontSize:11, fontWeight:700, color:T.muted,
                  textTransform:"uppercase", letterSpacing:"0.06em" }}>
                  Anomaly Detection
                </div>
                <div style={{ display:"flex", gap:6 }}>
                  {!anomalies && (
                    <Btn size="sm" variant="ghost" onClick={buildBaselines} disabled={anomalyLoading}
                      style={{ fontSize:10, color:T.purple, borderColor:`${T.purple}40` }}>
                      {anomalyLoading ? <Spinner size={10}/> : null}
                      {anomalyLoading ? "Building…" : "Build Baselines"}
                    </Btn>
                  )}
                  {anomalies && (
                    <Btn size="sm" variant="ghost" onClick={runAnomalyCheck} disabled={anomalyLoading}
                      style={{ fontSize:10 }}>
                      {anomalyLoading ? <Spinner size={10}/> : <RefreshCw size={10}/>}
                      Re-check
                    </Btn>
                  )}
                </div>
              </div>

              {!anomalies && !anomalyLoading && (
                <div style={{ fontSize:11, color:T.dim }}>
                  No baselines yet. Click "Build Baselines" to profile all tables and enable statistical anomaly detection.
                </div>
              )}
              {anomalyLoading && !anomalies && (
                <div style={{ fontSize:11, color:T.muted, display:"flex", alignItems:"center", gap:6 }}>
                  <Spinner size={11}/> Profiling tables…
                </div>
              )}
              {anomalies && (
                <>
                  {anomalies.tables_with_anomalies === 0 ? (
                    <div style={{ fontSize:12, color:T.green, display:"flex", alignItems:"center", gap:6 }}>
                      <CheckCircle size={13} color={T.green}/>
                      All {anomalies.tables_checked} table(s) within normal range
                    </div>
                  ) : (
                    <>
                      {anomalies.summary && (
                        <div style={{ fontSize:12, color:T.text2, marginBottom:10,
                          padding:"8px 12px", borderRadius:6,
                          background:`${T.orange}08`, border:`1px solid ${T.orange}20` }}>
                          {anomalies.summary}
                        </div>
                      )}
                      {anomalies.anomalies?.map((ta, i) => (
                        <div key={i} style={{ marginBottom:8 }}>
                          <div style={{ fontSize:11, fontWeight:600, color:T.text,
                            fontFamily:"monospace", marginBottom:4 }}>{ta.table}</div>
                          {ta.anomalies?.map((a, j) => (
                            <div key={j} style={{ display:"flex", alignItems:"center", gap:8,
                              padding:"5px 10px", borderRadius:5, marginBottom:3,
                              background:`${T.orange}08`, border:`1px solid ${T.orange}20` }}>
                              <Badge label={a.severity}
                                color={{critical:T.red,high:T.orange,medium:T.yellow}[a.severity]||T.muted}/>
                              <span style={{ fontSize:11, color:T.text, flex:1 }}>
                                {a.column === "_row_count"
                                  ? `Row count ${a.type==="row_count_spike"?"spike":"drop"}: ${a.baseline_value?.toLocaleString()} → ${a.current_value?.toLocaleString()}`
                                  : a.type === "null_rate_increase"
                                    ? `NULLs in \`${a.column}\` up ${a.deviation_pct}pp (${a.baseline_value}% → ${a.current_value}%)`
                                    : `${a.type} on \`${a.column}\``}
                              </span>
                              <span style={{ fontSize:10, fontFamily:"monospace", color:T.orange }}>
                                +{a.deviation_pct}%
                              </span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </>
                  )}
                  <div style={{ fontSize:9, color:T.dim, marginTop:6 }}>
                    Last checked: {new Date(anomalies.checked_at).toLocaleTimeString()}
                    {" · "}{anomalies.tables_checked} table(s) checked
                  </div>
                </>
              )}
            </Card>

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
  const dbSchema = useSchema();
  const [selectedTable, setSelectedTable] = React.useState("mws.report");
  const [tableList,     setTableList]     = React.useState([]);
  const [triageResult, setTriageResult] = useSession("wz_triage", null);
  const [loading,      setLoading]      = React.useState(false);

  // Load table list for selector
  React.useEffect(() => {
    fetch(`${API}/api/tables`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTableList(data.map(t => `${t.table_schema}.${t.table_name}`));
        }
      }).catch(() => {});
  }, []);
  const [dryRuns,      setDryRuns]      = useSession("wz_dryRuns", {});
  const [fixResults,   setFixResults]   = useSession("wz_fixResults", {});
  const [fixing,       setFixing]       = React.useState({});
  const [expanded,     setExpanded]     = useSession("wz_expanded", {});
  const [log,          setLog]          = useSession("wz_triageLog", []);
  const [agentRunning, setAgentRunning] = React.useState(false);
  const [agentResult,  setAgentResult]  = useSession("wz_agentResult", null);
  const [scanTs,       setScanTs]       = useSession("wz_triageScanTs", null);
  const [fixHistory,   setFixHistory]   = useLocal("wz_history", []);

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

  // Build scan URL based on selected table
  const fetchTriage = async (table) => {
    if (table === "mws.report") {
      const res  = await fetch(`${API}/api/report/triage`);
      return res.json();
    }
    // Generic table agent for any other table
    const [schema, tbl] = table.includes(".") ? table.split(".") : ["mws", table];
    const res = await fetch(`${API}/api/wizi-agent/run-table`, {
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ schema, table:tbl, dry_run:true })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    // Normalise run-table response → triage shape
    return {
      table,
      total_rows: data.total_rows || 0,
      scanned_at: new Date().toISOString(),
      issues: (data.alerts || []).map((a, i) => ({
        id: a.id || `CHK-${i+1}`,
        title: a.check || a.type || "Data quality issue",
        severity: a.severity || "medium",
        count: a.count || 0,
        description: a.description || a.msg || "",
        fix_action: a.fix_sql ? "custom_fix" : null,
        fix_sql: a.fix_sql || null,
        samples: a.samples || [],
        breakdown: [],
      })),
      clean: !data.alerts?.length,
    };
  };

  const scan = async () => {
    setLoading(true);
    try {
      const data = await fetchTriage(selectedTable);
      if (data.error) throw new Error(data.error);
      setTriageResult(data);
      setScanTs(new Date().toISOString());
      setFixResults({}); setDryRuns({});
      addLog(`Scanned ${selectedTable} — ${data.total_rows?.toLocaleString()} rows, ${data.issues?.length||0} issue(s)`, "info");
    } catch(e) { addLog(`Scan failed: ${e.message}`, "error"); }
    setLoading(false);
  };

  const reScan = async () => {
    try {
      const data = await fetchTriage(selectedTable);
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
      try { const c=JSON.parse(localStorage.getItem("wz_onboarding")||"{}"); localStorage.setItem("wz_onboarding",JSON.stringify({...c,triage:true})); } catch {}
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

  const [showLibrary, setShowLibrary] = React.useState(false);
  const [libraryAdded, setLibraryAdded] = React.useState({});
  const [explanations, setExplanations] = React.useState({}); // { [issue.id]: { loading, text } }

  const explainIssue = async (issue) => {
    setExplanations(p => ({...p, [issue.id]: { loading:true, text:null }}));
    try {
      const res = await fetch(`${API}/api/ai/chat`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          system:"You are WiziAgent explaining data quality issues to a junior QA engineer. Be clear, concise, and practical. Avoid jargon. Explain: what the issue is, why it matters, whether it is safe to fix, and what the fix does. Keep it under 5 sentences.",
          messages:[{ role:"user", content:
            `Explain this issue found in ${selectedTable}:
` +
            `ID: ${issue.id}
Title: ${issue.title}
Description: ${issue.description}
` +
            `Severity: ${issue.severity}
Rows affected: ${issue.count}
` +
            (issue.fix_action ? `Fix action available: ${issue.fix_action}` : "No automatic fix available — informational only.")
          }],
          max_tokens:200
        })
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "Could not generate explanation.";
      setExplanations(p => ({...p, [issue.id]: { loading:false, text }}));
    } catch(e) {
      setExplanations(p => ({...p, [issue.id]: { loading:false, text:`Error: ${e.message}` }}));
    }
  };

  const TEST_LIBRARY = [
    { id:"LIB-NULL",    icon:"🕳",  label:"Missing values",         desc:"Find columns with unexpected NULLs",                 check:"null_check",   severity:"high" },
    { id:"LIB-DUPE",    icon:"📋",  label:"Duplicate records",      desc:"Find rows with the same primary key",                check:"dupe_check",   severity:"high" },
    { id:"LIB-FRESH",   icon:"📅",  label:"Data freshness",         desc:"Check that data arrived within the last 24 hours",   check:"freshness",    severity:"high" },
    { id:"LIB-ROWDROP", icon:"📉",  label:"Unexpected row drop",    desc:"Alert if row count drops more than 20% vs baseline", check:"row_count",    severity:"critical" },
    { id:"LIB-STATUS",  icon:"🚦",  label:"Invalid status values",  desc:"Find rows with values outside expected set",         check:"enum_check",   severity:"medium" },
    { id:"LIB-STUCK",   icon:"⏳",  label:"Stuck pending rows",     desc:"Find rows stuck in 'pending' for more than 4 hours", check:"stale_pending",severity:"high" },
    { id:"LIB-DATES",   icon:"📆",  label:"Date anomalies",         desc:"Find rows where end date is before start date",      check:"date_anomaly", severity:"medium" },
    { id:"LIB-RETRIES", icon:"🔁",  label:"High retry count",       desc:"Find rows that have been retried more than 3 times", check:"high_retries", severity:"medium" },
  ];

  const addFromLibrary = (test) => {
    setLibraryAdded(p => ({...p, [test.id]: true}));
    scan();
    setShowLibrary(false);
  };

  // ── Data preview ──────────────────────────────────────────────────────────
  const [preview,        setPreview]        = React.useState(null);
  const [previewLoading, setPreviewLoading] = React.useState(false);
  const [previewLimit,   setPreviewLimit]   = React.useState(20);
  const [previewFilter,  setPreviewFilter]  = React.useState("all"); // all | issues_only

  const loadPreview = async (limit=20) => {
    setPreviewLoading(true);
    const [schema, tbl] = selectedTable.includes(".")
      ? selectedTable.split(".") : ["mws", selectedTable];
    try {
      const res  = await fetch(`${API}/api/preview?schema=${schema}&table=${tbl}&limit=${limit}`);
      const data = await res.json();
      setPreview(data);
    } catch(e) { setPreview({ error: e.message }); }
    setPreviewLoading(false);
  };

  const [activeView, setActiveView] = React.useState("issues"); // issues | data | log

  const issues     = triageResult?.issues || [];
  const SEV_COLOR  = { critical:T.red, high:T.orange, medium:T.yellow, low:T.cyan };
  const lowRiskCount = issues.filter(i =>
    i.fix_action==="recopy" || i.fix_action==="redrive_copy"
  ).length;

  const SEV_ORDER = { critical:0, high:1, medium:2, low:3 };
  const sortedIssues = [...issues].sort((a,b)=>(SEV_ORDER[a.severity]||9)-(SEV_ORDER[b.severity]||9));
  const critCount    = issues.filter(i=>i.severity==="critical").length;
  const highCount    = issues.filter(i=>i.severity==="high").length;
  const fixableCount = issues.filter(i=>i.fix_action).length;

  return (
    <div className="fade-in" style={{ display:"flex", flexDirection:"column",
      height:"calc(100vh - 2px)", overflow:"hidden" }}>

      {/* ── Top bar ────────────────────────────────────────────────────────── */}
      <div style={{ padding:"20px 28px 0", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
          {/* Title + help */}
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ fontSize:20, fontWeight:700, color:T.text, letterSpacing:"-0.02em" }}>
              Triage
            </div>
            <HelpTip>
              <strong>Triage</strong> scans a table for data quality issues and lets you fix them safely.<br/><br/>
              <strong>Scan</strong> — run checks (nulls, dupes, freshness, pipeline errors).<br/>
              <strong>Dry run</strong> — preview how many rows would change before committing.<br/>
              <strong>Fix</strong> — execute the fix. Always dry-run first if unsure.<br/>
              <strong>WiziAgent</strong> — auto-classifies and fixes low-risk issues automatically.
            </HelpTip>
          </div>

          {/* Table selector */}
          <select value={selectedTable} onChange={e => {
              setSelectedTable(e.target.value);
              setTriageResult(null); setFixResults({}); setDryRuns({});
              setPreview(null); setActiveView("issues");
            }}
            style={{ fontSize:12, padding:"6px 12px", borderRadius:7,
              border:`1px solid ${T.border}`, background:T.surface, color:T.text,
              fontFamily:"monospace", flex:"0 0 auto", maxWidth:260 }}>
            <option value="mws.report">mws.report</option>
            {tableList.filter(t=>t!=="mws.report").map(t=>(
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          {/* Status pills */}
          {triageResult && (
            <div style={{ display:"flex", gap:6, alignItems:"center" }}>
              <span style={{ fontSize:11, color:T.muted }}>
                {triageResult.total_rows?.toLocaleString()} rows
              </span>
              {critCount > 0 && (
                <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px",
                  borderRadius:5, background:`${T.red}15`, color:T.red }}>
                  {critCount} critical
                </span>
              )}
              {highCount > 0 && (
                <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px",
                  borderRadius:5, background:`${T.orange}15`, color:T.orange }}>
                  {highCount} high
                </span>
              )}
              {issues.length === 0 && (
                <span style={{ fontSize:11, fontWeight:600, padding:"2px 8px",
                  borderRadius:5, background:`${T.green}15`, color:T.green }}>
                  ✓ Clean
                </span>
              )}
            </div>
          )}

          {/* Actions */}
          <div style={{ display:"flex", gap:6, marginLeft:"auto", alignItems:"center" }}>
            {lowRiskCount > 1 && triageResult && selectedTable==="mws.report" && (
              <Btn onClick={batchApprove} variant="ghost" size="sm">
                <CheckCircle size={11}/> Batch Fix ({lowRiskCount})
              </Btn>
            )}
            <Btn onClick={()=>setShowLibrary(p=>!p)} size="sm" variant="ghost"
              style={{ color:T.purple, borderColor:`${T.purple}30` }}>
              <Plus size={11}/> Add Check
            </Btn>
            <Btn onClick={scan} disabled={loading} variant="ghost" size="sm">
              {loading ? <Spinner size={11}/> : <RefreshCw size={11}/>} Scan
            </Btn>
            {selectedTable==="mws.report" && (
              <Btn onClick={runWiziAgent} disabled={agentRunning} size="sm"
                style={{ background:agentRunning?T.border:`linear-gradient(135deg,${T.accent},${T.purple})`,
                  color:"white", border:"none" }}>
                {agentRunning?<Spinner size={11} color="white"/>:<Zap size={11}/>}
                {agentRunning?"Running…":"✨ WiziAgent"}
              </Btn>
            )}
          </div>
        </div>

        {/* ── View tabs ──────────────────────────────────────────────────────── */}
        <div style={{ display:"flex", gap:0, borderBottom:`1px solid ${T.border}` }}>
          {[
            { id:"issues", label:`Issues${issues.length>0?" ("+issues.length+")":""}` },
            { id:"data",   label:"Data Preview" },
            { id:"log",    label:`Log${log.length>0?" ("+log.length+")":""}` },
          ].map(tab => (
            <button key={tab.id} onClick={()=>{
                setActiveView(tab.id);
                if(tab.id==="data") loadPreview(previewLimit);
              }}
              style={{ padding:"8px 18px", fontSize:12, fontWeight:activeView===tab.id?600:400,
                color:activeView===tab.id?T.accent:T.muted,
                background:"none", border:"none", cursor:"pointer",
                borderBottom:activeView===tab.id?`2px solid ${T.accent}`:"2px solid transparent",
                marginBottom:-1, transition:"all 0.12s" }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <div style={{ flex:1, overflowY:"auto", padding:"16px 28px 28px" }}>

        {/* ── WiziAgent approval gate ──────────────────────────────────────── */}
        {agentResult?.status==="awaiting_approval" && agentResult.approval_status==="pending" && (
          <Card style={{ padding:"16px 20px", marginBottom:14,
            borderColor:`${T.yellow}50`, background:`${T.yellow}06` }}>
            <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
              <Lock size={18} color={T.yellow} style={{ flexShrink:0, marginTop:2 }}/>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:700, color:T.yellow, marginBottom:4 }}>
                  WiziAgent — Approval Required
                </div>
                <div style={{ fontSize:12, color:T.muted, marginBottom:12 }}>
                  {agentResult.classification?.risk_reason||"High-risk fix detected"}
                  <span style={{ fontFamily:T.monoFont, color:T.cyan, fontSize:11, marginLeft:8 }}>
                    token: {agentResult.approval_token}
                  </span>
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <Btn onClick={()=>approveAgent("approve")} variant="success" size="sm">
                    <Check size={11}/> Approve Fix
                  </Btn>
                  <Btn onClick={()=>approveAgent("reject")} variant="danger" size="sm">
                    <X size={11}/> Reject
                  </Btn>
                  <span style={{ fontSize:11, color:T.dim, alignSelf:"center" }}>Times out in 10 min</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* ── WiziAgent result banner ──────────────────────────────────────── */}
        {agentResult && agentResult.status!=="awaiting_approval" && (
          <Card style={{ padding:"12px 16px", marginBottom:14,
            borderColor:agentResult.status==="fixed"?`${T.green}40`:`${T.yellow}40`,
            background:agentResult.status==="fixed"?`${T.green}06`:`${T.yellow}06` }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <Zap size={13} color={agentResult.status==="fixed"?T.green:T.yellow}/>
              <span style={{ fontSize:12, fontWeight:700,
                color:agentResult.status==="fixed"?T.green:T.yellow }}>
                WiziAgent — {agentResult.status?.toUpperCase()}
              </span>
              {(agentResult.fix_results||[]).map((r,i)=>(
                <span key={i} style={{ fontSize:11, color:T.green, fontFamily:T.monoFont }}>
                  · {r.action}: {r.rows_affected} rows
                </span>
              ))}
              <button onClick={()=>setAgentResult(null)}
                style={{ marginLeft:"auto", background:"none", border:"none",
                  color:T.muted, cursor:"pointer" }}><X size={12}/></button>
            </div>
          </Card>
        )}

        {/* ── Check Library panel ──────────────────────────────────────────── */}
        {showLibrary && (
          <Card style={{ padding:"18px 20px", marginBottom:14,
            borderColor:`${T.purple}30`, background:`${T.purple}04` }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:T.text }}>Check Library</div>
                <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>Click a check to run it — no SQL needed.</div>
              </div>
              <button onClick={()=>setShowLibrary(false)}
                style={{ background:"none", border:"none", cursor:"pointer", color:T.muted, fontSize:16 }}>×</button>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:7 }}>
              {TEST_LIBRARY.map(test => {
                const done = libraryAdded[test.id];
                return (
                  <button key={test.id} onClick={()=>addFromLibrary(test)} disabled={done}
                    style={{ display:"flex", alignItems:"flex-start", gap:8, padding:"10px 12px",
                      borderRadius:8, textAlign:"left",
                      border:`1px solid ${done?T.green+"40":T.border}`,
                      background:done?`${T.green}06`:T.surface,
                      cursor:done?"default":"pointer", transition:"all 0.12s" }}
                    onMouseEnter={e=>{if(!done){e.currentTarget.style.borderColor=T.purple; e.currentTarget.style.background=`${T.purple}06`;}}}
                    onMouseLeave={e=>{if(!done){e.currentTarget.style.borderColor=T.border; e.currentTarget.style.background=T.surface;}}}>
                    <span style={{ fontSize:16, flexShrink:0 }}>{test.icon}</span>
                    <div>
                      <div style={{ fontSize:11, fontWeight:600, color:done?T.green:T.text, marginBottom:2 }}>
                        {done?"✓ ":""}{test.label}
                      </div>
                      <div style={{ fontSize:10, color:T.muted, lineHeight:1.4 }}>{test.desc}</div>
                      <Badge label={test.severity} color={{critical:T.red,high:T.orange,medium:T.yellow}[test.severity]||T.muted}
                        style={{ marginTop:4 }}/>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        )}

        {/* ── From Workflows banner ────────────────────────────────────────── */}
        {(initialIssues||[]).filter(i=>!i._dismissed).length > 0 && (
          <Card style={{ padding:"12px 16px", marginBottom:14,
            borderColor:`${T.purple}30`, background:`${T.purple}04` }}>
            <div style={{ fontSize:11, fontWeight:700, color:T.purple, marginBottom:8,
              textTransform:"uppercase", letterSpacing:"0.06em" }}>
              From Workflows ({(initialIssues||[]).filter(i=>!i._dismissed).length})
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {(initialIssues||[]).filter(i=>!i._dismissed).map((iss,i)=>(
                <div key={iss.id||i} style={{ display:"flex", alignItems:"center", gap:8,
                  padding:"6px 10px", borderRadius:6, background:T.surface, border:`1px solid ${T.border}` }}>
                  <Badge label={iss.severity||"medium"}
                    color={{critical:T.red,high:T.orange,medium:T.yellow,low:T.cyan}[iss.severity]||T.muted}/>
                  <div>
                    <div style={{ fontSize:11, fontWeight:600, color:T.text }}>{iss.title}</div>
                    {iss.table && <div style={{ fontSize:10, color:T.muted, fontFamily:"monospace" }}>{iss.table}</div>}
                  </div>
                  <Btn size="sm" variant="ghost" onClick={()=>{ setSelectedTable(iss.table||selectedTable); scan(); }}>
                    Scan table
                  </Btn>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* ISSUES VIEW                                                        */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {activeView==="issues" && (
          <>
            {!triageResult && !loading && (
              <EmptyState icon={Shield} title="No scan yet"
                desc={selectedTable==="mws.report"?"10 checks: pipeline health + data quality":`Generic quality checks on ${selectedTable}`}
                action={<Btn onClick={scan} size="sm"><RefreshCw size={11}/> Scan Now</Btn>}/>
            )}
            {loading && (
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center",
                padding:"60px 0", gap:10, color:T.muted }}>
                <Spinner size={18}/><span style={{ fontSize:14 }}>Scanning {selectedTable}…</span>
              </div>
            )}
            {!loading && triageResult && issues.length===0 && (
              <div style={{ textAlign:"center", padding:"48px 0" }}>
                <CheckCircle size={40} color={T.green} strokeWidth={1.2}
                  style={{ margin:"0 auto 12px", display:"block" }}/>
                <div style={{ fontSize:16, fontWeight:700, color:T.green }}>All clean</div>
                <div style={{ fontSize:13, color:T.muted, marginTop:4 }}>
                  {triageResult.total_rows?.toLocaleString()} rows — all {selectedTable==="mws.report"?"10":"quality"} checks passed
                </div>
              </div>
            )}

            {/* Issue cards — sorted by severity */}
            {sortedIssues.map(issue => {
              const color   = SEV_COLOR[issue.severity]||T.muted;
              const dr      = dryRuns[issue.id];
              const fr      = fixResults[issue.id];
              const isExp   = expanded[issue.id];
              const conf    = confidence(issue, dr);
              const isFixed = !!fr;

              return (
                <Card key={issue.id} style={{ marginBottom:10, overflow:"hidden",
                  borderLeft:`3px solid ${isFixed?T.green:color}` }}>

                  {/* ── Issue header ── */}
                  <div style={{ padding:"14px 18px" }}>
                    <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
                      {/* Severity indicator */}
                      <div style={{ width:36, height:36, borderRadius:8, flexShrink:0,
                        background:`${color}15`, display:"flex", alignItems:"center",
                        justifyContent:"center", marginTop:1 }}>
                        {isFixed
                          ? <CheckCircle size={16} color={T.green}/>
                          : <AlertTriangle size={16} color={color} strokeWidth={1.8}/>}
                      </div>

                      {/* Title + meta */}
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:4 }}>
                          <span style={{ fontSize:14, fontWeight:700,
                            color:isFixed?T.green:T.text }}>
                            {isFixed?"✓ Fixed — ":""}{issue.title}
                          </span>
                          <Badge label={issue.severity} color={color}/>
                          {!issue.fix_action && <Badge label="info only" color={T.purple}/>}
                          <span style={{ fontSize:10, color:T.dim, fontFamily:T.monoFont }}>{issue.id}</span>
                        </div>
                        <div style={{ fontSize:12, color:T.muted, lineHeight:1.5 }}>
                          {issue.description}
                        </div>

                        {/* Breakdown pills */}
                        {issue.breakdown?.length > 0 && (
                          <div style={{ display:"flex", gap:5, marginTop:8, flexWrap:"wrap" }}>
                            {issue.breakdown.map(b=>(
                              <span key={b.status} style={{ fontSize:11, padding:"2px 8px",
                                background:`${color}10`, color, borderRadius:5, fontFamily:T.monoFont,
                                border:`1px solid ${color}25` }}>
                                {b.status}: <strong>{b.count?.toLocaleString()}</strong>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Row count + actions */}
                      <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end",
                        gap:8, flexShrink:0 }}>
                        <div style={{ textAlign:"right" }}>
                          <div style={{ fontSize:24, fontWeight:800, fontFamily:T.monoFont,
                            color:isFixed?T.green:color, lineHeight:1 }}>
                            {isFixed?`${fr.before}→${fr.after}`:issue.count.toLocaleString()}
                          </div>
                          <div style={{ fontSize:9, color:T.muted, textTransform:"uppercase",
                            letterSpacing:"0.05em" }}>{isFixed?"rows":"affected rows"}</div>
                        </div>

                        {/* Action buttons */}
                        <div style={{ display:"flex", gap:5, flexWrap:"wrap", justifyContent:"flex-end" }}>
                          {issue.samples?.length > 0 && (
                            <Btn size="sm" variant="muted"
                              onClick={()=>setExpanded(p=>({...p,[issue.id]:!p[issue.id]}))}>
                              <Eye size={10}/> {isExp?"Hide":"Samples"}
                            </Btn>
                          )}
                          <Btn size="sm" variant="ghost"
                            onClick={()=>{ setActiveView("data"); loadPreview(previewLimit); }}
                            style={{ fontSize:10 }}>
                            <Table size={10}/> View Data
                          </Btn>
                          {!isFixed && !dr && issue.fix_action && (
                            <Btn size="sm" variant="ghost" onClick={()=>dryRun(issue)}>
                              {dr==="loading"?<Spinner size={10}/>:null} Dry run
                            </Btn>
                          )}
                          {dr && dr!=="loading" && dr!=="error" && !isFixed && issue.fix_action && (
                            <Btn size="sm" variant="danger" onClick={()=>fix(issue)} disabled={fixing[issue.id]}>
                              {fixing[issue.id]?<Spinner size={10} color="white"/>:null}
                              Fix {dr.rows_affected?.toLocaleString()} rows
                            </Btn>
                          )}
                          {dr==="loading" && <Spinner size={13}/>}
                          <Btn size="sm" variant="ghost"
                            onClick={()=>explainIssue(issue)}
                            disabled={explanations[issue.id]?.loading}
                            style={{ fontSize:10, color:T.purple, borderColor:`${T.purple}30` }}>
                            {explanations[issue.id]?.loading?<Spinner size={10}/>:"💬"}
                            {explanations[issue.id]?.loading?"Asking…":"Explain"}
                          </Btn>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── Dry run preview ── */}
                  {dr && dr!=="loading" && dr!=="error" && !isFixed && (
                    <div style={{ padding:"10px 18px", borderTop:`1px solid ${T.border}`,
                      background:`${T.accent}04`, display:"flex", alignItems:"center", gap:20 }}>
                      <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                        <div style={{ textAlign:"center" }}>
                          <div style={{ fontSize:18, fontWeight:700, fontFamily:T.monoFont,
                            color:T.text }}>{dr.before?.toLocaleString()}</div>
                          <div style={{ fontSize:9, color:T.muted, textTransform:"uppercase" }}>before</div>
                        </div>
                        <ArrowRight size={13} color={T.muted}/>
                        <div style={{ textAlign:"center" }}>
                          <div style={{ fontSize:18, fontWeight:700, fontFamily:T.monoFont,
                            color:T.green }}>{(dr.before-dr.rows_affected)?.toLocaleString()}</div>
                          <div style={{ fontSize:9, color:T.muted, textTransform:"uppercase" }}>after</div>
                        </div>
                        <span style={{ fontSize:12, fontWeight:700, padding:"2px 8px",
                          borderRadius:5, background:`${color}15`, color }}>
                          -{dr.rows_affected?.toLocaleString()} rows
                        </span>
                      </div>
                      {conf!==null && (
                        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:8 }}>
                          <div style={{ width:60, height:5, borderRadius:99, background:T.border, overflow:"hidden" }}>
                            <div style={{ height:"100%", borderRadius:99, width:`${conf}%`,
                              background:conf>=90?T.green:conf>=75?T.yellow:T.orange }}/>
                          </div>
                          <span style={{ fontSize:12, fontWeight:600,
                            color:conf>=90?T.green:conf>=75?T.yellow:T.orange }}>
                            {conf}% safe to fix
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── Sample rows ── */}
                  {isExp && issue.samples?.length > 0 && (
                    <div style={{ borderTop:`1px solid ${T.border}` }}>
                      <div style={{ padding:"8px 18px", background:`${T.accent}04`,
                        display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontSize:11, fontWeight:600, color:T.muted }}>
                          Sample rows ({issue.samples.length} shown)
                        </span>
                        <Btn size="sm" variant="ghost"
                          onClick={()=>{ setActiveView("data"); loadPreview(previewLimit); }}
                          style={{ fontSize:10 }}>
                          View full table →
                        </Btn>
                      </div>
                      <div style={{ overflowX:"auto", padding:"0 18px 12px" }}>
                        <table style={{ borderCollapse:"collapse", fontSize:11,
                          fontFamily:T.monoFont, width:"100%" }}>
                          <thead>
                            <tr>
                              {Object.keys(issue.samples[0]).map(k=>(
                                <th key={k} style={{ padding:"5px 12px", textAlign:"left",
                                  color:T.muted, fontWeight:600, fontSize:10,
                                  borderBottom:`1px solid ${T.border}`,
                                  textTransform:"uppercase", letterSpacing:"0.04em",
                                  whiteSpace:"nowrap" }}>{k}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {issue.samples.map((row,i)=>(
                              <tr key={i} style={{ borderBottom:`1px solid ${T.border}30` }}
                                onMouseEnter={e=>e.currentTarget.style.background=`${T.accent}06`}
                                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                                {Object.entries(row).map(([k,v],j)=>(
                                  <td key={j} style={{ padding:"6px 12px", whiteSpace:"nowrap",
                                    color:v===null?T.red:
                                      String(v).toLowerCase().includes("fail")||String(v).toLowerCase().includes("error")?T.orange:
                                      T.text2 }}>
                                    {v===null
                                      ? <span style={{ fontWeight:700, color:T.red }}>NULL</span>
                                      : String(v)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* ── AI Explanation ── */}
                  {explanations[issue.id]?.text && (
                    <div style={{ borderTop:`1px solid ${T.border}`, padding:"12px 18px",
                      background:`${T.purple}05` }}>
                      <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                        <div style={{ width:24, height:24, borderRadius:6, flexShrink:0,
                          background:`linear-gradient(135deg,${T.accent},${T.purple})`,
                          display:"flex", alignItems:"center", justifyContent:"center" }}>
                          <Zap size={10} color="white"/>
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:10, fontWeight:700, color:T.purple, marginBottom:4,
                            textTransform:"uppercase", letterSpacing:"0.05em" }}>WiziAgent Explanation</div>
                          <div style={{ fontSize:12, color:T.text2, lineHeight:1.65 }}>
                            {explanations[issue.id].text}
                          </div>
                        </div>
                        <button onClick={()=>setExplanations(p=>({...p,[issue.id]:null}))}
                          style={{ background:"none", border:"none", cursor:"pointer",
                            color:T.dim, fontSize:14 }}>×</button>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* DATA PREVIEW VIEW                                                  */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {activeView==="data" && (
          <div style={{ minHeight:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12, flexWrap:"wrap" }}>
              <span style={{ fontSize:13, fontWeight:600, color:T.text }}>
                {selectedTable}
              </span>
              <select value={previewLimit}
                onChange={e=>{ setPreviewLimit(Number(e.target.value)); loadPreview(Number(e.target.value)); }}
                style={{ fontSize:11, padding:"4px 8px", borderRadius:6,
                  border:`1px solid ${T.border}`, background:T.surface, color:T.text }}>
                <option value={20}>20 rows</option>
                <option value={50}>50 rows</option>
                <option value={100}>100 rows</option>
                <option value={200}>200 rows</option>
              </select>
              <Btn size="sm" variant="ghost" onClick={()=>loadPreview(previewLimit)}
                disabled={previewLoading}>
                {previewLoading?<Spinner size={10}/>:<RefreshCw size={10}/>} Refresh
              </Btn>
              <Btn size="sm" variant="ghost"
                onClick={()=>{ const [s,t]=selectedTable.split("."); window.open(`${API}/api/preview?schema=${s}&table=${t}&limit=200`,"_blank"); }}
                style={{ fontSize:10 }}>
                Open raw JSON ↗
              </Btn>
              {preview?.rows?.length > 0 && (
                <span style={{ fontSize:11, color:T.muted, marginLeft:"auto" }}>
                  {preview.rows.length} rows · {preview.columns?.length} columns
                </span>
              )}
            </div>

            {previewLoading && (
              <div style={{ display:"flex", alignItems:"center", gap:10,
                padding:"40px 0", justifyContent:"center", color:T.muted }}>
                <Spinner size={16}/><span>Loading data…</span>
              </div>
            )}
            {!previewLoading && preview?.error && (
              <div style={{ padding:"20px", color:T.red, fontSize:13 }}>
                Error: {preview.error}
              </div>
            )}
            {!previewLoading && preview?.rows?.length > 0 && (
              <div style={{ overflowX:"auto", overflowY:"auto",
                maxHeight:"calc(100vh - 280px)", borderRadius:8,
                border:`1px solid ${T.border}` }}>
                <table style={{ borderCollapse:"collapse", fontSize:11,
                  fontFamily:T.monoFont, width:"100%", minWidth:600 }}>
                  <thead>
                    <tr style={{ background:`${T.accent}08` }}>
                      {(preview.columns||Object.keys(preview.rows[0])).map(col=>(
                        <th key={col} style={{ padding:"8px 14px", textAlign:"left",
                          fontWeight:700, fontSize:10, color:T.muted,
                          borderBottom:`1px solid ${T.border}`, whiteSpace:"nowrap",
                          textTransform:"uppercase", letterSpacing:"0.04em",
                          position:"sticky", top:0, background:"#FAFBFF" }}>
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.rows.map((row,i)=>(
                      <tr key={i}
                        onMouseEnter={e=>e.currentTarget.style.background=`${T.accent}06`}
                        onMouseLeave={e=>e.currentTarget.style.background=i%2===0?"transparent":"#FAFBFF"}>
                        {(preview.columns||Object.keys(row)).map((col,j)=>{
                          const v = row[col];
                          const isNull = v===null||v===undefined;
                          const isBad  = !isNull && (
                            String(v).toLowerCase()==="failed"||
                            String(v).toLowerCase()==="error"||
                            String(v)==="NOT_REPLICATED"||
                            String(v)==="pending"
                          );
                          return (
                            <td key={j} style={{ padding:"6px 14px", whiteSpace:"nowrap",
                              borderBottom:`1px solid ${T.border}20`,
                              color:isNull?T.red:isBad?T.orange:T.text2,
                              background:i%2===1?"#FAFBFF":"transparent" }}>
                              {isNull
                                ? <span style={{ fontWeight:700, color:T.red, fontSize:10 }}>NULL</span>
                                : String(v)}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {!previewLoading && preview?.rows?.length === 0 && (
              <div style={{ textAlign:"center", padding:"48px 0", color:T.muted, fontSize:13 }}>
                Query returned 0 rows
              </div>
            )}
            {!previewLoading && !preview && (
              <div style={{ textAlign:"center", padding:"48px 0", color:T.muted }}>
                <Spinner size={24} style={{ margin:"0 auto 10px", display:"block" }}/>
                <div style={{ fontSize:13 }}>Loading…</div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* LOG VIEW                                                           */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {activeView==="log" && (
          <div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
              <span style={{ fontSize:13, fontWeight:600, color:T.text }}>Activity Log</span>
              {log.length > 0 && (
                <Btn size="sm" variant="ghost" onClick={()=>setLog([])}>Clear</Btn>
              )}
            </div>
            {log.length===0
              ? <div style={{ textAlign:"center", padding:"48px 0", color:T.muted, fontSize:13 }}>
                  No activity yet — run a scan to get started.
                </div>
              : <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                  {[...log].reverse().map((l,i)=>(
                    <div key={i} style={{ display:"flex", gap:12, padding:"6px 12px",
                      borderRadius:6, background:i===0?`${T.accent}05`:"transparent",
                      alignItems:"flex-start" }}>
                      <span style={{ fontSize:10, color:T.dim, flexShrink:0, marginTop:1,
                        fontFamily:T.monoFont }}>{l.ts}</span>
                      <span style={{ fontSize:12, lineHeight:1.5,
                        color:l.level==="success"?T.green:l.level==="error"?T.red:
                          l.level==="warning"?T.orange:T.text2 }}>
                        {l.msg}
                      </span>
                    </div>
                  ))}
                </div>
            }
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Notification Center ──────────────────────────────────────────────────────
// Persistent unified activity feed — every WiziAgent action, fix, gate, Slack msg
function ApprovalQueueTab({ onNavigate }) {
  const T = useT();
  const [sopResult]    = useSession("wz_sopResult", null);
  const [agentResult]  = useSession("wz_agentResult", null);
  const [triageResult] = useSession("wz_triage", null);

  const approvals = React.useMemo(() => {
    const items = [];
    if (sopResult) {
      for (let i=1; i<=5; i++) {
        const token = sopResult[`gate${i}_token`];
        const dec   = sopResult[`gate${i}_decision`];
        if (token && dec==="pending") {
          items.push({
            id:`sop-gate${i}`, type:"sop_gate",
            title:`Ads SOP — Gate ${i}`,
            detail:["Pause Mage Jobs","Data Available","Proceed with Refreshes",
                    "Run Product Summary","Resume Mage & GDS Copies"][i-1],
            token, source:"workflows", urgency:"high",
          });
        }
      }
    }
    if (agentResult?.status==="awaiting_approval" && agentResult?.approval_status==="pending") {
      items.push({
        id:"wizi-approval", type:"wizi_agent",
        title:"WiziAgent — Fix Approval",
        detail:agentResult.classification?.risk_reason||"High-risk fix awaiting approval",
        token:agentResult.approval_token, source:"triage", urgency:"critical",
      });
    }
    if (triageResult?.issues?.length > 0) {
      const dryRuns    = (() => { try { return JSON.parse(sessionStorage.getItem("wz_dryRuns")||"{}"); } catch { return {}; } })();
      const fixResults = (() => { try { return JSON.parse(sessionStorage.getItem("wz_fixResults")||"{}"); } catch { return {}; } })();
      triageResult.issues.forEach(issue => {
        const dr = dryRuns[issue.id];
        if (dr && dr!=="loading" && dr!=="error" && !fixResults[issue.id]) {
          items.push({
            id:`triage-${issue.id}`, type:"triage_fix",
            title:`Triage Fix Ready — ${issue.title}`,
            detail:`${dr.rows_affected} rows · ${issue.fix_action}`,
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
        <div style={{ fontSize:22, fontWeight:700, color:T.text, letterSpacing:"-0.02em" }}>Approval Queue</div>
        <div style={{ fontSize:13, color:T.muted, marginTop:3 }}>Pending approvals across workflows, triage fixes, and WiziAgent runs</div>
      </div>
      {approvals.length===0
        ? <EmptyState icon={CheckCircle} title="Queue is clear" desc="No approvals pending — all gates resolved"/>
        : (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {approvals.map(item=>(
              <Card key={item.id} style={{ padding:"16px 20px",
                borderColor:`${urgencyColor[item.urgency]||T.muted}40`,
                background:`${urgencyColor[item.urgency]||T.muted}06` }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:36, height:36, borderRadius:9, flexShrink:0,
                    background:`${urgencyColor[item.urgency]||T.muted}15`,
                    display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>
                    {item.type==="sop_gate"?"🔒":item.type==="wizi_agent"?"⚡":"🔧"}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                      <span style={{ fontSize:13, fontWeight:700, color:T.text }}>{item.title}</span>
                      <Badge label={item.urgency} color={urgencyColor[item.urgency]||T.muted}/>
                    </div>
                    <div style={{ fontSize:11, color:T.muted }}>{item.detail}</div>
                    {item.token && (
                      <div style={{ fontSize:10, color:T.dim, fontFamily:T.monoFont, marginTop:2 }}>
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

function ActivityTab({ onNavigate }) {
  const T = useT();
  const [activeView,   setActiveView]   = React.useState("alerts");
  const [history,      setHistory]      = useLocal("wz_history", []);
  const [filter,       setFilter]       = React.useState("all");
  const [search,       setSearch]       = React.useState("");
  const [insight,      setInsight]      = React.useState(null);
  const [insightLoading, setInsightLoading] = React.useState(false);
  const [insightError,   setInsightError]   = React.useState(null);

  // ── Sources for Alerts ────────────────────────────────────────────────────
  const [sopResult]    = useSession("wz_sopResult", null);
  const [agentResult]  = useSession("wz_agentResult", null);
  const [triageResult] = useSession("wz_triage", null);
  const [cwfHistory,   setCwfHistory]   = React.useState([]);
  const [anomalies]    = useSession("wz_anomalies", null);

  React.useEffect(() => {
    fetch(`${API}/api/custom-workflows/history`)
      .then(r=>r.json()).then(d=>{ if(Array.isArray(d)) setCwfHistory(d); }).catch(()=>{});
  }, []);

  const alerts = React.useMemo(() => {
    const items = [];

    // Pending WiziAgent approval
    if (agentResult?.status==="awaiting_approval" && agentResult?.approval_status==="pending") {
      items.push({
        id:"wizi-approval", urgency:"critical", icon:"⚡",
        title:"WiziAgent Fix — Approval Required",
        detail: agentResult.classification?.risk_reason || "High-risk fix awaiting approval",
        token: agentResult.approval_token,
        action:{ label:"Go to Triage", tab:"triage" },
      });
    }

    // Pending SOP gates
    if (sopResult) {
      for (let i=1; i<=5; i++) {
        if (sopResult[`gate${i}_token`] && sopResult[`gate${i}_decision`]==="pending") {
          items.push({
            id:`sop-gate${i}`, urgency:"high", icon:"🔒",
            title:`Ads SOP — Gate ${i} Pending`,
            detail:["Pause Mage Jobs","Data Available","Proceed with Refreshes",
                    "Run Product Summary","Resume Mage & GDS Copies"][i-1],
            token: sopResult[`gate${i}_token`],
            action:{ label:"Go to Workflows", tab:"workflows" },
          });
        }
      }
    }

    // Triage dry-runs ready to fix
    if (triageResult?.issues?.length > 0) {
      const dryRuns = (() => { try { return JSON.parse(sessionStorage.getItem("wz_dryRuns")||"{}"); } catch { return {}; } })();
      const fixResults = (() => { try { return JSON.parse(sessionStorage.getItem("wz_fixResults")||"{}"); } catch { return {}; } })();
      triageResult.issues.forEach(issue => {
        const dr = dryRuns[issue.id];
        if (dr && dr!=="loading" && dr!=="error" && !fixResults[issue.id]) {
          items.push({
            id:`dry-${issue.id}`, urgency:issue.severity, icon:"🔧",
            title:`Fix Ready — ${issue.title}`,
            detail:`${dr.rows_affected} rows · ${issue.fix_action} · dry run complete`,
            action:{ label:"Go to Triage", tab:"triage" },
          });
        }
      });
    }

    // Anomaly alerts
    if (anomalies?.anomalies?.length > 0) {
      anomalies.anomalies.forEach(ta => {
        const worst = ta.anomalies?.sort((a,b)=>
          ({critical:0,high:1,medium:2,low:3}[a.severity]||9) -
          ({critical:0,high:1,medium:2,low:3}[b.severity]||9))[0];
        if (worst) {
          items.push({
            id:`anomaly-${ta.table}`, urgency:worst.severity, icon:"📊",
            title:`Anomaly — ${ta.table}`,
            detail: worst.column==="_row_count"
              ? `Row ${worst.type==="row_count_spike"?"spike":"drop"}: ${worst.baseline_value?.toLocaleString()} → ${worst.current_value?.toLocaleString()}`
              : `NULLs in ${worst.column} up ${worst.deviation_pct}pp`,
            action:{ label:"Go to Brief", tab:"brief" },
          });
        }
      });
    }

    // Custom workflow runs with issues
    cwfHistory.filter(r=>r.total_issues>0 && r.status!=="error").slice(0,3).forEach(r => {
      items.push({
        id:`cwf-${r.run_id}`, urgency:"medium", icon:"🔀",
        title:`Workflow Issues — ${r.workflow_name}`,
        detail:`${r.total_issues} issue(s) found · ${r.triggered_by} · ${r.started_at?.slice(11,16)} UTC`,
        action:{ label:"Go to Workflows", tab:"workflows" },
      });
    });

    // Sort by urgency
    const RANK = {critical:0,high:1,medium:2,low:3};
    return items.sort((a,b)=>(RANK[a.urgency]||9)-(RANK[b.urgency]||9));
  }, [sopResult, agentResult, triageResult, anomalies, cwfHistory]);

  const urgencyColor = { critical:T.red, high:T.orange, medium:T.yellow, low:T.cyan };

  // ── Fix log filter + search ───────────────────────────────────────────────
  const ACTION_TYPES = [...new Set(history.map(h=>h.action).filter(Boolean))];
  const filteredHistory = history.filter(h => {
    if (filter!=="all" && h.action!==filter) return false;
    if (search && !`${h.action} ${h.table}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // ── AI Insight ────────────────────────────────────────────────────────────
  const generateInsight = async () => {
    if (!history.length) return;
    setInsightLoading(true); setInsightError(null); setInsight(null);
    try {
      const res = await fetch(`${API}/api/fix-history/summary`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ history })
      });
      const data = await res.json();
      if (data.error && !data.summary) throw new Error(data.error);
      setInsight(data);
    } catch(e) { setInsightError(e.message); }
    setInsightLoading(false);
  };

  const healthColor = insight?.health_score>=80?T.green:insight?.health_score>=50?T.yellow:T.red;

  return (
    <div className="fade-in" style={{ padding:"28px 32px", maxWidth:920 }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <div style={{ fontSize:22, fontWeight:700, color:T.text, letterSpacing:"-0.02em" }}>
            Activity
          </div>
          <div style={{ fontSize:13, color:T.muted, marginTop:3 }}>
            Live alerts · fix log · AI pipeline insight
          </div>
        </div>
        {activeView==="log" && history.length > 0 && (
          <Btn onClick={generateInsight} disabled={insightLoading} size="sm"
            style={{ background:`linear-gradient(135deg,${T.accent},${T.purple})`,
              color:"white", border:"none" }}>
            {insightLoading?<Spinner size={11} color="white"/>:<Zap size={11}/>}
            {insightLoading?"Analysing…":"AI Insight"}
          </Btn>
        )}
      </div>

      {/* View tabs */}
      <div style={{ display:"flex", gap:0, borderBottom:`1px solid ${T.border}`, marginBottom:20 }}>
        {[
          { id:"alerts", label:`Alerts${alerts.length>0?" ("+alerts.length+")":""}` },
          { id:"log",    label:`Fix Log${history.length>0?" ("+history.length+")":""}` },
        ].map(tab => (
          <button key={tab.id} onClick={()=>setActiveView(tab.id)}
            style={{ padding:"8px 20px", fontSize:12, fontWeight:activeView===tab.id?600:400,
              color:activeView===tab.id?T.accent:T.muted,
              background:"none", border:"none", cursor:"pointer",
              borderBottom:activeView===tab.id?`2px solid ${T.accent}`:"2px solid transparent",
              marginBottom:-1, transition:"all 0.12s" }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── ALERTS VIEW ─────────────────────────────────────────────────────── */}
      {activeView==="alerts" && (
        <>
          {alerts.length===0 ? (
            <div style={{ textAlign:"center", padding:"56px 0" }}>
              <CheckCircle size={40} color={T.green} strokeWidth={1.2}
                style={{ margin:"0 auto 12px", display:"block" }}/>
              <div style={{ fontSize:16, fontWeight:700, color:T.green }}>All clear</div>
              <div style={{ fontSize:13, color:T.muted, marginTop:4 }}>
                No pending approvals, anomalies, or issues requiring attention
              </div>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {alerts.map(item => (
                <Card key={item.id} style={{ padding:"16px 20px",
                  borderLeft:`3px solid ${urgencyColor[item.urgency]||T.muted}` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:38, height:38, borderRadius:9, flexShrink:0,
                      background:`${urgencyColor[item.urgency]||T.muted}12`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:17 }}>
                      {item.icon}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                        <span style={{ fontSize:13, fontWeight:700, color:T.text }}>
                          {item.title}
                        </span>
                        <Badge label={item.urgency} color={urgencyColor[item.urgency]||T.muted}/>
                      </div>
                      <div style={{ fontSize:11, color:T.muted }}>{item.detail}</div>
                      {item.token && (
                        <div style={{ fontSize:10, color:T.dim, fontFamily:T.monoFont, marginTop:2 }}>
                          token: {item.token}
                        </div>
                      )}
                    </div>
                    {item.action && (
                      <Btn onClick={()=>onNavigate(item.action.tab)} size="sm">
                        {item.action.label} <ArrowRight size={11}/>
                      </Btn>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── FIX LOG VIEW ────────────────────────────────────────────────────── */}
      {activeView==="log" && (
        <>
          {/* AI Insight panel */}
          {(insight||insightLoading||insightError) && (
            <Card style={{ padding:"18px 20px", marginBottom:16,
              borderColor:`${T.purple}30`, background:`${T.purple}04` }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                <Zap size={13} color={T.purple}/>
                <span style={{ fontSize:11, fontWeight:700, color:T.purple,
                  textTransform:"uppercase", letterSpacing:"0.06em" }}>AI Insight</span>
                {insight?.health_score!=null && (
                  <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:6 }}>
                    <span style={{ fontSize:10, color:T.muted }}>Pipeline health</span>
                    <span style={{ fontSize:18, fontWeight:800, color:healthColor,
                      fontFamily:"monospace" }}>{insight.health_score}</span>
                    <span style={{ fontSize:10, color:T.muted }}>/100</span>
                  </div>
                )}
              </div>
              {insightLoading && (
                <div style={{ fontSize:12, color:T.muted, display:"flex", gap:6, alignItems:"center" }}>
                  <Spinner size={11}/> Analysing {history.length} fix records…
                </div>
              )}
              {insightError && <div style={{ fontSize:12, color:T.red }}>Error: {insightError}</div>}
              {insight && (
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {insight.summary && (
                    <div style={{ fontSize:12, color:T.text2, lineHeight:1.6 }}>{insight.summary}</div>
                  )}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                    {insight.patterns?.length>0 && (
                      <div>
                        <div style={{ fontSize:10, fontWeight:700, color:T.muted,
                          textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:5 }}>
                          Patterns
                        </div>
                        {insight.patterns.map((p,i)=>(
                          <div key={i} style={{ fontSize:11, color:T.text2, marginBottom:2 }}>· {p}</div>
                        ))}
                      </div>
                    )}
                    {insight.hotspots?.length>0 && (
                      <div>
                        <div style={{ fontSize:10, fontWeight:700, color:T.muted,
                          textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:5 }}>
                          Hotspots
                        </div>
                        {insight.hotspots.map((h,i)=>(
                          <div key={i} style={{ fontSize:11, color:T.text2, marginBottom:2 }}>
                            <span style={{ fontFamily:"monospace", color:T.orange }}>{h.table}</span>
                            {" — "}{h.issue}{" "}
                            <Badge label={h.frequency} color={h.frequency==="high"?T.red:T.yellow}/>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {insight.recommendations?.length>0 && (
                    <div>
                      <div style={{ fontSize:10, fontWeight:700, color:T.muted,
                        textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:5 }}>
                        Recommendations
                      </div>
                      {insight.recommendations.map((r,i)=>(
                        <div key={i} style={{ fontSize:11, color:T.green, marginBottom:2 }}>→ {r}</div>
                      ))}
                    </div>
                  )}
                  {insight.stats && (
                    <div style={{ display:"flex", gap:24, paddingTop:8,
                      borderTop:`1px solid ${T.border}` }}>
                      {[["Total fixes",insight.stats.total_fixes],
                        ["Rows affected",insight.stats.total_rows_affected?.toLocaleString()],
                        ["Failures",insight.stats.failures],
                        ["Avg time",insight.stats.avg_duration_ms?`${Math.round(insight.stats.avg_duration_ms/1000)}s`:"—"]
                      ].map(([k,v])=>(
                        <div key={k}>
                          <div style={{ fontSize:9, color:T.muted, textTransform:"uppercase",
                            letterSpacing:"0.05em" }}>{k}</div>
                          <div style={{ fontSize:16, fontWeight:700, color:T.text,
                            fontFamily:"monospace" }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          )}

          {/* Filter + search row */}
          {history.length > 0 && (
            <div style={{ display:"flex", gap:8, marginBottom:14, alignItems:"center", flexWrap:"wrap" }}>
              <input value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="Search fixes…"
                style={{ padding:"5px 10px", borderRadius:6, fontSize:11,
                  border:`1px solid ${T.border}`, background:T.surface, color:T.text,
                  fontFamily:"inherit", outline:"none", width:160 }}
                onFocus={e=>e.target.style.borderColor=T.accent}
                onBlur={e=>e.target.style.borderColor=T.border}
              />
              <button onClick={()=>setFilter("all")}
                style={{ padding:"4px 10px", borderRadius:99, fontSize:11, cursor:"pointer",
                  border:"none", fontWeight:600,
                  background:filter==="all"?T.accent:`${T.accent}10`,
                  color:filter==="all"?"white":T.muted }}>
                All ({history.length})
              </button>
              {ACTION_TYPES.map(a=>(
                <button key={a} onClick={()=>setFilter(a)}
                  style={{ padding:"4px 10px", borderRadius:99, fontSize:11, cursor:"pointer",
                    border:"none", fontWeight:600,
                    background:filter===a?T.accent:`${T.accent}10`,
                    color:filter===a?"white":T.muted }}>
                  {a}
                </button>
              ))}
              {(filter!=="all"||search) && (
                <button onClick={()=>{ setFilter("all"); setSearch(""); }}
                  style={{ fontSize:11, color:T.muted, background:"none", border:"none",
                    cursor:"pointer" }}>Clear</button>
              )}
              <span style={{ marginLeft:"auto", fontSize:11, color:T.dim }}>
                {filteredHistory.length} of {history.length}
              </span>
            </div>
          )}

          {history.length===0 ? (
            <EmptyState icon={Shield} title="No fixes yet"
              desc="Fix history appears here after running Triage or WiziAgent"/>
          ) : filteredHistory.length===0 ? (
            <div style={{ textAlign:"center", padding:"32px 0", color:T.muted, fontSize:13 }}>
              No fixes match your filter
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {[...filteredHistory].reverse().map((h,i)=>(
                <Card key={i} style={{ padding:"12px 18px",
                  borderLeft:`3px solid ${h.success?T.green:T.red}` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:32, height:32, borderRadius:7, flexShrink:0,
                      background:h.success?`${T.green}12`:`${T.red}12`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:14 }}>
                      {h.success?"✅":"❌"}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:12, fontWeight:700, color:T.text,
                        textTransform:"capitalize" }}>{h.action?.replace(/_/g," ")}</div>
                      <div style={{ fontSize:11, color:T.muted, marginTop:1 }}>
                        <span style={{ fontFamily:"monospace" }}>{h.table}</span>
                        {" · "}{h.rows_affected?.toLocaleString()} rows
                        {h.durationMs && ` · ${Math.round(h.durationMs/1000)}s`}
                        {" · "}{h.ts}
                      </div>
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0 }}>
                      <div style={{ fontSize:13, fontWeight:700, fontFamily:"monospace",
                        color:h.success?T.green:T.red }}>
                        {h.before?.toLocaleString()} → {h.after?.toLocaleString()}
                      </div>
                      <div style={{ fontSize:9, color:T.muted, textTransform:"uppercase",
                        letterSpacing:"0.04em" }}>before → after</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
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
  const dbSchema = useSchema();
  const [messages,  setMessages]  = useSession("wz_chat", []);
  const [input,     setInput]     = React.useState("");
  const [loading,   setLoading]   = React.useState(false);
  const [actions,   setActions]   = React.useState([]);  // pending action confirmations
  const [monTables, setMonTables] = useLocal("wz_monTables",
    [{ schema:"mws", table:"report", label:"mws.report", primary:true, checks:[] }]
  );
  const [customRules, setCustomRules] = useLocal("wz_customRules", []);
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

    const schemaSection = dbSchema
      ? `DATABASE SCHEMA (all tables and columns):\n${dbSchema}`
      : `KNOWN TABLES: mws.report, mws.orders, mws.inventory, mws.sales_and_traffic_by_date, mws.sales_and_traffic_by_asin, public.tbl_amzn_campaign_report, public.tbl_amzn_keyword_report, public.tbl_amzn_product_ad_report, public.tbl_amzn_targets_report`;

    const system = `You are WiziAgent, an autonomous data quality and pipeline operations agent for Intentwise.

${schemaSection}

mws.report STATUS values: pending | processed | failed
mws.report COPY_STATUS values: REPLICATED | NOT_REPLICATED | null
HEALTHY row = status='processed' AND copy_status='REPLICATED' AND not stuck >2h

FIX ACTIONS available:
- redrive: reset failed downloads (status=failed → pending, tries=0)
- recopy: re-trigger replication (copy_status=null → NOT_REPLICATED)
- redrive_copy: fix stuck copies (processed, copy_status=null, download_date >2h ago)

IMPORTANT — when you decide to DO something, embed action tags IN your response:
- To run a fix:              ACTION:RUN_FIX:redrive (or recopy or redrive_copy)
- To show sample rows:       ACTION:SHOW_ROWS:schema.table
- To add a table to monitor: ACTION:ADD_MONITOR:schema.table
- To save a custom rule:     ACTION:SAVE_RULE:{"name":"rule name","table":"schema.table","check":"SQL check","severity":"high"}

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
      const reply = data.content?.[0]?.text || (typeof data.error === "string" ? data.error : data.error ? JSON.stringify(data.error) : null) || "No response";
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
function CheckSetBuilder({ table, initial, onSave, onCancel }) {
  const T = useT();
  const dbSchema = useSchema();
  const blank = { id:`cs-${Date.now()}`, name:"", desc:"", checks:[] };
  const [cs, setCs] = React.useState(initial || blank);
  const [checkIn, setCheckIn] = React.useState({ name:"", sql:"", pass_condition:"rows > 0" });
  const [aiLoading, setAiLoading] = React.useState(false);
  const [aiDesc, setAiDesc] = React.useState("");

  const inp = { width:"100%", padding:"7px 10px", borderRadius:6, fontSize:11,
    border:`1px solid ${T.border}`, background:T.surface, color:T.text,
    fontFamily:"inherit", outline:"none", boxSizing:"border-box" };
  const mono = { ...inp, fontFamily:"monospace" };

  const addCheck = () => {
    if (!checkIn.name.trim() || !checkIn.sql.trim()) return;
    setCs(p => ({...p, checks:[...p.checks,
      { id:`chk-${Date.now()}`, ...checkIn }]}));
    setCheckIn({ name:"", sql:"", pass_condition:"rows > 0" });
  };

  const removeCheck = (id) => setCs(p=>({...p, checks:p.checks.filter(c=>c.id!==id)}));

  const aiSuggest = async () => {
    if (!aiDesc.trim()) return;
    setAiLoading(true);
    try {
      const res = await fetch(`${API}/api/ai/chat`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          system: `You are WiziAgent helping a data engineer write SQL checks for Redshift.
Table: ${table}
${dbSchema ? "Schema context: " + dbSchema.split(";").find(s=>s.includes(table)) || "" : ""}
User describes a check they want. Return ONLY JSON array (no markdown):
[{"name":"Check name","sql":"SELECT ... FROM ${table} ...","pass_condition":"rows > 0"}]
Rules: only SELECT queries, use exact table name, pass_condition is one of: "rows > N", "value > N", "value = N"`,
          messages:[{role:"user", content: aiDesc}], max_tokens:600
        })
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "[]";
      const arr  = JSON.parse(text.replace(/```json|```/g,"").trim());
      if (Array.isArray(arr)) {
        setCs(p => ({...p, checks:[...p.checks,
          ...arr.map(c=>({id:`chk-${Date.now()}-${Math.random().toString(36).slice(2)}`, ...c}))]}));
        setAiDesc("");
      }
    } catch(e) { console.error(e); }
    setAiLoading(false);
  };

  return (
    <div style={{ padding:"20px 24px", maxWidth:740 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
        <Btn onClick={onCancel} variant="ghost" size="sm">← Back</Btn>
        <div style={{ fontSize:16, fontWeight:700, color:T.text }}>
          {initial ? "Edit Check Set" : "New Check Set"}
          <span style={{ fontSize:12, fontWeight:400, color:T.muted, marginLeft:8 }}>
            on {table}
          </span>
        </div>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {/* Name + desc */}
        <Card style={{ padding:"16px 20px" }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.muted, marginBottom:10,
            textTransform:"uppercase", letterSpacing:"0.06em" }}>Check Set Info</div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            <div>
              <label style={{ fontSize:11, fontWeight:600, color:T.text2,
                display:"block", marginBottom:3 }}>Name *</label>
              <input value={cs.name} onChange={e=>setCs(p=>({...p,name:e.target.value}))}
                placeholder="e.g. Daily Download Coverage"
                style={inp}
                onFocus={e=>e.target.style.borderColor=T.accent}
                onBlur={e=>e.target.style.borderColor=T.border}/>
            </div>
            <div>
              <label style={{ fontSize:11, fontWeight:600, color:T.text2,
                display:"block", marginBottom:3 }}>Description</label>
              <input value={cs.desc} onChange={e=>setCs(p=>({...p,desc:e.target.value}))}
                placeholder="What does this check set verify?"
                style={inp}
                onFocus={e=>e.target.style.borderColor=T.accent}
                onBlur={e=>e.target.style.borderColor=T.border}/>
            </div>
          </div>
        </Card>

        {/* AI suggest */}
        <Card style={{ padding:"16px 20px", borderColor:`${T.purple}30`, background:`${T.purple}04` }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
            <Zap size={12} color={T.purple}/>
            <span style={{ fontSize:11, fontWeight:700, color:T.purple }}>AI Check Suggester</span>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <input value={aiDesc} onChange={e=>setAiDesc(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&aiSuggest()}
              placeholder="Describe what you want to check, e.g. 'show download count by report type for today'"
              style={{...inp, flex:1}}
              onFocus={e=>e.target.style.borderColor=T.purple}
              onBlur={e=>e.target.style.borderColor=T.border}/>
            <Btn onClick={aiSuggest} disabled={aiLoading||!aiDesc.trim()} size="sm"
              style={{ color:T.purple, borderColor:`${T.purple}40` }} variant="ghost">
              {aiLoading?<Spinner size={10}/>:<Zap size={10}/>}
              {aiLoading?"Generating…":"Suggest SQL"}
            </Btn>
          </div>
          <div style={{ fontSize:10, color:T.dim, marginTop:6 }}>
            Describe in plain English — AI will write the SQL queries and add them below.
          </div>
        </Card>

        {/* Existing sub-checks */}
        {cs.checks.length > 0 && (
          <Card style={{ padding:"16px 20px" }}>
            <div style={{ fontSize:11, fontWeight:700, color:T.muted, marginBottom:10,
              textTransform:"uppercase", letterSpacing:"0.06em" }}>
              Sub-checks ({cs.checks.length})
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {cs.checks.map((c,i) => (
                <div key={c.id} style={{ padding:"10px 14px", borderRadius:8,
                  background:T.surface, border:`1px solid ${T.border}` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                    <span style={{ fontSize:11, fontWeight:600, color:T.text }}>{i+1}. {c.name}</span>
                    <span style={{ fontSize:10, padding:"1px 7px", borderRadius:4,
                      background:`${T.cyan}12`, color:T.cyan, fontFamily:"monospace" }}>
                      {c.pass_condition}
                    </span>
                    <button onClick={()=>removeCheck(c.id)}
                      style={{ marginLeft:"auto", background:"none", border:"none",
                        cursor:"pointer", color:T.muted, fontSize:13 }}>×</button>
                  </div>
                  <div style={{ fontSize:10, color:T.dim, fontFamily:"monospace",
                    background:"#F8FAFC", padding:"6px 10px", borderRadius:5,
                    border:`1px solid ${T.border}`, lineHeight:1.5 }}>
                    {c.sql}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Add sub-check manually */}
        <Card style={{ padding:"16px 20px" }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.muted, marginBottom:10,
            textTransform:"uppercase", letterSpacing:"0.06em" }}>Add Sub-Check Manually</div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            <div style={{ display:"flex", gap:8 }}>
              <div style={{ flex:1 }}>
                <label style={{ fontSize:11, fontWeight:600, color:T.text2,
                  display:"block", marginBottom:3 }}>Check name</label>
                <input value={checkIn.name} onChange={e=>setCheckIn(p=>({...p,name:e.target.value}))}
                  placeholder="e.g. Downloads by report type"
                  style={inp}
                  onFocus={e=>e.target.style.borderColor=T.accent}
                  onBlur={e=>e.target.style.borderColor=T.border}/>
              </div>
              <div style={{ width:160 }}>
                <label style={{ fontSize:11, fontWeight:600, color:T.text2,
                  display:"block", marginBottom:3 }}>Pass condition</label>
                <select value={checkIn.pass_condition}
                  onChange={e=>setCheckIn(p=>({...p,pass_condition:e.target.value}))}
                  style={{...inp, fontFamily:"monospace"}}>
                  <option value="rows > 0">rows &gt; 0 (has data)</option>
                  <option value="rows > 1">rows &gt; 1 (multiple)</option>
                  <option value="value > 0">value &gt; 0</option>
                  <option value="value = 0">value = 0 (expect empty)</option>
                </select>
              </div>
            </div>
            <div>
              <label style={{ fontSize:11, fontWeight:600, color:T.text2,
                display:"block", marginBottom:3 }}>SQL query</label>
              <textarea value={checkIn.sql} rows={3}
                onChange={e=>setCheckIn(p=>({...p,sql:e.target.value}))}
                placeholder={`SELECT report_type, COUNT(*) AS cnt\nFROM ${table}\nWHERE requested_date::date = CURRENT_DATE\nGROUP BY report_type`}
                style={{...mono, resize:"vertical"}}
                onFocus={e=>e.target.style.borderColor=T.accent}
                onBlur={e=>e.target.style.borderColor=T.border}/>
            </div>
            <Btn onClick={addCheck}
              disabled={!checkIn.name.trim()||!checkIn.sql.trim()} size="sm">
              <Plus size={11}/> Add Sub-check
            </Btn>
          </div>
        </Card>

        {/* Save */}
        <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
          <Btn onClick={onCancel} variant="muted" size="sm">Cancel</Btn>
          <Btn onClick={()=>onSave(cs)} disabled={!cs.name.trim()||cs.checks.length===0} size="sm">
            <Check size={11}/> Save Check Set
          </Btn>
        </div>
      </div>
    </div>
  );
}

function MonitorTab() {
  const T = useT();
  const [tables,      setTables]      = useLocal("wz_monTables",
    [{ schema:"mws", table:"report", label:"mws.report", primary:true,
       checkSets:[], checks:["status='processed'","copy_status='REPLICATED'","no stuck >2h"] }]
  );
  const [results,     setResults]     = useSession("wz_monResults", {});
  const [csResults,   setCsResults]   = React.useState({}); // { [csId]: run result }
  const [scanning,    setScanning]    = React.useState({});
  const [csRunning,   setCsRunning]   = React.useState({}); // { [csId]: bool }
  const [expanded,    setExpanded]    = React.useState({}); // { [key]: bool } table expand
  const [csExpanded,  setCsExpanded]  = React.useState({}); // { [csId]: bool } check result expand
  const [addOpen,     setAddOpen]     = React.useState(false);
  const [newTable,    setNewTable]    = React.useState({ schema:"mws", table:"" });
  const [builderFor,  setBuilderFor]  = React.useState(null); // { tableKey, initial }

  const scan = async (t) => {
    const key = `${t.schema}.${t.table}`;
    setScanning(p => ({...p,[key]:true}));
    try {
      const res = await fetch(`${API}/api/wizi-agent/run-table`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ schema:t.schema, table:t.table, dry_run:true })
      });
      const data = await res.json();
      setResults(p => ({...p,[key]:data}));
    } catch(e) { setResults(p => ({...p,[key]:{error:e.message}})); }
    setScanning(p => ({...p,[key]:false}));
  };

  const runCheckSet = async (cs) => {
    setCsRunning(p=>({...p,[cs.id]:true}));
    try {
      const res = await fetch(`${API}/api/monitor/run-checks`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ checks: cs.checks })
      });
      const data = await res.json();
      setCsResults(p=>({...p,[cs.id]:data}));
    } catch(e) {
      setCsResults(p=>({...p,[cs.id]:{overall:"error",results:[],error:e.message}}));
    }
    setCsRunning(p=>({...p,[cs.id]:false}));
    setCsExpanded(p=>({...p,[cs.id]:true}));
  };

  const addTable = () => {
    if (!newTable.table.trim()) return;
    setTables(p => [...p, {
      schema:newTable.schema, table:newTable.table,
      label:`${newTable.schema}.${newTable.table}`,
      primary:false, checkSets:[], checks:[]
    }]);
    setNewTable({ schema:"mws", table:"" });
    setAddOpen(false);
    try { const c=JSON.parse(localStorage.getItem("wz_onboarding")||"{}"); localStorage.setItem("wz_onboarding",JSON.stringify({...c,monitored:true})); } catch {}
  };

  const removeTable = (key) => {
    setTables(p => p.filter(t=>`${t.schema}.${t.table}`!==key));
    setResults(p => { const n={...p}; delete n[key]; return n; });
  };

  const saveCheckSet = (tableKey, cs) => {
    setTables(p => p.map(t => {
      if (`${t.schema}.${t.table}` !== tableKey) return t;
      const existing = (t.checkSets||[]).findIndex(c=>c.id===cs.id);
      const newSets  = existing>=0
        ? t.checkSets.map((c,i)=>i===existing?cs:c)
        : [...(t.checkSets||[]), cs];
      return {...t, checkSets:newSets};
    }));
    setBuilderFor(null);
  };

  const removeCheckSet = (tableKey, csId) => {
    setTables(p => p.map(t => {
      if (`${t.schema}.${t.table}` !== tableKey) return t;
      return {...t, checkSets:(t.checkSets||[]).filter(c=>c.id!==csId)};
    }));
  };

  const STATUS_COLOR = { pass:T.green, fail:T.orange, error:T.red };
  const STATUS_ICON  = { pass:"✓", fail:"✗", error:"!" };

  // Builder view
  if (builderFor) {
    return (
      <div className="fade-in" style={{ padding:"28px 32px" }}>
        <CheckSetBuilder
          table={builderFor.tableKey}
          initial={builderFor.initial||null}
          onSave={(cs) => saveCheckSet(builderFor.tableKey, cs)}
          onCancel={() => setBuilderFor(null)}
        />
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ padding:"28px 32px", maxWidth:960 }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
        <div>
          <div style={{ fontSize:22, fontWeight:700, color:T.text, letterSpacing:"-0.02em",
            display:"flex", alignItems:"center" }}>
            Monitor
            <HelpTip>
              <strong>Monitor</strong> watches tables with custom check sets.<br/><br/>
              <strong>Check Set</strong> — a named group of SQL queries on one table. Each query is a sub-check with its own pass condition.<br/>
              <strong>AI Suggester</strong> — describe what you want to check in plain English, AI writes the SQL.<br/>
              <strong>Run</strong> — executes all sub-checks and shows results inline.
            </HelpTip>
          </div>
          <div style={{ fontSize:13, color:T.muted, marginTop:3 }}>
            {tables.length} table{tables.length!==1?"s":""} · {tables.reduce((n,t)=>n+(t.checkSets?.length||0),0)} check sets
          </div>
        </div>
        <Btn onClick={()=>setAddOpen(true)} size="sm"><Plus size={12}/> Add Table</Btn>
      </div>

      {/* Add table form */}
      {addOpen && (
        <Card style={{ padding:"16px 20px", marginBottom:16, borderColor:T.accent, background:`${T.accent}06` }}>
          <div style={{ fontSize:12, fontWeight:700, color:T.text, marginBottom:10 }}>Add table to monitoring</div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <input value={newTable.schema} onChange={e=>setNewTable(p=>({...p,schema:e.target.value}))}
              placeholder="schema" style={{ width:90, padding:"6px 10px", borderRadius:6,
                border:`1px solid ${T.border}`, background:T.surface, color:T.text,
                fontSize:12, fontFamily:"monospace" }}/>
            <span style={{ color:T.muted }}>.</span>
            <input value={newTable.table} onChange={e=>setNewTable(p=>({...p,table:e.target.value}))}
              onKeyDown={e=>e.key==="Enter"&&addTable()}
              placeholder="table_name" style={{ flex:1, padding:"6px 10px", borderRadius:6,
                border:`1px solid ${T.border}`, background:T.surface, color:T.text,
                fontSize:12, fontFamily:"monospace" }}/>
            <Btn onClick={addTable} size="sm"><Check size={11}/> Add</Btn>
            <Btn onClick={()=>setAddOpen(false)} size="sm" variant="muted"><X size={11}/></Btn>
          </div>
        </Card>
      )}

      {/* Table cards */}
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {tables.map(t => {
          const key     = `${t.schema}.${t.table}`;
          const res     = results[key];
          const busy    = scanning[key];
          const alerts  = res?.alerts||[];
          const isExp   = expanded[key];
          const checkSets = t.checkSets||[];

          // Overall status for the table
          const csStatuses = checkSets.map(cs=>csResults[cs.id]?.overall);
          const tableStatus = !res && !csStatuses.length ? "idle"
            : csStatuses.includes("fail")||csStatuses.includes("error") ? "warning"
            : csStatuses.length && csStatuses.every(s=>s==="pass") ? "healthy"
            : res?.error ? "error"
            : alerts.length>0 ? "warning" : res ? "healthy" : "idle";

          return (
            <Card key={key} style={{ overflow:"hidden" }}>
              {/* Table header */}
              <div style={{ padding:"16px 20px", display:"flex", alignItems:"center", gap:12 }}>
                <StatusDot status={tableStatus}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2 }}>
                    <span style={{ fontSize:13, fontWeight:700, color:T.text,
                      fontFamily:"monospace" }}>{key}</span>
                    {t.primary && <Badge label="primary" color={T.accent}/>}
                    <Badge label={`${checkSets.length} check set${checkSets.length!==1?"s":""}`}
                      color={T.purple}/>
                  </div>
                  {/* Check set status summary */}
                  {checkSets.length > 0 && (
                    <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginTop:3 }}>
                      {checkSets.map(cs => {
                        const r = csResults[cs.id];
                        const col = r ? STATUS_COLOR[r.overall]||T.muted : T.dim;
                        return (
                          <span key={cs.id} style={{ fontSize:10, padding:"1px 8px", borderRadius:4,
                            background:`${col}12`, color:col, border:`1px solid ${col}25` }}>
                            {r ? STATUS_ICON[r.overall] : "○"} {cs.name}
                          </span>
                        );
                      })}
                    </div>
                  )}
                  {checkSets.length === 0 && (
                    <div style={{ fontSize:11, color:T.dim, marginTop:2 }}>
                      No check sets yet — add one to define custom SQL checks
                    </div>
                  )}
                </div>
                <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                  <Btn onClick={()=>setExpanded(p=>({...p,[key]:!p[key]}))} size="sm" variant="ghost">
                    <Eye size={11}/> {isExp?"Hide":"Details"}
                  </Btn>
                  <Btn onClick={()=>setBuilderFor({tableKey:key})} size="sm" variant="ghost"
                    style={{ color:T.purple, borderColor:`${T.purple}30` }}>
                    <Plus size={11}/> Add Check Set
                  </Btn>
                  <Btn onClick={()=>scan(t)} disabled={busy} size="sm" variant="ghost">
                    {busy?<Spinner size={11}/>:<RefreshCw size={11}/>} Quick Scan
                  </Btn>
                  {!t.primary && (
                    <Btn onClick={()=>removeTable(key)} size="sm" variant="muted">
                      <Trash2 size={11}/>
                    </Btn>
                  )}
                </div>
              </div>

              {/* Expanded: check sets + quick scan results */}
              {isExp && (
                <div style={{ borderTop:`1px solid ${T.border}`, padding:"14px 20px",
                  display:"flex", flexDirection:"column", gap:12 }}>

                  {/* Quick scan result */}
                  {res && (
                    <div>
                      <div style={{ fontSize:10, fontWeight:700, color:T.muted,
                        textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6 }}>
                        Quick Scan Result
                      </div>
                      {res.error ? (
                        <div style={{ fontSize:11, color:T.red }}>{res.error}</div>
                      ) : (
                        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                          <span style={{ fontSize:11, color:T.muted }}>
                            {res.total_rows?.toLocaleString()} rows scanned
                          </span>
                          {alerts.length===0
                            ? <span style={{ fontSize:11, color:T.green }}>✓ No issues</span>
                            : alerts.slice(0,4).map(a=>(
                                <Badge key={a.id} label={a.title||a.check} color={T.orange}/>
                              ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Check sets */}
                  {checkSets.length === 0 ? (
                    <div style={{ textAlign:"center", padding:"20px 0" }}>
                      <div style={{ fontSize:12, color:T.muted, marginBottom:8 }}>
                        No check sets yet. Add a check set to define custom SQL checks with sub-queries.
                      </div>
                      <Btn onClick={()=>setBuilderFor({tableKey:key})} size="sm"
                        style={{ color:T.purple, borderColor:`${T.purple}30` }} variant="ghost">
                        <Plus size={11}/> Add Check Set
                      </Btn>
                    </div>
                  ) : (
                    checkSets.map(cs => {
                      const csr       = csResults[cs.id];
                      const isRunning = csRunning[cs.id];
                      const isCsExp   = csExpanded[cs.id];
                      const overallColor = csr ? STATUS_COLOR[csr.overall]||T.muted : T.muted;

                      return (
                        <div key={cs.id} style={{ borderRadius:8,
                          border:`1px solid ${csr ? overallColor+"40" : T.border}`,
                          background: csr ? `${overallColor}04` : T.surface,
                          overflow:"hidden" }}>

                          {/* Check set header */}
                          <div style={{ padding:"12px 16px", display:"flex", alignItems:"center", gap:10 }}>
                            <div style={{ width:28, height:28, borderRadius:6, flexShrink:0,
                              background:`${overallColor}14`,
                              display:"flex", alignItems:"center", justifyContent:"center",
                              fontSize:13, fontWeight:700, color:overallColor }}>
                              {isRunning ? <Spinner size={12}/> : (csr ? STATUS_ICON[csr.overall] : "○")}
                            </div>
                            <div style={{ flex:1, minWidth:0 }}>
                              <div style={{ fontSize:12, fontWeight:700, color:T.text }}>
                                {cs.name}
                              </div>
                              {cs.desc && (
                                <div style={{ fontSize:11, color:T.muted, marginTop:1 }}>{cs.desc}</div>
                              )}
                              <div style={{ fontSize:10, color:T.dim, marginTop:1 }}>
                                {cs.checks.length} sub-check{cs.checks.length!==1?"s":""}
                                {csr && ` · ran ${csr.ran_at ? new Date(csr.ran_at).toLocaleTimeString() : ""}`}
                              </div>
                            </div>
                            <div style={{ display:"flex", gap:5, flexShrink:0 }}>
                              {csr && (
                                <Btn size="sm" variant="ghost"
                                  onClick={()=>setCsExpanded(p=>({...p,[cs.id]:!p[cs.id]}))}>
                                  <Eye size={10}/> {isCsExp?"Hide":"Results"}
                                </Btn>
                              )}
                              <Btn size="sm" variant="ghost"
                                onClick={()=>setBuilderFor({tableKey:key, initial:cs})}
                                style={{ fontSize:10 }}>Edit</Btn>
                              <Btn size="sm" onClick={()=>runCheckSet(cs)} disabled={isRunning}
                                style={{ background:isRunning?T.border:`linear-gradient(135deg,${T.accent},${T.purple})`,
                                  color:"white", border:"none" }}>
                                {isRunning?<Spinner size={10} color="white"/>:<Play size={10}/>}
                                {isRunning?"Running…":"Run"}
                              </Btn>
                              <Btn size="sm" variant="muted"
                                onClick={()=>removeCheckSet(key,cs.id)}>
                                <Trash2 size={10}/>
                              </Btn>
                            </div>
                          </div>

                          {/* Sub-check results */}
                          {isCsExp && csr && (
                            <div style={{ borderTop:`1px solid ${T.border}`,
                              padding:"10px 16px",
                              display:"flex", flexDirection:"column", gap:10 }}>
                              {csr.error && (
                                <div style={{ fontSize:12, color:T.red }}>Error: {csr.error}</div>
                              )}
                              {csr.results?.map((r,i) => (
                                <div key={r.id||i}>
                                  {/* Sub-check header */}
                                  <div style={{ display:"flex", alignItems:"center", gap:8,
                                    marginBottom:6 }}>
                                    <span style={{ fontSize:11, fontWeight:700,
                                      color:STATUS_COLOR[r.status]||T.muted }}>
                                      {STATUS_ICON[r.status]||"?"} {r.name}
                                    </span>
                                    <Badge label={r.status}
                                      color={STATUS_COLOR[r.status]||T.muted}/>
                                    <span style={{ fontSize:10, color:T.dim }}>
                                      {r.row_count} row{r.row_count!==1?"s":""}
                                      {r.duration_ms ? ` · ${r.duration_ms}ms` : ""}
                                    </span>
                                  </div>

                                  {/* Error */}
                                  {r.error && (
                                    <div style={{ fontSize:11, color:T.red, marginBottom:6,
                                      padding:"5px 10px", background:`${T.red}08`,
                                      borderRadius:5, fontFamily:"monospace" }}>
                                      {r.error}
                                    </div>
                                  )}

                                  {/* Result table */}
                                  {r.rows?.length > 0 && (
                                    <div style={{ overflowX:"auto", borderRadius:6,
                                      border:`1px solid ${T.border}` }}>
                                      <table style={{ borderCollapse:"collapse", fontSize:11,
                                        fontFamily:"monospace", width:"100%" }}>
                                        <thead>
                                          <tr style={{ background:`${T.accent}08` }}>
                                            {r.columns.map(col=>(
                                              <th key={col} style={{ padding:"6px 12px",
                                                textAlign:"left", fontWeight:700, fontSize:10,
                                                color:T.muted, borderBottom:`1px solid ${T.border}`,
                                                whiteSpace:"nowrap", textTransform:"uppercase",
                                                letterSpacing:"0.04em" }}>
                                                {col}
                                              </th>
                                            ))}
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {r.rows.map((row,ri)=>(
                                            <tr key={ri}
                                              onMouseEnter={e=>e.currentTarget.style.background=`${T.accent}06`}
                                              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                                              {r.columns.map((col,ci)=>{
                                                const v=row[col];
                                                return (
                                                  <td key={ci} style={{ padding:"5px 12px",
                                                    borderBottom:`1px solid ${T.border}20`,
                                                    whiteSpace:"nowrap",
                                                    color:v===null?T.red:T.text2 }}>
                                                    {v===null
                                                      ? <span style={{color:T.red,fontWeight:700}}>NULL</span>
                                                      : String(v)}
                                                  </td>
                                                );
                                              })}
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
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

  const save = () => {
    setSaved(true); setTimeout(()=>setSaved(false), 2000);
    if (slackUrl) { try { const c=JSON.parse(localStorage.getItem("wz_onboarding")||"{}"); localStorage.setItem("wz_onboarding",JSON.stringify({...c,slack:true})); } catch {} }
  };

  return (
    <div className="fade-in" style={{ padding:"28px 32px", maxWidth:680 }}>
      <div style={{ marginBottom:28 }}>
        <div style={{ fontSize:22, fontWeight:700, color:T.text, letterSpacing:"-0.02em", display:"flex", alignItems:"center" }}>
          Configure
          <HelpTip>
            <strong>Configure</strong> sets up your connections and notification preferences.<br/><br/>
            <strong>Redshift</strong> — connection is managed via Railway environment variables. No changes needed here unless you're moving environments.<br/>
            <strong>Slack</strong> — paste your Slack Incoming Webhook URL to receive WiziAgent notifications and approval requests.<br/>
            <strong>Approval threshold</strong> — fixes affecting more rows than this number require a human to click Approve before executing.
          </HelpTip>
        </div>
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
  const dbSchema = useSchema();
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
  const [aiValidating, setAiValidating] = React.useState(false);
  const [sqlGrounding, setSqlGrounding] = React.useState(null); // { valid, error, confidence, tables_referenced }
  const [runBlocked,   setRunBlocked]   = React.useState(false);
  const [expandedSchema,  setExpandedSchema]  = useSession("wz_queryExpandedSchema", {});
  const [leftMode,        setLeftMode]        = React.useState("schema"); // "schema" | "queries"
  const [richSchema,      setRichSchema]      = React.useState([]); // [{table_schema, table_name, columns}]
  const [richLoading,     setRichLoading]     = React.useState(false);
  const [schemaSearch,    setSchemaSearch]    = React.useState("");
  const [expandedTables,  setExpandedTables]  = React.useState({}); // {schema.table: bool}
  const [tableStats,      setTableStats]      = React.useState({}); // {schema.table: {row_count, scanned_at}}
  const [statsLoading,    setStatsLoading]    = React.useState({});

  // Load rich schema (with columns) on mount
  React.useEffect(() => {
    if (richSchema.length > 0) return;
    setRichLoading(true);
    fetch(`${API}/api/schema`).then(r=>r.json()).then(data => {
      if (Array.isArray(data)) setRichSchema(data);
    }).catch(()=>{}).finally(()=>setRichLoading(false));
  }, []);

  // Also load flat schema for backwards compat
  React.useEffect(() => {
    if (schema.length > 0) return;
    fetch(`${API}/api/tables`).then(r=>r.json()).then(data => {
      if (Array.isArray(data)) setSchema(data);
    }).catch(()=>{});
  }, []);

  const loadTableStats = async (schemaName, tableName) => {
    const key = `${schemaName}.${tableName}`;
    setStatsLoading(p=>({...p,[key]:true}));
    try {
      const res  = await fetch(`${API}/api/preview?schema=${schemaName}&table=${tableName}&limit=3`);
      const data = await res.json();
      // Also get row count
      const cres = await fetch(`${API}/api/query?sql=${encodeURIComponent(`SELECT COUNT(*) AS cnt FROM ${key}`)}`);
      const cdata = await cres.json();
      const cnt = cdata.rows?.[0]?.cnt ?? "?";
      setTableStats(p=>({...p,[key]:{
        sample:data.rows||[], columns:data.columns||[],
        row_count:cnt, scanned_at:new Date().toLocaleTimeString()
      }}));
      setExpandedTables(p=>({...p,[key]:true}));
    } catch(e){}
    setStatsLoading(p=>({...p,[key]:false}));
  };

  // Group rich schema
  const groupedRich = React.useMemo(() => {
    const search = schemaSearch.toLowerCase();
    const result = {};
    for (const t of richSchema) {
      const key = `${t.table_schema}.${t.table_name}`;
      if (search && !key.toLowerCase().includes(search) &&
          !t.columns?.some(c=>c.column_name.toLowerCase().includes(search))) continue;
      if (!result[t.table_schema]) result[t.table_schema] = [];
      result[t.table_schema].push(t);
    }
    return result;
  }, [richSchema, schemaSearch]);

  const TYPE_COLOR = {
    "character varying":T.cyan, "varchar":T.cyan, "text":T.cyan,
    "integer":T.orange, "bigint":T.orange, "numeric":T.orange,
    "double precision":T.orange, "real":T.orange, "decimal":T.orange,
    "boolean":T.green, "date":T.purple, "timestamp":T.purple,
    "timestamp without time zone":T.purple, "timestamp with time zone":T.purple,
  };
  const typeAbbr = (dt) => {
    const m = {"character varying":"varchar","timestamp without time zone":"timestamp",
      "timestamp with time zone":"timestamptz","double precision":"float8",
      "integer":"int","bigint":"int8"};
    return m[dt] || dt;
  };

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

  const validateSql = async (sqlStr) => {
    if (!sqlStr.trim()) return;
    setAiValidating(true);
    setSqlGrounding(null);
    setRunBlocked(false);
    try {
      const res  = await fetch(`${API}/api/ai/validate-sql`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ sql: sqlStr })
      });
      const data = await res.json();
      setSqlGrounding(data);
      setRunBlocked(!data.valid);
    } catch(e) {
      setSqlGrounding({ valid:false, error:"Validation unavailable", confidence:50, tables_referenced:[] });
      setRunBlocked(false); // don't block if validator itself is down
    }
    setAiValidating(false);
  };

  const aiGenerateSql = async () => {
    if (!aiInput.trim() || aiLoading) return;
    setAiLoading(true);
    setSqlGrounding(null);
    try {
      const res  = await fetch(`${API}/api/ai/chat`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          system:`You are a Redshift SQL expert for Intentwise.
${dbSchema ? "DATABASE SCHEMA:\n" + dbSchema : "Known tables: mws.report, mws.orders, mws.inventory, public.tbl_amzn_campaign_report, public.tbl_amzn_keyword_report, public.tbl_amzn_product_ad_report, public.tbl_amzn_targets_report."}
mws.report status: pending|processed|failed. copy_status: REPLICATED|NOT_REPLICATED|NULL.
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
        // Auto-validate the generated SQL against live schema
        await validateSql(generatedSql);
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
      {/* Left panel: Schema Explorer + Queries */}
      <div style={{ width:260, flexShrink:0, borderRight:`1px solid ${T.border}`,
        display:"flex", flexDirection:"column", overflow:"hidden" }}>

        {/* Mode toggle */}
        <div style={{ display:"flex", borderBottom:`1px solid ${T.border}`, flexShrink:0 }}>
          {[["schema","Schema"],["queries","Queries"]].map(([m,label])=>(
            <button key={m} onClick={()=>setLeftMode(m)}
              style={{ flex:1, padding:"8px 0", fontSize:11, fontWeight:leftMode===m?700:400,
                color:leftMode===m?T.accent:T.muted, background:"none", border:"none",
                cursor:"pointer", borderBottom:leftMode===m?`2px solid ${T.accent}`:"2px solid transparent",
                transition:"all 0.12s" }}>
              {label}
            </button>
          ))}
        </div>

        {/* SCHEMA MODE */}
        {leftMode==="schema" && (
          <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column" }}>
            <div style={{ padding:"8px 8px 4px", flexShrink:0 }}>
              <input value={schemaSearch} onChange={e=>setSchemaSearch(e.target.value)}
                placeholder="Search tables & columns…"
                style={{ width:"100%", padding:"5px 8px", borderRadius:5, fontSize:11,
                  border:`1px solid ${T.border}`, background:T.surface, color:T.text,
                  fontFamily:"inherit", outline:"none", boxSizing:"border-box" }}
                onFocus={e=>e.target.style.borderColor=T.accent}
                onBlur={e=>e.target.style.borderColor=T.border}/>
            </div>
            {richLoading && (
              <div style={{ padding:"20px", textAlign:"center", color:T.muted, fontSize:11 }}>
                <Spinner size={14}/><div style={{marginTop:6}}>Loading schema…</div>
              </div>
            )}
            {Object.entries(groupedRich).map(([sc, tables])=>{
              const isScExp = expandedSchema[sc] !== false;
              return (
                <div key={sc}>
                  <button onClick={()=>setExpandedSchema(p=>({...p,[sc]:!isScExp}))}
                    style={{ width:"100%", display:"flex", alignItems:"center", gap:5,
                      padding:"5px 10px", background:`${T.accent}08`, border:"none",
                      cursor:"pointer", textAlign:"left", borderBottom:`1px solid ${T.border}` }}>
                    <span style={{ fontSize:9, color:T.dim }}>{isScExp?"▾":"▸"}</span>
                    <Database size={10} color={T.accent}/>
                    <span style={{ fontSize:10, fontWeight:700, color:T.accent,
                      fontFamily:"monospace", flex:1 }}>{sc}</span>
                    <span style={{ fontSize:9, color:T.dim }}>{tables.length}</span>
                  </button>
                  {isScExp && tables.map(t=>{
                    const tkey  = `${t.table_schema}.${t.table_name}`;
                    const isTExp = expandedTables[tkey];
                    const stats  = tableStats[tkey];
                    const busy   = statsLoading[tkey];
                    return (
                      <div key={tkey} style={{ borderBottom:`1px solid ${T.border}20` }}>
                        <div style={{ display:"flex", alignItems:"center" }}>
                          <button onClick={()=>setSql(`SELECT * FROM ${tkey} LIMIT 50`)}
                            style={{ flex:1, display:"flex", alignItems:"center", gap:6,
                              padding:"5px 6px 5px 18px", background:"none", border:"none",
                              cursor:"pointer", textAlign:"left", transition:"background 0.1s" }}
                            onMouseEnter={e=>e.currentTarget.style.background=`${T.accent}08`}
                            onMouseLeave={e=>e.currentTarget.style.background="none"}>
                            <Table size={10} color={T.muted} style={{flexShrink:0}}/>
                            <span style={{ fontSize:11, color:T.text2, fontFamily:"monospace",
                              flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                              {t.table_name}
                            </span>
                            <span style={{ fontSize:9, color:T.dim, flexShrink:0 }}>{t.columns?.length}</span>
                          </button>
                          <button onClick={()=>{
                              if (!stats && !busy) loadTableStats(t.table_schema, t.table_name);
                              else setExpandedTables(p=>({...p,[tkey]:!isTExp}));
                            }}
                            style={{ background:"none", border:"none", cursor:"pointer",
                              padding:"5px 8px", color:T.dim, fontSize:10 }}>
                            {busy?<Spinner size={9}/>:(isTExp?"▴":"▾")}
                          </button>
                        </div>
                        {isTExp && (
                          <div style={{ paddingBottom:4 }}>
                            {stats && (
                              <div style={{ padding:"2px 18px 2px 32px", fontSize:9,
                                color:T.dim, fontFamily:"monospace" }}>
                                {typeof stats.row_count==="number"
                                  ? stats.row_count.toLocaleString() : stats.row_count} rows · {stats.scanned_at}
                              </div>
                            )}
                            {t.columns?.map((col,ci)=>(
                              <button key={ci}
                                onClick={()=>setSql(p=>p+(p.trimEnd().endsWith(",")?" ":", ")+col.column_name)}
                                style={{ width:"100%", display:"flex", alignItems:"center",
                                  gap:6, padding:"2px 10px 2px 28px", background:"none",
                                  border:"none", cursor:"pointer", textAlign:"left",
                                  transition:"background 0.1s" }}
                                onMouseEnter={e=>e.currentTarget.style.background=`${T.accent}08`}
                                onMouseLeave={e=>e.currentTarget.style.background="none"}
                                title={`Insert: ${col.column_name}`}>
                                <Columns size={8} color={T.dim} style={{flexShrink:0}}/>
                                <span style={{ fontSize:10, fontFamily:"monospace", flex:1,
                                  overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
                                  color:schemaSearch&&col.column_name.toLowerCase().includes(schemaSearch.toLowerCase())?T.accent:T.text2 }}>
                                  {col.column_name}
                                </span>
                                <span style={{ fontSize:9, fontFamily:"monospace", flexShrink:0,
                                  color:TYPE_COLOR[col.data_type]||T.dim }}>
                                  {typeAbbr(col.data_type)}
                                </span>
                              </button>
                            ))}
                            {stats?.sample?.length > 0 && (
                              <div style={{ margin:"4px 10px 4px 28px", padding:"5px 7px",
                                background:"#F8FAFC", borderRadius:5,
                                border:`1px solid ${T.border}`, overflowX:"auto" }}>
                                <div style={{ fontSize:8, color:T.dim, marginBottom:2,
                                  textTransform:"uppercase", letterSpacing:"0.06em" }}>Sample</div>
                                <table style={{ borderCollapse:"collapse", fontSize:9,
                                  fontFamily:"monospace", whiteSpace:"nowrap" }}>
                                  <thead><tr>
                                    {stats.columns.slice(0,4).map(c=>(
                                      <th key={c} style={{ padding:"1px 5px", color:T.muted,
                                        fontWeight:600, borderBottom:`1px solid ${T.border}` }}>{c}</th>
                                    ))}
                                    {stats.columns.length>4&&<th style={{padding:"1px 5px",color:T.dim}}>+{stats.columns.length-4}</th>}
                                  </tr></thead>
                                  <tbody>
                                    {stats.sample.slice(0,3).map((row,ri)=>(
                                      <tr key={ri}>
                                        {stats.columns.slice(0,4).map(c=>(
                                          <td key={c} style={{ padding:"1px 5px",
                                            color:row[c]===null?T.red:T.text2 }}>
                                            {row[c]===null?"NULL":String(row[c]).slice(0,18)}
                                          </td>
                                        ))}
                                        {stats.columns.length>4&&<td style={{color:T.dim}}>…</td>}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
            {Object.keys(groupedRich).length===0 && !richLoading && (
              <div style={{ padding:"20px 12px", fontSize:11, color:T.dim, textAlign:"center" }}>
                {schemaSearch?`No tables matching "${schemaSearch}"`:"No schema loaded"}
              </div>
            )}
          </div>
        )}

        {/* QUERIES MODE */}
        {leftMode==="queries" && (
          <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column" }}>
            <div style={{ padding:"10px 8px 8px" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                paddingLeft:8, marginBottom:6 }}>
                <div style={{ fontSize:9, fontWeight:700, color:T.dim,
                  textTransform:"uppercase", letterSpacing:"0.08em" }}>Saved</div>
                <button onClick={()=>setSaveModal(true)}
                  style={{ background:"none", border:"none", cursor:"pointer",
                    color:T.accent, fontSize:16, lineHeight:1, padding:"0 4px" }}>+</button>
              </div>
              {savedQueries.map(q=>(
                <div key={q.id} style={{ display:"flex", alignItems:"center", borderRadius:5,
                  transition:"background 0.1s" }}
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
                      color:T.dim, padding:"4px 8px", fontSize:12 }}>×</button>
                </div>
              ))}
              {savedQueries.length===0&&(
                <div style={{ fontSize:11, color:T.dim, paddingLeft:12 }}>No saved queries</div>
              )}
            </div>
            <div style={{ height:1, background:T.border }}/>
            <div style={{ padding:"8px 8px 12px" }}>
              <div style={{ fontSize:9, fontWeight:700, color:T.dim, marginBottom:6,
                paddingLeft:8, textTransform:"uppercase", letterSpacing:"0.08em" }}>History</div>
              {history.slice(0,10).map((h,i)=>(
                <button key={i} onClick={()=>setSql(h.sql)}
                  style={{ width:"100%", padding:"3px 8px 3px 12px", background:"none",
                    border:"none", cursor:"pointer", textAlign:"left", borderRadius:4,
                    transition:"background 0.1s" }}
                  onMouseEnter={e=>e.currentTarget.style.background=`${T.accent}10`}
                  onMouseLeave={e=>e.currentTarget.style.background="none"}>
                  <div style={{ fontSize:10, color:T.muted, fontFamily:"monospace",
                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {h.sql.slice(0,42)}…
                  </div>
                  <div style={{ fontSize:9, color:T.dim }}>{h.ts} · {h.rows} rows</div>
                </button>
              ))}
              {history.length===0&&(
                <div style={{ fontSize:11, color:T.dim, paddingLeft:12 }}>No history yet</div>
              )}
            </div>
          </div>
        )}
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

        {/* SQL validation banner */}
        {(aiValidating || sqlGrounding) && (
          <div style={{ padding:"7px 16px", borderBottom:`1px solid ${T.border}`,
            background: aiValidating ? `${T.accent}06`
              : sqlGrounding?.valid ? `${T.green}08` : `${T.red}08`,
            display:"flex", alignItems:"center", gap:8 }}>
            {aiValidating && (
              <><Spinner size={11}/><span style={{ fontSize:11, color:T.muted }}>Validating SQL against live schema…</span></>
            )}
            {!aiValidating && sqlGrounding?.valid && (
              <>
                <Check size={12} color={T.green}/>
                <span style={{ fontSize:11, color:T.green, fontWeight:600 }}>
                  SQL verified · {sqlGrounding.confidence}% confidence
                </span>
                {sqlGrounding.tables_referenced?.length > 0 && (
                  <span style={{ fontSize:10, color:T.muted, fontFamily:"monospace" }}>
                    · tables: {sqlGrounding.tables_referenced.join(", ")}
                  </span>
                )}
                <button onClick={()=>{ setSqlGrounding(null); setRunBlocked(false); }}
                  style={{ marginLeft:"auto", background:"none", border:"none",
                    cursor:"pointer", color:T.dim, fontSize:13 }}>×</button>
              </>
            )}
            {!aiValidating && sqlGrounding && !sqlGrounding.valid && (
              <>
                <AlertTriangle size={12} color={T.red}/>
                <div style={{ flex:1 }}>
                  <span style={{ fontSize:11, color:T.red, fontWeight:600 }}>
                    SQL validation failed —{" "}
                  </span>
                  <span style={{ fontSize:11, color:T.red, fontFamily:"monospace" }}>
                    {sqlGrounding.error}
                  </span>
                </div>
                <Btn size="sm" variant="ghost"
                  style={{ fontSize:10, color:T.orange, borderColor:`${T.orange}40` }}
                  onClick={() => setRunBlocked(false)}>
                  Run anyway
                </Btn>
                <button onClick={()=>{ setSqlGrounding(null); setRunBlocked(false); }}
                  style={{ background:"none", border:"none", cursor:"pointer",
                    color:T.dim, fontSize:13 }}>×</button>
              </>
            )}
          </div>
        )}

        {/* SQL editor */}
        <div style={{ padding:"12px 16px", borderBottom:`1px solid ${T.border}` }}>
          <textarea value={sql}
            onChange={e=>{ setSql(e.target.value); setSqlGrounding(null); setRunBlocked(false); }}
            onKeyDown={e=>{ if((e.ctrlKey||e.metaKey)&&e.key==="Enter"){e.preventDefault();run();} }}
            rows={5}
            style={{ width:"100%", padding:"10px 14px", borderRadius:8, resize:"vertical",
              border:`1px solid ${sqlGrounding && !sqlGrounding.valid ? T.red : sqlGrounding?.valid ? T.green : T.border}`,
              background:T.surface, color:T.text,
              fontSize:12, fontFamily:T.monoFont, outline:"none", lineHeight:1.6 }}
            onFocus={e=>e.target.style.borderColor=T.accent}
            onBlur={e=>e.target.style.borderColor= sqlGrounding && !sqlGrounding.valid ? T.red : sqlGrounding?.valid ? T.green : T.border}
          />
          <div style={{ display:"flex", gap:8, marginTop:8, alignItems:"center" }}>
            <Btn onClick={()=>run()} disabled={running || runBlocked} size="sm"
              style={{ opacity: runBlocked ? 0.5 : 1 }}>
              {running?<Spinner size={12} color="white"/>:<Play size={12}/>}
              {running?"Running…":runBlocked?"Blocked (invalid SQL)":"Run (Ctrl+↵)"}
            </Btn>
            <Btn onClick={()=>validateSql(sql)} disabled={aiValidating||!sql.trim()} size="sm" variant="ghost">
              {aiValidating?<Spinner size={11}/>:<Check size={11}/>}
              Validate
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

  const [runId,      setRunId]      = React.useState(null);
  const [gateTimeout,setGateTimeout]= useLocal("wz_sop_gate_timeout", 30);
  const pollRef = React.useRef(null);

  const pollState = React.useCallback(async (rid) => {
    try {
      const res  = await fetch(`${API}/api/workflow/ads-sop/${rid}`);
      const data = await res.json();
      if (data.error) return;
      setResult(data);
      // Stop polling on terminal states
      const terminal = ["complete","stopped","error","complete_no_issues","finalizing"];
      if (terminal.includes(data.status)) {
        setRunning(false);
        if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
      }
    } catch(e) {}
  }, []);

  // On mount — check if there is an in-progress SOP run
  React.useEffect(() => {
    fetch(`${API}/api/workflow/ads-sop`)
      .then(r=>r.json())
      .then(data => {
        if (data.run) {
          setResult(data.run);
          setRunId(data.run.run_id);
          const terminal = ["complete","stopped","error","complete_no_issues"];
          if (!terminal.includes(data.run.status)) {
            setRunning(true);
            pollRef.current = setInterval(()=>pollState(data.run.run_id), 3000);
          }
        }
      }).catch(()=>{});
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  // ── Run SOP ────────────────────────────────────────────────────────────────
  const runSop = async () => {
    setRunning(true); setResult(null); setRunId(null);
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
    try {
      const res  = await fetch(`${API}/api/workflow/ads-sop`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ gate_timeout_min: Number(gateTimeout) })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setRunId(data.run_id);
      // Start polling
      pollRef.current = setInterval(()=>pollState(data.run_id), 3000);
    } catch(e) {
      setResult({ error:e.message, status:"error", trace:[{node:"sop",ts:"",msg:e.message,level:"error"}] });
      setRunning(false);
    }
  };

  const forceAllGates = async () => {
    if (!runId) return;
    await fetch(`${API}/api/workflow/sop-gate-force`, {
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ run_id: runId })
    });
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
    const isTimeout  = decision === "timeout";
    const busy = submitting[token];

    // Countdown timer for pending gates
    const [elapsed, setElapsed] = React.useState(0);
    React.useEffect(() => {
      if (!isPending) return;
      const id = setInterval(()=>setElapsed(p=>p+1), 60000);
      return ()=>clearInterval(id);
    }, [isPending]);

    const pct = Math.min((elapsed / Number(gateTimeout)) * 100, 100);
    const remaining = Math.max(Number(gateTimeout) - elapsed, 0);

    return (
      <Card style={{ padding:"14px 18px", marginBottom:10,
        borderColor: isPending?`${T.yellow}50`:isApproved?`${T.green}40`:isTimeout?`${T.orange}40`:`${T.red}40`,
        background:  isPending?`${T.yellow}06`:isApproved?`${T.green}06`:isTimeout?`${T.orange}06`:`${T.red}06` }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:32, height:32, borderRadius:8, flexShrink:0,
            background: isPending?`${T.yellow}15`:isApproved?`${T.green}15`:isTimeout?`${T.orange}15`:`${T.red}15`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:14, fontWeight:800,
            color: isPending?T.yellow:isApproved?T.green:isTimeout?T.orange:T.red }}>
            {isPending?<Spinner size={14}/>:gateNum}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, fontWeight:700,
              color: isPending?T.yellow:isApproved?T.green:isTimeout?T.orange:T.red }}>
              🔒 Gate {gateNum}: {label}
              {isApproved&&" ✓"}{isRejected&&" — stopped"}{isTimeout&&" — timed out, force-proceeded"}
            </div>
            {isPending && (
              <>
                <div style={{ fontSize:10, color:T.muted, marginTop:2 }}>
                  Waiting for approval · {remaining}m remaining
                </div>
                <div style={{ height:3, background:T.border, borderRadius:99, marginTop:5 }}>
                  <div style={{ height:"100%", borderRadius:99, width:`${pct}%`,
                    background:pct>80?T.orange:T.yellow, transition:"width 0.5s" }}/>
                </div>
              </>
            )}
            {!isPending && (
              <div style={{ fontSize:10, color:T.muted, marginTop:2, fontFamily:"monospace" }}>
                token: {token}
              </div>
            )}
          </div>
          {isPending && (
            <div style={{ display:"flex", flexDirection:"column", gap:5, flexShrink:0 }}>
              <div style={{ display:"flex", gap:5 }}>
                <Btn onClick={()=>submitGate(token,"approve")} variant="success" size="sm" disabled={busy}>
                  {busy?<Spinner size={10} color="white"/>:<Check size={10}/>} Approve
                </Btn>
                <Btn onClick={()=>submitGate(token,"reject")} variant="danger" size="sm" disabled={busy}>
                  <X size={10}/> Reject
                </Btn>
              </div>
              <Btn onClick={()=>submitGate(token,"force")} variant="ghost" size="sm"
                style={{ fontSize:10, color:T.orange, borderColor:`${T.orange}30` }}>
                ⚡ Force Proceed
              </Btn>
            </div>
          )}
          {isApproved && <Badge label="approved" color={T.green}/>}
          {isRejected && <Badge label="rejected" color={T.red}/>}
          {isTimeout  && <Badge label="timed out" color={T.orange}/>}
        </div>
      </Card>
    );
  };

  const Checklist = ({ title, items, icon, type }) => {
    const [checked, setChecked] = React.useState({});
    if (!items?.length) return null;
    // Auto-check items that were triggered by the backend
    const autoChecked = items.filter(i=>i.paused||i.triggered).length;
    const manualDone  = Object.values(checked).filter(Boolean).length;
    const done        = Math.max(autoChecked, manualDone);

    return (
      <Card style={{ padding:"14px 18px", marginBottom:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
          <span style={{ fontSize:16 }}>{icon}</span>
          <span style={{ fontSize:12, fontWeight:700, color:T.text }}>{title}</span>
          {autoChecked > 0 && (
            <Badge label="auto-triggered (dummy)" color={T.purple}/>
          )}
          <span style={{ fontSize:11, color:T.muted, marginLeft:"auto" }}>
            {done}/{items.length} done
          </span>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
          {items.map((item, i) => {
            const isAutoTriggered = item.paused || item.triggered;
            const isDone = isAutoTriggered || checked[i];
            return (
              <div key={i} onClick={()=>!isAutoTriggered&&setChecked(p=>({...p,[i]:!p[i]}))}
                style={{ display:"flex", alignItems:"flex-start", gap:10,
                  cursor:isAutoTriggered?"default":"pointer",
                  padding:"8px 10px", borderRadius:6, transition:"background 0.1s",
                  background:isDone?`${T.green}08`:"transparent" }}
                onMouseEnter={e=>{ if(!isAutoTriggered) e.currentTarget.style.background=isDone?`${T.green}10`:`${T.accent}06`; }}
                onMouseLeave={e=>e.currentTarget.style.background=isDone?`${T.green}08`:"transparent"}>
                <div style={{ width:16, height:16, borderRadius:4, flexShrink:0, marginTop:1,
                  border:`1.5px solid ${isDone?T.green:T.border2}`,
                  background:isDone?T.green:"transparent",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  transition:"all 0.15s" }}>
                  {isDone && <Check size={10} color="white" strokeWidth={3}/>}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:12, color:isDone?T.muted:T.text,
                      textDecoration:isDone?"line-through":"none" }}>
                      {item.name}
                    </span>
                    {item.org && <Badge label={item.org} color={item.org==="Bluewheel"?T.cyan:T.purple}/>}
                    {isAutoTriggered && item.dummy && (
                      <span style={{ fontSize:9, color:T.orange }}>(dummy API)</span>
                    )}
                  </div>
                  <div style={{ fontSize:10, color:T.dim, marginTop:2, display:"flex", gap:12, flexWrap:"wrap" }}>
                    {item.expected    && <span>Expected: {item.expected}</span>}
                    {item.pause_by    && <span style={{color:T.orange}}>Pause by: {item.pause_by}</span>}
                    {item.type        && <span>Type: {item.type}</span>}
                    {item.region      && <span>Region: {item.region}</span>}
                    {item.destination && <span>→ {item.destination}</span>}
                    {item.paused_at   && <span style={{color:T.green}}>Paused at: {item.paused_at}</span>}
                    {item.triggered_at&& <span style={{color:T.green}}>Triggered at: {item.triggered_at}</span>}
                    {item.note        && <span style={{color:T.dim,fontStyle:"italic"}}>{item.note}</span>}
                  </div>
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
    const allPass = results.every(r=>r.status==="PASS");
    return (
      <Card style={{ padding:"14px 18px", marginBottom:10,
        borderColor:allPass?`${T.green}30`:`${T.orange}40`,
        background:allPass?`${T.green}04`:`${T.orange}04` }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
          <span style={{ fontSize:14 }}>🔬</span>
          <span style={{ fontSize:12, fontWeight:700, color:T.text }}>Validation Results</span>
          <Badge label={allPass?"ALL PASS":"ISSUES"} color={allPass?T.green:T.orange}/>
        </div>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${T.border}` }}>
              {["Table","Status","Accounts (n-1)","5-day Baseline","Coverage %","Error"].map(h=>(
                <th key={h} style={{ padding:"4px 10px", textAlign:"left",
                  fontSize:9, fontWeight:700, color:T.muted,
                  textTransform:"uppercase", letterSpacing:"0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((r,i)=>(
              <tr key={i} style={{ borderBottom:`1px solid ${T.border}30` }}>
                <td style={{ padding:"6px 10px", fontFamily:"monospace",
                  fontSize:10, color:T.text2 }}>{r.short || r.name?.split("tbl_amzn_")[1]?.replace("_report","") || r.name}</td>
                <td style={{ padding:"6px 10px" }}>
                  <Badge label={r.status}
                    color={r.status==="PASS"?T.green:r.status==="FAIL"?T.red:T.yellow}/>
                </td>
                <td style={{ padding:"6px 10px", fontFamily:"monospace",
                  fontWeight:700, color:r.today_count>0?T.green:T.red }}>
                  {r.today_count ?? "—"}
                </td>
                <td style={{ padding:"6px 10px", fontFamily:"monospace", color:T.muted }}>
                  {r.baseline_avg ?? "—"}
                </td>
                <td style={{ padding:"6px 10px", fontFamily:"monospace",
                  color:r.coverage_pct>=80?T.green:r.coverage_pct>0?T.orange:T.red }}>
                  {r.coverage_pct!=null ? `${r.coverage_pct}%` : "—"}
                </td>
                <td style={{ padding:"6px 10px", fontSize:9, color:T.red }}>
                  {r.error||""}
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
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
            <span style={{ fontSize:10, color:T.muted }}>Gate timeout:</span>
            <select value={gateTimeout} onChange={e=>setGateTimeout(Number(e.target.value))}
              style={{ fontSize:11, padding:"3px 6px", borderRadius:5,
                border:`1px solid ${T.border}`, background:T.surface, color:T.text }}>
              <option value={1}>1 min (test)</option>
              <option value={5}>5 min</option>
              <option value={15}>15 min</option>
              <option value={30}>30 min</option>
              <option value={60}>60 min</option>
            </select>
          </div>
          {running && runId && (
            <Btn onClick={forceAllGates} variant="ghost" size="sm"
              style={{ color:T.orange, borderColor:`${T.orange}40`, fontSize:10 }}>
              ⚡ Force All Gates
            </Btn>
          )}
          <Btn onClick={running?undefined:runSop} disabled={running} size="sm"
            style={{ background:running?T.border:`linear-gradient(135deg,${T.accent},${T.purple})`,
              color:"white", border:"none" }}>
            {running?<Spinner size={12} color="white"/>:<Play size={12}/>}
            {running?"SOP Running…":"▶ Trigger SOP"}
          </Btn>
        </div>
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

      {/* Running state banner */}
      {running && result && (
        <Card style={{ padding:"12px 18px", marginBottom:14,
          borderColor:`${T.accent}40`, background:`${T.accent}06` }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <Spinner size={14} color={T.accent}/>
            <div>
              <span style={{ fontSize:13, fontWeight:700, color:T.accent }}>
                SOP Running — {result.status?.replace(/_/g," ").replace("awaiting","⏳ awaiting")}
              </span>
              {runId && (
                <span style={{ fontSize:10, color:T.muted, fontFamily:"monospace", marginLeft:8 }}>
                  {runId}
                </span>
              )}
            </div>
          </div>
        </Card>
      )}
      {running && !result && (
        <Card style={{ padding:"20px 24px", textAlign:"center" }}>
          <Spinner size={28} style={{ margin:"0 auto 10px" }}/>
          <div style={{ fontSize:13, fontWeight:700, color:T.text }}>Starting SOP…</div>
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
  const dbSchema = useSchema();

  // view: "list" | "sop" | "builder" | "edit" | "timeline" | "templates"
  const [view,          setView]          = React.useState("list");
  const [editingWf,     setEditingWf]     = React.useState(null);
  const [timelineRun,   setTimelineRun]   = React.useState(null);   // run to show in timeline

  // Daily run state
  const [running,       setRunning]       = React.useState(false);
  const [result,        setResult]        = useSession("wz_wfResult", null);
  const [runHistory,    setRunHistory]    = useSession("wz_wfHistory", []);
  const [selected,      setSelected]      = React.useState(null);

  // Custom workflows — local state, synced to backend
  const [customWfs,     setCustomWfs]     = React.useState([]);
  const [cwfLoading,    setCwfLoading]    = React.useState(false);
  const [cwfRunning,    setCwfRunning]    = React.useState({}); // { [id]: bool }
  const [cwfResults,    setCwfResults]    = React.useState({}); // { [id]: result }
  const [detailWf,      setDetailWf]     = React.useState(null); // wf being inspected
  const [cwfHistory,    setCwfHistory]   = React.useState([]); // runs from backend
  const [pendingIssues, setPendingIssues] = useSession("wz_pendingIssues", []);

  // Load run history from backend
  const loadCwfHistory = async () => {
    try {
      const res  = await fetch(`${API}/api/custom-workflows/history`);
      const data = await res.json();
      if (Array.isArray(data)) setCwfHistory(data);
    } catch(e) {}
  };
  React.useEffect(() => { loadCwfHistory(); }, []);

  // Load custom workflows from backend on mount
  React.useEffect(() => {
    const load = async () => {
      try {
        const res  = await fetch(`${API}/api/custom-workflows`);
        const data = await res.json();
        if (Array.isArray(data)) setCustomWfs(data);
      } catch(e) {
        // Fallback: try localStorage
        try {
          const local = JSON.parse(localStorage.getItem("wz_customWorkflows") || "[]");
          setCustomWfs(local);
        } catch(_) {}
      }
    };
    load();
  }, []);

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
${dbSchema ? "Available tables: " + dbSchema.split(";").map(t=>t.split("(")[0].trim()).filter(Boolean).join(", ") : "Available tables: mws.report, mws.orders, mws.inventory, public.tbl_amzn_campaign_report, public.tbl_amzn_keyword_report, public.tbl_amzn_product_ad_report"}.
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
  const addSuggestion = async (s) => {
    const payload = { name:s.name, desc:s.desc, trigger:s.trigger,
      schedule:s.schedule||"", agents:s.agents||[], tables:s.tables||[], branches:[] };
    try {
      const res  = await fetch(`${API}/api/custom-workflows/save`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify(payload) });
      const data = await res.json();
      if (data.workflow) setCustomWfs(p => [...p, data.workflow]);
    } catch(e) {
      setCustomWfs(p => [...p, { ...payload, id:`local-${Date.now()}`, builtin:false }]);
    }
    setAiSuggestions(p => p.filter(x => x.id !== s.id));
  };

  // ── Delete custom workflow ─────────────────────────────────────────────────
  const deleteWf = async (id) => {
    setCustomWfs(p => p.filter(w => w.id !== id));
    try { await fetch(`${API}/api/custom-workflows/${id}`, { method:"DELETE" }); }
    catch(e) {}
  };

  // ── Save workflow from builder ─────────────────────────────────────────────
  const saveBuilderWf = async (wf) => {
    const payload = { ...wf, id: wf.id || undefined };
    try {
      const res  = await fetch(`${API}/api/custom-workflows/save`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify(payload) });
      const data = await res.json();
      if (data.workflow) {
        const saved = data.workflow;
        setCustomWfs(p => p.find(w => w.id === saved.id)
          ? p.map(w => w.id === saved.id ? saved : w)
          : [...p, saved]);
      }
    } catch(e) {
      // Fallback: local only
      if (wf.id && customWfs.find(w => w.id === wf.id)) {
        setCustomWfs(p => p.map(w => w.id === wf.id ? wf : w));
      } else {
        setCustomWfs(p => [...p, { ...wf, id:`local-${Date.now()}`, builtin:false }]);
      }
    }
    setView("list");
    setEditingWf(null);
    try { const c=JSON.parse(localStorage.getItem("wz_onboarding")||"{}"); localStorage.setItem("wz_onboarding",JSON.stringify({...c,workflow:true})); } catch {}
  };

  // ── Run a custom workflow ──────────────────────────────────────────────────
  const runCustomWf = async (wf) => {
    setCwfRunning(p => ({...p, [wf.id]: true}));
    setCwfResults(p => ({...p, [wf.id]: null}));
    try {
      const res  = await fetch(`${API}/api/custom-workflows/${wf.id}/run`, { method:"POST" });
      const data = await res.json();
      setCwfResults(p => ({...p, [wf.id]: data}));
      // Refresh last_run on local state
      setCustomWfs(p => p.map(w => w.id === wf.id
        ? {...w, last_run: data.started_at, run_count:(w.run_count||0)+1} : w));
      loadCwfHistory();
    } catch(e) {
      setCwfResults(p => ({...p, [wf.id]: { error: e.message, status:"error" }}));
    }
    setCwfRunning(p => ({...p, [wf.id]: false}));
  };

  // ── Send workflow issues to Triage ────────────────────────────────────────
  const sendToTriage = (tableResult, wfName) => {
    const newIssues = (tableResult.issues || []).map((iss, i) => ({
      id: `WF-${Date.now()}-${i}`,
      title: iss.type ? `${iss.type} issue in ${tableResult.table}` : `Issue in ${tableResult.table}`,
      description: iss.msg || `${iss.type}: ${iss.count || ''} rows affected`,
      severity: iss.severity || "medium",
      count: iss.count || 1,
      table: tableResult.table,
      fix_action: null,
      source: wfName,
      samples: [],
      breakdown: [],
    }));
    setPendingIssues(p => {
      const existing = new Set(p.map(x => x.id));
      return [...p, ...newIssues.filter(x => !existing.has(x.id))];
    });
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

  if (view === "detail") return (
    <WorkflowRunDetail
      wf={detailWf}
      results={cwfResults[detailWf?.id] || null}
      history={cwfHistory}
      onClose={() => { setView("list"); setDetailWf(null); }}
      onSendToTriage={(tr, wfName) => {
        sendToTriage(tr, wfName);
        setView("list");
        setDetailWf(null);
      }}
    />
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
          <div style={{ fontSize:22, fontWeight:700, color:T.text, letterSpacing:"-0.02em", display:"flex", alignItems:"center" }}>
            Workflows
            <HelpTip>
              <strong>Workflows</strong> are automated pipelines that run a sequence of checks across tables.<br/><br/>
              <strong>Daily Data Brief</strong> — runs every day at 4:30 PM IST, checks mws.report and sends a Slack digest.<br/>
              <strong>Ads Download SOP</strong> — step-by-step runbook for handling Ads download failures with 5 approval gates.<br/><br/>
              Click <strong>New Workflow</strong> to create your own. Pick a scenario template or describe what you want to check and let the AI suggest agents and tables.
            </HelpTip>
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
                {!wf.builtin && (
                  <>
                    {(cwfResults[wf.id] || cwfHistory.some(h => h.workflow_id === wf.id)) && (
                      <Btn size="sm" variant="ghost"
                        onClick={() => { setDetailWf(wf); setView("detail"); }}>
                        <Eye size={10}/> Results
                      </Btn>
                    )}
                    <Btn onClick={()=>runCustomWf(wf)} size="sm"
                      disabled={!!cwfRunning[wf.id]}
                      style={{ background:cwfRunning[wf.id]?T.border:`linear-gradient(135deg,${T.accent},${T.purple})`,
                        color:"white", border:"none" }}>
                      {cwfRunning[wf.id]?<Spinner size={10} color="white"/>:<Play size={10}/>}
                      {cwfRunning[wf.id]?"Running…":"Run"}
                    </Btn>
                  </>
                )}
              </div>
            </div>

            {/* Inline run result for this custom workflow */}
            {cwfResults[wf.id] && !cwfRunning[wf.id] && (
              <div style={{ marginTop:10, padding:"8px 12px", borderRadius:6,
                background: cwfResults[wf.id].error ? `${T.red}10` :
                  cwfResults[wf.id].total_issues > 0 ? `${T.orange}10` : `${T.green}10`,
                border:`1px solid ${cwfResults[wf.id].error ? T.red :
                  cwfResults[wf.id].total_issues > 0 ? T.orange : T.green}30` }}>
                {cwfResults[wf.id].error ? (
                  <div style={{ fontSize:11, color:T.red }}>
                    ✕ {cwfResults[wf.id].error}
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize:11, fontWeight:600,
                      color: cwfResults[wf.id].total_issues > 0 ? T.orange : T.green }}>
                      {cwfResults[wf.id].total_issues > 0
                        ? `⚠ ${cwfResults[wf.id].total_issues} issue(s) found`
                        : "✓ All checks passed"}
                    </div>
                    {(cwfResults[wf.id].table_results||[]).map((tr,i) => (
                      <div key={i} style={{ fontSize:10, color:T.muted, marginTop:3 }}>
                        <span style={{ fontFamily:"monospace" }}>{tr.table}</span>
                        {" — "}
                        {tr.skipped ? <span style={{color:T.dim}}>skipped</span>
                          : tr.issues?.length > 0
                            ? <span style={{color:T.orange}}>{tr.issues.length} issue(s)</span>
                            : <span style={{color:T.green}}>clean</span>}
                        {tr.branch_action && (
                          <span style={{ marginLeft:6, color:T.purple, fontSize:9 }}>
                            [{tr.branch_action}]
                          </span>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
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
function WorkflowRunDetail({ wf, results, history, onClose, onSendToTriage }) {
  const T = useT();
  const [expanded, setExpanded] = React.useState({});
  const toggle = (k) => setExpanded(p => ({...p, [k]: !p[k]}));

  // Merge: live result + latest from history
  const runs = React.useMemo(() => {
    const all = [...(history || []).filter(h => h.workflow_id === wf.id)];
    if (results && !all.find(r => r.run_id === results.run_id)) {
      all.unshift(results);
    }
    return all.slice(0, 10);
  }, [results, history, wf.id]);

  const [selectedRun, setSelectedRun] = React.useState(runs[0] || null);
  const tableResults = selectedRun?.table_results || [];
  const SEV = { critical: T.red, high: T.orange, medium: T.yellow, low: T.cyan };

  return (
    <div className="fade-in" style={{ padding:"28px 32px", maxWidth:1000 }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <Btn onClick={onClose} variant="ghost" size="sm">← Back</Btn>
        <div>
          <div style={{ fontSize:18, fontWeight:700, color:T.text }}>{wf.name}</div>
          <div style={{ fontSize:12, color:T.muted, marginTop:2 }}>
            {runs.length} run{runs.length!==1?"s":""} recorded
          </div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"180px 1fr", gap:16 }}>
        {/* Run selector */}
        <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
          <div style={{ fontSize:10, fontWeight:700, color:T.muted, textTransform:"uppercase",
            letterSpacing:"0.06em", marginBottom:4 }}>Runs</div>
          {runs.length === 0 && (
            <div style={{ fontSize:11, color:T.dim }}>No runs yet</div>
          )}
          {runs.map(r => (
            <button key={r.run_id} onClick={() => setSelectedRun(r)}
              style={{ textAlign:"left", padding:"8px 10px", borderRadius:7, cursor:"pointer",
                border:`1px solid ${selectedRun?.run_id===r.run_id ? T.accent : T.border}`,
                background: selectedRun?.run_id===r.run_id ? `${T.accent}10` : T.surface,
                color: T.text }}>
              <div style={{ fontSize:10, fontWeight:600,
                color: r.status==="clean" ? T.green : r.status==="error" ? T.red : T.orange }}>
                {r.status==="clean" ? "✓ Clean" : r.status==="error" ? "✗ Error" : `⚠ ${r.total_issues} issue(s)`}
              </div>
              <div style={{ fontSize:9, color:T.muted, marginTop:2 }}>
                {r.triggered_by} · {r.started_at?.slice(11,16)} UTC
              </div>
            </button>
          ))}
        </div>

        {/* Run detail */}
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {!selectedRun && (
            <div style={{ fontSize:13, color:T.muted, padding:20 }}>Select a run to view results</div>
          )}
          {selectedRun && (
            <>
              {/* Run summary bar */}
              <Card style={{ padding:"12px 16px" }}>
                <div style={{ display:"flex", gap:24, flexWrap:"wrap" }}>
                  {[
                    ["Run ID",     selectedRun.run_id],
                    ["Triggered",  selectedRun.triggered_by],
                    ["Started",    selectedRun.started_at?.slice(0,19).replace("T"," ")+" UTC"],
                    ["Tables",     (selectedRun.table_results||[]).length],
                    ["Issues",     selectedRun.total_issues || 0],
                  ].map(([k,v]) => (
                    <div key={k}>
                      <div style={{ fontSize:9, fontWeight:700, color:T.muted,
                        textTransform:"uppercase", letterSpacing:"0.05em" }}>{k}</div>
                      <div style={{ fontSize:12, fontWeight:600, color:T.text,
                        fontFamily: k==="Run ID" ? "monospace" : "inherit" }}>{v}</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Per-table results */}
              {tableResults.length === 0 && (
                <div style={{ fontSize:12, color:T.muted, padding:"12px 0" }}>No table results recorded.</div>
              )}
              {tableResults.map((tr, i) => {
                const hasIssues = tr.issues?.length > 0;
                const isExp = expanded[i];
                return (
                  <Card key={i} style={{ overflow:"hidden",
                    borderColor: tr.skipped ? T.border : hasIssues ? `${T.orange}40` : `${T.green}30` }}>
                    {/* Table header row */}
                    <div style={{ padding:"12px 16px", display:"flex", alignItems:"center", gap:10 }}>
                      <StatusDot status={tr.skipped?"muted":hasIssues?"warning":"healthy"}/>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <span style={{ fontFamily:"monospace", fontSize:12, fontWeight:600,
                            color:T.text }}>{tr.table}</span>
                          {tr.agent && (
                            <span style={{ fontSize:10, color:T.muted }}>via {tr.agent}</span>
                          )}
                          {tr.branch_action && (
                            <Badge label={tr.branch_action} color={T.purple}/>
                          )}
                        </div>
                        <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>
                          {tr.skipped ? "Skipped by branching rule"
                            : hasIssues ? `${tr.issues.length} issue(s) found`
                            : "All checks passed"}
                        </div>
                      </div>
                      <div style={{ display:"flex", gap:6 }}>
                        {hasIssues && (
                          <>
                            <Btn size="sm" variant="muted" onClick={() => toggle(i)}>
                              <Eye size={10}/> {isExp ? "Hide" : "Details"}
                            </Btn>
                            <Btn size="sm" variant="ghost"
                              onClick={() => onSendToTriage(tr, wf.name)}
                              style={{ color:T.accent, borderColor:`${T.accent}40` }}>
                              <ArrowRight size={10}/> Send to Triage
                            </Btn>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Issue details */}
                    {isExp && hasIssues && (
                      <div style={{ borderTop:`1px solid ${T.border}`,
                        padding:"10px 16px", display:"flex", flexDirection:"column", gap:8 }}>
                        {tr.issues.map((iss, j) => (
                          <div key={j} style={{ padding:"8px 12px", borderRadius:6,
                            background:`${SEV[iss.severity]||T.orange}08`,
                            border:`1px solid ${SEV[iss.severity]||T.orange}25` }}>
                            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                              <Badge label={iss.severity||"medium"} color={SEV[iss.severity]||T.orange}/>
                              <span style={{ fontSize:11, fontWeight:600, color:T.text,
                                textTransform:"capitalize" }}>
                                {iss.type?.replace(/_/g," ") || "Issue"}
                              </span>
                              {iss.count != null && (
                                <span style={{ fontSize:11, fontFamily:"monospace",
                                  color:T.muted }}>· {iss.count} row(s)</span>
                              )}
                              {iss.column && (
                                <span style={{ fontSize:10, fontFamily:"monospace",
                                  color:T.cyan }}>col: {iss.column}</span>
                              )}
                            </div>
                            {iss.msg && (
                              <div style={{ fontSize:11, color:T.text2 }}>{iss.msg}</div>
                            )}
                            {iss.age_hours != null && (
                              <div style={{ fontSize:11, color:T.orange }}>
                                {iss.age_hours}h since last update
                              </div>
                            )}
                          </div>
                        ))}

                        {/* Trace log */}
                        {tr.trace?.length > 0 && (
                          <details style={{ marginTop:4 }}>
                            <summary style={{ fontSize:10, color:T.muted, cursor:"pointer" }}>
                              Agent trace ({tr.trace.length} steps)
                            </summary>
                            <div style={{ marginTop:6, display:"flex", flexDirection:"column", gap:3 }}>
                              {tr.trace.map((t,k) => (
                                <div key={k} style={{ fontSize:10, fontFamily:"monospace",
                                  color: t.level==="error"?T.red:t.level==="warning"?T.orange:T.muted }}>
                                  [{t.node}] {t.msg}
                                </div>
                              ))}
                            </div>
                          </details>
                        )}
                      </div>
                    )}
                  </Card>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function WorkflowBuilder({ initial, onSave, onCancel }) {
  const T = useT();
  const dbSchema = useSchema();
  const blank = { name:"", desc:"", trigger:"manual", schedule:"",
                  agents:[], tables:[], branches:[], endpoint:"" };
  const [wf,       setWf]       = React.useState(initial ? {...blank,...initial, branches: initial.branches||[]} : blank);
  const [agentIn,  setAgentIn]  = React.useState("");
  const [tableIn,  setTableIn]  = React.useState("");
  const [aiLoading,setAiLoading]= React.useState(false);
  const [aiHints,  setAiHints]  = React.useState(null);
  const [showScenarios, setShowScenarios] = React.useState(!initial);

  const SCENARIOS = [
    { icon:"🌅", label:"Daily freshness check", desc:"Check that data arrived today for key tables",
      name:"Daily Freshness Check", trigger:"scheduled", schedule:"8:00 AM IST",
      agents:["Freshness Agent"], tables:["mws.report","mws.orders"] },
    { icon:"📥", label:"Post-download validation", desc:"Validate data quality after a download pipeline runs",
      name:"Post-Download Validation", trigger:"event", schedule:"",
      agents:["Null Check Agent","Dupe Check Agent","Row Count Agent"], tables:["mws.report"] },
    { icon:"⚠️", label:"Alert on failed downloads", desc:"Detect and notify when report downloads fail",
      name:"Download Failure Monitor", trigger:"scheduled", schedule:"Every 2 hours",
      agents:["Download Monitor","Failure Classifier"], tables:["mws.report"] },
    { icon:"📊", label:"Weekly data integrity scan", desc:"Deep integrity checks across all key tables",
      name:"Weekly Integrity Scan", trigger:"scheduled", schedule:"Monday 9:00 AM IST",
      agents:["Null Check Agent","Dupe Check Agent","Freshness Agent","Integrity Agent"], tables:["mws.report","mws.orders","mws.inventory"] },
    { icon:"🔁", label:"Replication health check", desc:"Monitor Redshift replication status",
      name:"Replication Health Check", trigger:"scheduled", schedule:"6:00 AM IST",
      agents:["Copy Status Monitor","Stuck Copy Detector"], tables:["mws.report"] },
  ];

  const applyScenario = (s) => {
    setWf(p => ({...p, name:s.name, desc:s.desc, trigger:s.trigger,
      schedule:s.schedule, agents:[...s.agents], tables:[...s.tables]}));
    setShowScenarios(false);
  };

  const blankBranch = () => ({ id: Date.now(), afterAgent:"", condition:"on_failure", action:"notify", target:"" });
  const addBranch    = () => setWf(p=>({...p, branches:[...p.branches, blankBranch()]}));
  const removeBranch = (id) => setWf(p=>({...p, branches:p.branches.filter(b=>b.id!==id)}));
  const updateBranch = (id, key, val) => setWf(p=>({
    ...p, branches: p.branches.map(b => b.id===id ? {...b,[key]:val} : b)
  }));

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
${dbSchema ? "Available tables: " + dbSchema.split(";").map(t=>t.split("(")[0].trim()).filter(Boolean).join(", ") : "Available tables: mws.report, mws.orders, mws.inventory, public.tbl_amzn_campaign_report, public.tbl_amzn_keyword_report"}.
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
        {/* Scenario picker — shown when blank */}
        {showScenarios && !wf.name && (
          <Card style={{ padding:"18px 20px",
            borderColor:`${T.accent}30`, background:`${T.accent}04` }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:T.text }}>
                  Start from a common scenario
                </div>
                <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>
                  Pick one to pre-fill the form, or skip and build from scratch below.
                </div>
              </div>
              <Btn size="sm" variant="ghost" onClick={()=>setShowScenarios(false)}>
                Skip →
              </Btn>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
              {SCENARIOS.map((s,i) => (
                <button key={i} onClick={()=>applyScenario(s)}
                  style={{ display:"flex", alignItems:"center", gap:12,
                    padding:"10px 14px", borderRadius:8, border:`1px solid ${T.border}`,
                    background:T.surface, cursor:"pointer", textAlign:"left",
                    transition:"all 0.12s" }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=T.accent; e.currentTarget.style.background=`${T.accent}06`;}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border; e.currentTarget.style.background=T.surface;}}>
                  <span style={{ fontSize:20, flexShrink:0 }}>{s.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:600, color:T.text }}>{s.label}</div>
                    <div style={{ fontSize:11, color:T.muted, marginTop:1 }}>{s.desc}</div>
                  </div>
                  <ArrowRight size={12} color={T.muted}/>
                </button>
              ))}
            </div>
          </Card>
        )}

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

        {/* Branching Rules */}
        <Card style={{ padding:"18px 20px", borderColor:`${T.orange}30`, background:`${T.orange}04` }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
            <div style={{ fontSize:11, fontWeight:700, color:T.muted,
              textTransform:"uppercase", letterSpacing:"0.06em" }}>Conditional Branching</div>
            <Btn onClick={addBranch} size="sm" variant="ghost"
              style={{ fontSize:10, color:T.orange, borderColor:`${T.orange}40` }}>
              <Plus size={10}/> Add Rule
            </Btn>
          </div>

          {wf.branches.length === 0 ? (
            <div style={{ fontSize:11, color:T.dim, padding:"8px 0" }}>
              No branching rules — agents run sequentially. Add a rule to control failure routing.
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {wf.branches.map((b, idx) => (
                <div key={b.id} style={{
                  display:"flex", alignItems:"center", gap:6, flexWrap:"wrap",
                  padding:"10px 12px", borderRadius:7,
                  background:T.surface, border:`1px solid ${T.border}`,
                }}>
                  {/* Rule number */}
                  <div style={{
                    minWidth:18, height:18, borderRadius:"50%", display:"flex",
                    alignItems:"center", justifyContent:"center",
                    background:`${T.orange}18`, fontSize:10, fontWeight:700, color:T.orange,
                  }}>{idx+1}</div>

                  <span style={{ fontSize:11, color:T.muted }}>After</span>

                  {/* After which agent */}
                  <select value={b.afterAgent}
                    onChange={e=>updateBranch(b.id,"afterAgent",e.target.value)}
                    style={{ fontSize:11, padding:"3px 6px", borderRadius:5,
                      border:`1px solid ${T.border}`, background:T.surface, color:T.text,
                      fontFamily:"inherit", minWidth:120 }}>
                    <option value="">— any agent —</option>
                    {wf.agents.map((a,i)=>(
                      <option key={i} value={a}>{a}</option>
                    ))}
                  </select>

                  {/* Condition */}
                  <select value={b.condition}
                    onChange={e=>updateBranch(b.id,"condition",e.target.value)}
                    style={{ fontSize:11, padding:"3px 6px", borderRadius:5,
                      border:`1px solid ${T.border}`, background:T.surface, color:T.text,
                      fontFamily:"inherit" }}>
                    <option value="on_failure">on failure</option>
                    <option value="on_success">on success</option>
                    <option value="always">always</option>
                  </select>

                  <ArrowRight size={11} color={T.muted}/>

                  {/* Action */}
                  <select value={b.action}
                    onChange={e=>updateBranch(b.id,"action",e.target.value)}
                    style={{ fontSize:11, padding:"3px 6px", borderRadius:5,
                      border:`1px solid ${T.border}`, background:T.surface, color:T.text,
                      fontFamily:"inherit" }}>
                    <option value="notify">Notify & continue</option>
                    <option value="stop">Stop workflow</option>
                    <option value="skip_remaining">Skip remaining agents</option>
                    <option value="run_agent">Run specific agent</option>
                  </select>

                  {/* Target agent (only for run_agent) */}
                  {b.action === "run_agent" && (
                    <select value={b.target}
                      onChange={e=>updateBranch(b.id,"target",e.target.value)}
                      style={{ fontSize:11, padding:"3px 6px", borderRadius:5,
                        border:`1px solid ${T.accent}60`, background:`${T.accent}08`,
                        color:T.text, fontFamily:"inherit", minWidth:120 }}>
                      <option value="">— pick agent —</option>
                      {wf.agents.filter(a=>a!==b.afterAgent).map((a,i)=>(
                        <option key={i} value={a}>{a}</option>
                      ))}
                    </select>
                  )}

                  {/* Remove */}
                  <button onClick={()=>removeBranch(b.id)}
                    style={{ marginLeft:"auto", background:"none", border:"none",
                      cursor:"pointer", color:T.muted, padding:2, lineHeight:1,
                      fontSize:14, borderRadius:4 }}>×</button>
                </div>
              ))}
            </div>
          )}

          {wf.branches.length > 0 && wf.agents.length === 0 && (
            <div style={{ marginTop:8, fontSize:10, color:T.orange }}>
              ⚠ Add agents above to bind branching rules to specific steps.
            </div>
          )}
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

  // ── Keyboard shortcuts ────────────────────────────────────────────────────
  React.useEffect(() => {
    const SHORTCUT_MAP = {
      "1":"brief", "2":"monitor", "3":"triage", "4":"workflows",
      "5":"activity", "6":"chat", "7":"config", "8":"query",
      "a":"approvals",
    };
    const handler = (e) => {
      // Skip if user is typing in an input/textarea
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;
      // Cmd+K / Ctrl+K — open command palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault(); setPaletteOpen(p => !p); return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tab = SHORTCUT_MAP[e.key.toLowerCase()];
      if (tab) { e.preventDefault(); setActiveTab(tab); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  const [issues,    setIssues]    = useSession("wz_pendingIssues", []);
  const [schemaStr, setSchemaStr] = React.useState("");
  const [globalStatus, setGlobalStatus] = React.useState(null); // { type, message, runId }
  const [paletteOpen, setPaletteOpen]   = React.useState(false);
  const [tabHistory,  setTabHistory]    = React.useState([]); // last 5 tabs

  // Track tab history for back navigation + URL hash sync
  const navigateTo = React.useCallback((tab) => {
    setTabHistory(prev => {
      const filtered = prev.filter(t => t !== tab);
      return [...filtered, activeTab].slice(-5);
    });
    setActiveTab(tab);
    window.location.hash = tab;
  }, [activeTab]);

  // Restore tab from URL hash on mount
  React.useEffect(() => {
    const hash = window.location.hash.replace("#","").trim();
    const valid = NAV.map(n=>n.id);
    if (hash && valid.includes(hash)) setActiveTab(hash);
  }, []);

  // Sync hash when activeTab changes externally (localStorage restore)
  React.useEffect(() => {
    const hash = window.location.hash.replace("#","").trim();
    if (hash !== activeTab) window.location.hash = activeTab;
  }, [activeTab]);

  const goBack = React.useCallback(() => {
    if (!tabHistory.length) return;
    const prev = tabHistory[tabHistory.length - 1];
    setTabHistory(h => h.slice(0,-1));
    setActiveTab(prev);
  }, [tabHistory]);

  // Wire back shortcut: Backspace or Alt+Left (when not in input)
  React.useEffect(() => {
    const handler = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;
      if ((e.altKey && e.key === "ArrowLeft") || e.key === "Backspace") {
        if (tabHistory.length > 0) { e.preventDefault(); goBack(); }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goBack, tabHistory]);

  // ── Global status bar — poll active runs every 15s ────────────────────────
  React.useEffect(() => {
    const poll = async () => {
      try {
        const res  = await fetch(`${API}/api/workflow/history`);
        const data = await res.json();
        if (!Array.isArray(data)) return;
        const active = data.find(r => r.status === "running");
        if (active) {
          setGlobalStatus({ type:"running", message:`Workflow running: ${active.name||active.run_id}`, runId:active.run_id });
        } else {
          // Check custom workflow history too
          const res2 = await fetch(`${API}/api/custom-workflows/history`);
          const data2 = await res2.json();
          if (Array.isArray(data2)) {
            const active2 = data2.find(r => r.status === "running");
            if (active2) {
              setGlobalStatus({ type:"running", message:`Workflow running: ${active2.workflow_name}`, runId:active2.run_id });
              return;
            }
          }
          setGlobalStatus(null);
        }
      } catch(e) {}
    };
    poll();
    const id = setInterval(poll, 15000);
    return () => clearInterval(id);
  }, []);

  // Fetch live schema once on mount — used by all AI system prompts
  React.useEffect(() => {
    fetch(`${API}/api/schema`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Build compact string: "schema.table(col:type,...); ..."
          const str = data.map(t =>
            `${t.table_schema}.${t.table_name}(${
              (t.columns||[]).map(c => c.column_name).join(",")
            })`
          ).join("; ");
          setSchemaStr(str);
        }
      })
      .catch(() => {});
  }, []);

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
    <SchemaCtx.Provider value={schemaStr}>
    <ThemeCtx.Provider value={T}>
      {paletteOpen && (
        <CommandPalette
          onNavigate={setActiveTab}
          onClose={() => setPaletteOpen(false)}
        />
      )}
      <style>{GLOBAL_CSS}</style>
      <div style={{
        display:"flex", minHeight:"100vh",
        background:T.bg, color:T.text,
        fontFamily:T.font,
      }}>
        <Sidebar
          active={activeTab}
          setActive={navigateTo}
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
          {/* Back button + breadcrumb */}
          {tabHistory.length > 0 && (
            <div style={{ display:"flex", alignItems:"center", gap:8,
              padding:"5px 16px", borderBottom:`1px solid ${TC.border}`,
              background:TC.surface }}>
              <button onClick={goBack}
                style={{ display:"flex", alignItems:"center", gap:5, background:"none",
                  border:"none", cursor:"pointer", color:TC.muted, fontSize:11,
                  padding:"3px 6px", borderRadius:5 }}
                onMouseEnter={e=>e.currentTarget.style.background=TC.border}
                onMouseLeave={e=>e.currentTarget.style.background="none"}>
                <ChevronRight size={11} style={{transform:"rotate(180deg)"}}/> Back
              </button>
              <span style={{ fontSize:10, color:TC.dim }}>
                {tabHistory.slice(-3).map((t,i) => (
                  <span key={t}>
                    {i > 0 && <span style={{margin:"0 4px",opacity:0.4}}>/</span>}
                    <span style={{cursor:"pointer", textTransform:"capitalize"}}
                      onClick={() => {
                        const idx = tabHistory.lastIndexOf(t);
                        setTabHistory(h => h.slice(0, idx));
                        setActiveTab(t);
                      }}>
                      {NAV.find(n=>n.id===t)?.label || t}
                    </span>
                  </span>
                ))}
                <span style={{margin:"0 4px",opacity:0.4}}>/</span>
                <span style={{fontWeight:600, color:TC.text2}}>
                  {NAV.find(n=>n.id===activeTab)?.label || activeTab}
                </span>
              </span>
            </div>
          )}

          {/* Global status bar */}
          {globalStatus && (
            <div style={{
              display:"flex", alignItems:"center", gap:10,
              padding:"7px 20px",
              background: globalStatus.type==="running"
                ? `linear-gradient(90deg,${TC.accent}18,${TC.purple}18)`
                : `${TC.orange}12`,
              borderBottom:`1px solid ${TC.border}`,
              fontSize:12,
            }}>
              {globalStatus.type==="running"
                ? <Spinner size={12} color={TC.accent}/>
                : <AlertTriangle size={12} color={TC.orange}/>}
              <span style={{ color:TC.text, fontWeight:500 }}>{globalStatus.message}</span>
              {globalStatus.type==="running" && (
                <Btn size="sm" variant="ghost" onClick={()=>navigateTo("workflows")}
                  style={{ marginLeft:"auto", fontSize:10 }}>
                  View <ArrowRight size={10}/>
                </Btn>
              )}
              <button onClick={()=>setGlobalStatus(null)}
                style={{ background:"none", border:"none", cursor:"pointer",
                  color:TC.muted, fontSize:14, lineHeight:1, marginLeft: globalStatus.type==="running" ? 0 : "auto" }}>
                ×
              </button>
            </div>
          )}

          {activeTab==="brief"     && <MorningBriefTab onNavigate={navigateTo} onIssueFound={setIssues}/>}
          {activeTab==="monitor"   && <MonitorTab/>}
          {activeTab==="triage"    && <TriageTab initialIssues={issues}/>}
          {activeTab==="workflows" && <WorkflowsTab/>}
          {activeTab==="approvals" && <ApprovalQueueTab onNavigate={navigateTo}/>}
          {activeTab==="activity"  && <ActivityTab onNavigate={navigateTo}/>}
          {activeTab==="chat"      && <AskWiziTab onAddMonitor={()=>{}} onSaveRule={()=>{}}/>}
          {activeTab==="config"    && <ConfigureTab/>}
          {activeTab==="query"     && <QueryTab/>}
        </main>
        </ThemeCtx.Provider>
      </div>
    </ThemeCtx.Provider>
    </SchemaCtx.Provider>
  );
}
