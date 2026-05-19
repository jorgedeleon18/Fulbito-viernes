import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";

/* ─────────────────────────────────────────
   STORAGE
───────────────────────────────────────── */
const S = {
  get: (k, def=null) => { try { const v=localStorage.getItem(k); return v?JSON.parse(v):def; } catch { return def; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

/* ─────────────────────────────────────────
   DATA INICIAL
───────────────────────────────────────── */
const ADMINS = ["nico","juank"];

const USERS_DEFAULT = [
  { id:1, nombre:"Nico", apellido:"De Leon", apodo:"El Capitán", email:"nico@fulbito.com", pass:"nico123", isAdmin:true, color:"#7C3AED", posicion:"Mediocampista", pierna:"Derecha", ciudad:"Berazategui", nivel:"Avanzado", fechaNac:"1990-03-15",
    stats:{ velocidad:82, pase:88, defensa:65, tiro:78, tecnica:85, resistencia:80 },
    pj:12, wins:8, mvps:4, goles:14, asist:9, puntosMes:52, puntosAnio:132, rating:88, rareza:"Oro", numero:10, foto:null },
  { id:2, nombre:"Juank", apellido:"Molina", apodo:"El Estratega", email:"juank@fulbito.com", pass:"juank123", isAdmin:true, color:"#2563EB", posicion:"Defensor", pierna:"Derecha", ciudad:"Berazategui", nivel:"Avanzado", fechaNac:"1991-07-22",
    stats:{ velocidad:75, pase:82, defensa:90, tiro:60, tecnica:78, resistencia:85 },
    pj:10, wins:6, mvps:3, goles:8, asist:12, puntosMes:47, puntosAnio:110, rating:84, rareza:"Oro", numero:4, foto:null },
  { id:3, nombre:"Enzo", apellido:"Cejas", apodo:"Al-Koliko", email:"enzo@fulbito.com", pass:"enzo123", isAdmin:false, color:"#059669", posicion:"Delantero", pierna:"Izquierda", ciudad:"Quilmes", nivel:"Intermedio", fechaNac:"1990-05-02",
    stats:{ velocidad:88, pase:72, defensa:55, tiro:85, tecnica:80, resistencia:75 },
    pj:11, wins:7, mvps:2, goles:18, asist:4, puntosMes:38, puntosAnio:98, rating:82, rareza:"Plata", numero:9, foto:null },
  { id:4, nombre:"Maxi", apellido:"García", apodo:"El Tanque", email:"maxi@fulbito.com", pass:"maxi123", isAdmin:false, color:"#DC2626", posicion:"Delantero", pierna:"Derecha", ciudad:"Florencio Varela", nivel:"Intermedio", fechaNac:"1992-11-08",
    stats:{ velocidad:70, pase:65, defensa:60, tiro:88, tecnica:68, resistencia:90 },
    pj:9, wins:5, mvps:3, goles:6, asist:15, puntosMes:29, puntosAnio:87, rating:80, rareza:"Plata", numero:11, foto:null },
  { id:5, nombre:"Fede", apellido:"López", apodo:"Mágico", email:"fede@fulbito.com", pass:"fede123", isAdmin:false, color:"#D97706", posicion:"Mediocampista", pierna:"Derecha", ciudad:"Berazategui", nivel:"Avanzado", fechaNac:"1993-02-14",
    stats:{ velocidad:78, pase:90, defensa:62, tiro:72, tecnica:92, resistencia:77 },
    pj:12, wins:7, mvps:1, goles:10, asist:7, puntosMes:25, puntosAnio:74, rating:77, rareza:"Plata", numero:8, foto:null },
  { id:6, nombre:"Lean", apellido:"Ramírez", apodo:"El Rápido", email:"lean@fulbito.com", pass:"lean123", isAdmin:false, color:"#0891B2", posicion:"Extremo", pierna:"Derecha", ciudad:"Quilmes", nivel:"Intermedio", fechaNac:"1994-09-30",
    stats:{ velocidad:95, pase:75, defensa:58, tiro:70, tecnica:76, resistencia:82 },
    pj:8, wins:4, mvps:2, goles:2, asist:3, puntosMes:22, puntosAnio:65, rating:75, rareza:"Bronce", numero:7, foto:null },
  { id:7, nombre:"Seba", apellido:"Moreno", apodo:"El Arquero", email:"seba@fulbito.com", pass:"seba123", isAdmin:false, color:"#65A30D", posicion:"Arquero", pierna:"Derecha", ciudad:"Berazategui", nivel:"Avanzado", fechaNac:"1988-12-05",
    stats:{ velocidad:65, pase:70, defensa:95, tiro:55, tecnica:72, resistencia:80 },
    pj:10, wins:5, mvps:1, goles:9, asist:5, puntosMes:18, puntosAnio:54, rating:73, rareza:"Bronce", numero:1, foto:null },
  { id:8, nombre:"Matías", apellido:"Suárez", apodo:"Toro", email:"matias@fulbito.com", pass:"matias123", isAdmin:false, color:"#B45309", posicion:"Defensor", pierna:"Derecha", ciudad:"Berazategui", nivel:"Intermedio", fechaNac:"1991-04-18",
    stats:{ velocidad:72, pase:68, defensa:85, tiro:65, tecnica:70, resistencia:88 },
    pj:7, wins:3, mvps:0, goles:5, asist:4, puntosMes:15, puntosAnio:42, rating:70, rareza:"Bronce", numero:5, foto:null },
];

const PARTIDO_DEFAULT = {
  fecha:"Viernes 16 Mayo", hora:"21:00", cancha:"Cancha La Estrella", ubicacion:"Berazategui",
  jugadores:[1,2,3,4,5,6,7,8], equipoA:[1,3,5,7], equipoB:[2,4,6,8], confirmados:[1,2,3,4,5,6],
};

const FEED_DEFAULT = [
  { id:1, userId:3, texto:"Mañana a las 9 el que llegue tarde limpia el vestuario 😂 estamos o no estamos?", likes:[1,2,4,5,6,7,8], comentarios:[{userId:1,texto:"Jajaja voy!"},{userId:4,texto:"Obvio!"}], hace:"Hace 2 horas" },
  { id:2, userId:1, texto:"El golazo de Lean del otro día 🔥🔥 la rompió", likes:[1,2,3,4,5,6,7,8,9], comentarios:[{userId:6,texto:"Gracias!"},{userId:5,texto:"Top 10!"}], hace:"Ayer 23:40" },
  { id:3, userId:5, texto:"Che alguien tiene las botitas número 41? Se me rompieron las mías esta semana jajaja", likes:[1,3,4,9], comentarios:[{userId:2,texto:"Yo tengo unas!"},{userId:8,texto:"Jajajaja"}], hace:"Hace 2 días" },
];

/* ─────────────────────────────────────────
   RAREZA CONFIG
───────────────────────────────────────── */
const RAREZA_CONFIG = {
  "Oro":    { bg:"linear-gradient(150deg,#7c5c10,#c9943a,#f0c060,#c9943a,#7c5c10)", border:"#e8c96d", glow:"rgba(201,168,76,0.5)" },
  "Plata":  { bg:"linear-gradient(150deg,#3a3a4a,#8a8aaa,#c0c0d8,#8a8aaa,#3a3a4a)", border:"#b0b0cc", glow:"rgba(160,160,200,0.4)" },
  "Bronce": { bg:"linear-gradient(150deg,#5a2e10,#a05030,#c87840,#a05030,#5a2e10)", border:"#c09060", glow:"rgba(180,120,60,0.4)" },
};

/* ─────────────────────────────────────────
   POSICIONES
───────────────────────────────────────── */
const POSICIONES = ["Arquero","Defensor","Lateral","Mediocampista","Volante","Extremo","Delantero"];
const NIVELES = ["Principiante","Intermedio","Avanzado","Semiprofesional"];
const PIERNAS = ["Derecha","Izquierda","Ambas"];

/* ─────────────────────────────────────────
   FIGURITA SVG
───────────────────────────────────────── */
function FiguritaSVG({ jugador, size=280, onClick }) {
  const media = Math.round(Object.values(jugador.stats||{}).reduce((a,b)=>a+b,0)/6);
  const initials = `${jugador.nombre[0]}${jugador.apellido?.[0]||""}`;

  // Color de fondo según rareza
  const bgColor = jugador.rareza==="Oro"
    ? {c1:"#b8860b", c2:"#ffd700", c3:"#b8860b"}
    : jugador.rareza==="Plata"
    ? {c1:"#708090", c2:"#c0c0c0", c3:"#708090"}
    : {c1:"#6a3805", c2:"#cd7f32", c3:"#6a3805"};

  return (
    <svg width={size} height={size*1.5} viewBox="0 0 300 450" onClick={onClick}
      style={{ cursor:onClick?"pointer":"default", filter:"drop-shadow(0 6px 24px rgba(0,0,0,0.5))" }}>
      <defs>
        <linearGradient id={`av-${jugador.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={bgColor.c1}/>
          <stop offset="50%" stopColor={bgColor.c2}/>
          <stop offset="100%" stopColor={bgColor.c3}/>
        </linearGradient>
        <clipPath id={`foto-${jugador.id}`}>
          <rect x="42" y="61" width="180" height="247" rx="12"/>
        </clipPath>
      </defs>

      {/* Fondo por rareza */}
      <rect x="42" y="61" width="180" height="247" rx="12" fill={`url(#av-${jugador.id})`}/>

      {/* Foto centrada o iniciales */}
      {jugador.foto ? (
        <foreignObject x="42" y="61" width="180" height="247" clipPath={`url(#foto-${jugador.id})`}>
          <img src={jugador.foto} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top",display:"block"}}/>
        </foreignObject>
      ) : (
        <text x="132" y="205" fontFamily="'Outfit',sans-serif" fontSize="64" fontWeight="900"
          fill="rgba(255,255,255,0.95)" textAnchor="middle"
          clipPath={`url(#foto-${jugador.id})`}>{initials}</text>
      )}

      {/* Marco PNG encima */}
      <image href="/marco.png" x="0" y="0" width="300" height="450" preserveAspectRatio="xMidYMid meet"/>

      {/* Media arriba izquierda */}
      <text x="60" y="52" fontFamily="'Bebas Neue',sans-serif" fontSize="20"
        fill="white" textAnchor="middle" fontWeight="900">{media}</text>

      {/* Fila 1 — Nombre Apellido */}
      <text x="120" y="332" fontFamily="'Outfit',sans-serif" fontSize="13"
        fill="white" textAnchor="middle">
        <tspan fontWeight="300">{jugador.nombre.toUpperCase()} </tspan>
        <tspan fontWeight="900">{jugador.apellido?.toUpperCase()}</tspan>
      </text>

      {/* Fila 2 — Fecha + posición */}
      <text x="120" y="358" fontFamily="'Outfit',sans-serif" fontSize="8.5"
        fill="white" textAnchor="middle">
        {(jugador.fechaNac||"--/--/----") + " · " + (jugador.posicion||"Jugador")}
      </text>

      {/* Fila 3 — Club */}
      <text x="112" y="382" fontFamily="'Outfit',sans-serif" fontSize="11" fontWeight="700"
        fill="white" textAnchor="middle" letterSpacing="1">
        AL-KOLIKO FC
      </text>

    </svg>
  );
}

function StarballSVG({ size=320, opacity=0.06 }) {
  const cx=size/2, cy=size/2, R=size*0.38, r=size*0.07;
  const stars=Array.from({length:8},(_,i)=>{ const a=(i*Math.PI*2)/8-Math.PI/2; return {x:cx+R*Math.cos(a),y:cy+R*Math.sin(a)}; });
  function star(cx,cy,or,ir,pts=5){ let d=""; for(let i=0;i<pts*2;i++){ const a=(i*Math.PI)/pts-Math.PI/2; const rad=i%2===0?or:ir; d+=(i===0?"M":"L")+(cx+rad*Math.cos(a))+","+(cy+rad*Math.sin(a)); } return d+"Z"; }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{opacity}}>
      <circle cx={cx} cy={cy} r={R+r*1.8} fill="none" stroke="white" strokeWidth={0.8} opacity={0.6}/>
      <circle cx={cx} cy={cy} r={r*1.4} fill="white" opacity={0.9}/>
      {stars.map((s,i)=><g key={i}><path d={star(s.x,s.y,r*0.95,r*0.42,5)} fill="white" opacity={0.92}/></g>)}
      {stars.map((s,i)=>{ const next=stars[(i+1)%8]; return <line key={i} x1={s.x} y1={s.y} x2={next.x} y2={next.y} stroke="white" strokeWidth={0.5} opacity={0.2}/>; })}
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
body{background:#060b18;color:#f0f4ff;font-family:'Outfit',sans-serif;min-height:100vh;min-height:100dvh;overscroll-behavior:none;-webkit-font-smoothing:antialiased}
body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 100% 50% at 50% -10%,rgba(30,100,255,0.12) 0%,transparent 65%),linear-gradient(180deg,#050a16 0%,#060b18 100%);z-index:-1;pointer-events:none}
::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#1e50d4;border-radius:99px}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pop{0%{transform:scale(0.88);opacity:0}70%{transform:scale(1.04)}100%{transform:scale(1);opacity:1}}
@keyframes rotateSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes slideDown{from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:translateY(0)}}
@keyframes glow{0%,100%{box-shadow:0 0 20px rgba(30,80,212,0.35)}50%{box-shadow:0 0 40px rgba(34,197,94,0.6)}}
.fade-up{animation:fadeUp 0.28s cubic-bezier(.22,.68,0,1.2) both}
.fade-in{animation:fadeIn 0.25s ease both}
.pop{animation:pop 0.32s cubic-bezier(.22,.68,0,1.2) both}
.rotate-slow{animation:rotateSlow 60s linear infinite}
.slide-down{animation:slideDown 0.3s cubic-bezier(.22,.68,0,1.2) both}
.pulse-dot{animation:pulse 2s ease infinite}
.glow-anim{animation:glow 2s ease infinite}
.gold-text{background:linear-gradient(90deg,#c9a84c,#f5e4a8,#e8c96d,#c9a84c);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 3s linear infinite}
.ucl-input{width:100%;padding:13px 16px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;outline:none;font-family:'Outfit';font-size:15px;font-weight:500;color:#f0f4ff;transition:all 0.2s}
.ucl-input:focus{border-color:rgba(30,80,212,0.6);background:rgba(30,80,212,0.08);box-shadow:0 0 0 3px rgba(30,80,212,0.12)}
.ucl-input::placeholder{color:rgba(255,255,255,0.25)}
select.ucl-input{appearance:none;cursor:pointer}
.card-tap{transition:transform 0.15s,opacity 0.15s;cursor:pointer}
.card-tap:active{transform:scale(0.97);opacity:0.85}
`;

/* ─────────────────────────────────────────
   COMPONENTES BASE
───────────────────────────────────────── */
function Av({ j, size=38, border=false, onClick }) {
  return (
    <div onClick={onClick} style={{
      width:size, height:size, borderRadius:"50%", flexShrink:0,
      background:j?.color||"#1e50d4",
      display:"flex", alignItems:"center", justifyContent:"center",
      fontFamily:"'Outfit'", fontWeight:800, fontSize:size*0.38, color:"#fff",
      textShadow:"0 1px 3px rgba(0,0,0,0.5)",
      border: border ? "2px solid rgba(255,255,255,0.3)" : "1.5px solid rgba(255,255,255,0.12)",
      boxShadow:`0 2px 12px ${j?.color||"#1e50d4"}44`,
      cursor: onClick?"pointer":"default", overflow:"hidden",
    }}>
      {j?.foto ? <img src={j.foto} style={{width:"100%",height:"100%",objectFit:"cover"}}/> : (j?.nombre?.[0]||"?")}
    </div>
  );
}

function Lbl({ children, style={} }) {
  return <div style={{fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"rgba(255,255,255,0.35)",marginBottom:5,...style}}>{children}</div>;
}

function Card({ children, style={}, onClick }) {
  return (
    <div onClick={onClick} className={onClick?"card-tap":""} style={{
      background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)",
      borderRadius:16, padding:16, marginBottom:10,
      backdropFilter:"blur(12px)", boxShadow:"inset 0 1px 0 rgba(255,255,255,0.04)",
      cursor:onClick?"pointer":"default", ...style,
    }}>{children}</div>
  );
}

function BtnGreen({ children, onClick, disabled=false, style={} }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width:"100%", padding:"14px", borderRadius:14,
      border: disabled?"1px solid rgba(255,255,255,0.06)":"1px solid rgba(30,80,212,0.4)",
      cursor: disabled?"not-allowed":"pointer",
      fontFamily:"'Outfit'", fontWeight:700, fontSize:15,
      background: disabled?"rgba(255,255,255,0.03)":"linear-gradient(135deg,#1440b8,#2563eb)",
      color: disabled?"rgba(255,255,255,0.2)":"#fff",
      boxShadow: disabled?"none":"0 4px 20px rgba(30,80,212,0.3)",
      transition:"all 0.2s", ...style,
    }}>{children}</button>
  );
}

function BtnOutline({ children, onClick, style={} }) {
  return (
    <button onClick={onClick} style={{
      width:"100%", padding:"13px", borderRadius:14,
      border:"1px solid rgba(255,255,255,0.15)",
      cursor:"pointer", fontFamily:"'Outfit'", fontWeight:600, fontSize:14,
      background:"rgba(255,255,255,0.04)", color:"rgba(255,255,255,0.7)",
      transition:"all 0.2s", ...style,
    }}>{children}</button>
  );
}

function StatBar({ label, value, color="#2563eb" }) {
  return (
    <div style={{marginBottom:8}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
        <span style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.5)"}}>{label}</span>
        <span style={{fontSize:11,fontWeight:700,color}}>{value}</span>
      </div>
      <div style={{height:4,background:"rgba(255,255,255,0.08)",borderRadius:99,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${value}%`,background:color,borderRadius:99,transition:"width 0.5s ease"}}/>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MODAL JUGADOR
───────────────────────────────────────── */
function PlayerModal({ jugador, onClose, isAdmin, onSave }) {
  const [editing, setEditing] = useState(false);
  const [tab, setTab] = useState("stats");
  const [form, setForm] = useState({...jugador});
  const [savedOk, setSavedOk] = useState(false);
  const fileRef = useRef();

  // Sincronizar form cuando jugador cambia desde afuera
  useEffect(() => { setForm(f=>({...jugador,...f, foto:jugador.foto||f.foto})); }, [jugador.id]);

  if(!jugador) return null;
  const media = Math.round(Object.values(jugador.stats||{}).reduce((a,b)=>a+b,0)/6);

  const save = () => {
    onSave(form);
    setEditing(false);
    setSavedOk(true);
    setTimeout(() => setSavedOk(false), 3000);
  };

  const handleFoto = (e) => {
    const file = e.target.files?.[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm(p=>({...p, foto:ev.target.result}));
    reader.readAsDataURL(file);
  };

  return (
    <div className="fade-in" style={{position:"fixed",inset:0,zIndex:500,background:"rgba(0,0,0,0.88)",backdropFilter:"blur(16px)",display:"flex",alignItems:"flex-end",justifyContent:"center",padding:"0 0 0 0"}}
      onMouseDown={e=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div className="slide-up" style={{width:"100%",maxWidth:520,background:"#0a1020",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"24px 24px 0 0",maxHeight:"92dvh",overflow:"auto",paddingBottom:24}}>
        {/* Header */}
        <div style={{position:"sticky",top:0,background:"#0a1020",padding:"14px 16px 0",zIndex:10}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{fontFamily:"'Bebas Neue'",fontSize:20,letterSpacing:1}}>{jugador.nombre} {jugador.apellido}</div>
            <button onClick={onClose} style={{background:"rgba(255,255,255,0.08)",border:"none",color:"rgba(255,255,255,0.6)",width:32,height:32,borderRadius:"50%",cursor:"pointer",fontSize:18}}>×</button>
          </div>

          {savedOk && (
            <div style={{background:"#16a34a",color:"#fff",borderRadius:10,padding:"8px 14px",fontSize:13,fontWeight:600,marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
              ✅ Perfil guardado correctamente
            </div>
          )}

          <div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto",paddingBottom:4}}>
            {["stats","figurita","editar"].filter(t=>t!=="editar"||isAdmin).map(t=>(
              <button key={t} onClick={()=>setTab(t)} style={{padding:"6px 16px",borderRadius:99,border:"none",cursor:"pointer",fontFamily:"'Outfit'",fontWeight:600,fontSize:12,background:tab===t?"#2563eb":"rgba(255,255,255,0.06)",color:tab===t?"#000":"rgba(255,255,255,0.5)",whiteSpace:"nowrap",transition:"all 0.2s"}}>
                {t==="stats"?"📊 Stats":t==="figurita"?"🎴 Figurita":"✏️ Editar"}
              </button>
            ))}
          </div>
        </div>

        <div style={{padding:"0 16px"}}>
          {/* STATS */}
          {tab==="stats"&&(
            <div className="fade-in">
              <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:20}}>
                <Av j={jugador} size={72} border/>
                <div>
                  <div style={{fontWeight:800,fontSize:18}}>{jugador.nombre} {jugador.apellido}</div>
                  <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:4}}>{jugador.apodo}</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    <span style={{fontSize:10,padding:"2px 8px",borderRadius:99,background:"rgba(30,80,212,0.15)",color:"#4ade80",border:"1px solid rgba(30,80,212,0.25)",fontWeight:600}}>{jugador.posicion}</span>
                    <span style={{fontSize:10,padding:"2px 8px",borderRadius:99,background:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.5)",border:"1px solid rgba(255,255,255,0.1)",fontWeight:600}}>#{jugador.numero}</span>
                    <span style={{fontSize:10,padding:"2px 8px",borderRadius:99,background:RAREZA_CONFIG[jugador.rareza]?.glow?.replace("0.5","0.15")||"rgba(201,168,76,0.12)",color:RAREZA_CONFIG[jugador.rareza]?.border||"#c9a84c",border:`1px solid ${RAREZA_CONFIG[jugador.rareza]?.border||"#c9a84c"}44`,fontWeight:600}}>{jugador.rareza}</span>
                  </div>
                </div>
                <div style={{marginLeft:"auto",textAlign:"center"}}>
                  <div style={{fontFamily:"'Bebas Neue'",fontSize:48,color:"#7cb9ff",lineHeight:1}}>{media}</div>
                  <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.3)",letterSpacing:1}}>MEDIA</div>
                </div>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginBottom:16}}>
                {[["⚽",jugador.goles,"Goles"],["🎯",jugador.asist,"Asist"],["👑",jugador.mvps,"MVPs"],["🎮",jugador.pj,"PJ"]].map(([icon,v,label])=>(
                  <div key={label} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"10px 6px",textAlign:"center"}}>
                    <div style={{fontSize:16,marginBottom:2}}>{icon}</div>
                    <div style={{fontFamily:"'Bebas Neue'",fontSize:22,color:"#7cb9ff",lineHeight:1}}>{v}</div>
                    <div style={{fontSize:9,fontWeight:600,color:"rgba(255,255,255,0.35)",marginTop:2}}>{label}</div>
                  </div>
                ))}
              </div>

              <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:14,marginBottom:14}}>
                <Lbl style={{marginBottom:10}}>Atributos</Lbl>
                {[["Velocidad",jugador.stats?.velocidad,"#2563eb"],["Pase",jugador.stats?.pase,"#3b82f6"],["Defensa",jugador.stats?.defensa,"#f59e0b"],["Tiro",jugador.stats?.tiro,"#ef4444"],["Técnica",jugador.stats?.tecnica,"#8b5cf6"],["Resistencia",jugador.stats?.resistencia,"#06b6d4"]].map(([k,v,c])=>(
                  <StatBar key={k} label={k} value={v||0} color={c}/>
                ))}
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {[["Ciudad",jugador.ciudad],["Pierna",jugador.pierna],["Nivel",jugador.nivel],["Puntos mes",jugador.puntosMes]].map(([k,v])=>(
                  <div key={k} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,padding:"10px 12px"}}>
                    <div style={{fontSize:10,fontWeight:600,color:"rgba(255,255,255,0.35)",marginBottom:2}}>{k}</div>
                    <div style={{fontWeight:700,fontSize:14}}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FIGURITA */}
          {tab==="figurita"&&(
            <div className="fade-in" style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"8px 0",overflowX:"hidden"}}>
              <FiguritaSVG jugador={form} size={200}/>
              <div style={{marginTop:12,fontSize:12,color:"rgba(255,255,255,0.3)",textAlign:"center"}}>
                Figurita generada automáticamente<br/>Completá tu perfil para mejorar tus stats
              </div>
            </div>
          )}

          {/* EDITAR (solo admin) */}
          {tab==="editar"&&isAdmin&&(
            <div className="fade-in">
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div style={{display:"flex",gap:8}}>
                  <div style={{flex:1}}><Lbl>Nombre</Lbl><input className="ucl-input" value={form.nombre||""} onChange={e=>setForm(p=>({...p,nombre:e.target.value}))}/></div>
                  <div style={{flex:1}}><Lbl>Apellido</Lbl><input className="ucl-input" value={form.apellido||""} onChange={e=>setForm(p=>({...p,apellido:e.target.value}))}/></div>
                </div>
                <div><Lbl>Apodo</Lbl><input className="ucl-input" value={form.apodo||""} onChange={e=>setForm(p=>({...p,apodo:e.target.value}))}/></div>
                <div style={{display:"flex",gap:8}}>
                  <div style={{flex:1}}><Lbl>Número</Lbl><input className="ucl-input" type="number" value={form.numero||""} onChange={e=>setForm(p=>({...p,numero:e.target.value}))}/></div>
                  <div style={{flex:1}}>
                    <Lbl>Rareza</Lbl>
                    <select className="ucl-input" value={form.rareza||"Bronce"} onChange={e=>setForm(p=>({...p,rareza:e.target.value}))}>
                      {["Oro","Plata","Bronce"].map(r=><option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
                <Lbl>Atributos</Lbl>
                {[["velocidad","Velocidad"],["pase","Pase"],["defensa","Defensa"],["tiro","Tiro"],["tecnica","Técnica"],["resistencia","Resistencia"]].map(([k,l])=>(
                  <div key={k} style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:12,color:"rgba(255,255,255,0.5)",width:80}}>{l}</span>
                    <input type="range" min="40" max="99" value={form.stats?.[k]||50} onChange={e=>setForm(p=>({...p,stats:{...p.stats,[k]:parseInt(e.target.value)}}))} style={{flex:1}}/>
                    <span style={{fontSize:13,fontWeight:700,width:28,textAlign:"right"}}>{form.stats?.[k]||50}</span>
                  </div>
                ))}
                <div style={{marginTop:4}}>
                  <Lbl>Foto de perfil</Lbl>
                  <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleFoto}/>
                  <button onClick={()=>fileRef.current?.click()} style={{width:"100%",padding:"12px",borderRadius:12,border:"1px dashed rgba(255,255,255,0.2)",background:"rgba(255,255,255,0.03)",cursor:"pointer",fontFamily:"'Outfit'",fontWeight:600,fontSize:13,color:"rgba(255,255,255,0.5)"}}>
                    📷 Subir foto
                  </button>
                </div>
                <div style={{display:"flex",gap:8,marginTop:8}}>
                  <BtnOutline onClick={()=>setTab("stats")} style={{flex:1}}>Cancelar</BtnOutline>
                  <BtnGreen onClick={save} style={{flex:1}}>💾 Guardar</BtnGreen>
                </div>
                {savedOk&&(
                  <div style={{marginTop:8,background:"#16a34a",color:"#fff",borderRadius:10,padding:"10px 14px",fontSize:14,fontWeight:700,textAlign:"center"}}>
                    ✅ ¡Cambios guardados!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   LOGIN / REGISTRO
───────────────────────────────────────── */
function AuthScreen({ onLogin, users, onRegister }) {
  const [modo, setModo] = useState("bienvenida"); // bienvenida | login | registro | onboarding
  const [form, setForm] = useState({ nombre:"", apellido:"", apodo:"", email:"", pass:"", pass2:"", fechaNac:"", posicion:"Mediocampista", pierna:"Derecha", ciudad:"", nivel:"Intermedio" });
  const [loginForm, setLoginForm] = useState({ nombre:"", pass:"" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState(null);
  const fileRef = useRef();

const handleLogin = async () => {
  setErr(""); setLoading(true);
  const { data, error } = await supabase.auth.signInWithPassword({
    email: loginForm.nombre.includes("@") 
      ? loginForm.nombre 
      : loginForm.nombre.toLowerCase().trim() + "@fulbito.com",
    password: loginForm.pass.trim()
  });
  if (error) {
    setErr("Usuario o contraseña incorrectos");
    setLoading(false);
  } else {
    const { data: jugador } = await supabase
      .from("jugadores")
      .select("*")
      .eq("id", data.user.id)
      .single();
    if (jugador) onLogin(jugador);
    else { setErr("No se encontró el jugador"); setLoading(false); }
  }
};

const handleRegister = async () => {
  setErr("");
  if(!form.nombre||!form.apellido||!form.email||!form.pass) return setErr("Completá todos los campos obligatorios");
  if(form.pass!==form.pass2) return setErr("Las contraseñas no coinciden");
  
  setLoading(true);
  const { data, error } = await supabase.auth.signUp({
    email: form.email,
    password: form.pass,
    options: {
      data: {
        nombre: form.nombre,
        apellido: form.apellido,
      }
    }
  });

  if (error) {
    setErr(error.message);
    setLoading(false);
    return;
  }

  // Actualizar el resto de los datos del jugador
  await supabase.from("jugadores").update({
    apodo: form.apodo || `El ${form.nombre}`,
    color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6,"0")}`,
    posicion: form.posicion,
    pierna: form.pierna,
    ciudad: form.ciudad,
    nivel: form.nivel,
    fecha_nac: form.fechaNac,
    numero: Math.floor(Math.random()*99)+1,
    is_admin: ADMINS.includes(form.nombre.toLowerCase()),
  }).eq("id", data.user.id);

  const { data: jugador } = await supabase
    .from("jugadores")
    .select("*")
    .eq("id", data.user.id)
    .single();

  setNewUser(jugador);
  setLoading(false);
  setModo("onboarding");
};

  const handleFoto = (e) => {
    const file = e.target.files?.[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setNewUser(p=>({...p,foto:ev.target.result}));
    reader.readAsDataURL(file);
  };

  const finalizarRegistro = () => {
    onRegister(newUser);
    onLogin(newUser);
  };

  // BIENVENIDA
  if(modo==="bienvenida") return (
    <div style={{minHeight:"100dvh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,position:"relative",overflow:"hidden"}}>
      <div className="rotate-slow" style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",pointerEvents:"none",zIndex:0}}><StarballSVG size={520} opacity={0.05}/></div>
      <div className="fade-up" style={{textAlign:"center",marginBottom:48,position:"relative",zIndex:1}}>
        <div style={{width:90,height:90,borderRadius:24,margin:"0 auto 20px",background:"linear-gradient(135deg,#1440b8,#0a1f6b)",border:"1px solid rgba(30,80,212,0.35)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:44,boxShadow:"0 0 50px rgba(30,80,212,0.35),inset 0 1px 0 rgba(255,255,255,0.1)"}}>⚽</div>
        <div style={{fontFamily:"'Outfit'",fontWeight:900,fontSize:34,color:"#fff",lineHeight:1.1,marginBottom:6}}>El Fulbito</div>
        <div className="gold-text" style={{fontFamily:"'Outfit'",fontWeight:600,fontSize:16,marginBottom:8}}>de los Viernes</div>
        <div style={{fontSize:12,fontWeight:500,color:"rgba(255,255,255,0.3)",letterSpacing:2}}>AL-KOLIKO FC · TEMPORADA 2025</div>
      </div>
      <div className="fade-up" style={{width:"100%",maxWidth:360,position:"relative",zIndex:1,display:"flex",flexDirection:"column",gap:12}}>
        <BtnGreen onClick={()=>setModo("login")}>Iniciar sesión</BtnGreen>
        <BtnOutline onClick={()=>setModo("registro")}>Crear cuenta</BtnOutline>
        <button onClick={()=>{}} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"'Outfit'",fontSize:13,color:"rgba(255,255,255,0.3)",marginTop:4}}>
          ¿Olvidaste tu contraseña?
        </button>
      </div>
      <div style={{position:"absolute",bottom:24,fontSize:10,color:"rgba(255,255,255,0.15)",letterSpacing:1}}>Demo: Nico/nico123 · Admin: Juank/juank123</div>
    </div>
  );

  // LOGIN
  if(modo==="login") return (
    <div style={{minHeight:"100dvh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:-60,right:-60,pointerEvents:"none",zIndex:0,opacity:0.04}}><StarballSVG size={260} opacity={1}/></div>
      <div className="fade-up" style={{width:"100%",maxWidth:380,position:"relative",zIndex:1}}>
        <button onClick={()=>setModo("bienvenida")} style={{background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.4)",fontSize:13,fontFamily:"'Outfit'",marginBottom:20,display:"flex",alignItems:"center",gap:6}}>
          ← Volver
        </button>
        <div style={{fontFamily:"'Outfit'",fontWeight:800,fontSize:26,marginBottom:4}}>Bienvenido de nuevo</div>
        <div style={{fontSize:14,color:"rgba(255,255,255,0.35)",marginBottom:24}}>Ingresá con tu usuario del grupo</div>

        <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:16}}>
          <div><Lbl>Usuario</Lbl><input className="ucl-input" placeholder="Tu nombre..." value={loginForm.nombre} onChange={e=>setLoginForm(p=>({...p,nombre:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&handleLogin()}/></div>
          <div><Lbl>Contraseña</Lbl><input className="ucl-input" type="password" placeholder="••••••••" value={loginForm.pass} onChange={e=>setLoginForm(p=>({...p,pass:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&handleLogin()}/></div>
        </div>

        {err&&<div className="pop" style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:10,padding:"10px 14px",fontSize:13,color:"#fca5a5",marginBottom:14,textAlign:"center"}}>⚠️ {err}</div>}

        <BtnGreen onClick={handleLogin} disabled={!loginForm.nombre||!loginForm.pass||loading}>
          {loading?"Entrando...":"Entrar al vestuario 🏟️"}
        </BtnGreen>
        <div style={{textAlign:"center",marginTop:16,fontSize:13,color:"rgba(255,255,255,0.35)"}}>
          ¿No tenés cuenta? <button onClick={()=>setModo("registro")} style={{background:"none",border:"none",cursor:"pointer",color:"#7cb9ff",fontFamily:"'Outfit'",fontWeight:700,fontSize:13}}>Registrate</button>
        </div>
      </div>
    </div>
  );

  // REGISTRO
  if(modo==="registro") return (
    <div style={{minHeight:"100dvh",padding:"24px 24px 40px",position:"relative",overflow:"hidden"}}>
      <button onClick={()=>setModo("bienvenida")} style={{background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.4)",fontSize:13,fontFamily:"'Outfit'",marginBottom:20,display:"flex",alignItems:"center",gap:6}}>← Volver</button>
      <div className="fade-up">
        <div style={{fontFamily:"'Outfit'",fontWeight:800,fontSize:24,marginBottom:4}}>Crear cuenta</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.35)",marginBottom:20}}>Unite al grupo del fulbito 🔥</div>

        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={{display:"flex",gap:8}}>
            <div style={{flex:1}}><Lbl>Nombre *</Lbl><input className="ucl-input" placeholder="Ej: Lucas" value={form.nombre} onChange={e=>setForm(p=>({...p,nombre:e.target.value}))}/></div>
            <div style={{flex:1}}><Lbl>Apellido *</Lbl><input className="ucl-input" placeholder="Ej: Gómez" value={form.apellido} onChange={e=>setForm(p=>({...p,apellido:e.target.value}))}/></div>
          </div>
          <div><Lbl>Apodo futbolero</Lbl><input className="ucl-input" placeholder="Ej: El Fantasma" value={form.apodo} onChange={e=>setForm(p=>({...p,apodo:e.target.value}))}/></div>
          <div><Lbl>Email *</Lbl><input className="ucl-input" type="email" placeholder="tu@email.com" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))}/></div>
          <div style={{display:"flex",gap:8}}>
            <div style={{flex:1}}><Lbl>Contraseña *</Lbl><input className="ucl-input" type="password" placeholder="••••••••" value={form.pass} onChange={e=>setForm(p=>({...p,pass:e.target.value}))}/></div>
            <div style={{flex:1}}><Lbl>Repetir *</Lbl><input className="ucl-input" type="password" placeholder="••••••••" value={form.pass2} onChange={e=>setForm(p=>({...p,pass2:e.target.value}))}/></div>
          </div>
          <div><Lbl>Fecha de nacimiento</Lbl><input className="ucl-input" type="date" value={form.fechaNac} onChange={e=>setForm(p=>({...p,fechaNac:e.target.value}))}/></div>
          <div style={{display:"flex",gap:8}}>
            <div style={{flex:1}}>
              <Lbl>Posición</Lbl>
              <select className="ucl-input" value={form.posicion} onChange={e=>setForm(p=>({...p,posicion:e.target.value}))}>
                {POSICIONES.map(p=><option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div style={{flex:1}}>
              <Lbl>Pierna hábil</Lbl>
              <select className="ucl-input" value={form.pierna} onChange={e=>setForm(p=>({...p,pierna:e.target.value}))}>
                {PIERNAS.map(p=><option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <div style={{flex:1}}><Lbl>Barrio/Ciudad</Lbl><input className="ucl-input" placeholder="Ej: Berazategui" value={form.ciudad} onChange={e=>setForm(p=>({...p,ciudad:e.target.value}))}/></div>
            <div style={{flex:1}}>
              <Lbl>Nivel</Lbl>
              <select className="ucl-input" value={form.nivel} onChange={e=>setForm(p=>({...p,nivel:e.target.value}))}>
                {NIVELES.map(n=><option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
        </div>

        {err&&<div className="pop" style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:10,padding:"10px 14px",fontSize:13,color:"#fca5a5",margin:"14px 0",textAlign:"center"}}>⚠️ {err}</div>}

        <div style={{marginTop:16}}>
          <BtnGreen onClick={handleRegister} disabled={!form.nombre||!form.apellido||!form.email||!form.pass}>
            Crear mi perfil →
          </BtnGreen>
        </div>
      </div>
    </div>
  );

  // ONBOARDING - FOTO
  if(modo==="onboarding"&&newUser) return (
    <div style={{minHeight:"100dvh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,position:"relative",overflow:"hidden"}}>
      <div className="fade-up" style={{width:"100%",maxWidth:380,position:"relative",zIndex:1,textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:16}}>🎴</div>
        <div style={{fontFamily:"'Outfit'",fontWeight:800,fontSize:24,marginBottom:6}}>¡Último paso!</div>
        <div style={{fontSize:14,color:"rgba(255,255,255,0.4)",marginBottom:28}}>Sacate una foto para tu figurita</div>

        {/* Preview figurita */}
        <div style={{display:"flex",justifyContent:"center",marginBottom:24}}>
          <FiguritaSVG jugador={newUser} size={180}/>
        </div>

        {/* Guía */}
        <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:14,marginBottom:20,textAlign:"left"}}>
          <div style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.5)",marginBottom:8,letterSpacing:1}}>CONSEJOS PARA UNA BUENA FOTO</div>
          {["😊 Mirá de frente a la cámara","💡 Buena iluminación","🙍 Solo una persona","🕶️ Sin gafas oscuras","⬜ Fondo simple"].map(c=>(
            <div key={c} style={{fontSize:13,color:"rgba(255,255,255,0.6)",marginBottom:4}}>{c}</div>
          ))}
        </div>

        <input ref={fileRef} type="file" accept="image/*" capture="user" style={{display:"none"}} onChange={handleFoto}/>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <BtnGreen onClick={()=>fileRef.current?.click()}>
            {newUser.foto ? "✅ Foto seleccionada · Cambiar" : "📷 Sacarme una foto"}
          </BtnGreen>
          <BtnOutline onClick={()=>{ fileRef.current?.click(); }}>🖼️ Elegir de galería</BtnOutline>
          <button onClick={finalizarRegistro} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"'Outfit'",fontSize:13,color:"rgba(255,255,255,0.35)",marginTop:4}}>
            Omitir por ahora →
          </button>
        </div>
      </div>
    </div>
  );

  return null;
}

/* ─────────────────────────────────────────
   HEADER
───────────────────────────────────────── */
function Header({ user, onAdmin, onLogout, onProfile }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return(
    <div style={{height:56,position:"sticky",top:0,zIndex:300,background:"rgba(6,11,24,0.92)",borderBottom:"1px solid rgba(255,255,255,0.07)",backdropFilter:"blur(24px)",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 16px"}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:34,height:34,borderRadius:10,background:"linear-gradient(135deg,#1440b8,#0a1f6b)",border:"1px solid rgba(30,80,212,0.4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,boxShadow:"0 0 16px rgba(30,80,212,0.4)"}}>⚽</div>
        <div>
          <div style={{fontFamily:"'Outfit'",fontWeight:800,fontSize:16,color:"#fff",lineHeight:1.1}}>El Fulbito</div>
          <div style={{fontFamily:"'Outfit'",fontWeight:500,fontSize:9,letterSpacing:1,color:"#c9a84c"}}>de los Viernes</div>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8,position:"relative"}}>
        {user.isAdmin&&<button onClick={onAdmin} style={{padding:"5px 11px",borderRadius:8,border:"1px solid rgba(201,168,76,0.25)",background:"rgba(201,168,76,0.08)",cursor:"pointer",fontFamily:"'Outfit'",fontWeight:600,fontSize:11,color:"#c9a84c"}}>⚙️ Admin</button>}
        <button onClick={()=>setMenuOpen(p=>!p)} style={{display:"flex",alignItems:"center",gap:7,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:99,padding:"5px 12px 5px 5px",cursor:"pointer"}}>
          <Av j={user} size={26}/><span style={{fontFamily:"'Outfit'",fontWeight:600,fontSize:13,color:"#fff"}}>{user.nombre}</span>
          <span style={{fontSize:9,color:"rgba(255,255,255,0.3)",marginLeft:2}}>▾</span>
        </button>
        {menuOpen&&(
          <div className="slide-down" style={{position:"absolute",top:48,right:0,background:"#0c1428",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,overflow:"hidden",minWidth:170,boxShadow:"0 8px 32px rgba(0,0,0,0.6)",zIndex:400}}>
            <button onClick={()=>{onProfile();setMenuOpen(false);}} style={{width:"100%",padding:"12px 16px",background:"none",border:"none",cursor:"pointer",fontFamily:"'Outfit'",fontWeight:600,fontSize:13,color:"rgba(255,255,255,0.85)",textAlign:"left",display:"flex",alignItems:"center",gap:10,borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
              👤 Mi perfil
            </button>
            {user.isAdmin&&<button onClick={()=>{onAdmin();setMenuOpen(false);}} style={{width:"100%",padding:"12px 16px",background:"none",border:"none",cursor:"pointer",fontFamily:"'Outfit'",fontWeight:600,fontSize:13,color:"rgba(255,255,255,0.85)",textAlign:"left",display:"flex",alignItems:"center",gap:10,borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
              ⚙️ Panel admin
            </button>}
            <button onClick={()=>{onLogout();setMenuOpen(false);}} style={{width:"100%",padding:"12px 16px",background:"none",border:"none",cursor:"pointer",fontFamily:"'Outfit'",fontWeight:600,fontSize:13,color:"#f87171",textAlign:"left",display:"flex",alignItems:"center",gap:10}}>
              🚪 Cerrar sesión
            </button>
          </div>
        )}
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
    <div style={{height:62,position:"fixed",bottom:0,left:0,right:0,zIndex:300,background:"rgba(5,9,20,0.97)",borderTop:"1px solid rgba(255,255,255,0.07)",backdropFilter:"blur(24px)",display:"flex",maxWidth:520,margin:"0 auto"}}>
      {NAV.map((n,i)=>{
        const on=active===i;
        return(
          <button key={i} onClick={()=>onChange(i)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,border:"none",background:"none",cursor:"pointer",fontFamily:"'Outfit'",fontSize:9,fontWeight:600,letterSpacing:0.3,color:on?"#2563eb":"rgba(255,255,255,0.26)",transition:"all 0.18s",borderTop:on?"2px solid #2563eb":"2px solid transparent",paddingTop:4,position:"relative"}}>
            <span style={{fontSize:19,lineHeight:1,transform:on?"scale(1.18)":"scale(1)",filter:on?"drop-shadow(0 0 8px rgba(30,80,212,0.65))":"none",transition:"all 0.18s"}}>{n.icon}</span>
            {n.label}
            {i===0&&pendiente>0&&!on&&<span className="pulse-dot" style={{position:"absolute",top:6,right:"calc(50% - 14px)",width:7,height:7,borderRadius:"50%",background:"#ef4444",border:"1.5px solid #060b18"}}/>}
          </button>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE: INICIO
───────────────────────────────────────── */
function PageInicio({ user, partido, stats, onVotar, onPlayerClick }) {
  const [confirmado, setConfirmado] = useState(partido?.confirmados?.includes(user.id));
  const miStats = stats.find(s=>s.id===user.id);
  const media = Math.round(Object.values(miStats?.stats||{}).reduce((a,b)=>a+b,0)/6)||65;

  return(
    <div className="fade-up">
      {/* Banner partido */}
      <div style={{background:"linear-gradient(135deg,#04060f,#08102a)",border:"1px solid rgba(30,80,212,0.25)",borderRadius:16,padding:16,marginBottom:10,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-20,right:-20,opacity:0.06,pointerEvents:"none"}}><StarballSVG size={180} opacity={1}/></div>
        <div style={{fontSize:10,fontWeight:700,letterSpacing:2,color:"#7cb9ff",textTransform:"uppercase",marginBottom:6}}>⚽ Próximo partido</div>
        <div style={{fontFamily:"'Bebas Neue'",fontSize:28,color:"#fff",lineHeight:1,marginBottom:6}}>{partido.fecha}</div>
        <div style={{display:"flex",gap:14,marginBottom:14,flexWrap:"wrap"}}>
          <span style={{fontSize:12,fontWeight:500,color:"rgba(255,255,255,0.5)"}}>⏰ {partido.hora} hs</span>
          <span style={{fontSize:12,fontWeight:500,color:"rgba(255,255,255,0.5)"}}>🏟️ {partido.cancha}</span>
          <span style={{fontSize:12,fontWeight:500,color:"rgba(255,255,255,0.5)"}}>📍 {partido.ubicacion}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:14}}>
          {partido.jugadores.slice(0,6).map((id,i)=>{ const j=stats.find(s=>s.id===id); return j?<div key={id} style={{marginLeft:i>0?-6:0,zIndex:10-i,cursor:"pointer"}} onClick={()=>onPlayerClick&&onPlayerClick(j)}><Av j={j} size={26} border/></div>:null; })}
          <span style={{marginLeft:8,fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.4)"}}>{partido.confirmados?.length||0} confirmados</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <button onClick={()=>setConfirmado(true)} style={{padding:"10px",borderRadius:10,border:"none",cursor:"pointer",fontFamily:"'Outfit'",fontWeight:700,fontSize:13,background:confirmado?"#2563eb":"rgba(30,80,212,0.15)",color:confirmado?"#fff":"#2563eb",border:confirmado?"1px solid #2563eb":"1px solid rgba(30,80,212,0.3)",transition:"all 0.2s"}}>
            {confirmado?"✓ Confirmado":"Confirmar"}
          </button>
          <button onClick={()=>setConfirmado(false)} style={{padding:"10px",borderRadius:10,border:"none",cursor:"pointer",fontFamily:"'Outfit'",fontWeight:700,fontSize:13,background:(!confirmado&&confirmado!==null)?"rgba(239,68,68,0.12)":"rgba(255,255,255,0.04)",color:(!confirmado&&confirmado!==null)?"#f87171":"rgba(255,255,255,0.35)",border:(!confirmado&&confirmado!==null)?"1px solid rgba(239,68,68,0.25)":"1px solid rgba(255,255,255,0.08)",transition:"all 0.2s"}}>
            No puedo
          </button>
        </div>
      </div>

      {/* Votación pendiente */}
      <Card style={{background:"rgba(234,179,8,0.05)",border:"1px solid rgba(234,179,8,0.18)",padding:14,marginBottom:10}} onClick={onVotar}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:24}}>🏆</span>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:14,color:"#fbbf24",marginBottom:1}}>Votación abierta</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>Repartí tus 10 monedas · <span style={{color:"#fbbf24"}}>Cierra el jueves</span></div>
          </div>
          <button style={{padding:"7px 14px",borderRadius:8,border:"none",cursor:"pointer",background:"#eab308",color:"#000",fontFamily:"'Outfit'",fontWeight:700,fontSize:12}}>Votar</button>
        </div>
      </Card>

      {/* Mis stats */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
        {[["Pts mayo",miStats?.puntosMes||0,"#2563eb"],["PJ",miStats?.pj||0,"#c9a84c"],["Media",media,"#7cb9ff"]].map(([k,v,c])=>(
          <Card key={k} style={{padding:12,margin:0,textAlign:"center"}}>
            <div style={{fontFamily:"'Bebas Neue'",fontSize:30,color:c,lineHeight:1}}>{v}</div>
            <div style={{fontSize:10,fontWeight:600,color:"rgba(255,255,255,0.35)",marginTop:3,letterSpacing:1}}>{k.toUpperCase()}</div>
          </Card>
        ))}
      </div>

      {/* Invitación */}
      <Card style={{padding:14}}>
        <Lbl style={{marginBottom:10}}>Invitaciones</Lbl>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:38,height:38,borderRadius:10,background:"rgba(30,80,212,0.12)",border:"1px solid rgba(30,80,212,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>👥</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:600,fontSize:14}}>Partido extra — Sábado 17/05</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>De: Rulo · Cancha Los Nogales</div>
          </div>
          <button style={{padding:"6px 14px",borderRadius:8,border:"none",cursor:"pointer",background:"#2563eb",color:"#fff",fontFamily:"'Outfit'",fontWeight:700,fontSize:12}}>Ver</button>
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
  const sorted = [...stats].sort((a,b)=>vista==="mensual"?b.puntosMes-a.puntosMes:b.puntosAnio-a.puntosAnio);

  return(
    <div className="fade-up">
      <div style={{display:"flex",background:"rgba(255,255,255,0.04)",borderRadius:10,padding:3,marginBottom:12,border:"1px solid rgba(255,255,255,0.07)"}}>
        {[["mensual","Mensual"],["anual","Anual"]].map(([v,l])=>(
          <button key={v} onClick={()=>setVista(v)} style={{flex:1,padding:"8px 0",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"'Outfit'",fontWeight:600,fontSize:12,background:vista===v?"linear-gradient(135deg,#1440b8,#2563eb)":"none",color:vista===v?"#fff":"rgba(255,255,255,0.3)",transition:"all 0.2s"}}>{l}</button>
        ))}
      </div>

      <div style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.3)",marginBottom:8}}>Mayo 2025 — Tabla de puntos</div>

      {/* Header */}
      <div style={{display:"flex",alignItems:"center",padding:"4px 14px",marginBottom:4}}>
        <span style={{width:22,fontSize:10,color:"rgba(255,255,255,0.25)",fontWeight:700}}>#</span>
        <span style={{flex:1,fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.25)",letterSpacing:1,marginLeft:42}}>JUGADOR</span>
        {["PJ","PTS","TOP1"].map(k=><span key={k} style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.25)",letterSpacing:1,width:36,textAlign:"center"}}>{k}</span>)}
      </div>

      {sorted.map((j,i)=>(
        <div key={j.id} className="card-tap" onClick={()=>onPlayerClick(j)} style={{
          display:"flex",alignItems:"center",padding:"10px 14px",
          background:j.id===user.id?"rgba(30,80,212,0.08)":"rgba(255,255,255,0.02)",
          border:j.id===user.id?"1px solid rgba(30,80,212,0.18)":"1px solid rgba(255,255,255,0.06)",
          borderRadius:12,marginBottom:6,cursor:"pointer",transition:"all 0.2s",
        }}>
          <span style={{fontFamily:"'Bebas Neue'",fontSize:16,color:i<3?"#c9a84c":"rgba(255,255,255,0.2)",width:22,textAlign:"center"}}>
            {i===0?"🥇":i===1?"🥈":i===2?"🥉":i+1}
          </span>
          <Av j={j} size={30}/>
          <div style={{flex:1,marginLeft:10}}>
            <div style={{fontWeight:700,fontSize:14,display:"flex",alignItems:"center",gap:6}}>
              {j.nombre}
              {j.id===user.id&&<span style={{fontSize:9,padding:"1px 6px",borderRadius:4,background:"rgba(30,80,212,0.15)",color:"#7cb9ff",border:"1px solid rgba(30,80,212,0.25)",fontWeight:600}}>vos</span>}
            </div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>{j.apodo}</div>
          </div>
          <div style={{display:"flex",gap:4}}>
            {[j.pj, vista==="mensual"?j.puntosMes:j.puntosAnio, j.mvps].map((v,k)=>(
              <div key={k} style={{fontFamily:"'Bebas Neue'",fontSize:k===1?20:15,color:k===1?"#2563eb":"rgba(255,255,255,0.4)",width:36,textAlign:"center"}}>{v}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE: 5 IDEAL
───────────────────────────────────────── */
function PageCincoIdeal({ stats, onPlayerClick }) {
  const top5 = [...stats].sort((a,b)=>b.puntosMes-a.puntosMes).slice(0,5);
  return(
    <div className="fade-up">
      <div style={{textAlign:"center",marginBottom:4}}>
        <div style={{fontFamily:"'Bebas Neue'",fontSize:10,letterSpacing:3,color:"rgba(255,255,255,0.3)"}}>SEMANA 4 · MAYO 2025</div>
        <div style={{fontFamily:"'Bebas Neue'",fontSize:32,color:"#fff",letterSpacing:1}}>5 Ideal</div>
      </div>

      {/* Cancha */}
      <div style={{background:"linear-gradient(180deg,#04060f 0%,#08102a 50%,#04060f 100%)",borderRadius:16,border:"1px solid rgba(30,80,212,0.12)",padding:"24px 12px",marginBottom:14,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",left:"50%",top:0,bottom:0,borderLeft:"1px dashed rgba(255,255,255,0.05)",transform:"translateX(-50%)"}}/>
        <div style={{position:"absolute",left:"50%",top:"50%",width:72,height:72,border:"1px dashed rgba(255,255,255,0.05)",borderRadius:"50%",transform:"translate(-50%,-50%)"}}/>
        {[[0,1],[2,3],[4]].map(([a,b],row)=>(
          <div key={row} style={{display:"flex",justifyContent:"space-around",marginBottom:row<2?22:0,position:"relative",zIndex:1}}>
            {[a,b].filter(x=>x!==undefined).map(idx=>{ const j=top5[idx]; if(!j) return null;
              return(
                <div key={j.id} onClick={()=>onPlayerClick(j)} className="card-tap" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,cursor:"pointer"}}>
                  <Av j={j} size={48} border/>
                  <div style={{background:"rgba(5,9,20,0.88)",borderRadius:8,padding:"3px 10px",textAlign:"center",border:"1px solid rgba(255,255,255,0.08)"}}>
                    <div style={{fontWeight:700,fontSize:11}}>{j.nombre}</div>
                    <div style={{fontFamily:"'Bebas Neue'",fontSize:13,color:"#7cb9ff"}}>{j.puntosMes} pts</div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Ranking */}
      <Lbl style={{marginBottom:8}}>Ranking del mes</Lbl>
      {[...stats].sort((a,b)=>b.puntosMes-a.puntosMes).map((j,i)=>(
        <div key={j.id} onClick={()=>onPlayerClick(j)} className="card-tap" style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:10,marginBottom:6}}>
          <span style={{fontFamily:"'Bebas Neue'",fontSize:14,color:i<3?"#c9a84c":"rgba(255,255,255,0.2)",width:18,textAlign:"center"}}>{i+1}</span>
          <Av j={j} size={26}/>
          <span style={{flex:1,fontWeight:600,fontSize:13}}>{j.nombre}</span>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{height:4,width:70,background:"rgba(255,255,255,0.08)",borderRadius:99,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${(j.puntosMes/(stats[0]?.puntosMes||1))*100}%`,background:"#2563eb",borderRadius:99}}/>
            </div>
            <span style={{fontFamily:"'Bebas Neue'",fontSize:17,color:"#7cb9ff",width:30,textAlign:"right"}}>{j.puntosMes}</span>
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

  const publicar = async () => {
    if(!texto.trim()) return;
    const { data, error } = await supabase
      .from("posts")
      .insert({ jugador_id: user.id, texto: texto.trim() })
      .select(`*, jugador:jugadores(nombre, apodo, foto_url, rareza, color)`)
      .single();
    
    if (!error && data) {
      onFeedUpdate([{
        ...data,
        userId: data.jugador_id,
        hace: "Ahora mismo",
        likes: [],
        comentarios: [],
      }, ...feed]);
    }
    setTexto("");
  };

  const toggleLike = async (id) => {
    const post = feed.find(p => p.id === id);
    const liked = post.likes.includes(user.id);
    if (liked) {
      await supabase.from("likes").delete().eq("post_id", id).eq("jugador_id", user.id);
      onFeedUpdate(feed.map(p => p.id !== id ? p : {...p, likes: p.likes.filter(x => x !== user.id)}));
    } else {
      await supabase.from("likes").insert({ post_id: id, jugador_id: user.id });
      onFeedUpdate(feed.map(p => p.id !== id ? p : {...p, likes: [...p.likes, user.id]}));
    }
  };

  const comentar = async (id) => {
    if(!comentTexto.trim()) return;
    const { data, error } = await supabase
      .from("comentarios")
      .insert({ post_id: id, jugador_id: user.id, texto: comentTexto.trim() })
      .select(`*, jugador:jugadores(nombre, apodo, color)`)
      .single();
    if (!error && data) {
      onFeedUpdate(feed.map(p => p.id !== id ? p : {
        ...p,
        comentarios: [...p.comentarios, { userId: data.jugador_id, texto: data.texto }]
      }));
    }
    setComentTexto(""); setComentando(null);
  };

  const getU = (id) => stats.find(s=>s.id===id)||{nombre:"?",color:"#333"};

  return(
    <div className="fade-up">
      <Card style={{padding:14,marginBottom:14}}>
        <div style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:10}}>
          <Av j={user} size={34}/>
          <textarea className="ucl-input" placeholder="¿Qué onda pibes?" value={texto} onChange={e=>setTexto(e.target.value)} style={{resize:"none",height:68,fontSize:13,padding:"10px 12px"}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",gap:6}}>{["📹","🖼️","😊"].map((ic,i)=><button key={i} style={{width:30,height:30,borderRadius:8,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.04)",cursor:"pointer",fontSize:14}}>{ic}</button>)}</div>
          <button onClick={publicar} disabled={!texto.trim()} style={{padding:"7px 18px",borderRadius:10,border:"none",cursor:texto.trim()?"pointer":"not-allowed",background:texto.trim()?"#2563eb":"rgba(255,255,255,0.06)",color:texto.trim()?"#fff":"rgba(255,255,255,0.25)",fontFamily:"'Outfit'",fontWeight:700,fontSize:12,transition:"all 0.2s"}}>Publicar</button>
        </div>
      </Card>

      {feed.map(post=>{
        const autor=getU(post.userId);
        const liked=post.likes.includes(user.id);
        return(
          <Card key={post.id} style={{padding:14,marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
              <Av j={autor} size={34}/>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14}}>{autor.nombre}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>{post.hace}</div>
              </div>
            </div>
            <div style={{fontSize:14,lineHeight:1.6,color:"rgba(255,255,255,0.82)",marginBottom:12}}>{post.texto}</div>
            <div style={{height:1,background:"rgba(255,255,255,0.06)",margin:"0 0 10px"}}/>
            <div style={{display:"flex",gap:14}}>
              <button onClick={()=>toggleLike(post.id)} style={{display:"flex",alignItems:"center",gap:5,background:"none",border:"none",cursor:"pointer",color:liked?"#f43f5e":"rgba(255,255,255,0.38)",fontFamily:"'Outfit'",fontWeight:600,fontSize:12,transition:"color 0.2s"}}>
                {liked?"❤️":"🤍"} {post.likes.length}
              </button>
              <button onClick={()=>setComentando(comentando===post.id?null:post.id)} style={{display:"flex",alignItems:"center",gap:5,background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.38)",fontFamily:"'Outfit'",fontWeight:600,fontSize:12}}>
                💬 {post.comentarios.length}
              </button>
              <button style={{display:"flex",alignItems:"center",gap:5,background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.38)",fontFamily:"'Outfit'",fontWeight:600,fontSize:12}}>↗️</button>
            </div>
            {post.comentarios.length>0&&(
              <div style={{marginTop:10,borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:10}}>
                {post.comentarios.map((c,i)=>{ const cu=getU(c.userId); return(
                  <div key={i} style={{display:"flex",gap:7,marginBottom:7}}>
                    <Av j={cu} size={22}/>
                    <div style={{background:"rgba(255,255,255,0.05)",borderRadius:10,padding:"5px 10px",flex:1}}>
                      <span style={{fontWeight:700,fontSize:11,color:"#fff",marginRight:5}}>{cu.nombre}</span>
                      <span style={{fontSize:12,color:"rgba(255,255,255,0.65)"}}>{c.texto}</span>
                    </div>
                  </div>
                ); })}
              </div>
            )}
            {comentando===post.id&&(
              <div style={{display:"flex",gap:7,marginTop:8}}>
                <Av j={user} size={26}/>
                <input className="ucl-input" placeholder="Comentar..." value={comentTexto} onChange={e=>setComentTexto(e.target.value)} onKeyDown={e=>e.key==="Enter"&&comentar(post.id)} style={{flex:1,padding:"7px 12px",fontSize:12}}/>
                <button onClick={()=>comentar(post.id)} style={{padding:"7px 12px",borderRadius:10,border:"none",cursor:"pointer",background:"#2563eb",color:"#fff",fontFamily:"'Outfit'",fontWeight:700,fontSize:12}}>↑</button>
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
  return(
    <div className="fade-up">
      <div style={{textAlign:"center",marginBottom:14}}>
        <div style={{fontFamily:"'Bebas Neue'",fontSize:32,color:"#fff",letterSpacing:1}}>Cards del Grupo</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.3)",marginTop:2}}>{user.isAdmin?"Tocá para ver · Admin puede editar":"Tocá una card para ver el perfil"}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        {stats.map(j=>(
          <div key={j.id} className="card-tap" onClick={()=>onPlayerClick(j)} style={{display:"flex",justifyContent:"center"}}>
            <FiguritaSVG jugador={j} size={160}/>
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
  const [users, setUsers] = useState([]);

useEffect(() => {
  supabase.from("jugadores").select("*").then(({ data }) => {
    if (data && data.length > 0) {
      const mapped = data.map(j => ({
        ...j,
        isAdmin: j.is_admin,
        puntosMes: j.puntos_mes,
        puntosAnio: j.puntos_anio,
        fechaNac: j.fecha_nac,
        foto: j.foto_url,
        stats: {
          velocidad: j.velocidad,
          pase: j.pase,
          defensa: j.defensa,
          tiro: j.tiro,
          tecnica: j.tecnica,
          resistencia: j.resistencia,
        }
      }));
      setUsers(mapped);
    }
  });
}, []);
  const [loggedUser, setLoggedUser] = useState(()=>{ const s=S.get("fulbito-session"); return s?users.find(u=>u.id===s.id)||null:null; });
  const [tab, setTab] = useState(0);
  const [showAdmin, setShowAdmin] = useState(false);
  const [partido, setPartido] = useState(PARTIDO_DEFAULT);

useEffect(() => {
  supabase.from("partidos").select("*").order("created_at", { ascending: false }).limit(1).then(({ data }) => {
    if (data && data.length > 0) {
      const p = data[0];
      setPartido({
        ...p,
        equipoA: p.equipo_a,
        equipoB: p.equipo_b,
      });
    }
  });
}, []);
  const [feed, setFeed] = useState([]);

useEffect(() => {
  supabase
    .from("posts")
    .select(`*, jugador:jugadores(nombre, apodo, foto_url, rareza, color)`)
    .order("created_at", { ascending: false })
    .then(({ data }) => {
      if (data) {
        const mapped = data.map(p => ({
          ...p,
          userId: p.jugador_id,
          hace: new Date(p.created_at).toLocaleDateString("es-AR"),
          likes: [],
          comentarios: [],
        }));
        setFeed(mapped);
      }
    });
}, []);

  const [selectedPlayer, setSelectedPlayer] = useState(null);


  const handleLogin = (u) => { setLoggedUser(u); setTab(0); };
  const handleLogout = () => { setLoggedUser(null); localStorage.removeItem("fulbito-session"); };
  const handleRegister = (nu) => setUsers(prev=>[...prev, nu]);

  const handlePlayerClick = (j) => setSelectedPlayer(j);
  const handlePlayerSave = (updated) => {
    setUsers(prev=>prev.map(u=>u.id===updated.id?{...u,...updated}:u));
    setSelectedPlayer(prev=>prev?{...prev,...updated}:prev);
    if(loggedUser?.id===updated.id) setLoggedUser(prev=>({...prev,...updated}));
  };

  if(!loggedUser) return (
    <>
      <style>{CSS}</style>
      <div style={{maxWidth:520,margin:"0 auto"}}>
        <AuthScreen onLogin={handleLogin} users={users} onRegister={handleRegister}/>
      </div>
    </>
  );

  return (
    <>
      <style>{CSS}</style>
      <div style={{maxWidth:520,margin:"0 auto",minHeight:"100dvh",position:"relative"}}>
        {selectedPlayer&&(
          <PlayerModal jugador={selectedPlayer} onClose={()=>setSelectedPlayer(null)} isAdmin={loggedUser.isAdmin} onSave={handlePlayerSave}/>
        )}
        <Header user={loggedUser} onAdmin={()=>setShowAdmin(true)} onLogout={handleLogout} onProfile={()=>handlePlayerClick(loggedUser)}/>
        <div style={{padding:"14px 14px 82px",position:"relative",zIndex:1}}>
          {tab===0&&<PageInicio user={loggedUser} partido={partido} stats={users} onVotar={()=>setTab(0)} onPlayerClick={handlePlayerClick}/>}
          {tab===1&&<PageTemporada user={loggedUser} stats={users} onPlayerClick={handlePlayerClick}/>}
          {tab===2&&<PageCincoIdeal stats={users} onPlayerClick={handlePlayerClick}/>}
          {tab===3&&<PageFeed user={loggedUser} stats={users} feed={feed} onFeedUpdate={setFeed}/>}
          {tab===4&&<PageCards user={loggedUser} stats={users} onPlayerClick={handlePlayerClick}/>}
        </div>
        <NavBottom active={tab} onChange={i=>{setTab(i);setShowAdmin(false);}} pendiente={1}/>
      </div>
    </>
  );
}
