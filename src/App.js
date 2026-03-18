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
  // ── Arctic: clinical white + deep cobalt. Precision instrument aesthetic.
  arctic: {
    name:"Arctic", isDark:false,
    bg:"#F0F4F8", surface:"#FFFFFF", card:"#FFFFFF",
    border:"#DDE3EA", border2:"#C8D2DC",
    text:"#0A1628", text2:"#1E3A5F", muted:"#5A7A9A", dim:"#8BA5BE",
    accent:"#1A56DB", accentL:"#2563EB",
    green:"#047857", greenL:"#059669",
    yellow:"#B45309", red:"#B91C1C", orange:"#C2410C",
    purple:"#5B21B6", cyan:"#0E7490",
    sidebarBg:"#0A1628", navActiveBg:"rgba(26,86,219,0.15)",
    navActiveText:"#60A5FA", navInactiveText:"#5A7A9A",
    font:"'DM Sans', sans-serif",
    monoFont:"'JetBrains Mono', monospace",
    googleFonts:"DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500",
  },
  // ── Midnight: deep navy + electric teal. Ops command center.
  midnight: {
    name:"Midnight", isDark:true,
    bg:"#080E1A", surface:"#0D1626", card:"#111F35",
    border:"#1A2E4A", border2:"#243D5E",
    text:"#E8F0FA", text2:"#B8CCE4", muted:"#6B8CAE", dim:"#4A6585",
    accent:"#00D4B4", accentL:"#00E8C8",
    green:"#00C896", greenL:"#00DCA8",
    yellow:"#FFB84D", red:"#FF4D6D", orange:"#FF8C42",
    purple:"#9B6DFF", cyan:"#00BFFF",
    sidebarBg:"#050C18", navActiveBg:"rgba(0,212,180,0.12)",
    navActiveText:"#00E8C8", navInactiveText:"#4A6585",
    font:"'Outfit', sans-serif",
    monoFont:"'Fira Code', monospace",
    googleFonts:"Outfit:wght@300;400;500;600;700&family=Fira+Code:wght@400;500",
  },
  // ── Slate: warm charcoal + amber. Refined industrial tool.
  slate: {
    name:"Slate", isDark:true,
    bg:"#141210", surface:"#1C1917", card:"#231F1C",
    border:"#2C2825", border2:"#3D3733",
    text:"#F5F0EB", text2:"#D4CBC0", muted:"#7D6F62", dim:"#564A3F",
    accent:"#F59E0B", accentL:"#FBB237",
    green:"#22C55E", greenL:"#4ADE80",
    yellow:"#EAB308", red:"#EF4444", orange:"#F97316",
    purple:"#A78BFA", cyan:"#22D3EE",
    sidebarBg:"#0E0C0A", navActiveBg:"rgba(245,158,11,0.12)",
    navActiveText:"#FBB237", navInactiveText:"#564A3F",
    font:"'Syne', sans-serif",
    monoFont:"'Source Code Pro', monospace",
    googleFonts:"Syne:wght@400;500;600;700;800&family=Source+Code+Pro:wght@400;500",
  },
  // ── Sage: soft sage green + warm sand. Calm focused work.
  sage: {
    name:"Sage", isDark:false,
    bg:"#F2F5F1", surface:"#FAFCF9", card:"#FFFFFF",
    border:"#D8E4D4", border2:"#C2D5BB",
    text:"#1A2E1A", text2:"#2D4A2D", muted:"#5C7A58", dim:"#8FA48B",
    accent:"#2D6A2D", accentL:"#3D8A3D",
    green:"#15803D", greenL:"#16A34A",
    yellow:"#A16207", red:"#B91C1C", orange:"#C2410C",
    purple:"#6B21A8", cyan:"#0E7490",
    sidebarBg:"#1A2E1A", navActiveBg:"rgba(45,106,45,0.15)",
    navActiveText:"#86EFAC", navInactiveText:"#4A6545",
    font:"'Nunito', sans-serif",
    monoFont:"'IBM Plex Mono', monospace",
    googleFonts:"Nunito:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500",
  },
  // ── Classic Light: clean professional. Default.
  light: {
    name:"Light", isDark:false,
    bg:"#F7F8FA", surface:"#FFFFFF", card:"#FFFFFF",
    border:"#E8ECF0", border2:"#D1D9E0",
    text:"#0D1117", text2:"#374151", muted:"#6B7280", dim:"#9CA3AF",
    accent:"#2563EB", accentL:"#3B82F6",
    green:"#059669", greenL:"#10B981",
    yellow:"#D97706", red:"#DC2626", orange:"#EA580C",
    purple:"#7C3AED", cyan:"#0891B2",
    sidebarBg:"#0D1117", navActiveBg:"rgba(37,99,235,0.12)",
    navActiveText:"#60A5FA", navInactiveText:"#4B5563",
    font:"'IBM Plex Sans', sans-serif",
    monoFont:"'IBM Plex Mono', monospace",
    googleFonts:"IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500",
  },
  // ── Classic Dark
  dark: {
    name:"Dark", isDark:true,
    bg:"#0D1117", surface:"#161B22", card:"#1C2128",
    border:"#21262D", border2:"#30363D",
    text:"#E6EDF3", text2:"#C9D1D9", muted:"#8B949E", dim:"#6E7681",
    accent:"#3B82F6", accentL:"#60A5FA",
    green:"#10B981", greenL:"#34D399",
    yellow:"#F59E0B", red:"#EF4444", orange:"#F97316",
    purple:"#8B5CF6", cyan:"#06B6D4",
    sidebarBg:"#010409", navActiveBg:"rgba(59,130,246,0.12)",
    navActiveText:"#60A5FA", navInactiveText:"#6E7681",
    font:"'IBM Plex Sans', sans-serif",
    monoFont:"'IBM Plex Mono', monospace",
    googleFonts:"IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500",
  },
};

// backwards compat helpers
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
  .mono { font-family:T.monoFont||"T.monoFont||"'IBM Plex Mono',monospace""; }
`;


// ─── Nav items ────────────────────────────────────────────────────────────────
const NAV = [
  { id:"brief",    label:"Morning Brief",  icon:Zap,          shortcut:"1" },
  { id:"monitor",  label:"Monitor",        icon:Activity,     shortcut:"2" },
  { id:"triage",   label:"Triage",         icon:AlertTriangle,shortcut:"3" },
  { id:"history",  label:"Fix History",    icon:Shield,       shortcut:"4" },
  { id:"chat",     label:"Ask WiziAgent",  icon:MessageSquare,shortcut:"5" },
  { id:"config",   label:"Configure",      icon:Settings,     shortcut:"6" },
  { id:"query",    label:"Query",          icon:Terminal,     shortcut:"7" },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ active, setActive, pendingCount, themeKey, setThemeKey }) {
  const T = useT();
  const [showThemes, setShowThemes] = React.useState(false);

  const THEME_LIST = [
    { key:"light",    label:"Light",    dot:"#F7F8FA",  dot2:"#2563EB" },
    { key:"dark",     label:"Dark",     dot:"#0D1117",  dot2:"#3B82F6" },
    { key:"midnight", label:"Midnight", dot:"#080E1A",  dot2:"#00D4B4" },
    { key:"slate",    label:"Slate",    dot:"#141210",  dot2:"#F59E0B" },
    { key:"arctic",   label:"Arctic",   dot:"#F0F4F8",  dot2:"#1A56DB" },
    { key:"sage",     label:"Sage",     dot:"#F2F5F1",  dot2:"#2D6A2D" },
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
          const hasBadge = item.id === "triage" && pendingCount > 0;
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

function MorningBriefTab({ onNavigate, onIssueFound }) {
  const T = useT();
  const [brief,    setBrief]    = useSession("wz_brief", null);
  const [loading,  setLoading]  = React.useState(!brief);
  const [error,    setError]    = React.useState(null);
  const [lastFetch,setLastFetch]= useLocal("wz_briefTs", null);

  const load = React.useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res  = await fetch(`${API}/api/report/triage`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setBrief(data);
      setLastFetch(new Date().toISOString());
      if (data.issues?.length > 0 && onIssueFound) onIssueFound(data.issues);
    } catch(e) {
      setError(e.message);
    }
    setLoading(false);
  }, []);

  // Auto-fetch on mount
  React.useEffect(() => { load(); }, []);

  const issues     = brief?.issues || [];
  const totalRows  = brief?.total_rows || 0;
  const isHealthy  = issues.length === 0 && !loading && brief;
  const scannedAt  = brief?.scanned_at
    ? new Date(brief.scanned_at).toLocaleTimeString()
    : null;

  const SEV_COLOR = { critical:T.red, high:T.orange, medium:T.yellow, low:T.cyan };
  const SEV_RANK  = { critical:0, high:1, medium:2, low:3 };
  const sorted    = [...issues].sort((a,b)=>(SEV_RANK[a.severity]||9)-(SEV_RANK[b.severity]||9));

  return (
    <div className="fade-in" style={{ padding:"28px 32px", maxWidth:980 }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:28 }}>
        <div>
          <div style={{ fontSize:22, fontWeight:700, color:T.text, letterSpacing:"-0.02em" }}>
            Morning Brief
          </div>
          <div style={{ fontSize:13, color:T.muted, marginTop:4 }}>
            {loading ? "Scanning mws.report…" :
             scannedAt ? `Last checked at ${scannedAt} · ${totalRows.toLocaleString()} rows` :
             "mws.report health overview"}
          </div>
        </div>
        <Btn onClick={load} disabled={loading} variant="ghost" size="sm">
          {loading ? <Spinner size={12}/> : <RefreshCw size={12}/>}
          {loading ? "Scanning…" : "Refresh"}
        </Btn>
      </div>

      {/* Error */}
      {error && (
        <Card style={{ padding:"14px 18px", marginBottom:20, borderColor:`${T.red}40`, background:`${T.red}06` }}>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <XCircle size={16} color={T.red}/>
            <div style={{ fontSize:12, color:T.red }}>{error}</div>
            <Btn onClick={load} size="sm" variant="ghost" style={{ marginLeft:"auto" }}>Retry</Btn>
          </div>
        </Card>
      )}

      {/* Summary banner */}
      {!loading && brief && (
        <Card style={{
          padding:"20px 24px", marginBottom:24,
          background: isHealthy ? `${T.green}08` : `${T.red}06`,
          borderColor: isHealthy ? `${T.green}30` : `${T.red}30`,
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            {isHealthy
              ? <CheckCircle size={28} color={T.green} strokeWidth={1.5}/>
              : <AlertTriangle size={28} color={T.red} strokeWidth={1.5}/>
            }
            <div style={{ flex:1 }}>
              <div style={{ fontSize:16, fontWeight:700,
                color: isHealthy ? T.green : T.red }}>
                {isHealthy
                  ? "All checks passed — mws.report is healthy"
                  : `${issues.length} issue${issues.length>1?"s":""} require attention`
                }
              </div>
              <div style={{ fontSize:12, color:T.muted, marginTop:3 }}>
                {totalRows.toLocaleString()} rows scanned ·{" "}
                {isHealthy
                  ? "status: processed, copy_status: REPLICATED, no stuck copies"
                  : issues.map(i=>i.title).join(" · ")}
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

      {/* Loading skeleton */}
      {loading && !brief && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {[1,2,3].map(i => (
            <div key={i} style={{
              height:72, borderRadius:10, background:T.border,
              animation:"pulse 1.5s infinite",
              animationDelay:`${i*0.1}s`
            }}/>
          ))}
        </div>
      )}

      {/* Issue cards */}
      {!loading && sorted.length > 0 && (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {sorted.map(issue => {
            const color = SEV_COLOR[issue.severity] || T.muted;
            return (
              <Card key={issue.id} hoverable style={{ padding:"16px 20px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                  <div style={{
                    width:40, height:40, borderRadius:10, flexShrink:0,
                    background:`${color}12`,
                    display:"flex", alignItems:"center", justifyContent:"center"
                  }}>
                    <AlertTriangle size={18} color={color} strokeWidth={1.5}/>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                      <span style={{ fontSize:13, fontWeight:600, color:T.text }}>
                        {issue.title}
                      </span>
                      <Badge label={issue.severity} color={color}/>
                      <span className="mono" style={{ fontSize:10, color:T.dim }}>{issue.id}</span>
                    </div>
                    <div style={{ fontSize:12, color:T.muted }}>{issue.description}</div>
                    {issue.breakdown?.length > 0 && (
                      <div style={{ display:"flex", gap:6, marginTop:6, flexWrap:"wrap" }}>
                        {issue.breakdown.map(b => (
                          <span key={b.status} className="mono"
                            style={{ fontSize:10, padding:"2px 7px",
                              background:T.border, color:T.muted, borderRadius:4 }}>
                            {b.status}: {b.count}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontSize:24, fontWeight:700, color,
                      fontFamily:T.monoFont }}>
                      {issue.count.toLocaleString()}
                    </div>
                    <div style={{ fontSize:10, color:T.muted, textTransform:"uppercase",
                      letterSpacing:"0.04em" }}>rows</div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:6, marginLeft:8 }}>
                    <Btn size="sm" onClick={()=>onNavigate("triage")}>
                      Fix <ArrowRight size={11}/>
                    </Btn>
                    <Btn size="sm" variant="ghost"
                      onClick={()=>onNavigate("chat")}>
                      Ask AI
                    </Btn>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Health checks legend (always visible) */}
      {!loading && brief && (
        <Card style={{ marginTop:24, padding:"16px 20px" }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.muted, marginBottom:12,
            textTransform:"uppercase", letterSpacing:"0.06em" }}>
            Health Checks — mws.report
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
            {[
              { label:"All status = processed",        check:"status != 'processed'",        pass:!issues.find(i=>i.id==="RPT-001"), id:"RPT-001" },
              { label:"All copy_status = REPLICATED",  check:"copy_status != 'REPLICATED'",  pass:!issues.find(i=>i.id==="RPT-002"), id:"RPT-002" },
              { label:"No reports stuck in copy >2h",  check:"processed, copy pending >2h",  pass:!issues.find(i=>i.id==="RPT-003"), id:"RPT-003" },
            ].map(c => (
              <div key={c.label} style={{
                padding:"10px 12px", borderRadius:8,
                background: c.pass ? `${T.green}08` : `${T.red}06`,
                border:`1px solid ${c.pass ? T.green : T.red}20`
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
                  {c.pass
                    ? <CheckCircle size={13} color={T.green}/>
                    : <XCircle size={13} color={T.red}/>
                  }
                  <span style={{ fontSize:11, fontWeight:600,
                    color: c.pass ? T.green : T.red }}>{c.label}</span>
                </div>
                <div className="mono" style={{ fontSize:9, color:T.dim }}>{c.check}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}


// ─── Triage Tab ───────────────────────────────────────────────────────────────
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

  const addLog = (msg, level="info") =>
    setLog(p => [...p.slice(-80), { ts:new Date().toLocaleTimeString(), msg, level }]);

  const scan = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/report/triage`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setTriageResult(data);
      setFixResults({}); setDryRuns({});
      addLog(`Scanned mws.report — ${data.total_rows?.toLocaleString()} rows, ${data.issues?.length||0} issues`, "info");
    } catch(e) { addLog(`Scan failed: ${e.message}`, "error"); }
    setLoading(false);
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
    if (!window.confirm(`Fix mws.report — ${issue.fix_action}\nAffected: ${dryRuns[issue.id]?.rows_affected} rows\n\nProceed?`)) return;
    setFixing(p => ({...p,[issue.id]:true}));
    addLog(`Executing fix: ${issue.fix_action}…`);
    try {
      const res  = await fetch(`${API}/api/report/fix`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ fix_action:issue.fix_action, dry_run:false })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setFixResults(p => ({...p,[issue.id]:data}));
      addLog(`✓ Fixed: before ${data.before} → after ${data.after}`, "success");
    } catch(e) { addLog(`Fix failed: ${e.message}`, "error"); }
    setFixing(p => ({...p,[issue.id]:false}));
  };

  const runWiziAgent = async () => {
    setAgentRunning(true); setAgentResult(null);
    addLog("✨ WiziAgent starting autonomous triage…");
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

  const issues    = triageResult?.issues || [];
  const SEV_COLOR = { critical:T.red, high:T.orange, medium:T.yellow, low:T.cyan };

  return (
    <div className="fade-in" style={{ padding:"28px 32px", maxWidth:1100 }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
        <div>
          <div style={{ fontSize:22, fontWeight:700, color:T.text, letterSpacing:"-0.02em" }}>Triage</div>
          <div style={{ fontSize:13, color:T.muted, marginTop:3 }}>
            Review issues · approve fixes · run WiziAgent for autonomous resolution
          </div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
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
          {/* Empty state */}
          {!triageResult && !loading && (
            <EmptyState icon={Shield} title="No scan yet"
              desc="Click Scan or Run WiziAgent to check mws.report"
              action={<Btn onClick={scan} size="sm">Scan Now</Btn>}
            />
          )}
          {triageResult?.clean && (
            <Card style={{ padding:"24px", background:`${T.green}06`,
              borderColor:`${T.green}30`, textAlign:"center" }}>
              <CheckCircle size={32} color={T.green} strokeWidth={1.5}
                style={{ margin:"0 auto 12px", display:"block" }}/>
              <div style={{ fontSize:15, fontWeight:700, color:T.green }}>
                mws.report is clean
              </div>
              <div style={{ fontSize:12, color:T.muted, marginTop:4 }}>
                All {triageResult.total_rows?.toLocaleString()} rows passed all checks
              </div>
            </Card>
          )}

          {/* WiziAgent approval gate */}
          {agentResult?.status === "awaiting_approval" && agentResult.approval_status === "pending" && (
            <Card style={{ padding:"18px 20px", borderColor:`${T.yellow}50`,
              background:`${T.yellow}06` }}>
              <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                <Lock size={20} color={T.yellow} style={{ flexShrink:0, marginTop:2 }}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:T.yellow, marginBottom:4 }}>
                    WiziAgent — Approval Required
                  </div>
                  <div style={{ fontSize:12, color:T.muted, marginBottom:12 }}>
                    {agentResult.classification?.risk_reason || "High-risk fix detected — human approval required"}
                    {" "}
                    <span className="mono" style={{ color:T.cyan }}>
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
            <Card style={{ padding:"16px 20px",
              borderColor: agentResult.status==="fixed" ? `${T.green}40` : `${T.yellow}40`,
              background: agentResult.status==="fixed" ? `${T.green}06` : `${T.yellow}06` }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <Zap size={15} color={agentResult.status==="fixed"?T.green:T.yellow}/>
                <span style={{ fontSize:13, fontWeight:700,
                  color:agentResult.status==="fixed"?T.green:T.yellow }}>
                  WiziAgent — {agentResult.status?.toUpperCase()}
                </span>
                <button onClick={()=>setAgentResult(null)}
                  style={{ marginLeft:"auto", background:"none", border:"none",
                    color:T.muted, cursor:"pointer" }}>
                  <X size={14}/>
                </button>
              </div>
              {(agentResult.fix_results||[]).map((r,i) => (
                <div key={i} className="mono"
                  style={{ fontSize:11, color:T.green, marginBottom:3 }}>
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
            const color = SEV_COLOR[issue.severity]||T.muted;
            const dr    = dryRuns[issue.id];
            const fr    = fixResults[issue.id];
            const isExp = expanded[issue.id];
            return (
              <Card key={issue.id} style={{ overflow:"hidden" }}>
                <div style={{ padding:"14px 18px", display:"flex",
                  alignItems:"center", gap:12 }}>
                  <StatusDot status={fr?"fixed":issue.severity==="critical"?"critical":"warning"}/>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:2 }}>
                      <span style={{ fontSize:13, fontWeight:600, color:fr?T.green:T.text }}>
                        {fr ? "✓ Fixed — " : ""}{issue.title}
                      </span>
                      <Badge label={issue.severity} color={color}/>
                    </div>
                    <div style={{ fontSize:11, color:T.muted }}>{issue.description}</div>
                  </div>
                  <div className="mono" style={{ fontSize:20, fontWeight:700,
                    color:fr?T.green:color, flexShrink:0 }}>
                    {fr ? `${fr.before}→${fr.after}` : issue.count.toLocaleString()}
                  </div>
                  <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                    {issue.samples?.length > 0 && (
                      <Btn size="sm" variant="muted"
                        onClick={()=>setExpanded(p=>({...p,[issue.id]:!p[issue.id]}))}>
                        <Eye size={11}/> {isExp?"Hide":"Rows"}
                      </Btn>
                    )}
                    {!fr && !dr && (
                      <Btn size="sm" variant="ghost"
                        onClick={()=>dryRun(issue)}>
                        Dry run
                      </Btn>
                    )}
                    {dr && dr!=="loading" && dr!=="error" && !fr && (
                      <Btn size="sm" variant="danger"
                        onClick={()=>fix(issue)} disabled={fixing[issue.id]}>
                        {fixing[issue.id]?<Spinner size={11} color="white"/>:null}
                        Fix {dr.rows_affected} rows
                      </Btn>
                    )}
                    {dr==="loading" && <Spinner size={14}/>}
                  </div>
                </div>
                {/* Sample rows */}
                {isExp && issue.samples?.length > 0 && (
                  <div style={{ borderTop:`1px solid ${T.border}`,
                    overflowX:"auto", padding:"10px 18px" }}>
                    <table style={{ width:"100%", borderCollapse:"collapse",
                      fontSize:10, fontFamily:T.monoFont }}>
                      <thead>
                        <tr>
                          {Object.keys(issue.samples[0]).map(k => (
                            <th key={k} style={{ textAlign:"left", padding:"3px 10px",
                              color:T.muted, fontWeight:600, borderBottom:`1px solid ${T.border}`,
                              textTransform:"uppercase", letterSpacing:"0.04em", fontSize:9 }}>
                              {k}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {issue.samples.map((row,i) => (
                          <tr key={i} style={{ borderBottom:`1px solid ${T.border}40` }}>
                            {Object.values(row).map((v,j) => (
                              <td key={j} style={{ padding:"5px 10px",
                                color: v===null ? T.red :
                                  String(v).includes("fail") ? T.red :
                                  String(v).includes("REPLICATED") ? T.green : T.text2 }}>
                                {v===null ? "NULL" : String(v)}
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
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <Card style={{ padding:"14px 16px", flex:1 }}>
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
            <div style={{ height:400, overflowY:"auto", display:"flex",
              flexDirection:"column", gap:3 }}>
              {log.length === 0
                ? <div style={{ fontSize:11, color:T.dim }}>No activity yet</div>
                : log.map((l,i) => (
                  <div key={i} style={{ fontFamily:T.monoFont,
                    fontSize:10, lineHeight:1.6,
                    color: l.level==="success"?T.green:
                           l.level==="error"?T.red:
                           l.level==="warning"?T.yellow:T.muted }}>
                    <span style={{ color:T.dim, marginRight:6 }}>{l.ts}</span>
                    {l.msg}
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


// ─── Fix History Tab ──────────────────────────────────────────────────────────
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
  const [sql,     setSql]     = useSession("wz_sql", "SELECT * FROM mws.report LIMIT 10");
  const [results, setResults] = useSession("wz_sqlResults", null);
  const [running, setRunning] = React.useState(false);
  const [error,   setError]   = React.useState(null);
  const [schema,  setSchema]  = useSession("wz_schema", []);

  React.useEffect(() => {
    if (schema.length > 0) return;
    fetch(`${API}/api/tables`).then(r=>r.json()).then(data => {
      if (Array.isArray(data)) setSchema(data);
    }).catch(()=>{});
  }, []);

  const run = async () => {
    setRunning(true); setError(null); setResults(null);
    try {
      const res  = await fetch(`${API}/api/query?sql=${encodeURIComponent(sql)}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResults(data);
    } catch(e) { setError(e.message); }
    setRunning(false);
  };

  const grouped = React.useMemo(() => schema.reduce((acc, t) => {
    const s = t.table_schema || t.schema || "?";
    const n = t.table_name   || t.name   || "";
    if (!acc[s]) acc[s] = [];
    acc[s].push(n);
    return acc;
  }, {}), [schema]);

  return (
    <div className="fade-in" style={{ display:"flex", height:"calc(100vh - 1px)", overflow:"hidden" }}>
      {/* Schema tree */}
      <div style={{ width:190, flexShrink:0, borderRight:`1px solid ${T.border}`,
        overflowY:"auto", padding:"14px 8px" }}>
        <div style={{ fontSize:9, fontWeight:700, color:T.dim, marginBottom:10,
          paddingLeft:8, textTransform:"uppercase", letterSpacing:"0.08em" }}>Schema</div>
        {Object.entries(grouped).map(([sc, tables]) => (
          <div key={sc} style={{ marginBottom:8 }}>
            <div style={{ fontSize:10, fontWeight:700, color:T.accent,
              padding:"2px 8px", fontFamily:T.monoFont }}>{sc}</div>
            {tables.map(t => (
              <button key={t} onClick={()=>setSql(`SELECT * FROM ${sc}.${t} LIMIT 20`)}
                style={{ width:"100%", textAlign:"left", padding:"3px 8px 3px 16px",
                  background:"none", border:"none", cursor:"pointer",
                  fontSize:11, color:T.muted, fontFamily:T.monoFont,
                  borderRadius:4, transition:"color 0.1s" }}
                onMouseEnter={e=>e.currentTarget.style.color=T.text}
                onMouseLeave={e=>e.currentTarget.style.color=T.muted}>
                {t}
              </button>
            ))}
          </div>
        ))}
        {Object.keys(grouped).length === 0 && (
          <div style={{ fontSize:11, color:T.dim, padding:8 }}>Loading…</div>
        )}
      </div>

      {/* Editor + results */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ padding:"14px 20px", borderBottom:`1px solid ${T.border}` }}>
          <textarea value={sql} onChange={e=>setSql(e.target.value)}
            onKeyDown={e=>{ if((e.ctrlKey||e.metaKey)&&e.key==="Enter"){e.preventDefault();run();} }}
            rows={4}
            style={{ width:"100%", padding:"10px 14px", borderRadius:8, resize:"vertical",
              border:`1px solid ${T.border}`, background:T.surface, color:T.text,
              fontSize:12, fontFamily:T.monoFont, outline:"none", lineHeight:1.6 }}
            onFocus={e=>e.target.style.borderColor=T.accent}
            onBlur={e=>e.target.style.borderColor=T.border}
          />
          <div style={{ display:"flex", gap:8, marginTop:8, alignItems:"center" }}>
            <Btn onClick={run} disabled={running} size="sm">
              {running ? <Spinner size={12} color="white"/> : <Play size={12}/>}
              {running ? "Running…" : "Run (Ctrl+↵)"}
            </Btn>
            {results && (
              <span style={{ fontSize:11, color:T.muted }}>{results.rows?.length||0} rows</span>
            )}
          </div>
        </div>

        <div style={{ flex:1, overflow:"auto", padding:"12px 20px" }}>
          {error && (
            <div style={{ padding:"10px 14px", background:`${T.red}08`,
              border:`1px solid ${T.red}30`, borderRadius:8,
              fontSize:12, color:T.red, fontFamily:T.monoFont }}>{error}</div>
          )}
          {results?.rows?.length > 0 && (
            <div style={{ overflowX:"auto" }}>
              <table style={{ borderCollapse:"collapse", fontSize:11,
                fontFamily:T.monoFont, width:"100%" }}>
                <thead>
                  <tr style={{ background:T.surface }}>
                    {results.columns?.map(c => (
                      <th key={c} style={{ padding:"6px 14px", textAlign:"left",
                        color:T.muted, fontWeight:600, fontSize:9,
                        textTransform:"uppercase", letterSpacing:"0.05em",
                        borderBottom:`1px solid ${T.border}`, whiteSpace:"nowrap" }}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.rows.map((row,i) => (
                    <tr key={i} style={{ borderBottom:`1px solid ${T.border}30` }}>
                      {(results.columns||[]).map(c => (
                        <td key={c} style={{ padding:"5px 14px", whiteSpace:"nowrap",
                          color: row[c]===null ? T.red :
                            String(row[c]).includes("fail") ? T.orange : T.text2 }}>
                          {row[c]===null ? <span style={{color:T.red}}>NULL</span> : String(row[c])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {results?.rows?.length === 0 && (
            <div style={{ fontSize:12, color:T.muted, padding:"16px 0" }}>Query returned 0 rows</div>
          )}
        </div>
      </div>
    </div>
  );
}


// ─── Root App ─────────────────────────────────────────────────────────────────
export default function WiziAgentApp() {
  const [themeKey,  setThemeKey]  = useLocal("wz_theme", "light");
  const [activeTab, setActiveTab] = useLocal("wz_tab",   "brief");
  const [issues,    setIssues]    = useSession("wz_pendingIssues", []);

  const T = THEMES[themeKey] || THEMES.light;

  // Inject Google Fonts for current theme
  React.useEffect(() => {
    const id = "wizi-font-link";
    let el = document.getElementById(id);
    if (!el) { el = document.createElement("link"); el.id=id; el.rel="stylesheet"; document.head.appendChild(el); }
    el.href = `https://fonts.googleapis.com/css2?family=${T.googleFonts}&display=swap`;
    document.body.style.fontFamily = T.font;
  }, [T.googleFonts, T.font]);

  const pendingCount = issues.filter(i =>
    i.severity === "critical" || i.severity === "high"
  ).length;

  return (
    <ThemeCtx.Provider value={T}>
      <style>{GLOBAL_CSS}</style>
      <div style={{
        display:"flex", minHeight:"100vh",
        background:T.bg, color:T.text,
        fontFamily: T.font,
      }}>
        <Sidebar
          active={activeTab}
          setActive={setActiveTab}
          pendingCount={pendingCount}
          themeKey={themeKey}
          setThemeKey={setThemeKey}
        />
        <main style={{ flex:1, overflowY:"auto", minWidth:0 }}>
          {activeTab === "brief"   && (
            <MorningBriefTab
              onNavigate={setActiveTab}
              onIssueFound={setIssues}
            />
          )}
          {activeTab === "monitor" && <MonitorTab/>}
          {activeTab === "triage"  && <TriageTab initialIssues={issues}/>}
          {activeTab === "history" && <FixHistoryTab/>}
          {activeTab === "chat"    && <AskWiziTab onAddMonitor={()=>{}} onSaveRule={()=>{}}/>}
          {activeTab === "config"  && <ConfigureTab/>}
          {activeTab === "query"   && <QueryTab/>}
        </main>
      </div>
    </ThemeCtx.Provider>
  );
}

