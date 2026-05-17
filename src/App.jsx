import { useState, useEffect, useCallback, useRef } from "react";

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const USERS_INIT = [
  { id:1,  nombre:"Nico",    apodo:"El Capitán",    pass:"nico123",    isAdmin:true,  color:"#7C3AED" },
  { id:2,  nombre:"Juank",   apodo:"El Otro Admin",  pass:"juank123",   isAdmin:true,  color:"#2563EB" },
  { id:3,  nombre:"Enzo",    apodo:"Al-Koliko",      pass:"enzo123",    isAdmin:false, color:"#059669" },
  { id:4,  nombre:"Maxi",    apodo:"El Tanque",      pass:"maxi123",    isAdmin:false, color:"#DC2626" },
  { id:5,  nombre:"Fede",    apodo:"Mágico",         pass:"fede123",    isAdmin:false, color:"#D97706" },
  { id:6,  nombre:"Lean",    apodo:"El Rápido",      pass:"lean123",    isAdmin:false, color:"#0891B2" },
  { id:7,  nombre:"Seba",    apodo:"El Arquero",     pass:"seba123",    isAdmin:false, color:"#65A30D" },
  { id:8,  nombre:"Matías",  apodo:"Toro",           pass:"matias123",  isAdmin:false, color:"#B45309" },
  { id:9,  nombre:"Gonza",   apodo:"Gordito",        pass:"gonza123",   isAdmin:false, color:"#BE185D" },
  { id:10, nombre:"Rulo",    apodo:"El Crack",       pass:"rulo123",    isAdmin:false, color:"#7C2D12" },
  { id:11, nombre:"Pipe",    apodo:"Fantasma",       pass:"pipe123",    isAdmin:false, color:"#1D4ED8" },
];

const STATS_INIT = USERS_INIT.map((u,i) => ({
  ...u,
  pj:    [12,10,11,9,12,8,10,7,6,5,4][i],
  wins:  [8,6,7,5,7,4,5,3,3,2,1][i],
  mvps:  [4,3,2,3,1,2,1,0,1,0,0][i],
  goles: [14,8,18,6,10,2,9,5,7,3,2][i],
  asist: [9,12,4,15,7,3,5,4,6,2,1][i],
  puntosMes:  [52,47,38,31,28,22,18,15,12,8,5][i],
  puntosAnio: [132,110,98,87,74,65,54,42,35,22,14][i],
  top1mes: [3,2,1,1,0,0,0,0,0,0,0][i],
  rating: [88,84,82,80,77,75,73,70,68,65,62][i],
  nacionalidad: "🇦🇷",
  club: "Al-Koliko FC",
}));

const FEED_INIT = [
  { id:1, userId:3, texto:"Mañana a las 9 el que llegue tarde limpia el vestuario 😂 estamos o no estamos?", likes:[1,2,4,5,6,7,8], comentarios:[{userId:1,texto:"Jajaja voy!"},{userId:4,texto:"Obvio!"},{userId:6,texto:"Allá voy"}], hace:"Hace 2 horas", tipo:"texto" },
  { id:2, userId:1, texto:"El golazo de Lean del otro día 🔥🔥 la rompió", likes:[1,2,3,4,5,6,7,8,9,10], comentarios:[{userId:3,texto:"Un cañonazo!"},{userId:5,texto:"top 10 de la historia"},{userId:6,texto:"Gracias!"},{userId:7,texto:"Brutal"},{userId:2,texto:"Grande!"}], hace:"Ayer 23:40", tipo:"texto" },
  { id:3, userId:5, texto:"Che alguien tiene las botitas número 41? Se me rompieron las mías esta semana jajaja", likes:[1,3,4,9], comentarios:[{userId:9,texto:"Jajaja siempre igual Fede"},{userId:2,texto:"Yo tengo unas!"},{userId:1,texto:"Preguntale a Gonza"},{userId:8,texto:"Jajajaja"},{userId:4,texto:"Sos un genio"},{userId:7,texto:"Mítico"},{userId:6,texto:"Jajaja"},{userId:10,texto:"Te presto"}], hace:"Hace 2 días", tipo:"texto" },
];

const PARTIDO_INIT = {
  fecha: "Viernes 16 Mayo",
  hora: "21:00",
  cancha: "Cancha La Estrella",
  ubicacion: "Berazategui",
  jugadores: [1,2,3,4,5,6,7,8,9,10],
  equipoA: [1,3,5,7,9],
  equipoB: [2,4,6,8,10],
  confirmados: [1,2,3,4,5,6,7,8,9,10],
};

const PUNTO_POR_RANK = [5,4,3,2,1];

/* ─────────────────────────────────────────
   STARBALL SVG
───────────────────────────────────────── */
function StarballSVG({ size=320, opacity=0.06 }) {
  const cx=size/2, cy=size/2, R=size*0.38, r=size*0.07;
  const stars=Array.from({length:8},(_,i)=>{ const a=(i*Math.PI*2)/8-Math.PI/2; return {x:cx+R*Math.cos(a),y:cy+R*Math.sin(a)}; });
  function star(cx,cy,or,ir,pts=5){ let d=''; for(let i=0;i<pts*2;i++){ const a=(i*Math.PI)/pts-Math.PI/2; const rad=i%2===0?or:ir; d+=(i===0?'M':'L')+(cx+rad*Math.cos(a))+','+(cy+rad*Math.sin(a)); } return d+'Z'; }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{opacity}}>
      <circle cx={cx} cy={cy} r={R+r*1.8} fill="none" stroke="white" strokeWidth={0.8} opacity={0.6}/>
      <circle cx={cx} cy={cy} r={R+r*1.2} fill="none" stroke="white" strokeWidth={0.4} opacity={0.3}/>
      <circle cx={cx} cy={cy} r={r*1.4} fill="white" opacity={0.9}/>
      {stars.map((s,i)=><g key={i}><path d={star(s.x,s.y,r*0.95,r*0.42,5)} fill="white" opacity={0.92}/></g>)}
      {stars.map((s,i)=>{ const next=stars[(i+1)%8]; return <line key={i} x1={s.x} y1={s.y} x2={next.x} y2={next.y} stroke="white" strokeWidth={0.5} opacity={0.22}/>; })}
      {stars.map((s,i)=><line key={i+'r'} x1={cx} y1={cy} x2={s.x} y2={s.y} stroke="white" strokeWidth={0.4} opacity={0.13}/>)}
    </svg>
  );
}

/* ─────────────────────────────────────────
   CSS
───────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Bebas+Neue&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html{scroll-behavior:smooth}
body{background:#080d1a;color:#f0f4ff;font-family:'Outfit',sans-serif;min-height:100vh;min-height:100dvh;overscroll-behavior:none;-webkit-font-smoothing:antialiased}
body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 100% 50% at 50% -10%,rgba(30,100,255,0.15) 0%,transparent 65%),linear-gradient(180deg,#060b18 0%,#080d1a 50%,#050810 100%);z-index:-1;pointer-events:none}
::-webkit-scrollbar{width:3px;height:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#1e50d4;border-radius:99px}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pop{0%{transform:scale(0.88);opacity:0}70%{transform:scale(1.04)}100%{transform:scale(1);opacity:1}}
@keyframes rotateSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes slideDown{from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:translateY(0)}}
.fade-up{animation:fadeUp 0.28s cubic-bezier(.22,.68,0,1.2) both}
.fade-in{animation:fadeIn 0.25s ease both}
.pop{animation:pop 0.32s cubic-bezier(.22,.68,0,1.2) both}
.rotate-slow{animation:rotateSlow 60s linear infinite}
.slide-down{animation:slideDown 0.3s cubic-bezier(.22,.68,0,1.2) both}
.pulse-dot{animation:pulse 2s ease infinite}
.gold-text{background:linear-gradient(90deg,#c9a84c,#f5e4a8,#e8c96d,#c9a84c);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 3s linear infinite}
.ucl-input{width:100%;padding:13px 16px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;outline:none;font-family:'Outfit';font-size:15px;font-weight:500;color:#f0f4ff;transition:all 0.2s}
.ucl-input:focus{border-color:rgba(30,80,212,0.6);background:rgba(30,80,212,0.08);box-shadow:0 0 0 3px rgba(30,80,212,0.12)}
.ucl-input::placeholder{color:rgba(255,255,255,0.25)}
.card-hover:active{transform:scale(0.98)}
`;

/* ─────────────────────────────────────────
   UTILS
───────────────────────────────────────── */
function Av({ j, size=38, border=false }) {
  const initial = j?.nombre?.[0] || "?";
  const color = j?.color || "#1e50d4";
  return (
    <div style={{
      width:size, height:size, borderRadius:"50%", flexShrink:0,
      background:color, display:"flex", alignItems:"center", justifyContent:"center",
      fontFamily:"'Outfit'", fontWeight:800, fontSize:size*0.38, color:"#fff",
      textShadow:"0 1px 3px rgba(0,0,0,0.5)",
      border: border ? "2px solid rgba(255,255,255,0.3)" : "1.5px solid rgba(255,255,255,0.15)",
      boxShadow:`0 2px 12px ${color}44`, flexShrink:0,
    }}>{initial}</div>
  );
}

function Lbl({ children, style={} }) {
  return <div style={{ fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:"rgba(255,255,255,0.35)", marginBottom:6, ...style }}>{children}</div>;
}

function Card({ children, style={}, onClick }) {
  return (
    <div onClick={onClick} style={{
      background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
      borderRadius:16, padding:16, marginBottom:10,
      backdropFilter:"blur(12px)", boxShadow:"inset 0 1px 0 rgba(255,255,255,0.05)",
      cursor: onClick ? "pointer" : "default", ...style,
    }}>{children}</div>
  );
}

function Badge({ children, color="blue", style={} }) {
  const colors = {
    blue: ["rgba(30,80,212,0.15)","rgba(30,80,212,0.3)","#7cb9ff"],
    green: ["rgba(34,197,94,0.12)","rgba(34,197,94,0.25)","#4ade80"],
    gold: ["rgba(201,168,76,0.12)","rgba(201,168,76,0.25)","#e8c96d"],
    red: ["rgba(239,68,68,0.12)","rgba(239,68,68,0.25)","#fca5a5"],
    gray: ["rgba(255,255,255,0.06)","rgba(255,255,255,0.1)","rgba(255,255,255,0.4)"],
  };
  const [bg,border,col] = colors[color]||colors.blue;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:4,
      background:bg, border:`1px solid ${border}`, color:col,
      borderRadius:99, padding:"3px 10px", fontSize:10, fontWeight:700,
      letterSpacing:0.5, textTransform:"uppercase", ...style,
    }}>{children}</span>
  );
}

function BtnPrimary({ children, onClick, disabled=false, style={} }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width:"100%", padding:"14px", borderRadius:14,
      border: disabled ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(34,197,94,0.35)",
      cursor: disabled ? "not-allowed" : "pointer",
      fontFamily:"'Outfit'", fontWeight:700, fontSize:15,
      background: disabled ? "rgba(255,255,255,0.03)" : "linear-gradient(135deg,#16a34a,#15803d)",
      color: disabled ? "rgba(255,255,255,0.2)" : "#fff",
      boxShadow: disabled ? "none" : "0 4px 20px rgba(22,163,74,0.25)",
      transition:"all 0.2s", ...style,
    }}>{children}</button>
  );
}

function BtnGold({ children, onClick, disabled=false, style={} }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding:"12px 20px", borderRadius:12,
      border: disabled ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(201,168,76,0.35)",
      cursor: disabled ? "not-allowed" : "pointer",
      fontFamily:"'Outfit'", fontWeight:700, fontSize:14,
      background: disabled ? "rgba(255,255,255,0.03)" : "linear-gradient(135deg,#c9a84c,#a07828)",
      color: disabled ? "rgba(255,255,255,0.2)" : "#000",
      transition:"all 0.2s", ...style,
    }}>{children}</button>
  );
}

function Divider({ style={} }) {
  return <div style={{ height:1, background:"rgba(255,255,255,0.07)", margin:"4px 0", ...style }}/>;
}

/* ─────────────────────────────────────────
   CARD MODAL (Player Card)
───────────────────────────────────────── */
function PlayerCardModal({ jugador, onClose, isAdmin, onSave }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...jugador });

  if (!jugador) return null;

  const save = () => { onSave(form); setEditing(false); };

  return (
    <div className="fade-in" style={{
      position:"fixed", inset:0, zIndex:500,
      background:"rgba(0,0,0,0.85)", backdropFilter:"blur(12px)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:16,
    }} onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div className="pop" style={{
        width:"100%", maxWidth:360,
        background:"linear-gradient(160deg,#0d1f6b,#1a4db5,#2563eb,#0a1540)",
        border:"1px solid rgba(255,255,255,0.15)", borderRadius:20, overflow:"hidden",
        boxShadow:"0 24px 60px rgba(0,0,0,0.6)",
      }}>
        {/* Shine */}
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,rgba(255,255,255,0.1) 0%,transparent 50%)", pointerEvents:"none" }}/>

        <div style={{ padding:20, position:"relative", zIndex:1 }}>
          {/* Header */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
            <div>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:42, color:"rgba(255,255,255,0.15)", lineHeight:1 }}>{jugador.rating}</div>
              <div style={{ fontSize:10, fontWeight:600, color:"rgba(255,255,255,0.4)", letterSpacing:1 }}>RATING</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <span style={{ fontSize:22 }}>{jugador.nacionalidad || "🇦🇷"}</span>
              <div style={{ fontSize:10, fontWeight:600, color:"rgba(255,255,255,0.4)", letterSpacing:1, marginTop:2 }}>
                {jugador.club || "Al-Koliko FC"}
              </div>
            </div>
          </div>

          {/* Avatar */}
          <div style={{ display:"flex", justifyContent:"center", marginBottom:16 }}>
            <div style={{ width:80, height:80, borderRadius:"50%", background:jugador.color||"#1e50d4", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Outfit'", fontWeight:900, fontSize:36, color:"#fff", border:"3px solid rgba(255,255,255,0.3)", boxShadow:"0 8px 30px rgba(0,0,0,0.4)" }}>
              {jugador.nombre[0]}
            </div>
          </div>

          {/* Info */}
          {editing ? (
            <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:16 }}>
              {[["nombre","Nombre"],["apodo","Apodo"],["club","Club"],["rating","Rating"]].map(([k,l])=>(
                <div key={k}>
                  <Lbl style={{marginBottom:3}}>{l}</Lbl>
                  <input className="ucl-input" value={form[k]||""} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} style={{padding:"8px 12px",fontSize:13}}/>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div style={{ textAlign:"center", marginBottom:16 }}>
                <div style={{ fontFamily:"'Outfit'", fontWeight:800, fontSize:22, color:"#fff", letterSpacing:0.3 }}>{jugador.nombre}</div>
                <div style={{ fontSize:13, fontWeight:500, color:"rgba(255,255,255,0.5)", marginTop:2 }}>{jugador.apodo}</div>
                <div style={{ fontSize:11, fontWeight:500, color:"rgba(255,255,255,0.3)", marginTop:2 }}>{jugador.club || "Al-Koliko FC"}</div>
              </div>

              {/* Stats */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:16 }}>
                {[["Goles",jugador.goles],["Asist",jugador.asist],["MVPs",jugador.mvps],["PJ",jugador.pj],["PTS",jugador.puntosMes],["Rating",jugador.rating]].map(([k,v])=>(
                  <div key={k} style={{ background:"rgba(0,0,0,0.3)", borderRadius:10, padding:"8px 6px", textAlign:"center" }}>
                    <div style={{ fontFamily:"'Bebas Neue'", fontSize:22, color:"#fff", lineHeight:1 }}>{v}</div>
                    <div style={{ fontSize:9, fontWeight:600, color:"rgba(255,255,255,0.4)", letterSpacing:1, marginTop:2 }}>{k}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Botones */}
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={onClose} style={{ flex:1, padding:"10px", borderRadius:10, border:"1px solid rgba(255,255,255,0.15)", background:"rgba(255,255,255,0.06)", cursor:"pointer", fontFamily:"'Outfit'", fontWeight:600, fontSize:13, color:"rgba(255,255,255,0.6)" }}>
              Cerrar
            </button>
            {isAdmin && !editing && (
              <button onClick={()=>setEditing(true)} style={{ flex:1, padding:"10px", borderRadius:10, border:"1px solid rgba(201,168,76,0.35)", background:"linear-gradient(135deg,#c9a84c,#a07828)", cursor:"pointer", fontFamily:"'Outfit'", fontWeight:700, fontSize:13, color:"#000" }}>
                ✏️ Editar
              </button>
            )}
            {editing && (
              <button onClick={save} style={{ flex:1, padding:"10px", borderRadius:10, border:"1px solid rgba(34,197,94,0.35)", background:"linear-gradient(135deg,#16a34a,#15803d)", cursor:"pointer", fontFamily:"'Outfit'", fontWeight:700, fontSize:13, color:"#fff" }}>
                💾 Guardar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   LOGIN
───────────────────────────────────────── */
function LoginScreen({ onLogin }) {
  const [user,setUser]=useState(""); const [pass,setPass]=useState(""); const [err,setErr]=useState(""); const [loading,setLoading]=useState(false);
  const handle=()=>{ setErr(""); setLoading(true); setTimeout(()=>{ const found=USERS_INIT.find(u=>u.nombre.toLowerCase()===user.toLowerCase().trim()&&u.pass===pass.trim()); if(found) onLogin(found); else { setErr("Usuario o contraseña incorrectos"); setLoading(false); } },700); };
  return(
    <div style={{minHeight:"100dvh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px",position:"relative",overflow:"hidden"}}>
      <div className="rotate-slow" style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",pointerEvents:"none",zIndex:0}}><StarballSVG size={520} opacity={0.052}/></div>
      <div style={{position:"absolute",top:-80,right:-80,pointerEvents:"none",zIndex:0}}><StarballSVG size={260} opacity={0.035}/></div>
      <div className="fade-up" style={{textAlign:"center",marginBottom:36,position:"relative",zIndex:1}}>
        <div style={{width:72,height:72,borderRadius:20,margin:"0 auto 16px",background:"linear-gradient(135deg,#1440b8,#0a1f6b)",border:"1px solid rgba(201,168,76,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,boxShadow:"0 0 40px rgba(30,80,212,0.4),inset 0 1px 0 rgba(255,255,255,0.1)"}}>⚽</div>
        <div style={{fontFamily:"'Outfit'",fontWeight:800,fontSize:28,color:"#fff",lineHeight:1.1,marginBottom:4}}>El Fulbito</div>
        <div className="gold-text" style={{fontFamily:"'Outfit'",fontWeight:600,fontSize:15}}>de los Viernes</div>
        <div style={{marginTop:10,fontSize:10,fontWeight:600,color:"rgba(255,255,255,0.22)",letterSpacing:2}}>AL-KOLIKO FC · TEMPORADA 2025</div>
      </div>
      <div className="fade-up" style={{width:"100%",maxWidth:380,position:"relative",zIndex:1,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:20,padding:24,backdropFilter:"blur(20px)",boxShadow:"0 24px 60px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.06)"}}>
        <div style={{fontFamily:"'Outfit'",fontWeight:700,fontSize:18,marginBottom:4}}>Acceder</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.35)",marginBottom:20}}>Tu usuario y contraseña te los da el admin</div>
        <div style={{marginBottom:12}}><Lbl>Usuario</Lbl><input className="ucl-input" placeholder="Tu nombre..." value={user} onChange={e=>setUser(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/></div>
        <div style={{marginBottom:20}}><Lbl>Contraseña</Lbl><input className="ucl-input" type="password" placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/></div>
        {err&&<div className="pop" style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:10,padding:"10px 14px",fontSize:13,fontWeight:500,color:"#fca5a5",marginBottom:16,textAlign:"center"}}>⚠️ {err}</div>}
        <BtnPrimary onClick={handle} disabled={!user||!pass||loading}>{loading?"Entrando...":"Entrar al vestuario 🏟️"}</BtnPrimary>
      </div>
      <div style={{marginTop:20,textAlign:"center",position:"relative",zIndex:1,fontSize:11,fontWeight:500,color:"rgba(255,255,255,0.18)",letterSpacing:1}}>Demo: Nico / nico123 · Admin: Juank / juank123</div>
    </div>
  );
}

/* ─────────────────────────────────────────
   HEADER
───────────────────────────────────────── */
function Header({ user, onAdmin, onLogout }) {
  return(
    <div style={{height:56,position:"sticky",top:0,zIndex:300,background:"rgba(8,13,26,0.92)",borderBottom:"1px solid rgba(255,255,255,0.07)",backdropFilter:"blur(24px)",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 16px"}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:34,height:34,borderRadius:10,background:"linear-gradient(135deg,#1440b8,#0a1f6b)",border:"1px solid rgba(201,168,76,0.28)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,boxShadow:"0 0 20px rgba(30,80,212,0.4)"}}>⚽</div>
        <div>
          <div style={{fontFamily:"'Outfit'",fontWeight:800,fontSize:16,color:"#fff",lineHeight:1.1}}>El Fulbito</div>
          <div style={{fontFamily:"'Outfit'",fontWeight:500,fontSize:9,letterSpacing:1,color:"#c9a84c"}}>de los Viernes</div>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        {user.isAdmin&&<button onClick={onAdmin} style={{padding:"5px 11px",borderRadius:8,border:"1px solid rgba(201,168,76,0.25)",background:"rgba(201,168,76,0.08)",cursor:"pointer",fontFamily:"'Outfit'",fontWeight:600,fontSize:11,color:"#c9a84c"}}>⚙️ Admin</button>}
        <button onClick={onLogout} style={{display:"flex",alignItems:"center",gap:7,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:99,padding:"5px 12px 5px 5px",cursor:"pointer"}}>
          <Av j={user} size={26}/><span style={{fontFamily:"'Outfit'",fontWeight:600,fontSize:13,color:"#fff"}}>{user.nombre}</span>
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   NAV
───────────────────────────────────────── */
const NAV=[{icon:"🏠",label:"Inicio"},{icon:"📊",label:"Temporada"},{icon:"⭐",label:"5 Ideal"},{icon:"📱",label:"Feed"},{icon:"🎴",label:"Cards"}];

function NavBottom({ active, onChange, pendiente }) {
  return(
    <div style={{height:62,position:"fixed",bottom:0,left:0,right:0,zIndex:300,background:"rgba(6,11,24,0.97)",borderTop:"1px solid rgba(255,255,255,0.07)",backdropFilter:"blur(24px)",display:"flex",maxWidth:520,margin:"0 auto"}}>
      {NAV.map((n,i)=>{
        const on=active===i;
        return(
          <button key={i} onClick={()=>onChange(i)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,border:"none",background:"none",cursor:"pointer",fontFamily:"'Outfit'",fontSize:9,fontWeight:600,letterSpacing:0.3,color:on?"#22c55e":"rgba(255,255,255,0.26)",transition:"all 0.18s",borderTop:on?"2px solid #22c55e":"2px solid transparent",paddingTop:4,position:"relative"}}>
            <span style={{fontSize:19,lineHeight:1,transform:on?"scale(1.18)":"scale(1)",filter:on?"drop-shadow(0 0 8px rgba(34,197,94,0.65))":"none",transition:"all 0.18s"}}>{n.icon}</span>
            {n.label}
            {i===0&&pendiente>0&&!on&&<span className="pulse-dot" style={{position:"absolute",top:6,right:"calc(50% - 14px)",width:7,height:7,borderRadius:"50%",background:"#ef4444",border:"1.5px solid #080d1a"}}/>}
          </button>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE: INICIO
───────────────────────────────────────── */
function PageInicio({ user, partido, stats, onVotar }) {
  const [confirmado, setConfirmado] = useState(partido?.confirmados?.includes(user.id));
  const miStats = stats.find(s=>s.id===user.id);

  return(
    <div className="fade-up">
      {/* Banner próximo partido */}
      <div style={{background:"linear-gradient(135deg,#0a1f0a,#0d2e12)",border:"1px solid rgba(34,197,94,0.25)",borderRadius:16,padding:16,marginBottom:10,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-20,right:-20,pointerEvents:"none",opacity:0.08}}><StarballSVG size={180} opacity={1}/></div>
        <div style={{fontSize:10,fontWeight:700,letterSpacing:2,color:"#22c55e",textTransform:"uppercase",marginBottom:6}}>Próximo partido</div>
        <div style={{fontFamily:"'Bebas Neue'",fontSize:30,color:"#fff",lineHeight:1,marginBottom:4}}>{partido.fecha}</div>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
          <span style={{fontSize:12,fontWeight:500,color:"rgba(255,255,255,0.5)"}}>⏰ {partido.hora} hs</span>
          <span style={{fontSize:12,fontWeight:500,color:"rgba(255,255,255,0.5)"}}>📍 {partido.ubicacion}</span>
        </div>

        {/* Avatares jugadores */}
        <div style={{display:"flex",alignItems:"center",gap:-4,marginBottom:14}}>
          {partido.jugadores.slice(0,6).map((id,i)=>{
            const j=stats.find(s=>s.id===id);
            return j?<div key={id} style={{marginLeft:i>0?-8:0,zIndex:10-i}}><Av j={j} size={28} border/></div>:null;
          })}
          {partido.jugadores.length>6&&<span style={{marginLeft:4,fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.5)"}}>+{partido.jugadores.length-6}</span>}
          <span style={{marginLeft:10,fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.5)"}}>{partido.jugadores.length} confirmados</span>
        </div>

        {/* Botones confirmación */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <button onClick={()=>setConfirmado(true)} style={{padding:"10px",borderRadius:10,border:"none",cursor:"pointer",fontFamily:"'Outfit'",fontWeight:700,fontSize:13,background:confirmado?"#22c55e":"rgba(34,197,94,0.15)",color:confirmado?"#000":"#22c55e",border:confirmado?"1px solid #22c55e":"1px solid rgba(34,197,94,0.3)",transition:"all 0.2s"}}>
            {confirmado?"✓ Confirmado":"Confirmar"}
          </button>
          <button onClick={()=>setConfirmado(false)} style={{padding:"10px",borderRadius:10,border:"none",cursor:"pointer",fontFamily:"'Outfit'",fontWeight:700,fontSize:13,background:!confirmado&&confirmado!==null?"rgba(239,68,68,0.15)":"rgba(255,255,255,0.04)",color:!confirmado&&confirmado!==null?"#f87171":"rgba(255,255,255,0.4)",border:!confirmado&&confirmado!==null?"1px solid rgba(239,68,68,0.3)":"1px solid rgba(255,255,255,0.08)",transition:"all 0.2s"}}>
            No puedo
          </button>
        </div>
      </div>

      {/* Alertas */}
      <Card style={{background:"rgba(234,179,8,0.06)",border:"1px solid rgba(234,179,8,0.2)",padding:14,marginBottom:10}} onClick={onVotar}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:24}}>🏆</span>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:14,color:"#fbbf24",marginBottom:2}}>Votación abierta — 09/05/2025</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>Repartí tus 10 monedas · <span style={{color:"#fbbf24"}}>Cierra el jueves</span></div>
          </div>
          <button style={{padding:"6px 14px",borderRadius:8,border:"none",cursor:"pointer",background:"#eab308",color:"#000",fontFamily:"'Outfit'",fontWeight:700,fontSize:12}}>Votar</button>
        </div>
      </Card>

      {/* Mis stats del mes */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
        <Card style={{padding:14,margin:0}}>
          <div style={{fontSize:10,fontWeight:600,color:"rgba(255,255,255,0.35)",letterSpacing:1,marginBottom:6}}>PUNTOS MAYO</div>
          <div style={{fontFamily:"'Bebas Neue'",fontSize:38,color:"#22c55e",lineHeight:1}}>{miStats?.puntosMes||0}</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.35)",marginTop:4}}>Posición 2°</div>
        </Card>
        <Card style={{padding:14,margin:0}}>
          <div style={{fontSize:10,fontWeight:600,color:"rgba(255,255,255,0.35)",letterSpacing:1,marginBottom:6}}>PARTIDOS JUGADOS</div>
          <div style={{fontFamily:"'Bebas Neue'",fontSize:38,color:"#c9a84c",lineHeight:1}}>{miStats?.pj||0}</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.35)",marginTop:4}}>este mes</div>
        </Card>
      </div>

      {/* Invitaciones */}
      <Card style={{padding:14}}>
        <div style={{fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"rgba(255,255,255,0.35)",marginBottom:10}}>Invitaciones</div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:36,height:36,borderRadius:10,background:"rgba(30,80,212,0.2)",border:"1px solid rgba(30,80,212,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>👥</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:600,fontSize:14}}>Partido extra — Sábado 17/05</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>De: Rulo · Cancha Los Nogales</div>
          </div>
          <button style={{padding:"6px 14px",borderRadius:8,border:"none",cursor:"pointer",background:"#22c55e",color:"#000",fontFamily:"'Outfit'",fontWeight:700,fontSize:12}}>Ver</button>
        </div>
      </Card>
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE: TEMPORADA
───────────────────────────────────────── */
function PageTemporada({ user, stats, onPlayerClick }) {
  const [vista, setVista] = useState("mensual");
  const [subtab, setSubtab] = useState("jugadores");

  const sorted = [...stats].sort((a,b)=> vista==="mensual" ? b.puntosMes-a.puntosMes : b.puntosAnio-a.puntosAnio);

  return(
    <div className="fade-up">
      {/* Toggle principal */}
      <div style={{display:"flex",background:"rgba(255,255,255,0.04)",borderRadius:10,padding:3,marginBottom:10,border:"1px solid rgba(255,255,255,0.07)"}}>
        {[["mensual","Mensual"],["historial","Historial"],["anual","Anual"]].map(([v,l])=>(
          <button key={v} onClick={()=>setVista(v)} style={{flex:1,padding:"8px 0",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"'Outfit'",fontWeight:600,fontSize:12,background:vista===v?"linear-gradient(135deg,#16a34a,#15803d)":"none",color:vista===v?"#fff":"rgba(255,255,255,0.3)",transition:"all 0.2s"}}>{l}</button>
        ))}
      </div>

      {/* Toggle jugadores/equipos */}
      <div style={{display:"flex",gap:8,marginBottom:14}}>
        {[["jugadores","Jugadores"],["equipos","Equipos"]].map(([v,l])=>(
          <button key={v} onClick={()=>setSubtab(v)} style={{padding:"6px 16px",borderRadius:99,border:"none",cursor:"pointer",fontFamily:"'Outfit'",fontWeight:600,fontSize:12,background:subtab===v?"rgba(34,197,94,0.15)":"rgba(255,255,255,0.04)",color:subtab===v?"#22c55e":"rgba(255,255,255,0.35)",border:subtab===v?"1px solid rgba(34,197,94,0.3)":"1px solid rgba(255,255,255,0.07)",transition:"all 0.2s"}}>{l}</button>
        ))}
      </div>

      {subtab==="jugadores" ? (
        <>
          {/* Header tabla */}
          <div style={{display:"flex",alignItems:"center",padding:"6px 14px",marginBottom:4}}>
            <span style={{width:28}}/>
            <span style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.25)",letterSpacing:1,flex:1,marginLeft:10}}>JUGADOR</span>
            <div style={{display:"flex",gap:16}}>
              {["PJ","PTS","TOP1"].map(k=><span key={k} style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.25)",letterSpacing:1,width:32,textAlign:"center"}}>{k}</span>)}
            </div>
          </div>

          {sorted.map((j,i)=>(
            <div key={j.id} className="card-hover" onClick={()=>onPlayerClick(j)} style={{
              display:"flex",alignItems:"center",padding:"12px 14px",
              background:j.id===user.id?"rgba(34,197,94,0.06)":"rgba(255,255,255,0.02)",
              border:j.id===user.id?"1px solid rgba(34,197,94,0.15)":"1px solid rgba(255,255,255,0.06)",
              borderRadius:12,marginBottom:6,cursor:"pointer",transition:"all 0.2s",
            }}>
              <span style={{fontFamily:"'Bebas Neue'",fontSize:18,color:i<3?"#c9a84c":"rgba(255,255,255,0.2)",width:24,textAlign:"center"}}>
                {i<3?["🥇","🥈","🥉"][i]:i+1}
              </span>
              <Av j={j} size={32}/>
              <div style={{flex:1,marginLeft:10}}>
                <div style={{fontWeight:700,fontSize:14,display:"flex",alignItems:"center",gap:6}}>
                  {j.nombre}
                  {j.id===user.id&&<Badge color="green" style={{fontSize:8,padding:"1px 6px"}}>vos</Badge>}
                </div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>{j.apodo}</div>
              </div>
              <div style={{display:"flex",gap:16}}>
                {[j.pj, vista==="mensual"?j.puntosMes:j.puntosAnio, j.top1mes].map((v,k)=>(
                  <div key={k} style={{fontFamily:"'Bebas Neue'",fontSize:k===1?22:16,color:k===1?"#22c55e":"rgba(255,255,255,0.4)",width:32,textAlign:"center"}}>{v}</div>
                ))}
              </div>
            </div>
          ))}
        </>
      ) : (
        <Card>
          <div style={{textAlign:"center",padding:"20px 0",color:"rgba(255,255,255,0.3)",fontSize:14}}>
            Vista de equipos próximamente 🔜
          </div>
        </Card>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE: 5 IDEAL
───────────────────────────────────────── */
function PageCincoIdeal({ stats, onPlayerClick }) {
  const [vista, setVista] = useState("semana");
  const top5 = [...stats].sort((a,b)=>b.puntosMes-a.puntosMes).slice(0,5);

  return(
    <div className="fade-up">
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {[["semana","Esta semana"],["mes","Equipo del mes"],["anual","Equipo anual"]].map(([v,l])=>(
          <button key={v} onClick={()=>setVista(v)} style={{flex:1,padding:"8px 4px",borderRadius:99,border:"none",cursor:"pointer",fontFamily:"'Outfit'",fontWeight:600,fontSize:11,background:vista===v?"rgba(34,197,94,0.15)":"rgba(255,255,255,0.04)",color:vista===v?"#22c55e":"rgba(255,255,255,0.35)",border:vista===v?"1px solid rgba(34,197,94,0.3)":"1px solid rgba(255,255,255,0.07)",transition:"all 0.2s"}}>{l}</button>
        ))}
      </div>

      <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.3)",letterSpacing:2,textTransform:"uppercase",textAlign:"center",marginBottom:4}}>5 IDEAL — MAYO 2025</div>

      {/* Cancha */}
      <div style={{background:"linear-gradient(180deg,#071a0a 0%,#0a2e10 50%,#071a0a 100%)",borderRadius:16,border:"1px solid rgba(34,197,94,0.12)",padding:"24px 16px",marginBottom:14,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",left:"50%",top:0,bottom:0,borderLeft:"1px dashed rgba(255,255,255,0.05)",transform:"translateX(-50%)"}}/>
        <div style={{position:"absolute",left:"50%",top:"50%",width:72,height:72,border:"1px dashed rgba(255,255,255,0.05)",borderRadius:"50%",transform:"translate(-50%,-50%)"}}/>
        <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:120,height:1,background:"rgba(255,255,255,0.05)"}}/>

        {[[0,1],[2,3],[4]].map(([a,b],row)=>(
          <div key={row} style={{display:"flex",justifyContent:"space-around",marginBottom:row<2?24:0,position:"relative",zIndex:1}}>
            {[a,b].filter(x=>x!==undefined).map(idx=>{
              const j=top5[idx];
              if(!j) return null;
              return(
                <div key={j.id} onClick={()=>onPlayerClick(j)} className="card-hover" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,cursor:"pointer"}}>
                  <div style={{width:52,height:52,borderRadius:"50%",background:j.color,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Outfit'",fontWeight:800,fontSize:22,color:"#fff",border:"2px solid rgba(255,255,255,0.3)",boxShadow:"0 4px 20px rgba(0,0,0,0.4)"}}>
                    {j.nombre[0]}
                  </div>
                  <div style={{background:"rgba(6,11,24,0.85)",borderRadius:8,padding:"4px 10px",textAlign:"center",border:"1px solid rgba(255,255,255,0.1)"}}>
                    <div style={{fontWeight:700,fontSize:12}}>{j.nombre}</div>
                    <div style={{fontFamily:"'Bebas Neue'",fontSize:14,color:"#22c55e"}}>{j.puntosMes} pts</div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Ranking */}
      <div style={{fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"rgba(255,255,255,0.35)",marginBottom:8}}>Ranking del mes</div>
      {[...stats].sort((a,b)=>b.puntosMes-a.puntosMes).map((j,i)=>(
        <div key={j.id} onClick={()=>onPlayerClick(j)} className="card-hover" style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:10,marginBottom:6,cursor:"pointer",transition:"all 0.2s"}}>
          <span style={{fontFamily:"'Bebas Neue'",fontSize:16,color:i<3?"#c9a84c":"rgba(255,255,255,0.2)",width:20,textAlign:"center"}}>{i+1}</span>
          <Av j={j} size={28}/>
          <span style={{flex:1,fontWeight:600,fontSize:14}}>{j.nombre}</span>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{height:4,width:80,background:"rgba(255,255,255,0.08)",borderRadius:99,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${(j.puntosMes/stats[0].puntosMes)*100}%`,background:"#22c55e",borderRadius:99}}/>
            </div>
            <span style={{fontFamily:"'Bebas Neue'",fontSize:18,color:"#22c55e",width:32,textAlign:"right"}}>{j.puntosMes}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE: FEED
───────────────────────────────────────── */
function PageFeed({ user, stats, feed, onFeedUpdate }) {
  const [texto, setTexto] = useState("");
  const [comentando, setComentando] = useState(null);
  const [comentTexto, setComentTexto] = useState("");

  const publicar = () => {
    if(!texto.trim()) return;
    const nuevo = { id:Date.now(), userId:user.id, texto:texto.trim(), likes:[], comentarios:[], hace:"Ahora mismo", tipo:"texto" };
    onFeedUpdate([nuevo, ...feed]);
    setTexto("");
  };

  const toggleLike = (postId) => {
    onFeedUpdate(feed.map(p=>{
      if(p.id!==postId) return p;
      const liked = p.likes.includes(user.id);
      return { ...p, likes: liked ? p.likes.filter(id=>id!==user.id) : [...p.likes, user.id] };
    }));
  };

  const comentar = (postId) => {
    if(!comentTexto.trim()) return;
    onFeedUpdate(feed.map(p=>{
      if(p.id!==postId) return p;
      return { ...p, comentarios:[...p.comentarios, {userId:user.id, texto:comentTexto.trim()}] };
    }));
    setComentTexto(""); setComentando(null);
  };

  const getUser = (id) => stats.find(s=>s.id===id);

  return(
    <div className="fade-up">
      {/* Caja de publicación */}
      <Card style={{padding:14,marginBottom:14}}>
        <div style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:10}}>
          <Av j={user} size={36}/>
          <textarea
            className="ucl-input"
            placeholder="¿Qué onda pibes?"
            value={texto}
            onChange={e=>setTexto(e.target.value)}
            style={{resize:"none",height:72,fontSize:14,padding:"10px 14px"}}
          />
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",gap:8}}>
            {["📹","🖼️","😊"].map((icon,i)=>(
              <button key={i} style={{width:32,height:32,borderRadius:8,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.04)",cursor:"pointer",fontSize:16}}>{icon}</button>
            ))}
          </div>
          <button onClick={publicar} disabled={!texto.trim()} style={{padding:"8px 20px",borderRadius:10,border:"none",cursor:texto.trim()?"pointer":"not-allowed",background:texto.trim()?"#22c55e":"rgba(255,255,255,0.08)",color:texto.trim()?"#000":"rgba(255,255,255,0.3)",fontFamily:"'Outfit'",fontWeight:700,fontSize:13,transition:"all 0.2s"}}>
            Publicar
          </button>
        </div>
      </Card>

      {/* Posts */}
      {feed.map(post=>{
        const autor = getUser(post.userId);
        const liked = post.likes.includes(user.id);
        return(
          <Card key={post.id} style={{padding:16,marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
              <Av j={autor} size={36}/>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14}}>{autor?.nombre}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>{post.hace}</div>
              </div>
              <button style={{background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.3)",fontSize:18}}>•••</button>
            </div>

            <div style={{fontSize:14,fontWeight:400,lineHeight:1.6,color:"rgba(255,255,255,0.85)",marginBottom:14}}>
              {post.texto}
            </div>

            <Divider/>

            <div style={{display:"flex",gap:16,padding:"10px 0"}}>
              <button onClick={()=>toggleLike(post.id)} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",color:liked?"#f43f5e":"rgba(255,255,255,0.4)",fontFamily:"'Outfit'",fontWeight:600,fontSize:13,transition:"color 0.2s"}}>
                {liked?"❤️":"🤍"} {post.likes.length}
              </button>
              <button onClick={()=>setComentando(comentando===post.id?null:post.id)} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.4)",fontFamily:"'Outfit'",fontWeight:600,fontSize:13}}>
                💬 {post.comentarios.length}
              </button>
              <button style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.4)",fontFamily:"'Outfit'",fontWeight:600,fontSize:13}}>
                ↗️ Compartir
              </button>
            </div>

            {/* Comentarios */}
            {post.comentarios.length>0&&(
              <div style={{borderTop:"1px solid rgba(255,255,255,0.07)",paddingTop:10,marginTop:4}}>
                {post.comentarios.map((c,i)=>{
                  const cu=getUser(c.userId);
                  return(
                    <div key={i} style={{display:"flex",gap:8,marginBottom:8}}>
                      <Av j={cu} size={24}/>
                      <div style={{background:"rgba(255,255,255,0.05)",borderRadius:10,padding:"6px 10px",flex:1}}>
                        <span style={{fontWeight:700,fontSize:12,color:"#fff",marginRight:6}}>{cu?.nombre}</span>
                        <span style={{fontSize:12,color:"rgba(255,255,255,0.7)"}}>{c.texto}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Input comentario */}
            {comentando===post.id&&(
              <div style={{display:"flex",gap:8,marginTop:8}}>
                <Av j={user} size={28}/>
                <input className="ucl-input" placeholder="Escribí un comentario..." value={comentTexto} onChange={e=>setComentTexto(e.target.value)} onKeyDown={e=>e.key==="Enter"&&comentar(post.id)} style={{flex:1,padding:"8px 12px",fontSize:13}}/>
                <button onClick={()=>comentar(post.id)} style={{padding:"8px 14px",borderRadius:10,border:"none",cursor:"pointer",background:"#22c55e",color:"#000",fontFamily:"'Outfit'",fontWeight:700,fontSize:12}}>↑</button>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE: CARDS
───────────────────────────────────────── */
function PageCards({ user, stats, onPlayerClick }) {
  const CARD_GRADIENTS = [
    "linear-gradient(150deg,#7c5c10,#c9943a,#e8b84b)",
    "linear-gradient(150deg,#0d1f6b,#1a4db5,#2563eb)",
    "linear-gradient(150deg,#064e3b,#059669,#10b981)",
    "linear-gradient(150deg,#3b0764,#7c3aed,#a855f7)",
    "linear-gradient(150deg,#7f1d1d,#dc2626,#f87171)",
    "linear-gradient(150deg,#083344,#0891b2,#22d3ee)",
    "linear-gradient(150deg,#431407,#c2410c,#f97316)",
    "linear-gradient(150deg,#042f2e,#0d9488,#2dd4bf)",
    "linear-gradient(150deg,#1a2e05,#4d7c0f,#84cc16)",
    "linear-gradient(150deg,#4a044e,#a21caf,#e879f9)",
    "linear-gradient(150deg,#1a2e6b,#2554c7,#4f88f7)",
  ];

  return(
    <div className="fade-up">
      <div style={{textAlign:"center",marginBottom:14}}>
        <div style={{fontFamily:"'Bebas Neue'",fontSize:34,color:"#fff",letterSpacing:1}}>Cards del Grupo</div>
        <div style={{fontSize:12,fontWeight:500,color:"rgba(255,255,255,0.3)",marginTop:2}}>
          {user.isAdmin?"Tocá para ver · Admin puede editar":"Tocá para ver los stats"}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {stats.map((j,i)=>(
          <div key={j.id} onClick={()=>onPlayerClick(j)} className="card-hover" style={{background:CARD_GRADIENTS[i%CARD_GRADIENTS.length],borderRadius:16,padding:13,cursor:"pointer",border:"1px solid rgba(255,255,255,0.1)",minHeight:180,position:"relative",overflow:"hidden",boxShadow:"0 4px 20px rgba(0,0,0,0.3)"}}>
            <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(255,255,255,0.1) 0%,transparent 55%)",pointerEvents:"none"}}/>
            <div style={{position:"relative",zIndex:1}}>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <div style={{fontFamily:"'Bebas Neue'",fontSize:36,color:"rgba(0,0,0,0.2)",lineHeight:1}}>{j.rating}</div>
                <span style={{fontSize:14}}>{j.nacionalidad||"🇦🇷"}</span>
              </div>
              <div style={{width:48,height:48,borderRadius:"50%",background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Outfit'",fontWeight:800,fontSize:21,color:"#fff",margin:"4px auto 8px",border:"2px solid rgba(255,255,255,0.3)"}}>
                {j.nombre[0]}
              </div>
              <div style={{background:"rgba(0,0,0,0.4)",borderRadius:9,padding:"6px 8px",textAlign:"center"}}>
                <div style={{fontWeight:700,fontSize:13}}>{j.nombre}</div>
                <div style={{fontSize:9,fontWeight:500,opacity:0.55}}>{j.club||"Al-Koliko FC"}</div>
              </div>
              <div style={{display:"flex",justifyContent:"space-around",marginTop:8}}>
                {[["Goles",j.goles],["Asist",j.asist],["MVP",j.mvps]].map(([k,v])=>(
                  <div key={k} style={{textAlign:"center"}}>
                    <div style={{fontFamily:"'Bebas Neue'",fontSize:17}}>{v}</div>
                    <div style={{fontSize:8,fontWeight:600,opacity:0.5}}>{k}</div>
                  </div>
                ))}
              </div>
              {user.isAdmin&&<div style={{position:"absolute",top:6,right:6,background:"rgba(0,0,0,0.4)",borderRadius:6,padding:"2px 6px",fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.6)"}}>✏️</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   APP ROOT
───────────────────────────────────────── */
export default function App() {
  const [loggedUser, setLoggedUser] = useState(null);
  const [tab, setTab] = useState(0);
  const [showAdmin, setShowAdmin] = useState(false);
  const [stats, setStats] = useState(STATS_INIT);
  const [feed, setFeed] = useState(FEED_INIT);
  const [partido] = useState(PARTIDO_INIT);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const handleLogin = (user) => { setLoggedUser(user); setTab(0); };
  const handleLogout = () => { setLoggedUser(null); setTab(0); setShowAdmin(false); };

  const handlePlayerClick = (j) => setSelectedPlayer(j);
  const handlePlayerSave = (updated) => {
    setStats(prev => prev.map(s => s.id===updated.id ? {...s,...updated} : s));
    setSelectedPlayer(updated);
  };

  if(!loggedUser) return (
    <>
      <style>{CSS}</style>
      <div style={{maxWidth:520,margin:"0 auto"}}><LoginScreen onLogin={handleLogin}/></div>
    </>
  );

  const PAGES = [
    <PageInicio user={loggedUser} partido={partido} stats={stats} onVotar={()=>setTab(0)}/>,
    <PageTemporada user={loggedUser} stats={stats} onPlayerClick={handlePlayerClick}/>,
    <PageCincoIdeal stats={stats} onPlayerClick={handlePlayerClick}/>,
    <PageFeed user={loggedUser} stats={stats} feed={feed} onFeedUpdate={setFeed}/>,
    <PageCards user={loggedUser} stats={stats} onPlayerClick={handlePlayerClick}/>,
  ];

  return (
    <>
      <style>{CSS}</style>
      {selectedPlayer && (
        <PlayerCardModal
          jugador={selectedPlayer}
          onClose={()=>setSelectedPlayer(null)}
          isAdmin={loggedUser.isAdmin}
          onSave={handlePlayerSave}
        />
      )}
      <div style={{maxWidth:520,margin:"0 auto",minHeight:"100dvh",position:"relative"}}>
        <Header user={loggedUser} onAdmin={()=>setShowAdmin(true)} onLogout={handleLogout}/>
        <div style={{padding:"14px 14px 82px",position:"relative",zIndex:1}}>
          {PAGES[tab]}
        </div>
        <NavBottom active={tab} onChange={i=>{setTab(i);setShowAdmin(false);}} pendiente={1}/>
      </div>
    </>
  );
}
