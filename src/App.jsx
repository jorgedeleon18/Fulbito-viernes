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

/* ─────────────────────────────────────────
   EQUIPOS FAVORITOS
───────────────────────────────────────── */
const EQUIPOS_ARG = [
  "River Plate","Boca Juniors","Racing Club","Independiente","San Lorenzo",
  "Huracán","Vélez Sársfield","Lanús","Banfield","Arsenal Sarandí",
  "Talleres (Córdoba)","Belgrano","Estudiantes (LP)","Gimnasia (LP)","Platense",
  "Tigre","San Martín (SJ)","Riestra","Deportivo Riestra","Godoy Cruz",
  "Unión (SF)","Colón (SF)","Central Córdoba","Sarmiento","Instituto"
];

const LIGAS_EU = {
  "Premier League 🏴": ["Manchester City","Arsenal","Liverpool","Chelsea","Manchester United","Tottenham","Newcastle","Aston Villa","Brighton","West Ham","Sunderland","Bournemouth","Brentford","Burnley","Crystal Palace","Everton","Fulham","Leeds United","Nottingham Forest","Wolves"],
  "La Liga 🇪🇸": ["Real Madrid","Barcelona","Atletico Madrid","Sevilla","Real Sociedad","Real Betis","Valencia","Villarreal","Athletic Bilbao","Osasuna","Alavés","Celta de Vigo","Elche","Espanyol","Getafe","Girona","Levante","Mallorca","Rayo Vallecano","Real Oviedo"],
  "Serie A 🇮🇹": ["Inter Milan","AC Milan","Juventus","Napoli","AS Roma","Lazio","Fiorentina","Atalanta","Bologna","Torino","Cagliari","Como","Cremonese","Genoa","Hellas Verona","Lecce","Parma","Pisa","Sassuolo","Udinese"],
  "Bundesliga 🇩🇪": ["Bayern Munich","Borussia Dortmund","RB Leipzig","Bayer Leverkusen","Eintracht Frankfurt","Wolfsburg","Freiburg","Union Berlin","Hoffenheim","Stuttgart","Augsburg","Borussia Mönchengladbach","Hamburger SV","Heidenheim","Köln","Mainz 05","St. Pauli","Werder Bremen"],
  "Ligue 1 🇫🇷": ["PSG","Marseille","Lyon","Monaco","Lille","Nice","Rennes","Lens","Strasbourg","Montpellier","Angers","Auxerre","Le Havre","Lorient","Metz","Nantes","Paris FC","Stade Brestois","Toulouse"],
};

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
select.ucl-input{
  appearance:none;
  cursor:pointer;
  background:#0f172a !important;
  color:#ffffff !important;
}

select.ucl-input option{
  background:#0f172a;
  color:#ffffff;
}
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
function PlayerModal({ jugador, onClose, isAdmin, isMiPerfil, onSave, onSavePerfil }) {
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
            {["stats","figurita",...(isMiPerfil?["miperfil"]:[]),...(isAdmin?["editar"]:[])].map(t=>(
              <button key={t} onClick={()=>setTab(t)} style={{padding:"6px 16px",borderRadius:99,border:"none",cursor:"pointer",fontFamily:"'Outfit'",fontWeight:600,fontSize:12,background:tab===t?"#2563eb":"rgba(255,255,255,0.06)",color:tab===t?"#fff":"rgba(255,255,255,0.5)",whiteSpace:"nowrap",transition:"all 0.2s"}}>
                {t==="stats"?"📊 Stats":t==="figurita"?"🎴 Figurita":t==="miperfil"?"👤 Mi perfil":"✏️ Editar"}
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

          {/* MI PERFIL — editable por el propio usuario */}
          {tab==="miperfil"&&isMiPerfil&&(
            <TabMiPerfil jugador={jugador} onSave={onSavePerfil}/>
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
  const [form, setForm] = useState({ nombre:"", apellido:"", apodo:"", email:"", pass:"", pass2:"", fechaNac:"", posicion:"Mediocampista", pierna:"Derecha", ciudad:"", nivel:"Intermedio", equipoArg:"", ligaEu:"", equipoEu:"" });
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
    if (jugador) {
      const mapped = {
        ...jugador,
        isAdmin: jugador.is_admin,
        puntosMes: jugador.puntos_mes,
        puntosAnio: jugador.puntos_anio,
        fechaNac: jugador.fecha_nac,
        foto: jugador.foto_url,
        equipoArg: jugador.equipo_arg,
        equipoEu: jugador.equipo_eu,
        ligaEu: jugador.liga_eu,
        stats: {
          velocidad: jugador.velocidad,
          pase: jugador.pase,
          defensa: jugador.defensa,
          tiro: jugador.tiro,
          tecnica: jugador.tecnica,
          resistencia: jugador.resistencia,
        }
      };
      setLoading(false);
      onLogin(mapped);
    } else {
      setErr("No se encontró el jugador");
      setLoading(false);
    }
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
    equipo_arg: form.equipoArg || null,
    equipo_eu: form.equipoEu || null,
    liga_eu: form.ligaEu || null,
  }).eq("id", data.user.id);

  const { data: jugador } = await supabase
    .from("jugadores")
    .select("*")
    .eq("id", data.user.id)
    .single();

  const mappedNew = jugador ? {
    ...jugador,
    isAdmin: jugador.is_admin,
    puntosMes: jugador.puntos_mes || 0,
    puntosAnio: jugador.puntos_anio || 0,
    fechaNac: jugador.fecha_nac,
    foto: jugador.foto_url,
    equipoArg: jugador.equipo_arg,
    equipoEu: jugador.equipo_eu,
    ligaEu: jugador.liga_eu,
    stats: {
      velocidad: jugador.velocidad || 65,
      pase: jugador.pase || 65,
      defensa: jugador.defensa || 65,
      tiro: jugador.tiro || 65,
      tecnica: jugador.tecnica || 65,
      resistencia: jugador.resistencia || 65,
    }
  } : null;
  setNewUser(mappedNew);
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
        <img src="/FL.png" alt="FL" style={{width:90,height:90,borderRadius:24,margin:"0 auto 20px",objectFit:"cover",boxShadow:"0 0 50px rgba(30,80,212,0.35)"}}/>
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

          {/* Equipo argentino */}
          <div>
            <Lbl>⭐ Equipo argentino favorito</Lbl>
            <select className="ucl-input" value={form.equipoArg||""} onChange={e=>setForm(p=>({...p,equipoArg:e.target.value}))}>
              <option value="">Seleccioná tu equipo...</option>
              {EQUIPOS_ARG.map(e=><option key={e} value={e}>{e}</option>)}
            </select>
          </div>

          {/* Liga europea */}
          <div>
            <Lbl>🌍 Liga europea</Lbl>
            <select className="ucl-input" value={form.ligaEu||""} onChange={e=>setForm(p=>({...p,ligaEu:e.target.value,equipoEu:""}))}>
              <option value="">Seleccioná una liga...</option>
              {Object.keys(LIGAS_EU).map(l=><option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          {/* Equipo europeo */}
          {form.ligaEu&&(
            <div>
              <Lbl>🏆 Equipo europeo favorito</Lbl>
              <select className="ucl-input" value={form.equipoEu||""} onChange={e=>setForm(p=>({...p,equipoEu:e.target.value}))}>
                <option value="">Seleccioná tu equipo...</option>
                {(LIGAS_EU[form.ligaEu]||[]).map(e=><option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          )}
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
    <div style={{height:60,position:"sticky",top:0,zIndex:300,background:"rgba(6,11,24,0.95)",borderBottom:"1px solid rgba(255,255,255,0.07)",backdropFilter:"blur(24px)",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 14px"}}>
      {/* Logo FL + nombre */}
      <div style={{display:"flex",alignItems:"center",gap:9}}>
        <img src="/FL.png" alt="FL" style={{width:38,height:38,borderRadius:10,objectFit:"cover"}}/>
        <div>
          <div style={{fontFamily:"'Outfit'",fontWeight:900,fontSize:15,color:"#fff",lineHeight:1.1}}>El Fulbito</div>
          <div style={{fontFamily:"'Outfit'",fontWeight:500,fontSize:9,letterSpacing:1,color:"#c9a84c"}}>de los Viernes</div>
        </div>
      </div>
      {/* Avatar usuario con menú */}
      <div style={{position:"relative"}}>
        <button onClick={()=>setMenuOpen(p=>!p)} style={{display:"flex",alignItems:"center",gap:7,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:99,padding:"5px 10px 5px 5px",cursor:"pointer"}}>
          <Av j={user} size={30} border/>
          <span style={{fontFamily:"'Outfit'",fontWeight:600,fontSize:13,color:"#fff"}}>{user.nombre}</span>
          <span style={{fontSize:9,color:"rgba(255,255,255,0.3)",marginLeft:1}}>▾</span>
        </button>
        {menuOpen&&(
          <div className="slide-down" style={{position:"absolute",top:50,right:0,background:"#0c1428",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,overflow:"hidden",minWidth:180,boxShadow:"0 8px 32px rgba(0,0,0,0.7)",zIndex:400}}>
            <button onClick={()=>{onProfile();setMenuOpen(false);}} style={{width:"100%",padding:"13px 16px",background:"none",border:"none",cursor:"pointer",fontFamily:"'Outfit'",fontWeight:600,fontSize:13,color:"rgba(255,255,255,0.85)",textAlign:"left",display:"flex",alignItems:"center",gap:10,borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
              👤 Mi perfil
            </button>
            {user.isAdmin&&<button onClick={()=>{onAdmin();setMenuOpen(false);}} style={{width:"100%",padding:"13px 16px",background:"none",border:"none",cursor:"pointer",fontFamily:"'Outfit'",fontWeight:600,fontSize:13,color:"rgba(255,255,255,0.85)",textAlign:"left",display:"flex",alignItems:"center",gap:10,borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
              ⚙️ Panel admin
            </button>}
            <button onClick={()=>{onLogout();setMenuOpen(false);}} style={{width:"100%",padding:"13px 16px",background:"none",border:"none",cursor:"pointer",fontFamily:"'Outfit'",fontWeight:600,fontSize:13,color:"#f87171",textAlign:"left",display:"flex",alignItems:"center",gap:10}}>
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
const NAV=[{icon:"🏠",label:"Inicio"},{icon:"📊",label:"Temporada"},{icon:"⭐",label:"5 Ideal"},{icon:"📱",label:"Feed"},{icon:"🎴",label:"Cards",adminOnly:true}];

function NavBottom({ active, onChange, pendiente, isAdmin }) {
  const visibleNav = NAV.filter(n => !n.adminOnly || isAdmin);
  return(
    <div style={{height:62,position:"fixed",bottom:0,left:0,right:0,zIndex:300,background:"rgba(5,9,20,0.97)",borderTop:"1px solid rgba(255,255,255,0.07)",backdropFilter:"blur(24px)",display:"flex",maxWidth:520,margin:"0 auto"}}>
      {visibleNav.map((n,i)=>{
        const realIdx = NAV.indexOf(n);
        const on=active===realIdx;
        return(
          <button key={i} onClick={()=>onChange(realIdx)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,border:"none",background:"none",cursor:"pointer",fontFamily:"'Outfit'",fontSize:9,fontWeight:600,letterSpacing:0.3,color:on?"#2563eb":"rgba(255,255,255,0.26)",transition:"all 0.18s",borderTop:on?"2px solid #2563eb":"2px solid transparent",paddingTop:4,position:"relative"}}>
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
   MODAL: CREAR PARTIDO
───────────────────────────────────────── */
function ModalCrearPartido({ users, user, onClose, onCreated }) {
  const [cancha, setCancha] = useState("");
  const [hora, setHora] = useState("21:00");
  const [fecha, setFecha] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [precio, setPrecio] = useState("");
  const [mapsUrl, setMapsUrl] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [guardando, setGuardando] = useState(false);
  const [err, setErr] = useState("");

  const appUsers = users;
  const externalSlots = Array.from({ length: Math.max(0, 10 - selectedIds.length) }, (_, i) => i);

  const toggleUser = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 10 ? [...prev, id] : prev
    );
  };

  const shareWhatsApp = () => {
    const fechaLeg = new Date(fecha).toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
    const txt = encodeURIComponent(
      `⚽ *Invitación al fulbito*\n📅 ${fechaLeg} a las ${hora} hs\n🏟️ ${cancha || "Cancha a confirmar"}\n💰 $${precio || "?"} por cabeza\n${mapsUrl ? `📍 ${mapsUrl}` : ""}\n\nDescargá la app y unite al grupo!`
    );
    window.open(`https://wa.me/?text=${txt}`, "_blank");
  };

  const handleCrear = async () => {
    if (!cancha.trim()) { setErr("Indicá el nombre de la cancha"); return; }
    setGuardando(true);
    const fechaLeg = new Date(fecha).toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
    const { data, error } = await supabase.from("partidos").insert({
      fecha: fechaLeg,
      hora,
      cancha: cancha.trim(),
      ubicacion: mapsUrl || cancha.trim(),
      precio_cabeza: precio || null,
      maps_url: mapsUrl || null,
      jugadores: selectedIds,
      equipo_a: [],
      equipo_b: [],
      confirmados: [user.id],
      creado_por: user.id,
      votacion_activa: false,
    }).select().single();
    setGuardando(false);
    if (error) { setErr("Error al crear el partido"); return; }
    if (onCreated) onCreated(data);
    onClose();
  };

  return (
    <div className="fade-in" style={{ position: "fixed", inset: 0, zIndex: 800, background: "rgba(0,0,0,0.97)", overflowY: "auto", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 2, background: "rgba(6,11,24,0.98)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: 22, letterSpacing: 1 }}>⚽ Crear Partido</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Completá los datos e invitá jugadores</div>
        </div>
        <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", width: 34, height: 34, borderRadius: "50%", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
      </div>

      <div style={{ padding: "20px 16px 40px", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Fecha */}
        <div>
          <Lbl>📅 Fecha</Lbl>
          <input className="ucl-input" type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
        </div>
        {/* Hora */}
        <div>
          <Lbl>⏰ Hora</Lbl>
          <input className="ucl-input" type="time" value={hora} onChange={e => setHora(e.target.value)} />
        </div>
        {/* Cancha */}
        <div>
          <Lbl>🏟️ Nombre de la cancha *</Lbl>
          <input className="ucl-input" placeholder="Ej: Cancha La Estrella" value={cancha} onChange={e => setCancha(e.target.value)} />
        </div>
        {/* Precio */}
        <div>
          <Lbl>💰 Precio por cabeza ($)</Lbl>
          <input className="ucl-input" type="number" placeholder="Ej: 3500" value={precio} onChange={e => setPrecio(e.target.value)} />
        </div>
        {/* Google Maps */}
        <div>
          <Lbl>📍 Ubicación en Google Maps (URL o dirección)</Lbl>
          <input className="ucl-input" placeholder="Pegá el link de Google Maps o la dirección" value={mapsUrl} onChange={e => setMapsUrl(e.target.value)} />
          {mapsUrl && mapsUrl.startsWith("http") && (
            <a href={mapsUrl} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: "#7cb9ff", marginTop: 4, display: "block" }}>🔗 Ver ubicación</a>
          )}
        </div>

        {/* Jugadores del grupo */}
        <div>
          <Lbl style={{ marginBottom: 6 }}>👥 Invitar jugadores del grupo ({selectedIds.length}/10)</Lbl>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {appUsers.map(j => {
              const sel = selectedIds.includes(j.id);
              return (
                <div key={j.id} onClick={() => toggleUser(j.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, border: sel ? "1px solid rgba(30,80,212,0.5)" : "1px solid rgba(255,255,255,0.06)", background: sel ? "rgba(30,80,212,0.1)" : "rgba(255,255,255,0.03)", cursor: "pointer", transition: "all 0.15s" }}>
                  <Av j={j} size={32} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{j.nombre} {j.apellido}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{j.posicion} · {j.ciudad}</div>
                  </div>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", border: sel ? "none" : "1.5px solid rgba(255,255,255,0.15)", background: sel ? "#2563eb" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>{sel ? "✓" : ""}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Invitar externos por WhatsApp */}
        <div style={{ background: "rgba(37,211,102,0.06)", border: "1px solid rgba(37,211,102,0.2)", borderRadius: 14, padding: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: "#4ade80", marginBottom: 4 }}>📲 Invitar por WhatsApp</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 10 }}>Si un jugador no tiene la app, podés enviarle la invitación con los datos del partido por WhatsApp.</div>
          <button onClick={shareWhatsApp} style={{ width: "100%", padding: "11px", borderRadius: 10, border: "none", cursor: "pointer", background: "#25D366", color: "#fff", fontFamily: "'Outfit'", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>💬</span> Enviar invitación por WhatsApp
          </button>
        </div>

        {err && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#fca5a5", textAlign: "center" }}>⚠️ {err}</div>}

        <BtnGreen onClick={handleCrear} disabled={guardando || !cancha.trim()}>
          {guardando ? "Creando partido..." : "⚽ Crear partido"}
        </BtnGreen>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE: INICIO
───────────────────────────────────────── */
// Mapeo de equipos a IDs de la API de football-data.org
const TEAM_IDS = {
  // Argentina (liga: 128) - IDs verificados football-data.org
  "River Plate": 419, "Boca Juniors": 408, "Racing Club": 418, "Independiente": 411,
  "San Lorenzo": 416, "Huracán": 412, "Vélez Sársfield": 420, "Lanús": 414,
  "Banfield": 407, "Talleres (Córdoba)": 7847, "Belgrano": 16461, "Estudiantes (LP)": 16462,
  "Gimnasia (LP)": 409, "Platense": 7849, "Tigre": 7851, "Godoy Cruz": 16463,
  // Premier League (liga: 2021)
  "Manchester City": 65, "Arsenal": 57, "Liverpool": 64, "Chelsea": 61,
  "Manchester United": 66, "Tottenham": 73, "Newcastle": 67, "Aston Villa": 58,
  "Brighton": 397, "West Ham": 563,
  // La Liga (liga: 2014)
  "Real Madrid": 86, "Barcelona": 81, "Atletico Madrid": 78, "Sevilla": 559,
  "Real Sociedad": 92, "Real Betis": 90, "Valencia": 95, "Villarreal": 94,
  "Athletic Bilbao": 77, "Osasuna": 79,
  // Serie A (liga: 2019)
  "Inter Milan": 108, "AC Milan": 98, "Juventus": 109, "Napoli": 113,
  "AS Roma": 100, "Lazio": 110, "Fiorentina": 99, "Atalanta": 102,
  "Bologna": 103, "Torino": 586,
  // Bundesliga (liga: 2002)
  "Bayern Munich": 5, "Borussia Dortmund": 4, "RB Leipzig": 721,
  "Bayer Leverkusen": 3, "Eintracht Frankfurt": 19, "Wolfsburg": 11,
  "Freiburg": 17, "Union Berlin": 28003, "Hoffenheim": 715, "Stuttgart": 10,
  // Ligue 1 (liga: 2015)
  "PSG": 524, "Marseille": 516, "Lyon": 523, "Monaco": 548,
  "Lille": 521, "Nice": 522, "Rennes": 529, "Lens": 546,
  "Strasbourg": 576, "Montpellier": 518,
};


// Escudos locales guardados en /public/equipos.
// Si falta alguno, la app usa el fallback remoto de football-data o la estrella.
const EQUIPO_LOGOS = {
  "River Plate": "/equipos/river.png",
  "Boca Juniors": "/equipos/boca.png",
  "Racing Club": "/equipos/racing.png",
  "Independiente": "/equipos/independiente.png",
  "San Lorenzo": "/equipos/sanlorenzo.png",
  "Huracán": "/equipos/huracan.png",
  "Vélez Sársfield": "/equipos/velez.png",
  "Lanús": "/equipos/lanus.png",
  "Banfield": "/equipos/banfield.png",
  "Talleres (Córdoba)": "/equipos/talleres.png",
  "Belgrano": "/equipos/belgrano.png",
  "Estudiantes (LP)": "/equipos/estudiantes.png",
  "Gimnasia (LP)": "/equipos/gimnasia.png",
  "Platense": "/equipos/platense.png",
  "Tigre": "/equipos/tigre.png",
  "Godoy Cruz": "/equipos/godoycruz.png",
  "Unión (SF)": "/equipos/union.png",
  "Central Córdoba": "/equipos/centralcordoba.png",
  "Sarmiento": "/equipos/sarmiento.png",
  "Instituto": "/equipos/instituto.png",
  "Riestra": "/equipos/riestra.png",
  "Deportivo Riestra": "/equipos/riestra.png",

  // Europa
  "Manchester City": "/europa/premier/manchestercity.png",
  "Arsenal": "/europa/premier/arsenal.png",
  "Liverpool": "/europa/premier/liverpool.png",
  "Chelsea": "/europa/premier/chelsea.png",
  "Manchester United": "/europa/premier/manchesterunited.png",
  "Tottenham": "/europa/premier/tottenham.png",
  "Newcastle": "/europa/premier/newcastle.png",
  "Aston Villa": "/europa/premier/astonvilla.png",
  "Brighton": "/europa/premier/brighton.png",
  "West Ham": "/europa/premier/westham.png",
  "Sunderland": "/europa/premier/sunderland.png",
  "Bournemouth": "/europa/premier/bournemouth.png",
  "Brentford": "/europa/premier/brentford.png",
  "Burnley": "/europa/premier/burnley.png",
  "Crystal Palace": "/europa/premier/crystalpalace.png",
  "Everton": "/europa/premier/everton.png",
  "Fulham": "/europa/premier/fulham.png",
  "Leeds United": "/europa/premier/leeds.png",
  "Nottingham Forest": "/europa/premier/nottingham_forest.png",
  "Wolves": "/europa/premier/wolves.png",
  "Real Madrid": "/europa/laliga/realmadrid.png",
  "Barcelona": "/europa/laliga/barcelona.png",
  "Atletico Madrid": "/europa/laliga/atlmadrid.png",
  "Sevilla": "/europa/laliga/sevilla.png",
  "Real Sociedad": "/europa/laliga/realsociedad.png",
  "Real Betis": "/europa/laliga/betis.png",
  "Valencia": "/europa/laliga/valencia.png",
  "Villarreal": "/europa/laliga/villarreal.png",
  "Athletic Bilbao": "/europa/laliga/athletic.png",
  "Osasuna": "/europa/laliga/osasuna.png",
  "Alavés": "/europa/laliga/alaves.png",
  "Celta de Vigo": "/europa/laliga/celta.png",
  "Elche": "/europa/laliga/elche.png",
  "Espanyol": "/europa/laliga/espanyol.png",
  "Getafe": "/europa/laliga/getafe.png",
  "Girona": "/europa/laliga/girona.png",
  "Levante": "/europa/laliga/levante.png",
  "Mallorca": "/europa/laliga/mallorca.png",
  "Rayo Vallecano": "/europa/laliga/rayovallecano.png",
  "Real Oviedo": "/europa/laliga/realoviedo.png",
  "Inter Milan": "/europa/seriea/inter.png",
  "AC Milan": "/europa/seriea/milan.png",
  "Juventus": "/europa/seriea/juventus.png",
  "Napoli": "/europa/seriea/napoli.png",
  "AS Roma": "/europa/seriea/roma.png",
  "Lazio": "/europa/seriea/lazio.png",
  "Fiorentina": "/europa/seriea/fiorentina.png",
  "Atalanta": "/europa/seriea/atalanta.png",
  "Bologna": "/europa/seriea/bologna.png",
  "Torino": "/europa/seriea/torino.png",
  "Cagliari": "/europa/seriea/cagliari.png",
  "Como": "/europa/seriea/como.png",
  "Cremonese": "/europa/seriea/cremonese.png",
  "Genoa": "/europa/seriea/genoa.png",
  "Hellas Verona": "/europa/seriea/hellasverona.png",
  "Lecce": "/europa/seriea/lecce.png",
  "Parma": "/europa/seriea/parma.png",
  "Pisa": "/europa/seriea/pisa.png",
  "Sassuolo": "/europa/seriea/sassuolo.png",
  "Udinese": "/europa/seriea/udinese.png",
  "Bayern Munich": "/europa/bundesliga/bayernmunchen.png",
  "Borussia Dortmund": "/europa/bundesliga/borussiadortmund.png",
  "RB Leipzig": "/europa/bundesliga/rbleipzig.png",
  "Bayer Leverkusen": "/europa/bundesliga/bayerleverkusen.png",
  "Eintracht Frankfurt": "/europa/bundesliga/eintrachtfrankfurt.png",
  "Wolfsburg": "/europa/bundesliga/wolfsburg.png",
  "Freiburg": "/europa/bundesliga/freiburg.png",
  "Union Berlin": "/europa/bundesliga/unionberlin.png",
  "Hoffenheim": "/europa/bundesliga/hoffenheim.png",
  "Stuttgart": "/europa/bundesliga/stuttgart.png",
  "Augsburg": "/europa/bundesliga/augsburgo.png",
  "Borussia Mönchengladbach": "/europa/bundesliga/bmonchengladbach.png",
  "Hamburger SV": "/europa/bundesliga/hamburgo.png",
  "Heidenheim": "/europa/bundesliga/heidenheim.png",
  "Köln": "/europa/bundesliga/koln.png",
  "Mainz 05": "/europa/bundesliga/mainz05.png",
  "St. Pauli": "/europa/bundesliga/st_pauli.png",
  "Werder Bremen": "/europa/bundesliga/werderbremen.png",
  "PSG": "/europa/ligue1/psg.png",
  "Marseille": "/europa/ligue1/olimpiquemarsella.png",
  "Lyon": "/europa/ligue1/olympiquelyon.png",
  "Monaco": "/europa/ligue1/monaco.png",
  "Lille": "/europa/ligue1/lille.png",
  "Nice": "/europa/ligue1/niza.png",
  "Rennes": "/europa/ligue1/rennais.png",
  "Lens": "/europa/ligue1/racinglens.png",
  "Strasbourg": "/europa/ligue1/racingetrasburgo.png",
  "Montpellier": "/europa/ligue1/montpellier.png",
  "Angers": "/europa/ligue1/angers.png",
  "Auxerre": "/europa/ligue1/auxerre.png",
  "Le Havre": "/europa/ligue1/havre.png",
  "Lorient": "/europa/ligue1/lorient.png",
  "Metz": "/europa/ligue1/metz.png",
  "Nantes": "/europa/ligue1/nantes.png",
  "Paris FC": "/europa/ligue1/paris_fc.png",
  "Stade Brestois": "/europa/ligue1/stadebretois.png",
  "Toulouse": "/europa/ligue1/toulouse.png",
};

const getEquipoLogo = (teamName) => EQUIPO_LOGOS[teamName] || null;

const TEAM_COLORS = {
  // Argentina
  "River Plate": { primary:"#d90429", secondary:"#ffffff", text:"#ffffff" },
  "Boca Juniors": { primary:"#003b7a", secondary:"#f9c80e", text:"#ffffff" },
  "Racing Club": { primary:"#5ec8ff", secondary:"#ffffff", text:"#ffffff" },
  "Independiente": { primary:"#d5001c", secondary:"#8b0000", text:"#ffffff" },
  "San Lorenzo": { primary:"#0033a0", secondary:"#d50032", text:"#ffffff" },
  "Huracán": { primary:"#ffffff", secondary:"#d71920", text:"#ffffff" },
  "Vélez Sársfield": { primary:"#ffffff", secondary:"#0050a4", text:"#ffffff" },
  "Lanús": { primary:"#6d001a", secondary:"#9f1239", text:"#ffffff" },
  "Banfield": { primary:"#0f8f3c", secondary:"#ffffff", text:"#ffffff" },
  "Arsenal Sarandí": { primary:"#7a003c", secondary:"#66b3ff", text:"#ffffff" },
  "Talleres (Córdoba)": { primary:"#005eb8", secondary:"#ffffff", text:"#ffffff" },
  "Belgrano": { primary:"#00a3e0", secondary:"#111827", text:"#ffffff" },
  "Estudiantes (LP)": { primary:"#d5001c", secondary:"#ffffff", text:"#ffffff" },
  "Gimnasia (LP)": { primary:"#001f5b", secondary:"#ffffff", text:"#ffffff" },
  "Platense": { primary:"#7a3e2b", secondary:"#ffffff", text:"#ffffff" },
  "Tigre": { primary:"#0033a0", secondary:"#d50032", text:"#ffffff" },
  "Godoy Cruz": { primary:"#0050a4", secondary:"#ffffff", text:"#ffffff" },
  "Unión (SF)": { primary:"#d5001c", secondary:"#ffffff", text:"#ffffff" },
  "Colón (SF)": { primary:"#111111", secondary:"#d5001c", text:"#ffffff" },
  "Central Córdoba": { primary:"#111827", secondary:"#ffffff", text:"#ffffff" },
  "Sarmiento": { primary:"#15803d", secondary:"#ffffff", text:"#ffffff" },
  "Instituto": { primary:"#d5001c", secondary:"#ffffff", text:"#ffffff" },
  "Riestra": { primary:"#111827", secondary:"#ffffff", text:"#ffffff" },
  "Deportivo Riestra": { primary:"#111827", secondary:"#ffffff", text:"#ffffff" },

  // Europa
  "Real Madrid": { primary:"#f8fafc", secondary:"#b7a8ff", text:"#ffffff" },
  "Barcelona": { primary:"#004d98", secondary:"#a50044", text:"#ffffff" },
  "Atletico Madrid": { primary:"#d50032", secondary:"#1d4ed8", text:"#ffffff" },
  "Sevilla": { primary:"#d5001c", secondary:"#ffffff", text:"#ffffff" },
  "Real Sociedad": { primary:"#005baa", secondary:"#ffffff", text:"#ffffff" },
  "Real Betis": { primary:"#00843d", secondary:"#ffffff", text:"#ffffff" },
  "Valencia": { primary:"#ff7a00", secondary:"#111827", text:"#ffffff" },
  "Villarreal": { primary:"#ffe500", secondary:"#0050a4", text:"#ffffff" },
  "Athletic Bilbao": { primary:"#d5001c", secondary:"#ffffff", text:"#ffffff" },
  "Osasuna": { primary:"#d50032", secondary:"#003b7a", text:"#ffffff" },
  "Manchester City": { primary:"#6cabdd", secondary:"#ffffff", text:"#ffffff" },
  "Arsenal": { primary:"#ef0107", secondary:"#063672", text:"#ffffff" },
  "Liverpool": { primary:"#c8102e", secondary:"#00b2a9", text:"#ffffff" },
  "Chelsea": { primary:"#034694", secondary:"#ffffff", text:"#ffffff" },
  "Manchester United": { primary:"#da291c", secondary:"#fbe122", text:"#ffffff" },
  "Tottenham": { primary:"#ffffff", secondary:"#132257", text:"#ffffff" },
  "Newcastle": { primary:"#111827", secondary:"#ffffff", text:"#ffffff" },
  "Aston Villa": { primary:"#95bfe5", secondary:"#670e36", text:"#ffffff" },
  "Brighton": { primary:"#0057b8", secondary:"#ffffff", text:"#ffffff" },
  "West Ham": { primary:"#7a263a", secondary:"#1bb1e7", text:"#ffffff" },
  "Inter Milan": { primary:"#0057b8", secondary:"#111827", text:"#ffffff" },
  "AC Milan": { primary:"#fb090b", secondary:"#111111", text:"#ffffff" },
  "Juventus": { primary:"#ffffff", secondary:"#111827", text:"#ffffff" },
  "Napoli": { primary:"#12a8e0", secondary:"#ffffff", text:"#ffffff" },
  "AS Roma": { primary:"#8e1f2f", secondary:"#f0bc42", text:"#ffffff" },
  "Lazio": { primary:"#87ceeb", secondary:"#ffffff", text:"#ffffff" },
  "Fiorentina": { primary:"#5f259f", secondary:"#ffffff", text:"#ffffff" },
  "Atalanta": { primary:"#0057b8", secondary:"#111827", text:"#ffffff" },
  "Bayern Munich": { primary:"#dc052d", secondary:"#0066b2", text:"#ffffff" },
  "Borussia Dortmund": { primary:"#fde100", secondary:"#111111", text:"#ffffff" },
  "RB Leipzig": { primary:"#ffffff", secondary:"#dd0741", text:"#ffffff" },
  "Bayer Leverkusen": { primary:"#e32221", secondary:"#111111", text:"#ffffff" },
  "Eintracht Frankfurt": { primary:"#e1000f", secondary:"#111111", text:"#ffffff" },
  "Wolfsburg": { primary:"#65b32e", secondary:"#ffffff", text:"#ffffff" },
  "PSG": { primary:"#004170", secondary:"#da291c", text:"#ffffff" },
  "Marseille": { primary:"#00a3e0", secondary:"#ffffff", text:"#ffffff" },
  "Lyon": { primary:"#0033a0", secondary:"#d50032", text:"#ffffff" },
  "Monaco": { primary:"#e30613", secondary:"#ffffff", text:"#ffffff" },
  "Lille": { primary:"#d50032", secondary:"#001f5b", text:"#ffffff" },
  "Nice": { primary:"#d50032", secondary:"#111111", text:"#ffffff" },
  "Rennes": { primary:"#e30613", secondary:"#111827", text:"#ffffff" },
  "Lens": { primary:"#f6c600", secondary:"#d5001c", text:"#ffffff" },
};

const DEFAULT_TEAM_COLOR = { primary:"#2563eb", secondary:"#7cb9ff", text:"#ffffff" };
const getTeamColors = (teamName) => TEAM_COLORS[teamName] || DEFAULT_TEAM_COLOR;


// Mapeo de nombre equipo → escudo URL (logo via API football-data)
function useEquipoData(teamName) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!teamName) return;
    const teamId = TEAM_IDS[teamName];
    if (!teamId) return;
    setLoading(true);
    // Usamos la API pública de football-data (free tier, no CORS issues con proxy)
    // Fallback: solo mostrar logo desde Wikipedia/Clearbit
    const logo = `https://crests.football-data.org/${teamId}.png`;
    // Próximo partido y último resultado via API
    fetch(`https://api.football-data.org/v4/teams/${teamId}/matches?status=SCHEDULED&limit=1`, {
      headers: { "X-Auth-Token": "placeholder" }
    })
    .then(r => r.ok ? r.json() : null)
    .then(d => {
      setData({ logo, nextMatch: d?.matches?.[0] || null });
      setLoading(false);
    })
    .catch(() => {
      setData({ logo, nextMatch: null });
      setLoading(false);
    });
  }, [teamName]);
  return { data, loading };
}

function EquipoCard({ titulo, equipo, liga, emoji, onClick }) {
  const teamId = equipo ? TEAM_IDS[equipo] : null;
  const localLogo = equipo ? getEquipoLogo(equipo) : null;
  const logoUrl = localLogo || (teamId ? `https://crests.football-data.org/${teamId}.svg` : null);
  const logoPng = localLogo || (teamId ? `https://crests.football-data.org/${teamId}.png` : null);
  const [imgSrc, setImgSrc] = useState(logoUrl || logoPng);
  const [imgError, setImgError] = useState(false);
  const colors = getTeamColors(equipo);
  const primary = colors.primary;
  const secondary = colors.secondary;

  useEffect(() => {
    setImgSrc(logoUrl || logoPng || null);
    setImgError(false);
  }, [equipo, logoUrl, logoPng]);

  const handleImgError = () => {
    if (!localLogo && imgSrc === logoUrl && logoPng) { setImgSrc(logoPng); }
    else { setImgError(true); }
  };

  if(!equipo) return (
    <div onClick={onClick} style={{
      background:"linear-gradient(135deg,rgba(255,255,255,0.035),rgba(255,255,255,0.015))",
      border:"1px dashed rgba(255,255,255,0.12)",
      borderRadius:18,
      padding:14,
      flex:1,
      display:"flex",
      flexDirection:"column",
      alignItems:"center",
      justifyContent:"center",
      gap:6,
      minHeight:128,
      cursor:onClick?"pointer":"default",
      boxShadow:"inset 0 1px 0 rgba(255,255,255,0.04)"
    }}>
      <span style={{fontSize:24,filter:"drop-shadow(0 3px 8px rgba(0,0,0,0.45))"}}>{emoji}</span>
      <div style={{fontSize:11,color:"rgba(255,255,255,0.28)",textAlign:"center",fontWeight:700}}>{titulo}<br/>sin asignar</div>
    </div>
  );

  return (
    <div onClick={onClick} style={{
      background:`
        radial-gradient(circle at 86% 38%, ${primary}40 0%, transparent 38%),
        linear-gradient(135deg, ${primary}30 0%, rgba(8,13,27,0.96) 52%, ${secondary}18 100%)
      `,
      border:`1px solid ${primary}70`,
      borderRadius:18,
      padding:14,
      flex:1,
      minHeight:128,
      overflow:"hidden",
      position:"relative",
      cursor:onClick?"pointer":"default",
      boxShadow:`0 12px 30px ${primary}1f, inset 0 1px 0 rgba(255,255,255,0.08)`,
      transition:"transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease"
    }}>
      <div style={{position:"absolute",inset:0,background:`linear-gradient(120deg,rgba(255,255,255,0.08),transparent 38%,${secondary}12)`,pointerEvents:"none"}} />
      <div style={{position:"absolute",left:0,top:0,bottom:0,width:4,background:`linear-gradient(180deg,${primary},${secondary})`,opacity:0.95}} />
      {/* Escudo de fondo fantasma */}
      {imgSrc && !imgError && (
        <img src={imgSrc} alt="" style={{position:"absolute",right:-12,top:"50%",transform:"translateY(-50%)",width:92,height:92,objectFit:"contain",opacity:0.12,pointerEvents:"none",filter:`drop-shadow(0 0 18px ${primary}55)`}} onError={()=>{}}/>
      )}
      <div style={{position:"relative",zIndex:1,fontSize:9,fontWeight:900,letterSpacing:2.2,color:"rgba(255,255,255,0.48)",marginBottom:10}}>{titulo.toUpperCase()}</div>
      {/* Escudo + nombre */}
      <div style={{position:"relative",zIndex:1,display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
        {imgSrc && !imgError ? (
          <div style={{width:38,height:38,borderRadius:13,background:"rgba(255,255,255,0.10)",border:"1px solid rgba(255,255,255,0.14)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 8px 22px ${primary}35`,flexShrink:0}}>
            <img src={imgSrc} alt={equipo}
              style={{width:31,height:31,objectFit:"contain",filter:"drop-shadow(0 2px 5px rgba(0,0,0,0.55))"}}
              onError={handleImgError}/>
          </div>
        ) : (
          <div style={{width:38,height:38,borderRadius:13,background:`linear-gradient(135deg,${primary}55,rgba(255,255,255,0.08))`,border:`1px solid ${primary}80`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,boxShadow:`0 8px 22px ${primary}35`,flexShrink:0}}>{emoji}</div>
        )}
        <div style={{minWidth:0}}>
          <div style={{fontWeight:900,fontSize:14,color:colors.text||"#fff",lineHeight:1.12,textShadow:"0 2px 8px rgba(0,0,0,0.45)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{equipo}</div>
          {liga&&<div style={{fontSize:10,color:"rgba(255,255,255,0.58)",fontWeight:700,marginTop:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{liga}</div>}
        </div>
      </div>
      <div style={{position:"relative",zIndex:1,display:"flex",gap:5,flexWrap:"wrap"}}>
        <span style={{fontSize:9,padding:"3px 8px",borderRadius:99,background:`${primary}38`,color:"#dbeafe",border:`1px solid ${primary}70`,fontWeight:800}}>Próx: TBD</span>
        <span style={{fontSize:9,padding:"3px 8px",borderRadius:99,background:"rgba(255,255,255,0.09)",color:"rgba(255,255,255,0.62)",border:"1px solid rgba(255,255,255,0.12)",fontWeight:800}}>Últ: TBD</span>
      </div>
    </div>
  );
}

function PageInicio({ user, partido, setPartido, stats, onVotar, onPlayerClick, users, onUpdateEquipoArg, onUpdateEquipoEu }) {
  const pendienteKey = partido?.id && user?.id ? `fulbito_pendiente_${partido.id}_${user.id}` : null;
  const yaConfirmo = partido?.confirmados?.includes(user.id);
  const yaRechazo = partido?.rechazados?.includes(user.id);
  const yaPendiente = partido?.pendientes?.includes(user.id) || (pendienteKey ? S.get(pendienteKey, false) : false);
  const [estadoRespuesta, setEstadoRespuesta] = useState(yaConfirmo ? "confirmado" : yaRechazo ? "rechazado" : yaPendiente ? "pendiente" : null);
  const respondida = Boolean(estadoRespuesta);
  const confirmado = estadoRespuesta === "confirmado";
  const pendienteConfirmacion = estadoRespuesta === "pendiente";
  const rechazado = estadoRespuesta === "rechazado";

  const getRespuestaBtnStyle = (tipo) => {
    const config = {
      confirmado: {
        color: "#4ade80",
        colorStrong: "#22c55e",
        bg: "rgba(34,197,94,0.08)",
        bgStrong: "linear-gradient(135deg,rgba(34,197,94,0.95),rgba(21,128,61,0.72))",
        border: "rgba(34,197,94,0.28)",
        borderStrong: "rgba(134,239,172,0.95)",
        shadow: "rgba(34,197,94,0.42)",
      },
      pendiente: {
        color: "#fbbf24",
        colorStrong: "#facc15",
        bg: "rgba(251,191,36,0.08)",
        bgStrong: "linear-gradient(135deg,rgba(251,191,36,0.96),rgba(202,138,4,0.72))",
        border: "rgba(251,191,36,0.28)",
        borderStrong: "rgba(253,224,71,0.95)",
        shadow: "rgba(251,191,36,0.42)",
      },
      rechazado: {
        color: "#f87171",
        colorStrong: "#ef4444",
        bg: "rgba(239,68,68,0.08)",
        bgStrong: "linear-gradient(135deg,rgba(239,68,68,0.96),rgba(153,27,27,0.75))",
        border: "rgba(239,68,68,0.26)",
        borderStrong: "rgba(252,165,165,0.95)",
        shadow: "rgba(239,68,68,0.42)",
      },
    }[tipo];

    const active = estadoRespuesta === tipo;
    const muted = respondida && !active;

    return {
      padding: "10px",
      borderRadius: 10,
      border: active ? `1px solid ${config.borderStrong}` : `1px solid ${config.border}`,
      cursor: "pointer",
      fontFamily: "'Outfit'",
      fontWeight: 900,
      fontSize: 12,
      background: active ? config.bgStrong : config.bg,
      color: active ? "#ffffff" : config.color,
      transition: "all 0.18s ease",
      boxShadow: active ? `0 0 0 2px ${config.shadow}, 0 10px 28px ${config.shadow}` : "inset 0 1px 0 rgba(255,255,255,0.05)",
      transform: active ? "translateY(-1px) scale(1.02)" : "scale(1)",
      opacity: muted ? 0.42 : 1,
      filter: muted ? "saturate(0.75)" : "none",
    };
  };
  const [confirmados, setConfirmados] = useState(partido?.confirmados || []);
  const [pendientesConfirmacion, setPendientesConfirmacion] = useState(partido?.pendientes || []);
  const [showCrearPartido, setShowCrearPartido] = useState(false);
  const [showEquiposArg, setShowEquiposArg] = useState(false);
  const [showEquiposEu, setShowEquiposEu] = useState(false);
  const [ligaEuActiva, setLigaEuActiva] = useState(user?.ligaEu || user?.liga_eu || Object.keys(LIGAS_EU)[0]);
  const [guardandoEquipoArg, setGuardandoEquipoArg] = useState(false);
  const [guardandoEquipoEu, setGuardandoEquipoEu] = useState(false);
  const miStats = stats.find(s=>s.id===user.id) || user;
  const equipoArgHome = miStats?.equipoArg || miStats?.equipo_arg || user?.equipoArg || user?.equipo_arg || "";
  const equipoEuHome = miStats?.equipoEu || miStats?.equipo_eu || user?.equipoEu || user?.equipo_eu || "";
  const ligaEuHome = miStats?.ligaEu || miStats?.liga_eu || user?.ligaEu || user?.liga_eu || "";
  const media = Math.round(Object.values(miStats?.stats||{}).reduce((a,b)=>a+b,0)/6)||65;

  useEffect(() => {
    const nextConfirmo = partido?.confirmados?.includes(user.id);
    const nextRechazo = partido?.rechazados?.includes(user.id);
    const nextPendiente = partido?.pendientes?.includes(user.id) || (pendienteKey ? S.get(pendienteKey, false) : false);
    setConfirmados(partido?.confirmados || []);
    setPendientesConfirmacion(partido?.pendientes || []);
    setEstadoRespuesta(nextConfirmo ? "confirmado" : nextRechazo ? "rechazado" : nextPendiente ? "pendiente" : null);
  }, [partido?.id, partido?.confirmados, partido?.rechazados, partido?.pendientes, user.id]);


  const seleccionarEquipoArg = async (equipo) => {
    if (!user?.id || guardandoEquipoArg) return;
    setGuardandoEquipoArg(true);
    const { error } = await supabase
      .from("jugadores")
      .update({ equipo_arg: equipo })
      .eq("id", user.id);

    setGuardandoEquipoArg(false);

    if (error) {
      alert("No se pudo guardar el equipo. Probá de nuevo.");
      return;
    }

    if (onUpdateEquipoArg) onUpdateEquipoArg(equipo);
    setShowEquiposArg(false);
  };

  const seleccionarEquipoEu = async (liga, equipo) => {
    if (!user?.id || guardandoEquipoEu) return;
    setGuardandoEquipoEu(true);
    const { error } = await supabase
      .from("jugadores")
      .update({ liga_eu: liga, equipo_eu: equipo })
      .eq("id", user.id);

    setGuardandoEquipoEu(false);

    if (error) {
      alert("No se pudo guardar el equipo europeo. Probá de nuevo.");
      return;
    }

    if (onUpdateEquipoEu) onUpdateEquipoEu(liga, equipo);
    setShowEquiposEu(false);
  };

  const handleConfirmar = async (estado) => {
    if (!partido) return;

    let nuevosConf = [...(partido.confirmados || confirmados || [])].filter(id => id !== user.id);
    let nuevosRech = [...(partido.rechazados || [])].filter(id => id !== user.id);
    let nuevosPend = [...(partido.pendientes || pendientesConfirmacion || [])].filter(id => id !== user.id);

    if (estado === "confirmado") nuevosConf.push(user.id);
    if (estado === "rechazado") nuevosRech.push(user.id);
    if (estado === "pendiente") nuevosPend.push(user.id);

    nuevosConf = [...new Set(nuevosConf)];
    nuevosRech = [...new Set(nuevosRech)];
    nuevosPend = [...new Set(nuevosPend)];

    setConfirmados(nuevosConf);
    setPendientesConfirmacion(nuevosPend);
    setEstadoRespuesta(estado);

    if (pendienteKey) S.set(pendienteKey, estado === "pendiente");

    const payloadCompleto = { confirmados: nuevosConf, rechazados: nuevosRech, pendientes: nuevosPend };
    const payloadCompatible = { confirmados: nuevosConf, rechazados: nuevosRech };

    const { error } = await supabase.from("partidos").update(payloadCompleto).eq("id", partido.id);

    // Si la columna "pendientes" todavía no existe en Supabase, no rompemos la app:
    // guardamos el estado localmente y actualizamos confirmados/rechazados igual.
    if (error) {
      await supabase.from("partidos").update(payloadCompatible).eq("id", partido.id);
    }

    if (setPartido) {
      setPartido(prev => ({ ...prev, confirmados: nuevosConf, rechazados: nuevosRech, pendientes: nuevosPend }));
    }
  };

  const resetRespuestaPartido = async () => {
    if (!partido) return;
    const nuevosConf = [...(partido.confirmados || [])].filter(id => id !== user.id);
    const nuevosRech = [...(partido.rechazados || [])].filter(id => id !== user.id);
    const nuevosPend = [...(partido.pendientes || pendientesConfirmacion || [])].filter(id => id !== user.id);

    setConfirmados(nuevosConf);
    setPendientesConfirmacion(nuevosPend);
    setEstadoRespuesta(null);
    if (pendienteKey) S.set(pendienteKey, false);

    const { error } = await supabase.from("partidos").update({ confirmados: nuevosConf, rechazados: nuevosRech, pendientes: nuevosPend }).eq("id", partido.id);
    if (error) await supabase.from("partidos").update({ confirmados: nuevosConf, rechazados: nuevosRech }).eq("id", partido.id);
    if (setPartido) setPartido(prev => ({ ...prev, confirmados: nuevosConf, rechazados: nuevosRech, pendientes: nuevosPend }));
  };

  return(
    <div className="fade-up">
      {showCrearPartido && (
        <ModalCrearPartido
          users={users || stats}
          user={user}
          onClose={() => setShowCrearPartido(false)}
          onCreated={(nuevoPartido) => {
            if (setPartido) setPartido({ ...nuevoPartido, equipoA: nuevoPartido.equipo_a || [], equipoB: nuevoPartido.equipo_b || [] });
            setShowCrearPartido(false);
          }}
        />
      )}

      {showEquiposArg && (
        <div
          className="fade-in"
          style={{
            position:"fixed",
            inset:0,
            zIndex:900,
            background:"rgba(0,0,0,0.88)",
            backdropFilter:"blur(16px)",
            display:"flex",
            alignItems:"flex-end",
            justifyContent:"center"
          }}
          onMouseDown={(e)=>{ if(e.target===e.currentTarget) setShowEquiposArg(false); }}
        >
          <div style={{
            width:"100%",
            maxWidth:520,
            maxHeight:"78dvh",
            overflowY:"auto",
            background:"#080d1b",
            border:"1px solid rgba(255,255,255,0.1)",
            borderRadius:"24px 24px 0 0",
            padding:18,
            boxShadow:"0 -12px 40px rgba(0,0,0,0.55)"
          }}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,gap:12}}>
              <div>
                <div style={{fontWeight:900,fontSize:18}}>Elegí tu equipo argentino</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>Tocá un club y se guarda el escudo en Mis equipos.</div>
              </div>
              <button onClick={()=>setShowEquiposArg(false)} style={{
                width:34,
                height:34,
                borderRadius:"50%",
                border:"1px solid rgba(255,255,255,0.12)",
                background:"rgba(255,255,255,0.06)",
                color:"#fff",
                cursor:"pointer",
                fontSize:18,
                flexShrink:0
              }}>
                ×
              </button>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {EQUIPOS_ARG.map(eq => {
                const teamId = TEAM_IDS[eq];
                const logo = getEquipoLogo(eq) || (teamId ? `https://crests.football-data.org/${teamId}.png` : null);
                const activo = equipoArgHome === eq;

                return (
                  <button key={eq} disabled={guardandoEquipoArg} onClick={()=>seleccionarEquipoArg(eq)} style={{
                    padding:12,
                    borderRadius:14,
                    border: activo ? "1px solid #4ade80" : "1px solid rgba(255,255,255,0.08)",
                    background: activo ? "rgba(34,197,94,0.13)" : "rgba(255,255,255,0.04)",
                    color:"#fff",
                    cursor:guardandoEquipoArg?"wait":"pointer",
                    fontFamily:"'Outfit'",
                    display:"flex",
                    alignItems:"center",
                    gap:10,
                    textAlign:"left",
                    opacity:guardandoEquipoArg?0.7:1
                  }}>
                    {logo ? (
                      <img src={logo} alt={eq} style={{width:28,height:28,objectFit:"contain",flexShrink:0}} />
                    ) : (
                      <span style={{fontSize:22}}>⭐</span>
                    )}
                    <span style={{fontWeight:800,fontSize:12,lineHeight:1.15}}>{eq}</span>
                    {activo && <span style={{marginLeft:"auto",fontSize:13}}>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {showEquiposEu && (
        <div
          className="fade-in"
          style={{
            position:"fixed",
            inset:0,
            zIndex:900,
            background:"rgba(0,0,0,0.88)",
            backdropFilter:"blur(16px)",
            display:"flex",
            alignItems:"flex-end",
            justifyContent:"center"
          }}
          onMouseDown={(e)=>{ if(e.target===e.currentTarget) setShowEquiposEu(false); }}
        >
          <div style={{
            width:"100%",
            maxWidth:520,
            maxHeight:"78dvh",
            overflowY:"auto",
            background:"#080d1b",
            border:"1px solid rgba(255,255,255,0.1)",
            borderRadius:"24px 24px 0 0",
            padding:18,
            boxShadow:"0 -12px 40px rgba(0,0,0,0.55)"
          }}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,gap:12}}>
              <div>
                <div style={{fontWeight:900,fontSize:18}}>Elegí tu equipo europeo</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>Primero elegí la liga y después el club.</div>
              </div>
              <button onClick={()=>setShowEquiposEu(false)} style={{
                width:34,
                height:34,
                borderRadius:"50%",
                border:"1px solid rgba(255,255,255,0.12)",
                background:"rgba(255,255,255,0.06)",
                color:"#fff",
                cursor:"pointer",
                fontSize:18,
                flexShrink:0
              }}>
                ×
              </button>
            </div>

            <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:10,marginBottom:8}}>
              {Object.keys(LIGAS_EU).map(liga => {
                const activa = ligaEuActiva === liga;
                return (
                  <button key={liga} onClick={()=>setLigaEuActiva(liga)} style={{
                    flex:"0 0 auto",
                    padding:"8px 12px",
                    borderRadius:999,
                    border: activa ? "1px solid #60a5fa" : "1px solid rgba(255,255,255,0.08)",
                    background: activa ? "rgba(37,99,235,0.22)" : "rgba(255,255,255,0.04)",
                    color: activa ? "#bfdbfe" : "rgba(255,255,255,0.6)",
                    fontFamily:"'Outfit'",
                    fontWeight:800,
                    fontSize:12,
                    cursor:"pointer",
                    whiteSpace:"nowrap"
                  }}>{liga}</button>
                );
              })}
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {(LIGAS_EU[ligaEuActiva] || []).map(eq => {
                const teamId = TEAM_IDS[eq];
                const logo = getEquipoLogo(eq) || (teamId ? `https://crests.football-data.org/${teamId}.png` : null);
                const activo = equipoEuHome === eq && ligaEuHome === ligaEuActiva;

                return (
                  <button key={eq} disabled={guardandoEquipoEu} onClick={()=>seleccionarEquipoEu(ligaEuActiva, eq)} style={{
                    padding:12,
                    borderRadius:14,
                    border: activo ? "1px solid #60a5fa" : "1px solid rgba(255,255,255,0.08)",
                    background: activo ? "rgba(37,99,235,0.16)" : "rgba(255,255,255,0.04)",
                    color:"#fff",
                    cursor:guardandoEquipoEu?"wait":"pointer",
                    fontFamily:"'Outfit'",
                    display:"flex",
                    alignItems:"center",
                    gap:10,
                    textAlign:"left",
                    opacity:guardandoEquipoEu?0.7:1
                  }}>
                    {logo ? (
                      <img src={logo} alt={eq} style={{width:28,height:28,objectFit:"contain",flexShrink:0}} />
                    ) : (
                      <span style={{fontSize:22}}>🏆</span>
                    )}
                    <span style={{fontWeight:800,fontSize:12,lineHeight:1.15}}>{eq}</span>
                    {activo && <span style={{marginLeft:"auto",fontSize:13}}>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mis stats arriba */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
        {[["Pts mayo",miStats?.puntosMes||0,"#2563eb"],["PJ",miStats?.pj||0,"#c9a84c"],["Media",media,"#7cb9ff"]].map(([k,v,c])=>(
          <Card key={k} style={{padding:12,margin:0,textAlign:"center"}}>
            <div style={{fontFamily:"'Bebas Neue'",fontSize:30,color:c,lineHeight:1}}>{v}</div>
            <div style={{fontSize:10,fontWeight:600,color:"rgba(255,255,255,0.35)",marginTop:3,letterSpacing:1}}>{k.toUpperCase()}</div>
          </Card>
        ))}
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

      {/* Banner partido */}
      <div style={{background:"linear-gradient(135deg,#04060f,#08102a)",border:"1px solid rgba(30,80,212,0.25)",borderRadius:16,padding:16,marginBottom:10,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-20,right:-20,opacity:0.06,pointerEvents:"none"}}><StarballSVG size={180} opacity={1}/></div>
        <div style={{fontSize:10,fontWeight:700,letterSpacing:2,color:"#7cb9ff",textTransform:"uppercase",marginBottom:6}}>⚽ Próximo partido</div>
        <div style={{fontFamily:"'Bebas Neue'",fontSize:28,color:"#fff",lineHeight:1,marginBottom:6}}>{partido.fecha}</div>
        <div style={{display:"flex",gap:14,marginBottom:14,flexWrap:"wrap"}}>
          <span style={{fontSize:12,fontWeight:500,color:"rgba(255,255,255,0.5)"}}>⏰ {partido.hora} hs</span>
          <span style={{fontSize:12,fontWeight:500,color:"rgba(255,255,255,0.5)"}}>🏟️ {partido.cancha}</span>
          {partido.maps_url ? (
            <a href={partido.maps_url} target="_blank" rel="noreferrer" style={{fontSize:12,fontWeight:500,color:"#7cb9ff",textDecoration:"none"}}>📍 Ver ubicación</a>
          ) : (
            <span style={{fontSize:12,fontWeight:500,color:"rgba(255,255,255,0.5)"}}>📍 {partido.ubicacion}</span>
          )}
          {partido.precio_cabeza && <span style={{fontSize:12,fontWeight:500,color:"#4ade80"}}>💰 ${partido.precio_cabeza}/cabeza</span>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:14,flexWrap:"wrap"}}>
          {confirmados.slice(0,6).map((id,i)=>{ const j=stats.find(s=>s.id===id); return j?<div key={id} style={{marginLeft:i>0?-6:0,zIndex:10-i,cursor:"pointer"}} onClick={()=>onPlayerClick&&onPlayerClick(j)}><Av j={j} size={26} border/></div>:null; })}
          <span style={{marginLeft:8,fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.4)"}}>{confirmados.length} confirmados</span>
          {pendientesConfirmacion.length > 0 && (
            <span style={{fontSize:11,fontWeight:700,color:"#fbbf24",background:"rgba(251,191,36,0.12)",border:"1px solid rgba(251,191,36,0.22)",borderRadius:999,padding:"3px 8px"}}>
              ⏰ {pendientesConfirmacion.length} más tarde
            </span>
          )}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
            <button onClick={()=>handleConfirmar("confirmado")} style={getRespuestaBtnStyle("confirmado")}>
              {confirmado ? "✓ Confirmado" : "Confirmar"}
            </button>
            <button onClick={()=>handleConfirmar("pendiente")} style={getRespuestaBtnStyle("pendiente")}>
              {pendienteConfirmacion ? "⏰ Más tarde" : "Más tarde"}
            </button>
            <button onClick={()=>handleConfirmar("rechazado")} style={getRespuestaBtnStyle("rechazado")}>
              {rechazado ? "✕ No puedo" : "No puedo"}
            </button>
          </div>

          {respondida && (
            <div style={{
              padding:"9px 12px",
              borderRadius:10,
              background: confirmado ? "rgba(34,197,94,0.10)" : pendienteConfirmacion ? "rgba(251,191,36,0.10)" : "rgba(239,68,68,0.09)",
              border: confirmado ? "1px solid rgba(34,197,94,0.22)" : pendienteConfirmacion ? "1px solid rgba(251,191,36,0.24)" : "1px solid rgba(239,68,68,0.20)",
              fontSize:12,
              fontWeight:800,
              color: confirmado ? "#4ade80" : pendienteConfirmacion ? "#fbbf24" : "#f87171",
              textAlign:"center",
              boxShadow: confirmado ? "0 8px 22px rgba(34,197,94,0.08)" : pendienteConfirmacion ? "0 8px 22px rgba(251,191,36,0.08)" : "0 8px 22px rgba(239,68,68,0.07)"
            }}>
              {confirmado ? "✓ ¡Confirmado! Nos vemos el viernes 🙌" : pendienteConfirmacion ? "⏰ Pendiente · Te recordaremos el jueves 12:00" : "❌ Marcaste que no podés para este partido"}
            </div>
          )}
        </div>
      </div>

      {/* Equipos favoritos */}
      <div style={{marginBottom:10}}>
        <Lbl style={{marginBottom:8}}>Mis equipos</Lbl>
        <div style={{display:"flex",gap:8}}>
          <EquipoCard titulo="Argentina 🇦🇷" equipo={equipoArgHome} emoji="⭐" onClick={() => setShowEquiposArg(true)}/>
          <EquipoCard titulo="Europa 🌍" equipo={equipoEuHome} liga={ligaEuHome} emoji="🏆" onClick={() => setShowEquiposEu(true)}/>
        </div>
      </div>

      {/* Crear partido solo admins */}
      {user?.isAdmin && (
        <button onClick={() => setShowCrearPartido(true)} style={{
          width: "100%", padding: "13px 16px", borderRadius: 14, marginTop: 6, marginBottom: 12,
          border: "1px solid rgba(34,197,94,0.35)", cursor: "pointer",
          fontFamily: "'Outfit'", fontWeight: 800, fontSize: 15,
          background: "linear-gradient(135deg,rgba(5,150,105,0.2),rgba(16,185,129,0.1))",
          color: "#4ade80", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          boxShadow: "0 4px 20px rgba(34,197,94,0.12)", transition: "all 0.2s",
        }}>
          <span style={{ fontSize: 20 }}>⚽</span> CREAR PARTIDO
        </button>
      )}

    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE: TEMPORADA — Historial de partidos
───────────────────────────────────────── */
function PageTemporada({ user, stats, partido, votos, onVotar, onPlayerClick }) {
  const [partidos, setPartidos] = useState([]);
  const [loadingPartidos, setLoadingPartidos] = useState(true);

  useEffect(() => {
    supabase.from("partidos").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setPartidos(data.map(p => ({
        ...p,
        equipoA: p.equipo_a || [],
        equipoB: p.equipo_b || [],
      })));
      setLoadingPartidos(false);
    });
  }, []);

  const yoVotePorPartido = (p) => (votos || []).some(v => v.partido_id === p.id && v.votante_id === user.id);

  const getResultadoEquipo = (p, lado) => {
    const equipo = lado === "A" ? (p.equipoA || []) : (p.equipoB || []);
    const golesA = p.goles_a ?? null;
    const golesB = p.goles_b ?? null;
    if (golesA === null || golesB === null) return null;
    return lado === "A" ? golesA : golesB;
  };

  const getNombreEquipo = (p, lado) => {
    const nombre = lado === "A" ? p.nombre_equipo_a : p.nombre_equipo_b;
    if (nombre) return nombre;
    const ids = lado === "A" ? (p.equipoA || []) : (p.equipoB || []);
    if (ids.length === 0) return `Equipo ${lado}`;
    const cap = stats.find(s => s.id === ids[0]);
    return cap ? `Equipo ${cap.nombre}` : `Equipo ${lado}`;
  };

  if (loadingPartidos) return (
    <div className="fade-up" style={{textAlign:"center",padding:"48px 0",color:"rgba(255,255,255,0.3)"}}>
      <div style={{fontSize:28,marginBottom:8}}>⏳</div>
      <div>Cargando historial...</div>
    </div>
  );

  if (partidos.length === 0) return (
    <div className="fade-up" style={{textAlign:"center",padding:"48px 0",color:"rgba(255,255,255,0.3)"}}>
      <div style={{fontSize:40,marginBottom:10}}>📅</div>
      <div style={{fontWeight:700,fontSize:16,marginBottom:4}}>Sin partidos registrados</div>
      <div style={{fontSize:13}}>Los partidos van a aparecer acá cuando un admin los cargue</div>
    </div>
  );

  return (
    <div className="fade-up">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div>
          <div style={{fontFamily:"'Bebas Neue'",fontSize:26,letterSpacing:1}}>Historial</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>{partidos.length} partidos · Temporada 2025</div>
        </div>
        <div style={{background:"rgba(30,80,212,0.12)",border:"1px solid rgba(30,80,212,0.25)",borderRadius:10,padding:"6px 12px",textAlign:"center"}}>
          <div style={{fontFamily:"'Bebas Neue'",fontSize:22,color:"#7cb9ff",lineHeight:1}}>{partidos.length}</div>
          <div style={{fontSize:9,color:"rgba(255,255,255,0.3)",fontWeight:600}}>PARTIDOS</div>
        </div>
      </div>

      {partidos.map((p, i) => {
        const yoVote = yoVotePorPartido(p);
        const golesA = p.goles_a ?? null;
        const golesB = p.goles_b ?? null;
        const hayResultado = golesA !== null && golesB !== null;
        const hayVotacion = p.votacion_activa;
        const nombreA = getNombreEquipo(p, "A");
        const nombreB = getNombreEquipo(p, "B");
        const esUltimo = i === 0;

        return (
          <div key={p.id} style={{
            background: esUltimo ? "rgba(30,80,212,0.06)" : "rgba(255,255,255,0.025)",
            border: esUltimo ? "1px solid rgba(30,80,212,0.2)" : "1px solid rgba(255,255,255,0.07)",
            borderRadius:16, padding:14, marginBottom:10,
            position:"relative", overflow:"hidden",
          }}>
            {esUltimo && (
              <div style={{position:"absolute",top:10,right:12,fontSize:9,fontWeight:700,letterSpacing:1.5,color:"#7cb9ff",background:"rgba(30,80,212,0.15)",padding:"2px 8px",borderRadius:99,border:"1px solid rgba(30,80,212,0.3)"}}>
                ÚLTIMO
              </div>
            )}

            {/* Info partido */}
            <div style={{fontSize:10,fontWeight:700,letterSpacing:1,color:"rgba(255,255,255,0.3)",marginBottom:6}}>
              {p.fecha} · {p.cancha}
            </div>

            {/* Marcador / VS */}
            <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:6,alignItems:"center",marginBottom:12}}>
              {/* Equipo A */}
              <div>
                <div style={{fontSize:10,fontWeight:700,letterSpacing:2,color:"#2563eb",marginBottom:4}}>EQUIPO A</div>
                <div style={{fontWeight:800,fontSize:13,color:"#fff",marginBottom:6,lineHeight:1.2}}>{nombreA}</div>
                <div style={{display:"flex",gap:-4}}>
                  {(p.equipoA||[]).slice(0,4).map((id,idx)=>{ const j=stats.find(s=>s.id===id); return j?<div key={id} style={{marginLeft:idx>0?-6:0}}><Av j={j} size={22} border/></div>:null; })}
                  {(p.equipoA||[]).length>4&&<div style={{marginLeft:-6,width:22,height:22,borderRadius:"50%",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:700}}>+{(p.equipoA||[]).length-4}</div>}
                </div>
              </div>

              {/* Marcador */}
              <div style={{textAlign:"center",minWidth:60}}>
                {hayResultado ? (
                  <div style={{fontFamily:"'Bebas Neue'",fontSize:32,color:"#fff",lineHeight:1,letterSpacing:2}}>
                    <span style={{color:golesA>golesB?"#4ade80":golesA===golesB?"#fbbf24":"rgba(255,255,255,0.5)"}}>{golesA}</span>
                    <span style={{color:"rgba(255,255,255,0.2)",margin:"0 2px"}}>-</span>
                    <span style={{color:golesB>golesA?"#4ade80":golesA===golesB?"#fbbf24":"rgba(255,255,255,0.5)"}}>{golesB}</span>
                  </div>
                ) : (
                  <div style={{fontFamily:"'Bebas Neue'",fontSize:20,color:"rgba(255,255,255,0.2)"}}>VS</div>
                )}
                <div style={{fontSize:9,color:"rgba(255,255,255,0.25)",marginTop:2}}>{p.hora} hs</div>
              </div>

              {/* Equipo B */}
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:10,fontWeight:700,letterSpacing:2,color:"#ef4444",marginBottom:4,textAlign:"right"}}>EQUIPO B</div>
                <div style={{fontWeight:800,fontSize:13,color:"#fff",marginBottom:6,lineHeight:1.2,textAlign:"right"}}>{nombreB}</div>
                <div style={{display:"flex",justifyContent:"flex-end",gap:-4}}>
                  {(p.equipoB||[]).slice(0,4).map((id,idx)=>{ const j=stats.find(s=>s.id===id); return j?<div key={id} style={{marginLeft:idx>0?-6:0}}><Av j={j} size={22} border/></div>:null; })}
                  {(p.equipoB||[]).length>4&&<div style={{marginLeft:-6,width:22,height:22,borderRadius:"50%",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:700}}>+{(p.equipoB||[]).length-4}</div>}
                </div>
              </div>
            </div>

            {/* Estado votación */}
            {hayVotacion && !yoVote && (
              <button onClick={onVotar} style={{width:"100%",padding:"10px",borderRadius:10,border:"1px solid rgba(234,179,8,0.3)",cursor:"pointer",background:"rgba(234,179,8,0.08)",color:"#fbbf24",fontFamily:"'Outfit'",fontWeight:700,fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                🪙 Votar en este partido →
              </button>
            )}
            {yoVote && (
              <div style={{fontSize:12,color:"#4ade80",fontWeight:600,display:"flex",alignItems:"center",gap:6,padding:"6px 0"}}>
                ✅ Ya votaste en este partido
              </div>
            )}
            {!hayVotacion && !hayResultado && (
              <div style={{fontSize:11,color:"rgba(255,255,255,0.2)",fontStyle:"italic"}}>Resultado pendiente</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE: 5 IDEAL
───────────────────────────────────────── */
function PageCincoIdeal({ stats, onPlayerClick, isAdmin, user }) {
  const [cardFullscreen, setCardFullscreen] = useState(null);
  const [periodo, setPeriodo] = useState("mes");
  const sorted = [...stats].sort((a,b)=>periodo==="anio"?b.puntosAnio-a.puntosAnio:b.puntosMes-a.puntosMes);
  const top5 = sorted.slice(0,5);
  const maxPts = sorted[0] ? (periodo==="anio"?sorted[0].puntosAnio:sorted[0].puntosMes)||1 : 1;

  return(
    <div className="fade-up">
      <div style={{textAlign:"center",marginBottom:8}}>
        <div style={{fontFamily:"'Bebas Neue'",fontSize:10,letterSpacing:3,color:"rgba(255,255,255,0.3)"}}>AL-KOLIKO FC · 2025</div>
        <div style={{fontFamily:"'Bebas Neue'",fontSize:32,color:"#fff",letterSpacing:1}}>5 Ideal</div>
      </div>

      {/* Tabs periodo */}
      <div style={{display:"flex",gap:6,marginBottom:12,justifyContent:"center"}}>
        {[["semana","Semana"],["mes","Mes"],["anio","Año"]].map(([v,l])=>(
          <button key={v} onClick={()=>setPeriodo(v)} style={{padding:"5px 16px",borderRadius:99,border:"none",cursor:"pointer",fontFamily:"'Outfit'",fontWeight:600,fontSize:11,background:periodo===v?"linear-gradient(135deg,#1440b8,#2563eb)":"rgba(255,255,255,0.05)",color:periodo===v?"#fff":"rgba(255,255,255,0.35)",transition:"all 0.2s"}}>{l}</button>
        ))}
      </div>

      {/* Cancha táctica con figuritas */}
      <div style={{background:"linear-gradient(180deg,#071a0a 0%,#0a2a10 40%,#071a0a 100%)",borderRadius:16,border:"1px solid rgba(34,197,94,0.12)",padding:"20px 8px 16px",marginBottom:14,position:"relative",overflow:"hidden"}}>
        {/* Líneas de cancha */}
        <div style={{position:"absolute",left:"50%",top:0,bottom:0,borderLeft:"1px dashed rgba(255,255,255,0.06)",transform:"translateX(-50%)"}}/>
        <div style={{position:"absolute",left:"50%",top:"50%",width:80,height:80,border:"1px dashed rgba(255,255,255,0.06)",borderRadius:"50%",transform:"translate(-50%,-50%)"}}/>
        <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:100,height:30,border:"1px dashed rgba(255,255,255,0.06)",borderTop:"none"}}/>
        <div style={{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:100,height:30,border:"1px dashed rgba(255,255,255,0.06)",borderBottom:"none"}}/>

        {/* Jugadores en formación 2-2-1 */}
        {[[0,1],[2,3],[4]].map(([a,b],row)=>(
          <div key={row} style={{display:"flex",justifyContent:"space-around",marginBottom:row<2?16:0,position:"relative",zIndex:1}}>
            {[a,b].filter(x=>x!==undefined).map(idx=>{ const j=top5[idx]; if(!j) return null;
              return(
                <div key={j.id} onClick={()=>setCardFullscreen(j)} className="card-tap" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer"}}>
                  <FiguritaSVG jugador={j} size={80}/>
                  <div style={{background:"rgba(0,0,0,0.7)",borderRadius:6,padding:"2px 8px",textAlign:"center",border:"1px solid rgba(255,255,255,0.1)"}}>
                    <div style={{fontWeight:700,fontSize:10,color:"#fff"}}>{j.nombre}</div>
                    <div style={{fontFamily:"'Bebas Neue'",fontSize:11,color:"#7cb9ff"}}>{periodo==="anio"?j.puntosAnio:j.puntosMes} pts</div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Ranking de jugadores */}
      <Lbl style={{marginBottom:8}}>Ranking {periodo==="semana"?"de la semana":periodo==="mes"?"del mes":"del año"}</Lbl>

      {/* Header tabla */}
      <div style={{display:"flex",alignItems:"center",padding:"4px 14px",marginBottom:4}}>
        <span style={{width:22,fontSize:10,color:"rgba(255,255,255,0.25)",fontWeight:700}}>#</span>
        <span style={{flex:1,fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.25)",letterSpacing:1,marginLeft:42}}>JUGADOR</span>
        {["PJ","PTS","MVPs"].map(k=><span key={k} style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.25)",letterSpacing:1,width:36,textAlign:"center"}}>{k}</span>)}
      </div>

      {sorted.map((j,i)=>(
        <div key={j.id} className="card-tap" onClick={()=>setCardFullscreen(j)} style={{
          display:"flex",alignItems:"center",padding:"10px 14px",
          background:user && j.id===user.id?"rgba(30,80,212,0.08)":i<5?"rgba(30,80,212,0.03)":"rgba(255,255,255,0.02)",
          border:user && j.id===user.id?"1px solid rgba(30,80,212,0.18)":i<5?"1px solid rgba(30,80,212,0.1)":"1px solid rgba(255,255,255,0.06)",
          borderRadius:12,marginBottom:6,cursor:"pointer",transition:"all 0.2s",
        }}>
          <span style={{fontFamily:"'Bebas Neue'",fontSize:16,color:i<3?"#c9a84c":i<5?"#7cb9ff":"rgba(255,255,255,0.2)",width:22,textAlign:"center"}}>
            {i===0?"🥇":i===1?"🥈":i===2?"🥉":i+1}
          </span>
          <Av j={j} size={30}/>
          <div style={{flex:1,marginLeft:10}}>
            <div style={{fontWeight:700,fontSize:14,display:"flex",alignItems:"center",gap:6}}>
              {j.nombre}
              {user && j.id===user.id&&<span style={{fontSize:9,padding:"1px 6px",borderRadius:4,background:"rgba(30,80,212,0.15)",color:"#7cb9ff",border:"1px solid rgba(30,80,212,0.25)",fontWeight:600}}>vos</span>}
            </div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>{j.apodo}</div>
          </div>
          <div style={{display:"flex",gap:4}}>
            {[j.pj, periodo==="anio"?j.puntosAnio:j.puntosMes, j.mvps].map((v,k)=>(
              <div key={k} style={{fontFamily:"'Bebas Neue'",fontSize:k===1?20:15,color:k===1?"#2563eb":"rgba(255,255,255,0.4)",width:36,textAlign:"center"}}>{v}</div>
            ))}
          </div>
        </div>
      ))}

      {cardFullscreen && (
        <ModalCardFullscreen jugador={cardFullscreen} isAdmin={isAdmin} onClose={()=>setCardFullscreen(null)}/>
      )}
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
      {/* Historias */}
      <div style={{marginBottom:14,overflowX:"auto",paddingBottom:4}}>
        <div style={{display:"flex",gap:10,width:"max-content"}}>
          {/* Tu historia */}
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,cursor:"pointer"}}>
            <div style={{width:56,height:56,borderRadius:"50%",border:"2px dashed rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(255,255,255,0.04)"}}>
              <span style={{fontSize:22}}>+</span>
            </div>
            <span style={{fontSize:10,color:"rgba(255,255,255,0.4)",fontWeight:600}}>Tu historia</span>
          </div>
          {/* Historias de jugadores */}
          {stats.slice(0,8).map((j,i)=>(
            <div key={j.id} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,cursor:"pointer"}}>
              <div style={{padding:2,borderRadius:"50%",background:i%3===0?"linear-gradient(135deg,#f59e0b,#ef4444)":i%3===1?"linear-gradient(135deg,#2563eb,#7c3aed)":"linear-gradient(135deg,#059669,#2563eb)"}}>
                <div style={{padding:2,borderRadius:"50%",background:"#060b18"}}>
                  <Av j={j} size={48} border/>
                </div>
              </div>
              <span style={{fontSize:10,color:"rgba(255,255,255,0.5)",fontWeight:600,maxWidth:52,textAlign:"center",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{j.nombre}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Publicar */}
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
   PAGE: CARDS (solo admin)
───────────────────────────────────────── */
function PageCards({ user, stats }) {
  const [selected, setSelected] = useState(null);

  return(
    <div className="fade-up">
      <div style={{textAlign:"center",marginBottom:14}}>
        <div style={{fontFamily:"'Bebas Neue'",fontSize:32,color:"#fff",letterSpacing:1}}>Cards del Grupo</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.3)",marginTop:2}}>{user.isAdmin?"Tocá para ver y editar":"Tocá una card para ver el perfil completo"}</div>
      </div>

      {selected ? (
        <div className="fade-in">
          <button onClick={()=>setSelected(null)} style={{background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.4)",fontSize:13,fontFamily:"'Outfit'",marginBottom:16,display:"flex",alignItems:"center",gap:6}}>← Volver a cards</button>
          <div style={{display:"flex",justifyContent:"center",marginBottom:20}}>
            <FiguritaSVG jugador={selected} size={220}/>
          </div>
          <Card style={{padding:16}}>
            <div style={{fontWeight:800,fontSize:20,marginBottom:4}}>{selected.nombre} {selected.apellido}</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:12}}>{selected.apodo}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
              {[["Posición",selected.posicion],["Número","#"+selected.numero],["Rareza",selected.rareza],["Pierna",selected.pierna],["Ciudad",selected.ciudad],["Nivel",selected.nivel]].map(([k,v])=>(
                <div key={k} style={{background:"rgba(255,255,255,0.03)",borderRadius:10,padding:"8px 12px"}}>
                  <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",marginBottom:2}}>{k}</div>
                  <div style={{fontWeight:700,fontSize:13}}>{v}</div>
                </div>
              ))}
            </div>
            <Lbl style={{marginBottom:8}}>Atributos</Lbl>
            {[["Velocidad",selected.stats?.velocidad,"#2563eb"],["Pase",selected.stats?.pase,"#3b82f6"],["Defensa",selected.stats?.defensa,"#f59e0b"],["Tiro",selected.stats?.tiro,"#ef4444"],["Técnica",selected.stats?.tecnica,"#8b5cf6"],["Resistencia",selected.stats?.resistencia,"#06b6d4"]].map(([k,v,c])=>(
              <StatBar key={k} label={k} value={v||0} color={c}/>
            ))}
          </Card>
        </div>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          {stats.map(j=>(
            <div key={j.id} className="card-tap" onClick={()=>setSelected(j)} style={{display:"flex",justifyContent:"center"}}>
              <FiguritaSVG jugador={j} size={160}/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


/* ─────────────────────────────────────────
   TAB MI PERFIL (editable por el propio usuario)
───────────────────────────────────────── */
function TabMiPerfil({ jugador, onSave }) {
  const [form, setForm] = useState({
    apodo: jugador.apodo || "",
    ciudad: jugador.ciudad || "",
    celular: jugador.celular || "",
    equipoArg: jugador.equipoArg || "",
    ligaEu: jugador.ligaEu || "",
    equipoEu: jugador.equipoEu || "",
  });
  const [newPass, setNewPass] = useState("");
  const [saved, setSaved] = useState(false);

  const equiposEu = LIGAS_EU[form.ligaEu] || [];

  const handleSave = async () => {
    const updates = {
      apodo: form.apodo,
      ciudad: form.ciudad,
      celular: form.celular,
      equipo_arg: form.equipoArg,
      liga_eu: form.ligaEu,
      equipo_eu: form.equipoEu,
    };
    await supabase.from("jugadores").update(updates).eq("id", jugador.id);
    if (newPass.trim().length >= 6) {
      await supabase.auth.updateUser({ password: newPass.trim() });
    }
    if (onSave) onSave({ ...jugador, ...form, equipoArg: form.equipoArg, ligaEu: form.ligaEu, equipoEu: form.equipoEu });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="fade-in" style={{display:"flex",flexDirection:"column",gap:12}}>
      <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"10px 14px",marginBottom:4}}>
        <div style={{fontSize:10,fontWeight:700,letterSpacing:1,color:"rgba(255,255,255,0.3)",marginBottom:2}}>NOMBRE Y APELLIDO</div>
        <div style={{fontWeight:700,fontSize:15}}>{jugador.nombre} {jugador.apellido}</div>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>No se puede editar</div>
      </div>

      <div><Lbl>Apodo futbolero</Lbl>
        <input className="ucl-input" value={form.apodo} onChange={e=>setForm(p=>({...p,apodo:e.target.value}))} placeholder="Tu apodo"/>
      </div>
      <div><Lbl>Domicilio / Barrio</Lbl>
        <input className="ucl-input" value={form.ciudad} onChange={e=>setForm(p=>({...p,ciudad:e.target.value}))} placeholder="Tu barrio o ciudad"/>
      </div>
      <div><Lbl>Celular</Lbl>
        <input className="ucl-input" value={form.celular} onChange={e=>setForm(p=>({...p,celular:e.target.value}))} placeholder="+54 11 ..." type="tel"/>
      </div>
      <div><Lbl>🇦🇷 Club argentino favorito</Lbl>
        <select className="ucl-input" value={form.equipoArg} onChange={e=>setForm(p=>({...p,equipoArg:e.target.value}))}>
          <option value="">— Seleccioná —</option>
          {EQUIPOS_ARG.map(eq=><option key={eq} value={eq}>{eq}</option>)}
        </select>
      </div>
      <div><Lbl>🌍 Liga europea</Lbl>
        <select className="ucl-input" value={form.ligaEu} onChange={e=>setForm(p=>({...p,ligaEu:e.target.value,equipoEu:""}))}>
          <option value="">— Seleccioná liga —</option>
          {Object.keys(LIGAS_EU).map(l=><option key={l} value={l}>{l}</option>)}
        </select>
      </div>
      {form.ligaEu && (
        <div><Lbl>🏟️ Club europeo ({form.ligaEu})</Lbl>
          <select className="ucl-input" value={form.equipoEu} onChange={e=>setForm(p=>({...p,equipoEu:e.target.value}))}>
            <option value="">— Seleccioná club —</option>
            {equiposEu.map(eq=><option key={eq} value={eq}>{eq}</option>)}
          </select>
        </div>
      )}
      <div><Lbl>Nueva contraseña (opcional, mín. 6 caracteres)</Lbl>
        <input className="ucl-input" type="password" value={newPass} onChange={e=>setNewPass(e.target.value)} placeholder="Dejá vacío para no cambiar"/>
      </div>
      <BtnGreen onClick={handleSave}>💾 Guardar cambios</BtnGreen>
      {saved && (
        <div style={{background:"#16a34a",color:"#fff",borderRadius:10,padding:"10px 14px",fontSize:14,fontWeight:700,textAlign:"center"}}>
          ✅ ¡Perfil actualizado!
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   TABLA EQUIPOS CON VOTACIÓN REAL
───────────────────────────────────────── */
function TablaEquiposConVotacion({ partido, votos, stats, user, onVotar }) {
  if (!partido) return (
    <div style={{textAlign:"center",padding:"40px 0",color:"rgba(255,255,255,0.3)"}}>
      <div style={{fontSize:32,marginBottom:8}}>📅</div>
      <div>No hay partidos registrados aún</div>
    </div>
  );

  const equipoA = (partido.equipoA || partido.equipo_a || []).map(id => stats.find(s=>s.id===id)).filter(Boolean);
  const equipoB = (partido.equipoB || partido.equipo_b || []).map(id => stats.find(s=>s.id===id)).filter(Boolean);
  const yoVote = votos?.some(v => v.partido_id === partido.id && v.votante_id === user.id);
  const votacionActiva = partido.votacion_activa;

  const votosPorJugador = {};
  (votos || []).filter(v => v.partido_id === partido.id).forEach(v => {
    votosPorJugador[v.votado_id] = (votosPorJugador[v.votado_id] || 0) + v.monedas;
  });

  return (
    <div>
      <div style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.3)",marginBottom:10}}>
        {partido.fecha} · {partido.cancha}
      </div>

      {/* Botón votar */}
      {votacionActiva && !yoVote && (
        <div style={{background:"rgba(234,179,8,0.08)",border:"1px solid rgba(234,179,8,0.25)",borderRadius:14,padding:14,marginBottom:14,display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:24}}>🪙</span>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:14,color:"#fbbf24"}}>¡Votación abierta!</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>Repartí tus 10 monedas entre los jugadores</div>
          </div>
          <button onClick={onVotar} style={{padding:"8px 16px",borderRadius:10,border:"none",cursor:"pointer",background:"#eab308",color:"#000",fontFamily:"'Outfit'",fontWeight:700,fontSize:13}}>Votar →</button>
        </div>
      )}
      {yoVote && (
        <div style={{background:"rgba(34,197,94,0.08)",border:"1px solid rgba(34,197,94,0.2)",borderRadius:12,padding:"10px 14px",marginBottom:14,fontSize:13,color:"#4ade80",fontWeight:600}}>
          ✅ Ya votaste en este partido
        </div>
      )}

      {/* VS */}
      <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:8,alignItems:"start",marginBottom:14}}>
        <div>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:2,color:"#2563eb",marginBottom:8}}>EQUIPO A</div>
          {equipoA.map(j=>(
            <div key={j.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
              <Av j={j} size={24}/>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:12}}>{j.nombre}</div>
                {votosPorJugador[j.id] > 0 && <div style={{fontSize:10,color:"#fbbf24"}}>🪙 {votosPorJugador[j.id]}</div>}
              </div>
            </div>
          ))}
          {equipoA.length === 0 && <div style={{fontSize:11,color:"rgba(255,255,255,0.2)"}}>Sin jugadores</div>}
        </div>
        <div style={{fontFamily:"'Bebas Neue'",fontSize:22,color:"rgba(255,255,255,0.2)",paddingTop:20}}>VS</div>
        <div>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:2,color:"#ef4444",marginBottom:8}}>EQUIPO B</div>
          {equipoB.map(j=>(
            <div key={j.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
              <Av j={j} size={24}/>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:12}}>{j.nombre}</div>
                {votosPorJugador[j.id] > 0 && <div style={{fontSize:10,color:"#fbbf24"}}>🪙 {votosPorJugador[j.id]}</div>}
              </div>
            </div>
          ))}
          {equipoB.length === 0 && <div style={{fontSize:11,color:"rgba(255,255,255,0.2)"}}>Sin jugadores</div>}
        </div>
      </div>

      {/* Top votados */}
      {Object.keys(votosPorJugador).length > 0 && (
        <div style={{background:"rgba(201,168,76,0.05)",border:"1px solid rgba(201,168,76,0.15)",borderRadius:12,padding:14}}>
          <Lbl style={{marginBottom:8}}>⭐ Top votados del partido</Lbl>
          {Object.entries(votosPorJugador).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([id,mon],i)=>{
            const j = stats.find(s=>s.id===id);
            return (
              <div key={id} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0"}}>
                <span style={{fontFamily:"'Bebas Neue'",fontSize:14,color:i===0?"#c9a84c":i===1?"#b0b0cc":i===2?"#c09060":"rgba(255,255,255,0.2)",width:18}}>{i+1}</span>
                <Av j={j} size={22}/>
                <span style={{flex:1,fontSize:12,fontWeight:600}}>{j?.nombre} {j?.apellido}</span>
                <span style={{fontSize:12,color:"#fbbf24",fontWeight:700}}>🪙 {mon}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   MODAL VOTACIÓN (cancha 5vs5 + monedas)
───────────────────────────────────────── */
function ModalVotacion({ partido, stats, user, votos, onClose, onVotado }) {
  const equipoA = (partido.equipoA || partido.equipo_a || []).map(id => stats.find(s=>s.id===id)).filter(Boolean);
  const equipoB = (partido.equipoB || partido.equipo_b || []).map(id => stats.find(s=>s.id===id)).filter(Boolean);
  const todos = [...equipoA, ...equipoB];

  const [monedas, setMonedas] = useState(() => {
    const m = {};
    todos.forEach(j => { m[j.id] = 0; });
    return m;
  });

  const TOTAL = 10;
  const usado = Object.values(monedas).reduce((a,b)=>a+b,0);
  const restantes = TOTAL - usado;

  const cambiar = (id, delta) => {
    setMonedas(prev => {
      const actual = prev[id] || 0;
      const nuevo = actual + delta;
      if (nuevo < 0) return prev;
      if (delta > 0 && restantes <= 0) return prev;
      return { ...prev, [id]: nuevo };
    });
  };

  const confirmar = async () => {
    await supabase.from("votos").delete().eq("partido_id", partido.id).eq("votante_id", user.id);
    const rows = Object.entries(monedas).filter(([,m])=>m>0).map(([votado_id, mon])=>({
      partido_id: partido.id, votante_id: user.id, votado_id, monedas: mon
    }));
    if (rows.length > 0) await supabase.from("votos").insert(rows);
    if (onVotado) onVotado();
    onClose();
  };

  // Render de una card de jugador votable — igual que 5 Ideal + controles monedas
  const CardVotable = ({ j }) => {
    if (!j) return null;
    const esYo = j.id === user.id;
    const mon = monedas[j.id] || 0;
    return (
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"default"}}>
        <div style={{position:"relative"}}>
          <FiguritaSVG jugador={j} size={80}/>
          {mon > 0 && (
            <div style={{position:"absolute",top:0,right:-2,background:"#fbbf24",borderRadius:"50%",width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:"#000",boxShadow:"0 2px 8px rgba(0,0,0,0.7)",zIndex:10,border:"2px solid #000"}}>
              {mon}
            </div>
          )}
        </div>
        <div style={{background:"rgba(0,0,0,0.75)",borderRadius:6,padding:"3px 8px",textAlign:"center",border:"1px solid rgba(255,255,255,0.1)",opacity:esYo?0.45:1,minWidth:64}}>
          <div style={{fontWeight:700,fontSize:10,color:"#fff",marginBottom:esYo?0:2}}>{j.nombre}</div>
          {esYo
            ? <div style={{fontSize:8,color:"rgba(255,255,255,0.3)"}}>no votable</div>
            : (
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:3}}>
                <button onClick={()=>cambiar(j.id,-1)} disabled={!mon} style={{width:17,height:17,borderRadius:"50%",border:"1px solid rgba(255,255,255,0.2)",background:"rgba(0,0,0,0.7)",color:"#fff",cursor:mon?"pointer":"not-allowed",fontSize:12,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center",opacity:mon?1:0.25,padding:0,lineHeight:1}}>−</button>
                <span style={{fontFamily:"'Bebas Neue'",fontSize:14,color:mon>0?"#fbbf24":"rgba(255,255,255,0.35)",minWidth:14,textAlign:"center"}}>{mon}</span>
                <button onClick={()=>cambiar(j.id,1)} disabled={restantes<=0} style={{width:17,height:17,borderRadius:"50%",border:"1px solid rgba(255,255,255,0.2)",background:"rgba(0,0,0,0.7)",color:"#fff",cursor:restantes>0?"pointer":"not-allowed",fontSize:12,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center",opacity:restantes>0?1:0.25,padding:0,lineHeight:1}}>+</button>
              </div>
            )
          }
        </div>
      </div>
    );
  };

  // Renderiza un bloque de 5 jugadores en formación 2-2-1 (igual que 5 Ideal)
  const FormacionEquipo = ({ equipo, label, color }) => (
    <div style={{marginBottom:10}}>
      <div style={{fontSize:9,fontWeight:800,letterSpacing:2,color,textAlign:"center",marginBottom:6}}>{label}</div>
      {[[0,1],[2,3],[4]].map(([a,b],row)=>(
        <div key={row} style={{display:"flex",justifyContent:"space-around",marginBottom:row<2?12:0,position:"relative",zIndex:1}}>
          {[a,b].filter(x=>x!==undefined).map(idx=>{
            const j = equipo[idx];
            return j ? <CardVotable key={j.id} j={j}/> : null;
          })}
        </div>
      ))}
    </div>
  );

  return (
    <div className="fade-in" style={{position:"fixed",inset:0,zIndex:600,background:"rgba(0,0,0,0.97)",display:"flex",flexDirection:"column"}}>
      {/* Header */}
      <div style={{padding:"12px 16px",background:"#0a1020",borderBottom:"1px solid rgba(255,255,255,0.08)",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div>
          <div style={{fontFamily:"'Bebas Neue'",fontSize:20,letterSpacing:1}}>🪙 Repartí tus monedas</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>10 monedas · No podés votarte a vos mismo</div>
        </div>
        <div style={{textAlign:"center"}}>
          <div style={{fontFamily:"'Bebas Neue'",fontSize:34,color:restantes>0?"#fbbf24":"#4ade80",lineHeight:1}}>{restantes}</div>
          <div style={{fontSize:9,color:"rgba(255,255,255,0.3)"}}>restantes</div>
        </div>
      </div>

      {/* CANCHA COMPLETA — estilo idéntico a 5 Ideal, dos mitades */}
      <div style={{flex:1,overflowY:"auto",padding:"10px 8px 20px"}}>
        <div style={{
          background:"linear-gradient(180deg,#071a0a 0%,#0a2a10 40%,#071a0a 100%)",
          borderRadius:16, border:"1px solid rgba(34,197,94,0.12)",
          padding:"16px 8px 16px", position:"relative", overflow:"hidden",
        }}>
          {/* Líneas de cancha — exactas al 5 Ideal */}
          <div style={{position:"absolute",left:"50%",top:0,bottom:0,borderLeft:"1px dashed rgba(255,255,255,0.06)",transform:"translateX(-50%)"}}/>
          <div style={{position:"absolute",left:"50%",top:"50%",width:80,height:80,border:"1px dashed rgba(255,255,255,0.06)",borderRadius:"50%",transform:"translate(-50%,-50%)"}}/>
          <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:100,height:30,border:"1px dashed rgba(255,255,255,0.06)",borderTop:"none"}}/>
          <div style={{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:100,height:30,border:"1px dashed rgba(255,255,255,0.06)",borderBottom:"none"}}/>

          {/* Equipo A — mitad de arriba, formación 2-2-1 */}
          <FormacionEquipo equipo={equipoA} label="⬆ EQUIPO A" color="#60a5fa"/>

          {/* Divisor central */}
          <div style={{borderTop:"1px dashed rgba(255,255,255,0.08)",margin:"10px 0",position:"relative",zIndex:1}}/>

          {/* Equipo B — mitad de abajo, formación 2-2-1 */}
          <FormacionEquipo equipo={equipoB} label="⬇ EQUIPO B" color="#f87171"/>
        </div>

        <div style={{textAlign:"center",fontSize:11,color:"rgba(255,255,255,0.22)",marginTop:10}}>
          Tocá + y − para repartir tus 🪙
        </div>
      </div>

      {/* Footer */}
      <div style={{padding:"12px 16px",background:"#0a1020",borderTop:"1px solid rgba(255,255,255,0.08)",display:"flex",gap:10,flexShrink:0}}>
        <BtnOutline onClick={onClose} style={{flex:1}}>Cancelar</BtnOutline>
        <BtnGreen onClick={confirmar} style={{flex:2}}>🪙 Confirmar ({usado}/{TOTAL} monedas)</BtnGreen>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MODAL CARD FULLSCREEN
───────────────────────────────────────── */
function ModalCardFullscreen({ jugador, isAdmin, onClose, onEdit }) {
  return (
    <div className="fade-in" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}} style={{position:"fixed",inset:0,zIndex:700,background:"rgba(0,0,0,0.96)",backdropFilter:"blur(20px)",display:"flex",flexDirection:"column",alignItems:"center",overflowY:"auto"}}>
      {/* Barra superior */}
      <div style={{width:"100%",maxWidth:520,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 16px 0",flexShrink:0}}>
        <button onClick={onClose} style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",color:"rgba(255,255,255,0.7)",width:36,height:36,borderRadius:"50%",cursor:"pointer",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
        <div style={{fontFamily:"'Bebas Neue'",fontSize:14,letterSpacing:2,color:"rgba(255,255,255,0.3)"}}>AL-KOLIKO FC · 2025</div>
        {isAdmin ? (
          <button onClick={()=>{ onClose(); if(onEdit) onEdit(jugador); }} style={{background:"rgba(30,80,212,0.2)",border:"1px solid rgba(30,80,212,0.4)",color:"#7cb9ff",padding:"7px 14px",borderRadius:10,cursor:"pointer",fontFamily:"'Outfit'",fontWeight:700,fontSize:12,display:"flex",alignItems:"center",gap:5}}>
            ✏️ Editar
          </button>
        ) : <div style={{width:36}}/>}
      </div>

      {/* Card grande centrada */}
      <div style={{display:"flex",justifyContent:"center",padding:"20px 0 8px",flexShrink:0}}>
        <FiguritaSVG jugador={jugador} size={240}/>
      </div>

      {/* Info completa */}
      <div style={{width:"100%",maxWidth:400,padding:"0 16px 40px",flexShrink:0}}>
        <div style={{textAlign:"center",marginBottom:16}}>
          <div style={{fontWeight:900,fontSize:22,color:"#fff"}}>{jugador.nombre} {jugador.apellido}</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.35)",marginTop:2}}>{jugador.apodo}</div>
          <div style={{display:"flex",gap:6,justifyContent:"center",marginTop:8,flexWrap:"wrap"}}>
            <span style={{fontSize:10,padding:"2px 10px",borderRadius:99,background:"rgba(30,80,212,0.15)",color:"#4ade80",border:"1px solid rgba(30,80,212,0.25)",fontWeight:600}}>{jugador.posicion}</span>
            <span style={{fontSize:10,padding:"2px 10px",borderRadius:99,background:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.5)",border:"1px solid rgba(255,255,255,0.1)",fontWeight:600}}>#{jugador.numero}</span>
            <span style={{fontSize:10,padding:"2px 10px",borderRadius:99,background:RAREZA_CONFIG[jugador.rareza]?.glow?.replace("0.5","0.15")||"rgba(201,168,76,0.12)",color:RAREZA_CONFIG[jugador.rareza]?.border||"#c9a84c",border:`1px solid ${RAREZA_CONFIG[jugador.rareza]?.border||"#c9a84c"}44`,fontWeight:600}}>{jugador.rareza}</span>
          </div>
        </div>

        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginBottom:14}}>
          {[["⚽",jugador.goles,"Goles"],["🎯",jugador.asist,"Asist"],["👑",jugador.mvps,"MVPs"],["🎮",jugador.pj,"PJ"]].map(([icon,v,label])=>(
            <div key={label} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"10px 6px",textAlign:"center"}}>
              <div style={{fontSize:16,marginBottom:2}}>{icon}</div>
              <div style={{fontFamily:"'Bebas Neue'",fontSize:22,color:"#7cb9ff",lineHeight:1}}>{v||0}</div>
              <div style={{fontSize:9,fontWeight:600,color:"rgba(255,255,255,0.35)",marginTop:2}}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:14}}>
          <Lbl style={{marginBottom:10}}>Atributos</Lbl>
          {[["Velocidad",jugador.stats?.velocidad,"#2563eb"],["Pase",jugador.stats?.pase,"#3b82f6"],["Defensa",jugador.stats?.defensa,"#f59e0b"],["Tiro",jugador.stats?.tiro,"#ef4444"],["Técnica",jugador.stats?.tecnica,"#8b5cf6"],["Resistencia",jugador.stats?.resistencia,"#06b6d4"]].map(([k,v,c])=>(
            <StatBar key={k} label={k} value={v||0} color={c}/>
          ))}
        </div>
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
        equipoArg: j.equipo_arg,
        equipoEu: j.equipo_eu,
        ligaEu: j.liga_eu,
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
      setLoggedUser(prev => {
        if (!prev?.id) return prev;
        const actualizado = mapped.find(u => u.id === prev.id);
        return actualizado ? { ...prev, ...actualizado } : prev;
      });
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
  const [cardFullscreen, setCardFullscreen] = useState(null);
  const [votos, setVotos] = useState([]);
  const [showVotacion, setShowVotacion] = useState(null);

  useEffect(() => {
    if (!partido?.id) return;
    supabase.from("votos").select("*").eq("partido_id", partido.id).then(({ data }) => {
      if (data) setVotos(data);
    });
  }, [partido?.id]);

  const handleLogin = (u) => { setLoggedUser(u); S.set("fulbito-session", { id: u.id }); setTab(0); };
  const handleLogout = () => { setLoggedUser(null); localStorage.removeItem("fulbito-session"); };
  const handleRegister = (nu) => setUsers(prev=>[...prev, nu]);

  // Click en jugador: si es mi propio perfil o admin quiere editar, abre PlayerModal; si no, abre ModalCardFullscreen
  const handlePlayerClick = (j) => setCardFullscreen(j);
  const handlePlayerSave = (updated) => {
    setUsers(prev=>prev.map(u=>u.id===updated.id?{...u,...updated}:u));
    setSelectedPlayer(prev=>prev?{...prev,...updated}:prev);
    if(loggedUser?.id===updated.id) setLoggedUser(prev=>({...prev,...updated}));
  };


  const handleUpdateEquipoArg = (equipo) => {
    setUsers(prev => prev.map(u =>
      u.id === loggedUser?.id ? { ...u, equipoArg: equipo, equipo_arg: equipo } : u
    ));
    setLoggedUser(prev => prev ? { ...prev, equipoArg: equipo, equipo_arg: equipo } : prev);
  };

  const handleUpdateEquipoEu = (liga, equipo) => {
    setUsers(prev => prev.map(u =>
      u.id === loggedUser?.id ? { ...u, ligaEu: liga, liga_eu: liga, equipoEu: equipo, equipo_eu: equipo } : u
    ));
    setLoggedUser(prev => prev ? { ...prev, ligaEu: liga, liga_eu: liga, equipoEu: equipo, equipo_eu: equipo } : prev);
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
        {/* Card fullscreen al hacer click en jugador */}
        {cardFullscreen&&(
          <ModalCardFullscreen
            jugador={cardFullscreen}
            isAdmin={loggedUser.isAdmin}
            onClose={()=>setCardFullscreen(null)}
            onEdit={(j)=>{ setSelectedPlayer(j); }}
          />
        )}
        {/* PlayerModal para edición (admin) o mi propio perfil */}
        {selectedPlayer&&(
          <PlayerModal
            jugador={selectedPlayer}
            onClose={()=>setSelectedPlayer(null)}
            isAdmin={loggedUser.isAdmin}
            isMiPerfil={selectedPlayer.id===loggedUser.id}
            onSave={handlePlayerSave}
            onSavePerfil={(updated)=>{
              handlePlayerSave(updated);
              setSelectedPlayer(null);
            }}
          />
        )}
        {showVotacion&&(
          <ModalVotacion
            partido={showVotacion}
            stats={users}
            user={loggedUser}
            votos={votos}
            onClose={()=>setShowVotacion(null)}
            onVotado={()=>{
              supabase.from("votos").select("*").eq("partido_id", showVotacion.id).then(({data})=>{if(data)setVotos(data);});
            }}
          />
        )}
        <Header user={loggedUser} onAdmin={()=>setShowAdmin(true)} onLogout={handleLogout} onProfile={()=>setSelectedPlayer(loggedUser)}/>
        <div style={{padding:"14px 14px 82px",position:"relative",zIndex:1}}>
          {tab===0&&<PageInicio user={loggedUser} partido={partido} setPartido={setPartido} stats={users} onVotar={()=>{setTab(1);}} onPlayerClick={handlePlayerClick} users={users} onUpdateEquipoArg={handleUpdateEquipoArg} onUpdateEquipoEu={handleUpdateEquipoEu}/>}
          {tab===1&&<PageTemporada user={loggedUser} stats={users} partido={partido} votos={votos} onVotar={()=>setShowVotacion(partido)} onPlayerClick={handlePlayerClick}/>}
          {tab===2&&<PageCincoIdeal stats={users} user={loggedUser} onPlayerClick={handlePlayerClick} isAdmin={loggedUser?.isAdmin}/>}
          {tab===3&&<PageFeed user={loggedUser} stats={users} feed={feed} onFeedUpdate={setFeed}/>}
          {tab===4&&<PageCards user={loggedUser} stats={users}/>}
        </div>
        <NavBottom active={tab} onChange={i=>{setTab(i);setShowAdmin(false);}} pendiente={1} isAdmin={loggedUser.isAdmin}/>
      </div>
    </>
  );
}
