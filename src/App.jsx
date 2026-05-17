import { useState, useEffect, useCallback } from "react";

/* ─────────────────────────────────────────
   STORAGE HELPERS
───────────────────────────────────────── */
const save = async (key, val) => {
  try { await window.storage.set(key, JSON.stringify(val)); } catch(e) { localStorage.setItem(key, JSON.stringify(val)); }
};
const load = async (key, def) => {
  try {
    const r = await window.storage.get(key);
    return r ? JSON.parse(r.value) : def;
  } catch {
    try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : def; } catch { return def; }
  }
};

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const USERS_INIT = [
  { id:1,  nombre:"Nico",    apodo:"El Capitán",    pass:"nico123",    isAdmin:true  },
  { id:2,  nombre:"Juank",   apodo:"El Otro Admin",  pass:"juank123",   isAdmin:true  },
  { id:3,  nombre:"Enzo",    apodo:"Al-Koliko",      pass:"enzo123",    isAdmin:false },
  { id:4,  nombre:"Maxi",    apodo:"El Tanque",      pass:"maxi123",    isAdmin:false },
  { id:5,  nombre:"Fede",    apodo:"Mágico",         pass:"fede123",    isAdmin:false },
  { id:6,  nombre:"Lean",    apodo:"El Rápido",      pass:"lean123",    isAdmin:false },
  { id:7,  nombre:"Seba",    apodo:"El Arquero",     pass:"seba123",    isAdmin:false },
  { id:8,  nombre:"Matías",  apodo:"Toro",           pass:"matias123",  isAdmin:false },
  { id:9,  nombre:"Gonza",   apodo:"Gordito",        pass:"gonza123",   isAdmin:false },
  { id:10, nombre:"Rulo",    apodo:"El Crack",       pass:"rulo123",    isAdmin:false },
  { id:11, nombre:"Pipe",    apodo:"Fantasma",       pass:"pipe123",    isAdmin:false },
];

const STATS_INIT = USERS_INIT.map((u,i) => ({
  ...u,
  pj:    [12,10,11,9,12,8,10,7,6,5,4][i],
  wins:  [8,6,7,5,7,4,5,3,3,2,1][i],
  mvps:  [4,3,2,3,1,2,1,0,1,0,0][i],
  goles: [14,8,18,6,10,2,9,5,7,3,2][i],
  asist: [9,12,4,15,7,3,5,4,6,2,1][i],
  puntosMes:  [47,38,35,29,25,22,18,15,12,8,5][i],
  puntosAnio: [132,110,98,87,74,65,54,42,35,22,14][i],
  rating:[88,84,82,80,77,75,73,70,68,65,62][i],
}));

const HALL_INIT = [
  { semana:"Semana 1 · Mayo", ganador:"Nico",  pts:18, top5:["Nico","Enzo","Maxi","Fede","Lean"] },
  { semana:"Semana 2 · Mayo", ganador:"Enzo",  pts:15, top5:["Enzo","Maxi","Nico","Lean","Seba"] },
  { semana:"Semana 3 · Mayo", ganador:"Maxi",  pts:17, top5:["Maxi","Nico","Fede","Enzo","Matías"] },
];

const PREMIOS_DEF = [
  { emoji:"🐢", titulo:"El más lento",      sub:"El que nunca llega",    opciones:["Pipe","Gonza","Matías"] },
  { emoji:"🧱", titulo:"El más cagón",       sub:"Arco propio favorito",  opciones:["Seba","Rulo","Fede"] },
  { emoji:"🎭", titulo:"El más dramático",   sub:"Oscar a mejor actor",   opciones:["Enzo","Maxi","Lean"] },
  { emoji:"👑", titulo:"Rey del caño",       sub:"El mago de la pelota",  opciones:["Nico","Fede","Lean"] },
  { emoji:"💨", titulo:"Desapareció",        sub:"¿Estaba en el equipo?", opciones:["Pipe","Rulo","Gonza"] },
];

const PUNTO_POR_RANK = [5,4,3,2,1];

const AV_COLORS = [
  ["#1565C0","#42A5F5"],["#7B1FA2","#CE93D8"],["#E65100","#FFA726"],
  ["#1B5E20","#66BB6A"],["#880E4F","#F48FB1"],["#006064","#26C6DA"],
  ["#BF360C","#FF7043"],["#004D40","#26A69A"],["#33691E","#9CCC65"],
  ["#4A148C","#AB47BC"],["#0D47A1","#64B5F6"],
];

const CARD_GRADIENTS = [
  "linear-gradient(150deg,#7c5c10,#c9943a,#e8b84b,#7c4a00)",
  "linear-gradient(150deg,#0d1f6b,#1a4db5,#2563eb,#0a1540)",
  "linear-gradient(150deg,#064e3b,#059669,#10b981,#022c22)",
  "linear-gradient(150deg,#3b0764,#7c3aed,#a855f7,#1e003f)",
  "linear-gradient(150deg,#7f1d1d,#dc2626,#f87171,#450a0a)",
  "linear-gradient(150deg,#083344,#0891b2,#22d3ee,#03202e)",
  "linear-gradient(150deg,#431407,#c2410c,#f97316,#271006)",
  "linear-gradient(150deg,#042f2e,#0d9488,#2dd4bf,#011e1d)",
  "linear-gradient(150deg,#1a2e05,#4d7c0f,#84cc16,#0d1a02)",
  "linear-gradient(150deg,#4a044e,#a21caf,#e879f9,#2d0030)",
  "linear-gradient(150deg,#1a2e6b,#2554c7,#4f88f7,#0a1540)",
];

/* ─────────────────────────────────────────
   STARBALL SVG
───────────────────────────────────────── */
function StarballSVG({ size=320, opacity=0.06 }) {
  const cx=size/2, cy=size/2, R=size*0.38, r=size*0.07;
  const stars=Array.from({length:8},(_,i)=>{
    const a=(i*Math.PI*2)/8-Math.PI/2;
    return {x:cx+R*Math.cos(a),y:cy+R*Math.sin(a)};
  });
  function star(cx,cy,or,ir,pts=5){
    let d='';
    for(let i=0;i<pts*2;i++){
      const a=(i*Math.PI)/pts-Math.PI/2;
      const rad=i%2===0?or:ir;
      d+=(i===0?'M':'L')+(cx+rad*Math.cos(a))+','+(cy+rad*Math.sin(a));
    }
    return d+'Z';
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{opacity}}>
      <circle cx={cx} cy={cy} r={R+r*1.8} fill="none" stroke="white" strokeWidth={0.8} opacity={0.6}/>
      <circle cx={cx} cy={cy} r={R+r*1.2} fill="none" stroke="white" strokeWidth={0.4} opacity={0.3}/>
      <circle cx={cx} cy={cy} r={r*1.4} fill="white" opacity={0.9}/>
      {stars.map((s,i)=>(
        <g key={i}>
          <path d={star(s.x,s.y,r*0.95,r*0.42,5)} fill="white" opacity={0.92}/>
        </g>
      ))}
      {stars.map((s,i)=>{
        const next=stars[(i+1)%8];
        return <line key={i} x1={s.x} y1={s.y} x2={next.x} y2={next.y} stroke="white" strokeWidth={0.5} opacity={0.22}/>;
      })}
      {stars.map((s,i)=>(
        <line key={i+'r'} x1={cx} y1={cy} x2={s.x} y2={s.y} stroke="white" strokeWidth={0.4} opacity={0.13}/>
      ))}
    </svg>
  );
}

/* ─────────────────────────────────────────
   GLOBAL CSS
───────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Bebas+Neue&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html{scroll-behavior:smooth}
body{background:#03061a;color:#f0f4ff;font-family:'Outfit',sans-serif;min-height:100vh;min-height:100dvh;overscroll-behavior:none;-webkit-font-smoothing:antialiased}
body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 100% 50% at 50% -10%,rgba(30,100,255,0.2) 0%,transparent 65%),radial-gradient(ellipse 60% 40% at 100% 110%,rgba(10,50,180,0.1) 0%,transparent 55%),linear-gradient(180deg,#030820 0%,#03061a 50%,#020512 100%);z-index:-1;pointer-events:none}
::-webkit-scrollbar{width:3px;height:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#1e50d4;border-radius:99px}

@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pop{0%{transform:scale(0.88);opacity:0}70%{transform:scale(1.04)}100%{transform:scale(1);opacity:1}}
@keyframes rotateSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
@keyframes slideDown{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}

.fade-up{animation:fadeUp 0.3s cubic-bezier(.22,.68,0,1.2) both}
.fade-in{animation:fadeIn 0.3s ease both}
.pop{animation:pop 0.32s cubic-bezier(.22,.68,0,1.2) both}
.rotate-slow{animation:rotateSlow 60s linear infinite}
.slide-down{animation:slideDown 0.35s cubic-bezier(.22,.68,0,1.2) both}
.pulse-dot{animation:pulse 2s ease infinite}

.gold-text{background:linear-gradient(90deg,#c9a84c,#f5e4a8,#e8c96d,#c9a84c);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 3s linear infinite}

.ucl-input{width:100%;padding:14px 16px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;outline:none;font-family:'Outfit';font-size:15px;font-weight:500;color:#f0f4ff;transition:all 0.2s}
.ucl-input:focus{border-color:rgba(30,80,212,0.6);background:rgba(30,80,212,0.08);box-shadow:0 0 0 3px rgba(30,80,212,0.12)}
.ucl-input::placeholder{color:rgba(255,255,255,0.25)}
`;

/* ─────────────────────────────────────────
   TOAST / NOTIFICACIÓN
───────────────────────────────────────── */
function Toast({ msg, type="success", onClose }) {
  useEffect(()=>{ const t=setTimeout(onClose,4000); return()=>clearTimeout(t); },[onClose]);
  const colors = {
    success:["rgba(34,197,94,0.12)","rgba(34,197,94,0.25)","#4ade80"],
    warning:["rgba(245,158,11,0.12)","rgba(245,158,11,0.25)","#fbbf24"],
    error:  ["rgba(239,68,68,0.12)","rgba(239,68,68,0.25)","#fca5a5"],
    info:   ["rgba(30,80,212,0.18)","rgba(30,80,212,0.35)","#7cb9ff"],
  };
  const [bg,border,color]=colors[type]||colors.info;
  return (
    <div className="slide-down" style={{
      position:"fixed", top:68, left:"50%", transform:"translateX(-50%)",
      zIndex:999, minWidth:280, maxWidth:360,
      background:bg, border:`1px solid ${border}`,
      borderRadius:14, padding:"13px 18px",
      display:"flex", alignItems:"center", gap:10,
      backdropFilter:"blur(20px)",
      boxShadow:"0 8px 32px rgba(0,0,0,0.4)",
    }}>
      <span style={{fontSize:18}}>{type==="success"?"✅":type==="warning"?"⚠️":type==="error"?"❌":"ℹ️"}</span>
      <span style={{flex:1,fontFamily:"'Outfit'",fontWeight:600,fontSize:14,color}}>{msg}</span>
      <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color,fontSize:18,lineHeight:1,opacity:0.6}}>×</button>
    </div>
  );
}

function useToast() {
  const [toasts,setToasts]=useState([]);
  const show=useCallback((msg,type="success")=>{
    const id=Date.now();
    setToasts(p=>[...p,{id,msg,type}]);
  },[]);
  const hide=useCallback((id)=>setToasts(p=>p.filter(t=>t.id!==id)),[]);
  const Toasts=()=>(
    <div style={{position:"fixed",top:0,left:0,right:0,zIndex:999,pointerEvents:"none"}}>
      {toasts.map((t,i)=>(
        <div key={t.id} style={{pointerEvents:"auto",marginTop:i>0?6:0}}>
          <Toast msg={t.msg} type={t.type} onClose={()=>hide(t.id)}/>
        </div>
      ))}
    </div>
  );
  return {show,Toasts};
}

/* ─────────────────────────────────────────
   COMPONENTES BASE
───────────────────────────────────────── */
function Av({j,size=38}){
  const [c1,c2]=AV_COLORS[(j.id-1)%AV_COLORS.length];
  return(
    <div style={{width:size,height:size,borderRadius:"50%",flexShrink:0,background:`linear-gradient(135deg,${c1},${c2})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Outfit'",fontWeight:800,fontSize:size*0.38,color:"#fff",textShadow:"0 1px 3px rgba(0,0,0,0.4)",boxShadow:`0 2px 12px ${c1}55`,border:"1.5px solid rgba(255,255,255,0.15)"}}>
      {j.nombre[0]}
    </div>
  );
}

function Lbl({children,style={}}){
  return <div style={{fontSize:10,fontWeight:600,letterSpacing:1.5,textTransform:"uppercase",color:"rgba(255,255,255,0.3)",marginBottom:6,...style}}>{children}</div>;
}

function Card({children,style={}}){
  return <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:16,marginBottom:10,backdropFilter:"blur(12px)",boxShadow:"inset 0 1px 0 rgba(255,255,255,0.05)",...style}}>{children}</div>;
}

function GBlock({title,titleRight,children,gold=false}){
  return(
    <div style={{marginBottom:10,borderRadius:14,overflow:"hidden",border:"1px solid rgba(30,80,212,0.28)"}}>
      <div style={{background:gold?"linear-gradient(90deg,#8a6020,#c9a84c,#e8c96d,#c9a84c,#8a6020)":"linear-gradient(90deg,#1440b8,#1e50d4,#2563eb)",padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{fontFamily:"'Outfit'",fontWeight:700,fontSize:13,color:gold?"#1a0f00":"#fff"}}>{title}</span>
        {titleRight&&<span style={{fontFamily:"'Outfit'",fontWeight:500,fontSize:11,color:gold?"rgba(26,15,0,0.55)":"rgba(255,255,255,0.5)"}}>{titleRight}</span>}
      </div>
      <div style={{background:"rgba(3,8,32,0.8)",backdropFilter:"blur(8px)"}}>{children}</div>
    </div>
  );
}

function GRow({children,highlight=false,last=false}){
  return <div style={{display:"flex",alignItems:"center",padding:"11px 16px",borderBottom:last?"none":"1px solid rgba(255,255,255,0.05)",background:highlight?"rgba(201,168,76,0.05)":"transparent"}}>{children}</div>;
}

function BtnPrimary({children,onClick,disabled=false,style={}}){
  return <button onClick={onClick} disabled={disabled} style={{width:"100%",padding:"15px",borderRadius:14,border:disabled?"1px solid rgba(255,255,255,0.06)":"1px solid rgba(201,168,76,0.35)",cursor:disabled?"not-allowed":"pointer",fontFamily:"'Outfit'",fontWeight:700,fontSize:15,background:disabled?"rgba(255,255,255,0.03)":"linear-gradient(135deg,#c9a84c,#a07828)",color:disabled?"rgba(255,255,255,0.2)":"#000",boxShadow:disabled?"none":"0 4px 24px rgba(201,168,76,0.2)",transition:"all 0.2s",...style}}>{children}</button>;
}

function BtnSec({children,onClick,style={}}){
  return <button onClick={onClick} style={{width:"100%",padding:"13px",borderRadius:14,border:"1px solid rgba(30,80,212,0.4)",cursor:"pointer",fontFamily:"'Outfit'",fontWeight:600,fontSize:14,background:"rgba(30,80,212,0.12)",color:"#7cb9ff",transition:"all 0.2s",...style}}>{children}</button>;
}

/* ─────────────────────────────────────────
   LOGIN
───────────────────────────────────────── */
function LoginScreen({onLogin}){
  const [user,setUser]=useState("");
  const [pass,setPass]=useState("");
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);

  const handle=()=>{
    setErr(""); setLoading(true);
    setTimeout(()=>{
      const found=USERS_INIT.find(u=>u.nombre.toLowerCase()===user.toLowerCase().trim()&&u.pass===pass.trim());
      if(found) onLogin(found);
      else { setErr("Usuario o contraseña incorrectos"); setLoading(false); }
    },700);
  };

  return(
    <div style={{minHeight:"100dvh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 24px 40px",position:"relative",overflow:"hidden"}}>
      <div className="rotate-slow" style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",pointerEvents:"none",zIndex:0}}>
        <StarballSVG size={520} opacity={0.052}/>
      </div>
      <div style={{position:"absolute",top:-80,right:-80,pointerEvents:"none",zIndex:0}}>
        <StarballSVG size={260} opacity={0.038}/>
      </div>
      <div style={{position:"absolute",bottom:-60,left:-60,pointerEvents:"none",zIndex:0}}>
        <StarballSVG size={200} opacity={0.028}/>
      </div>

      {/* Logo */}
      <div className="fade-up" style={{textAlign:"center",marginBottom:36,position:"relative",zIndex:1}}>
        <div style={{width:72,height:72,borderRadius:20,margin:"0 auto 16px",background:"linear-gradient(135deg,#1440b8,#0a1f6b)",border:"1px solid rgba(201,168,76,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,boxShadow:"0 0 40px rgba(30,80,212,0.4),0 0 80px rgba(30,80,212,0.15),inset 0 1px 0 rgba(255,255,255,0.1)"}}>⚽</div>
        <div style={{fontFamily:"'Outfit'",fontWeight:800,fontSize:28,color:"#fff",lineHeight:1.1,marginBottom:4}}>El Fulbito</div>
        <div className="gold-text" style={{fontFamily:"'Outfit'",fontWeight:600,fontSize:15}}>de los Viernes</div>
        <div style={{marginTop:10,fontSize:10,fontWeight:600,color:"rgba(255,255,255,0.22)",letterSpacing:2}}>AL-KOLIKO FC · TEMPORADA 2025</div>
      </div>

      {/* Form */}
      <div className="fade-up" style={{width:"100%",maxWidth:380,position:"relative",zIndex:1,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:20,padding:24,backdropFilter:"blur(20px)",boxShadow:"0 24px 60px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.06)"}}>
        <div style={{fontFamily:"'Outfit'",fontWeight:700,fontSize:18,marginBottom:4}}>Acceder</div>
        <div style={{fontSize:13,fontWeight:400,color:"rgba(255,255,255,0.35)",marginBottom:20}}>Tu usuario y contraseña te los da el admin</div>

        <div style={{marginBottom:12}}>
          <Lbl>Usuario</Lbl>
          <input className="ucl-input" placeholder="Tu nombre..." value={user} onChange={e=>setUser(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/>
        </div>
        <div style={{marginBottom:20}}>
          <Lbl>Contraseña</Lbl>
          <input className="ucl-input" type="password" placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/>
        </div>

        {err&&<div className="pop" style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:10,padding:"10px 14px",fontSize:13,fontWeight:500,color:"#fca5a5",marginBottom:16,textAlign:"center"}}>⚠️ {err}</div>}

        <BtnPrimary onClick={handle} disabled={!user||!pass||loading}>
          {loading?"Entrando...":"Entrar al vestuario 🏟️"}
        </BtnPrimary>
      </div>

      <div className="fade-up" style={{marginTop:20,textAlign:"center",position:"relative",zIndex:1}}>
        <div style={{fontSize:11,fontWeight:500,color:"rgba(255,255,255,0.18)",letterSpacing:1}}>Demo: Nico / nico123 · Admin: Juank / juank123</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   HEADER
───────────────────────────────────────── */
function Header({user,onAdmin,onLogout}){
  return(
    <div style={{height:56,position:"sticky",top:0,zIndex:300,background:"rgba(3,6,26,0.9)",borderBottom:"1px solid rgba(255,255,255,0.07)",backdropFilter:"blur(24px)",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 16px"}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:34,height:34,borderRadius:10,flexShrink:0,background:"linear-gradient(135deg,#1440b8,#0a1f6b)",border:"1px solid rgba(201,168,76,0.28)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,boxShadow:"0 0 20px rgba(30,80,212,0.4)"}}>⚽</div>
        <div>
          <div style={{fontFamily:"'Outfit'",fontWeight:800,fontSize:16,color:"#fff",lineHeight:1.1}}>Fulbito</div>
          <div style={{fontFamily:"'Outfit'",fontWeight:500,fontSize:9,letterSpacing:1,color:"#c9a84c"}}>de los Viernes</div>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        {user.isAdmin&&(
          <button onClick={onAdmin} style={{padding:"5px 11px",borderRadius:8,border:"1px solid rgba(201,168,76,0.25)",background:"rgba(201,168,76,0.08)",cursor:"pointer",fontFamily:"'Outfit'",fontWeight:600,fontSize:11,color:"#c9a84c"}}>⚙️ Admin</button>
        )}
        <button onClick={onLogout} style={{display:"flex",alignItems:"center",gap:7,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:99,padding:"5px 12px 5px 5px",cursor:"pointer"}}>
          <Av j={user} size={26}/>
          <span style={{fontFamily:"'Outfit'",fontWeight:600,fontSize:13,color:"#fff"}}>{user.nombre}</span>
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   NAV BOTTOM
───────────────────────────────────────── */
const NAV=[{icon:"🏠",label:"Inicio"},{icon:"🗳️",label:"Votar"},{icon:"🏆",label:"Tabla"},{icon:"⭐",label:"Top 5"},{icon:"🎴",label:"Cards"},{icon:"🎭",label:"Premios"}];

function NavBottom({active,onChange,votoPendiente}){
  return(
    <div style={{height:62,position:"fixed",bottom:0,left:0,right:0,zIndex:300,background:"rgba(3,6,26,0.97)",borderTop:"1px solid rgba(255,255,255,0.07)",backdropFilter:"blur(24px)",display:"flex",maxWidth:520,margin:"0 auto"}}>
      {NAV.map((n,i)=>{
        const on=active===i;
        return(
          <button key={i} onClick={()=>onChange(i)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,border:"none",background:"none",cursor:"pointer",fontFamily:"'Outfit'",fontSize:9,fontWeight:600,letterSpacing:0.3,color:on?"#e8c96d":"rgba(255,255,255,0.26)",transition:"all 0.18s",borderTop:on?"2px solid #c9a84c":"2px solid transparent",paddingTop:4,position:"relative"}}>
            <span style={{fontSize:20,lineHeight:1,transform:on?"scale(1.18)":"scale(1)",filter:on?"drop-shadow(0 0 8px rgba(201,168,76,0.65))":"none",transition:"all 0.18s"}}>{n.icon}</span>
            {n.label}
            {/* Badge de votación pendiente en tab Votar */}
            {i===1&&votoPendiente&&!on&&(
              <span className="pulse-dot" style={{position:"absolute",top:6,right:"calc(50% - 14px)",width:7,height:7,borderRadius:"50%",background:"#ef4444",border:"1.5px solid #03061a"}}/>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────
   BANNER DE NOTIFICACIÓN DE CIERRE
───────────────────────────────────────── */
function ClosingBanner({horasRestantes,onVotar}){
  if(horasRestantes>24||horasRestantes<=0) return null;
  const urgent=horasRestantes<=6;
  return(
    <div className="slide-down" style={{background:urgent?"linear-gradient(90deg,rgba(239,68,68,0.12),rgba(239,68,68,0.08))":"linear-gradient(90deg,rgba(245,158,11,0.12),rgba(245,158,11,0.08))",border:`1px solid ${urgent?"rgba(239,68,68,0.25)":"rgba(245,158,11,0.25)"}`,borderRadius:12,padding:"11px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:10}}>
      <span style={{fontSize:20}}>{urgent?"🔴":"⚠️"}</span>
      <div style={{flex:1}}>
        <div style={{fontWeight:700,fontSize:13,color:urgent?"#fca5a5":"#fbbf24"}}>
          {urgent?`¡Últimas ${horasRestantes}h para votar!`:`Cerramos en ${horasRestantes}h`}
        </div>
        <div style={{fontSize:11,fontWeight:400,color:"rgba(255,255,255,0.4)",marginTop:1}}>
          La votación cierra el jueves 23:59
        </div>
      </div>
      <button onClick={onVotar} style={{padding:"6px 12px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"'Outfit'",fontWeight:700,fontSize:12,background:urgent?"rgba(239,68,68,0.2)":"rgba(245,158,11,0.2)",color:urgent?"#fca5a5":"#fbbf24"}}>Votar →</button>
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE: INICIO
───────────────────────────────────────── */
function PageInicio({user,partido,hall,onVotar}){
  return(
    <div className="fade-up">
      {/* Banner partido */}
      <div style={{background:"linear-gradient(135deg,#0c1e5c,#112070)",border:"1px solid rgba(30,80,212,0.45)",borderRadius:16,padding:18,marginBottom:10,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-40,right:-40,pointerEvents:"none",opacity:0.12}}><StarballSVG size={200} opacity={1}/></div>
        <div style={{fontSize:11,fontWeight:600,letterSpacing:1.5,color:"#c9a84c",textTransform:"uppercase",marginBottom:6}}>Próximo partido</div>
        <div style={{fontFamily:"'Bebas Neue'",fontSize:34,color:"#fff",lineHeight:1,marginBottom:4}}>
          {partido?.fecha||"Viernes 16 Mayo"}
        </div>
        <div style={{fontWeight:500,fontSize:14,color:"rgba(255,255,255,0.45)",marginBottom:16}}>
          {partido?.hora||"23:00 hs"} · Cancha de siempre
        </div>
        {partido?.jugadores?.length>0 ? (
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {partido.jugadores.map(id=>{
              const j=STATS_INIT.find(x=>x.id===id);
              return j?<span key={id} style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:8,padding:"4px 11px",fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.85)"}}>⚽ {j.nombre}</span>:null;
            })}
          </div>
        ):(
          <div style={{fontSize:13,color:"rgba(255,255,255,0.3)"}}>El admin aún no confirmó los jugadores</div>
        )}
      </div>

      {/* Equipos si están cargados */}
      {partido?.equipoA?.length>0&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
          {["A","B"].map(eq=>(
            <div key={eq} style={{background:`rgba(${eq==="A"?"30,80,212":"201,168,76"},0.08)`,border:`1px solid rgba(${eq==="A"?"30,80,212":"201,168,76"},0.2)`,borderRadius:12,padding:12}}>
              <div style={{fontFamily:"'Bebas Neue'",fontSize:18,color:eq==="A"?"#7cb9ff":"#c9a84c",marginBottom:6}}>Equipo {eq}</div>
              {(eq==="A"?partido.equipoA:partido.equipoB).map(id=>{
                const j=STATS_INIT.find(x=>x.id===id);
                return j?<div key={id} style={{fontSize:12,fontWeight:600,marginBottom:3,color:"rgba(255,255,255,0.7)"}}>⚽ {j.nombre}</div>:null;
              })}
            </div>
          ))}
        </div>
      )}

      {/* Estado votación */}
      <GBlock title="Votación esta semana" titleRight="Cierra Jue 23:59">
        <div style={{padding:"8px 16px 0",display:"flex",justifyContent:"space-between"}}>
          <span style={{fontSize:10,fontWeight:600,color:"rgba(255,255,255,0.25)",letterSpacing:1}}>Jugador</span>
          <span style={{fontSize:10,fontWeight:600,color:"rgba(255,255,255,0.25)",letterSpacing:1}}>Estado</span>
        </div>
        {(partido?.jugadores||[1,2,3,4,5,6]).slice(0,6).map((id,i,arr)=>{
          const j=STATS_INIT.find(x=>x.id===id)||{nombre:"?",id};
          const ok=Math.random()>0.5;
          return(
            <GRow key={id} last={i===arr.length-1}>
              <span style={{flex:1,fontWeight:600,fontSize:14}}>{j.nombre}</span>
              <span style={{fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:6,background:ok?"rgba(34,197,94,0.1)":"rgba(255,255,255,0.04)",color:ok?"#4ade80":"rgba(255,255,255,0.25)",border:ok?"1px solid rgba(34,197,94,0.2)":"1px solid rgba(255,255,255,0.07)"}}>{ok?"✓ Votó":"Pendiente"}</span>
            </GRow>
          );
        })}
        <div style={{padding:"10px 16px",display:"flex",justifyContent:"center"}}>
          <button onClick={onVotar} style={{padding:"8px 20px",borderRadius:99,border:"1px solid rgba(30,80,212,0.4)",background:"rgba(30,80,212,0.15)",cursor:"pointer",fontFamily:"'Outfit'",fontWeight:600,fontSize:13,color:"#7cb9ff"}}>Ir a votar →</button>
        </div>
      </GBlock>

      {/* Hall */}
      <GBlock title="🏆 Hall of Fame semanal" gold>
        {hall.map((h,i)=>(
          <GRow key={i} last={i===hall.length-1} highlight={i===0}>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:15,marginBottom:3}}>{["🥇","🥈","🥉"][i]} {h.ganador}</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.35)",marginBottom:5}}>{h.semana}</div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                {h.top5.map(n=><span key={n} style={{fontSize:10,padding:"2px 7px",borderRadius:5,background:"rgba(30,80,212,0.18)",color:"rgba(255,255,255,0.4)",border:"1px solid rgba(30,80,212,0.2)"}}>{n}</span>)}
              </div>
            </div>
            <div style={{fontFamily:"'Bebas Neue'",fontSize:38,color:"#c9a84c",lineHeight:1}}>{h.pts}</div>
          </GRow>
        ))}
      </GBlock>
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE: VOTAR
───────────────────────────────────────── */
function PageVotar({user,partido,misVotos,onVotosGuardados,toast}){
  const [votos,setVotos]=useState(misVotos||{});
  const [guardando,setGuardando]=useState(false);
  const yaVote=Object.keys(misVotos||{}).length>0;
  const total=Object.values(votos).reduce((a,b)=>a+b,0);

  const setVoto=(id,n)=>{
    const v={...votos};
    if(n===0) delete v[id]; else v[id]=n;
    setVotos(v);
  };

  const confirmar=async()=>{
    if(!total) return;
    setGuardando(true);
    await save(`votos-${user.id}-semana4`, votos);
    onVotosGuardados(votos);
    toast("¡Votos guardados! Suerte con el Top 5 🎯","success");
    setGuardando(false);
  };

  const jugables=STATS_INIT.filter(j=>
    j.id!==user.id&&
    (partido?.jugadores?.includes(j.id)||true)
  ).slice(0,partido?.jugadores?.length||9);

  if(yaVote) return(
    <div className="fade-up">
      <div className="pop" style={{background:"rgba(34,197,94,0.08)",border:"1px solid rgba(34,197,94,0.2)",borderRadius:14,padding:"14px 16px",fontWeight:700,fontSize:15,color:"#4ade80",textAlign:"center",marginBottom:12}}>
        ✅ Ya votaste esta semana
      </div>
      <GBlock title="Tus votos · Semana 4">
        {Object.entries(misVotos).sort((a,b)=>b[1]-a[1]).map(([id,pts],i,arr)=>{
          const j=STATS_INIT.find(x=>x.id===parseInt(id));
          return(
            <GRow key={id} last={i===arr.length-1}>
              <Av j={j} size={32}/>
              <span style={{flex:1,fontWeight:600,fontSize:15,marginLeft:10}}>{j?.nombre}</span>
              <span style={{fontFamily:"'Bebas Neue'",fontSize:26,color:"#c9a84c"}}>{pts} 🪙</span>
            </GRow>
          );
        })}
      </GBlock>
      <div style={{textAlign:"center",padding:16,fontSize:12,color:"rgba(255,255,255,0.25)"}}>Resultados cuando todos voten o el jueves 23:59</div>
    </div>
  );

  return(
    <div className="fade-up">
      {/* Monedas */}
      <div style={{background:"linear-gradient(135deg,#0c1e5c,#112070)",border:"1px solid rgba(30,80,212,0.4)",borderRadius:16,padding:18,marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div>
            <Lbl style={{marginBottom:4,color:"rgba(255,255,255,0.4)"}}>Monedas disponibles</Lbl>
            <div style={{fontFamily:"'Bebas Neue'",fontSize:52,lineHeight:1,color:10-total===0?"#4ade80":"#c9a84c"}}>{10-total} <span style={{fontSize:28}}>🪙</span></div>
          </div>
          <div style={{maxWidth:130,textAlign:"right",fontSize:12,fontWeight:500,color:"rgba(255,255,255,0.35)",lineHeight:1.5}}>Acertá el Top 5 y sumás puntos a tu tabla</div>
        </div>
        <div style={{background:"rgba(255,255,255,0.07)",borderRadius:99,height:5,overflow:"hidden"}}>
          <div style={{width:`${total*10}%`,height:"100%",borderRadius:99,background:"linear-gradient(90deg,#1440b8,#c9a84c)",transition:"width 0.3s ease"}}/>
        </div>
        <div style={{marginTop:8,fontSize:11,color:"rgba(255,255,255,0.25)"}}>
          💡 No tenés que repartir todo · Solo votá a quien creas que va al Top 5
        </div>
      </div>

      {jugables.map(j=>{
        const asig=votos[j.id]||0,sinEste=total-asig;
        return(
          <div key={j.id} style={{background:asig>0?"rgba(201,168,76,0.05)":"rgba(255,255,255,0.03)",border:asig>0?"1px solid rgba(201,168,76,0.2)":"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:14,marginBottom:8,transition:"all 0.2s"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:11}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <Av j={j} size={38}/>
                <div>
                  <div style={{fontWeight:700,fontSize:15}}>{j.nombre}</div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,0.35)"}}>{j.apodo}</div>
                </div>
              </div>
              <div style={{fontFamily:"'Bebas Neue'",fontSize:30,color:asig>0?"#c9a84c":"rgba(255,255,255,0.12)",transition:"color 0.2s"}}>{asig}🪙</div>
            </div>
            <div style={{display:"flex",gap:3}}>
              {[0,1,2,3,4,5,6,7,8,9,10].map(n=>{
                const dis=(sinEste+n>10)&&n!==asig,sel=asig===n;
                return<button key={n} disabled={dis} onClick={()=>setVoto(j.id,n)} style={{flex:1,padding:"8px 2px",borderRadius:8,border:sel?"1px solid #e8c96d":dis?"1px solid transparent":"1px solid rgba(30,80,212,0.22)",background:sel?"linear-gradient(135deg,#c9a84c,#a07828)":dis?"rgba(255,255,255,0.02)":"rgba(30,80,212,0.15)",color:sel?"#000":dis?"rgba(255,255,255,0.07)":"rgba(255,255,255,0.6)",fontFamily:"'Outfit'",fontWeight:700,fontSize:13,cursor:dis?"not-allowed":"pointer",transition:"all 0.15s"}}>{n}</button>;
              })}
            </div>
          </div>
        );
      })}

      <BtnPrimary onClick={confirmar} disabled={!total||guardando} style={{marginBottom:8}}>
        {guardando?"Guardando...":total?`Confirmar votos · ${total}/10 🪙`:"Repartí tus monedas"}
      </BtnPrimary>
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE: TABLA
───────────────────────────────────────── */
function PageTabla({user}){
  const [vista,setVista]=useState("mes");
  const sorted=[...STATS_INIT].sort((a,b)=>vista==="mes"?b.puntosMes-a.puntosMes:b.puntosAnio-a.puntosAnio);
  return(
    <div className="fade-up">
      <div style={{display:"flex",background:"rgba(255,255,255,0.04)",borderRadius:10,padding:3,marginBottom:14,border:"1px solid rgba(255,255,255,0.07)"}}>
        {[["mes","Mensual · Mayo"],["anio","Temporada 2025"]].map(([v,l])=>(
          <button key={v} onClick={()=>setVista(v)} style={{flex:1,padding:"9px 0",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"'Outfit'",fontWeight:600,fontSize:13,background:vista===v?"linear-gradient(135deg,#1440b8,#2563eb)":"none",color:vista===v?"#fff":"rgba(255,255,255,0.3)",transition:"all 0.2s"}}>{l}</button>
        ))}
      </div>
      <div style={{display:"flex",justifyContent:"center",alignItems:"flex-end",gap:10,marginBottom:16}}>
        {[sorted[1],sorted[0],sorted[2]].map((j,i)=>{
          const h=[86,110,70],m=["🥈","🥇","🥉"],sz=[40,52,36],isFirst=i===1;
          return(
            <div key={j.id} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
              <span style={{fontSize:sz[i]*0.3,marginBottom:2}}>{m[i]}</span>
              <Av j={j} size={sz[i]}/>
              <div style={{fontWeight:600,fontSize:11,color:isFirst?"#c9a84c":"rgba(255,255,255,0.55)"}}>{j.nombre}</div>
              <div style={{width:74,height:h[i],background:isFirst?"linear-gradient(180deg,#1440b8,#0a1f6b)":"rgba(255,255,255,0.04)",border:isFirst?"1px solid rgba(30,80,212,0.5)":"1px solid rgba(255,255,255,0.07)",borderRadius:"8px 8px 0 0",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Bebas Neue'",fontSize:isFirst?28:22,color:isFirst?"#c9a84c":"rgba(255,255,255,0.4)"}}>
                {vista==="mes"?j.puntosMes:j.puntosAnio}
              </div>
            </div>
          );
        })}
      </div>
      <GBlock title={vista==="mes"?"Clasificación mensual":"Clasificación anual"}>
        <div style={{display:"flex",justifyContent:"flex-end",padding:"6px 16px",gap:18}}>
          {["PJ","MVP","Pts"].map(k=><span key={k} style={{fontSize:10,fontWeight:600,color:"rgba(255,255,255,0.25)",width:30,textAlign:"center",letterSpacing:0.5}}>{k}</span>)}
        </div>
        {sorted.map((j,i)=>(
          <GRow key={j.id} last={i===sorted.length-1} highlight={j.id===user.id}>
            <span style={{fontWeight:700,fontSize:13,width:24,textAlign:"center",color:i<3?"#c9a84c":"rgba(255,255,255,0.22)"}}>{i<3?["🥇","🥈","🥉"][i]:i+1}</span>
            <Av j={j} size={30}/>
            <div style={{flex:1,marginLeft:10}}>
              <div style={{fontWeight:700,fontSize:14,display:"flex",alignItems:"center",gap:7}}>
                {j.nombre}
                {j.id===user.id&&<span style={{fontSize:9,padding:"1px 7px",borderRadius:4,background:"rgba(201,168,76,0.12)",color:"#c9a84c",border:"1px solid rgba(201,168,76,0.2)",fontWeight:600}}>vos</span>}
              </div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>{j.apodo}</div>
            </div>
            <div style={{display:"flex",gap:6}}>
              {[j.pj,j.mvps].map((v,k)=><div key={k} style={{fontWeight:600,fontSize:15,color:"rgba(255,255,255,0.38)",width:30,textAlign:"center"}}>{v}</div>)}
              <div style={{fontFamily:"'Bebas Neue'",fontSize:22,color:"#c9a84c",width:36,textAlign:"center"}}>{vista==="mes"?j.puntosMes:j.puntosAnio}</div>
            </div>
          </GRow>
        ))}
      </GBlock>
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE: TOP 5
───────────────────────────────────────── */
function PageTop5(){
  const top5=[...STATS_INIT].sort((a,b)=>b.puntosMes-a.puntosMes).slice(0,5);
  return(
    <div className="fade-up">
      <div style={{textAlign:"center",marginBottom:18}}>
        <Lbl style={{textAlign:"center",marginBottom:4}}>Semana 4 · Mayo 2025</Lbl>
        <div style={{fontFamily:"'Bebas Neue'",fontSize:38,color:"#fff",letterSpacing:1,lineHeight:1}}>Top 5 Ideal</div>
        <div style={{fontSize:13,fontWeight:500,color:"#c9a84c",marginTop:4}}>⭐ Al-Koliko FC</div>
      </div>
      <div style={{background:"linear-gradient(180deg,#071a0a,#0a2410,#071a0a)",borderRadius:16,border:"1px solid rgba(34,197,94,0.1)",padding:"28px 16px",marginBottom:14,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",left:"50%",top:0,bottom:0,borderLeft:"1px dashed rgba(255,255,255,0.04)",transform:"translateX(-50%)"}}/>
        {[[0,2],[2,4],[4,5]].map(([from,to],row)=>(
          <div key={row} style={{display:"flex",justifyContent:"space-around",marginBottom:row<2?28:0,position:"relative",zIndex:1}}>
            {top5.slice(from,to).map((j,idx)=>(
              <div key={j.id} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:7}}>
                <div style={{width:54,height:54,borderRadius:"50%",background:`linear-gradient(135deg,${AV_COLORS[(j.id-1)%AV_COLORS.length][0]},${AV_COLORS[(j.id-1)%AV_COLORS.length][1]})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Outfit'",fontWeight:800,fontSize:22,color:"#fff",border:"2px solid rgba(201,168,76,0.35)",boxShadow:"0 4px 20px rgba(0,0,0,0.4)"}}>{j.nombre[0]}</div>
                <div style={{background:"rgba(3,6,26,0.82)",borderRadius:8,padding:"5px 11px",textAlign:"center",border:"1px solid rgba(30,80,212,0.25)"}}>
                  <div style={{fontWeight:700,fontSize:12}}>{j.nombre}</div>
                  <div style={{fontFamily:"'Bebas Neue'",fontSize:15,color:"#c9a84c"}}>+{PUNTO_POR_RANK[from+idx]} pts</div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <GBlock title="Cómo se suman puntos" gold>
        {top5.map((j,i)=>(
          <GRow key={j.id} last={i===4} highlight={i===0}>
            <span style={{fontWeight:700,fontSize:15,color:"#c9a84c",width:28}}>{i+1}°</span>
            <Av j={j} size={28}/>
            <div style={{flex:1,marginLeft:10}}>
              <div style={{fontWeight:600,fontSize:14}}>{j.nombre}</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>{j.puntosMes} monedas recibidas</div>
            </div>
            <span style={{fontWeight:700,fontSize:12,padding:"4px 10px",borderRadius:7,background:"rgba(30,80,212,0.2)",color:"#7cb9ff",border:"1px solid rgba(30,80,212,0.3)"}}>+{PUNTO_POR_RANK[i]} pts</span>
          </GRow>
        ))}
        <div style={{padding:"13px 16px",textAlign:"center",borderTop:"1px solid rgba(255,255,255,0.05)"}}>
          <span style={{fontFamily:"'Bebas Neue'",fontSize:20,color:"#c9a84c"}}>Si acertás los 5 → 15 pts 🏆</span>
        </div>
      </GBlock>
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE: CARDS
───────────────────────────────────────── */
function PageCards(){
  const [flipped,setFlipped]=useState({});
  const toggle=id=>setFlipped(p=>({...p,[id]:!p[id]}));
  return(
    <div className="fade-up">
      <div style={{textAlign:"center",marginBottom:16}}>
        <Lbl style={{textAlign:"center",marginBottom:4}}>Al-Koliko FC · Temporada 2025</Lbl>
        <div style={{fontFamily:"'Bebas Neue'",fontSize:36,color:"#fff",letterSpacing:1}}>Cards del Grupo</div>
        <div style={{fontSize:12,fontWeight:500,color:"rgba(255,255,255,0.3)",marginTop:2}}>Tocá para ver los stats</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {STATS_INIT.map((j,i)=>{
          const fl=!!flipped[j.id];
          return(
            <div key={j.id} onClick={()=>toggle(j.id)} style={{background:CARD_GRADIENTS[i%CARD_GRADIENTS.length],borderRadius:16,padding:13,cursor:"pointer",border:"1px solid rgba(255,255,255,0.1)",minHeight:185,position:"relative",overflow:"hidden",boxShadow:"0 4px 20px rgba(0,0,0,0.3)"}}>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(255,255,255,0.1) 0%,transparent 55%)",pointerEvents:"none"}}/>
              {!fl?(
                <div style={{position:"relative",zIndex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between"}}>
                    <div style={{fontFamily:"'Bebas Neue'",fontSize:38,color:"rgba(0,0,0,0.18)",lineHeight:1}}>{j.rating}</div>
                    <span style={{fontSize:15}}>🇦🇷</span>
                  </div>
                  <div style={{width:50,height:50,borderRadius:"50%",background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Outfit'",fontWeight:800,fontSize:22,color:"#fff",margin:"5px auto 8px",border:"2px solid rgba(255,255,255,0.28)"}}>{j.nombre[0]}</div>
                  <div style={{background:"rgba(0,0,0,0.42)",borderRadius:9,padding:"7px 8px",textAlign:"center"}}>
                    <div style={{fontWeight:700,fontSize:13}}>{j.nombre}</div>
                    <div style={{fontSize:9,fontWeight:500,opacity:0.55}}>Al-Koliko FC</div>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-around",marginTop:9}}>
                    {[["Goles",j.goles],["Asist",j.asist],["MVPs",j.mvps]].map(([k,v])=>(
                      <div key={k} style={{textAlign:"center"}}>
                        <div style={{fontFamily:"'Bebas Neue'",fontSize:18}}>{v}</div>
                        <div style={{fontSize:8,fontWeight:600,opacity:0.5}}>{k}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ):(
                <div style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",gap:6,height:"100%",justifyContent:"center"}}>
                  <div style={{fontWeight:700,fontSize:14,textAlign:"center",marginBottom:3}}>{j.nombre} · Stats</div>
                  {[["Partidos",j.pj],["Victorias",j.wins],["Rating",j.rating],["Pts mes",j.puntosMes]].map(([k,v])=>(
                    <div key={k} style={{display:"flex",justifyContent:"space-between",background:"rgba(0,0,0,0.28)",borderRadius:7,padding:"5px 9px"}}>
                      <span style={{fontSize:12,fontWeight:500,opacity:0.6}}>{k}</span>
                      <span style={{fontFamily:"'Bebas Neue'",fontSize:16}}>{v}</span>
                    </div>
                  ))}
                  <div style={{fontSize:9,textAlign:"center",opacity:0.35,marginTop:2}}>Tap para volver</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{textAlign:"center",marginTop:14,fontSize:11,fontWeight:500,color:"rgba(255,255,255,0.2)"}}>📸 Selfie al registrarse · Fotos reales próximamente</div>
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE: PREMIOS
───────────────────────────────────────── */
function PagePremios({user,premiosVotos,onPremioVoto}){
  return(
    <div className="fade-up">
      <div style={{textAlign:"center",marginBottom:16}}>
        <Lbl style={{textAlign:"center",marginBottom:4}}>Al-Koliko FC · Temporada 2025</Lbl>
        <div style={{fontFamily:"'Bebas Neue'",fontSize:36,color:"#fff",letterSpacing:1}}>Premios Falopa</div>
        <div style={{fontSize:12,fontWeight:500,color:"rgba(255,255,255,0.3)",marginTop:2}}>Los galardones que importan de verdad</div>
      </div>
      {PREMIOS_DEF.map((p,pi)=>(
        <Card key={pi} style={{background:premiosVotos[pi]!==undefined?"rgba(201,168,76,0.04)":"rgba(255,255,255,0.03)",border:premiosVotos[pi]!==undefined?"1px solid rgba(201,168,76,0.18)":"1px solid rgba(255,255,255,0.07)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            <span style={{fontSize:26}}>{p.emoji}</span>
            <div>
              <div style={{fontWeight:700,fontSize:15}}>{p.titulo}</div>
              <div style={{fontSize:11,fontWeight:400,color:"rgba(255,255,255,0.35)"}}>{p.sub}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:7}}>
            {p.opciones.map((opt,oi)=>{
              const voted=premiosVotos[pi]===oi;
              return<button key={oi} onClick={()=>onPremioVoto(pi,oi)} style={{flex:1,padding:"11px 6px",borderRadius:10,border:voted?"1px solid rgba(201,168,76,0.45)":"1px solid rgba(255,255,255,0.08)",cursor:"pointer",fontFamily:"'Outfit'",fontWeight:600,fontSize:14,background:voted?"linear-gradient(135deg,#c9a84c,#a07828)":"rgba(255,255,255,0.05)",color:voted?"#000":"rgba(255,255,255,0.55)",boxShadow:voted?"0 4px 20px rgba(201,168,76,0.18)":"none",transition:"all 0.2s"}}>{voted?"✓ ":""}{opt}</button>;
            })}
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   PANEL ADMIN
───────────────────────────────────────── */
function AdminPanel({user,partido,onPartidoGuardado,onBack,toast}){
  const [step,setStep]=useState("menu");
  const [jugadoresHoy,setJugadoresHoy]=useState(partido?.jugadores||[]);
  const [equipoA,setEquipoA]=useState(partido?.equipoA||[]);
  const [equipoB,setEquipoB]=useState(partido?.equipoB||[]);
  const [fecha,setFecha]=useState(partido?.fecha||"Viernes 16 Mayo");
  const [hora,setHora]=useState(partido?.hora||"23:00 hs");

  const toggleJ=id=>{
    setJugadoresHoy(prev=>prev.includes(id)?prev.filter(x=>x!==id):prev.length<10?[...prev,id]:prev);
    setEquipoA(p=>p.filter(x=>x!==id));
    setEquipoB(p=>p.filter(x=>x!==id));
  };

  const toggleEq=(id,eq)=>{
    if(eq==="A"){setEquipoA(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);setEquipoB(p=>p.filter(x=>x!==id));}
    else{setEquipoB(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);setEquipoA(p=>p.filter(x=>x!==id));}
  };

  const guardarPartido=async()=>{
    const data={fecha,hora,jugadores:jugadoresHoy,equipoA,equipoB,timestamp:Date.now()};
    await save("partido-actual",data);
    onPartidoGuardado(data);
    toast(`Partido configurado · ${jugadoresHoy.length} jugadores habilitados para votar 🚀`,"success");
    setStep("menu");
  };

  if(step==="menu") return(
    <div className="fade-up" style={{padding:"0 0 10px"}}>
      <div style={{background:"linear-gradient(135deg,#0c1e5c,#112070)",border:"1px solid rgba(30,80,212,0.45)",borderRadius:16,padding:18,marginBottom:14,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-30,right:-30,pointerEvents:"none",opacity:0.14}}><StarballSVG size={160} opacity={1}/></div>
        <div style={{fontSize:11,fontWeight:600,letterSpacing:1.5,color:"#c9a84c",textTransform:"uppercase",marginBottom:6}}>Panel de Administración</div>
        <div style={{fontFamily:"'Bebas Neue'",fontSize:28,color:"#fff",lineHeight:1,marginBottom:4}}>Bienvenido, {user.nombre} 👋</div>
        <div style={{fontSize:13,fontWeight:400,color:"rgba(255,255,255,0.45)"}}>Configurá el partido y gestioná la votación</div>
      </div>
      {[
        {icon:"⚽",title:"Configurar partido",sub:"Jugadores del viernes y equipos",action:()=>setStep("partido")},
        {icon:"🗳️",title:"Gestionar votación",sub:"Abrí, cerrá o revelá resultados",action:()=>setStep("votacion")},
        {icon:"👥",title:"Ver jugadores",sub:"Usuarios registrados y credenciales",action:()=>setStep("jugadores")},
      ].map((item,i)=>(
        <button key={i} onClick={item.action} style={{width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"16px 18px",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:14,marginBottom:10,transition:"all 0.2s"}}>
          <span style={{fontSize:28}}>{item.icon}</span>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'Outfit'",fontWeight:700,fontSize:15,color:"#fff",marginBottom:2}}>{item.title}</div>
            <div style={{fontSize:12,fontWeight:400,color:"rgba(255,255,255,0.35)"}}>{item.sub}</div>
          </div>
          <span style={{color:"rgba(255,255,255,0.25)",fontSize:20}}>›</span>
        </button>
      ))}
      <BtnSec onClick={onBack}>← Volver a la app</BtnSec>
    </div>
  );

  if(step==="partido") return(
    <div className="fade-up">
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
        <button onClick={()=>setStep("menu")} style={{background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.5)",fontSize:22}}>←</button>
        <div>
          <div style={{fontFamily:"'Bebas Neue'",fontSize:24,color:"#fff"}}>Configurar partido</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.35)"}}>Seleccioná hasta 10 jugadores</div>
        </div>
      </div>
      <Card>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <div>
            <Lbl>Fecha</Lbl>
            <input className="ucl-input" value={fecha} onChange={e=>setFecha(e.target.value)} style={{padding:"10px 12px",fontSize:13}}/>
          </div>
          <div>
            <Lbl>Hora</Lbl>
            <input className="ucl-input" value={hora} onChange={e=>setHora(e.target.value)} style={{padding:"10px 12px",fontSize:13}}/>
          </div>
        </div>
      </Card>
      <GBlock title={`Jugadores del viernes (${jugadoresHoy.length}/10)`}>
        {USERS_INIT.map((u,i)=>{
          const sel=jugadoresHoy.includes(u.id);
          return(
            <GRow key={u.id} last={i===USERS_INIT.length-1}>
              <Av j={u} size={32}/>
              <div style={{flex:1,marginLeft:10}}>
                <div style={{fontWeight:600,fontSize:14}}>{u.nombre}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>{u.apodo}</div>
              </div>
              <button onClick={()=>toggleJ(u.id)} style={{padding:"6px 14px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"'Outfit'",fontWeight:600,fontSize:12,background:sel?"linear-gradient(135deg,#1440b8,#2563eb)":"rgba(255,255,255,0.06)",color:sel?"#fff":"rgba(255,255,255,0.4)",border:sel?"1px solid rgba(30,80,212,0.5)":"1px solid rgba(255,255,255,0.1)",transition:"all 0.18s"}}>
                {sel?"✓ Dentro":"+ Agregar"}
              </button>
            </GRow>
          );
        })}
      </GBlock>
      {jugadoresHoy.length>=2&&(
        <Card>
          <Lbl>Armar equipos (opcional)</Lbl>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
            {["A","B"].map(eq=>(
              <div key={eq} style={{background:`rgba(${eq==="A"?"30,80,212":"201,168,76"},0.08)`,border:`1px solid rgba(${eq==="A"?"30,80,212":"201,168,76"},0.2)`,borderRadius:10,padding:10}}>
                <div style={{fontFamily:"'Bebas Neue'",fontSize:18,color:eq==="A"?"#7cb9ff":"#c9a84c",marginBottom:6}}>Equipo {eq}</div>
                {(eq==="A"?equipoA:equipoB).map(id=>{const j=USERS_INIT.find(x=>x.id===id);return j?<div key={id} style={{fontSize:12,fontWeight:600,marginBottom:3,color:"rgba(255,255,255,0.7)"}}>⚽ {j.nombre}</div>:null;})}
                {(eq==="A"?equipoA:equipoB).length===0&&<div style={{fontSize:11,color:"rgba(255,255,255,0.2)"}}>Sin jugadores</div>}
              </div>
            ))}
          </div>
          {USERS_INIT.filter(u=>jugadoresHoy.includes(u.id)).map(j=>(
            <div key={j.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:7}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}><Av j={j} size={24}/><span style={{fontSize:13,fontWeight:600}}>{j.nombre}</span></div>
              <div style={{display:"flex",gap:6}}>
                {["A","B"].map(eq=>(
                  <button key={eq} onClick={()=>toggleEq(j.id,eq)} style={{padding:"4px 14px",borderRadius:7,border:"none",cursor:"pointer",fontFamily:"'Outfit'",fontWeight:700,fontSize:12,background:(eq==="A"?equipoA:equipoB).includes(j.id)?`linear-gradient(135deg,${eq==="A"?"#1440b8,#2563eb":"#a07828,#c9a84c"})`:"rgba(255,255,255,0.06)",color:(eq==="A"?equipoA:equipoB).includes(j.id)?"#fff":"rgba(255,255,255,0.4)",transition:"all 0.15s"}}>{eq}</button>
                ))}
              </div>
            </div>
          ))}
        </Card>
      )}
      <BtnPrimary onClick={guardarPartido} disabled={jugadoresHoy.length<2} style={{marginTop:8}}>
        Confirmar y habilitar votación 🚀
      </BtnPrimary>
    </div>
  );

  if(step==="votacion") return(
    <div className="fade-up">
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
        <button onClick={()=>setStep("menu")} style={{background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.5)",fontSize:22}}>←</button>
        <div><div style={{fontFamily:"'Bebas Neue'",fontSize:24,color:"#fff"}}>Gestionar votación</div><div style={{fontSize:12,color:"rgba(255,255,255,0.35)"}}>Control de la votación semanal</div></div>
      </div>
      <Card style={{background:"rgba(34,197,94,0.05)",border:"1px solid rgba(34,197,94,0.15)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{fontWeight:700,fontSize:15}}>Estado actual</div>
          <span style={{fontSize:11,padding:"3px 10px",borderRadius:99,background:"rgba(34,197,94,0.12)",color:"#4ade80",border:"1px solid rgba(34,197,94,0.2)",fontWeight:600}}>● Abierta</span>
        </div>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:16}}>Cierre automático: Jueves 23:59 o cuando todos voten</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,textAlign:"center"}}>
          {[["Votaron","3"],["Pendientes","7"],["Total","10"]].map(([k,v])=>(
            <div key={k} style={{background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"10px 6px"}}>
              <div style={{fontFamily:"'Bebas Neue'",fontSize:26,color:"#c9a84c"}}>{v}</div>
              <div style={{fontSize:10,fontWeight:600,color:"rgba(255,255,255,0.3)",letterSpacing:1}}>{k}</div>
            </div>
          ))}
        </div>
      </Card>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        <BtnSec onClick={()=>toast("Votación cerrada manualmente","warning")}>🔒 Cerrar votación ahora</BtnSec>
        <BtnPrimary onClick={()=>toast("¡Resultados revelados! El Top 5 de esta semana ya es visible 🎉","success")}>🎉 Revelar resultados</BtnPrimary>
      </div>
    </div>
  );

  if(step==="jugadores") return(
    <div className="fade-up">
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
        <button onClick={()=>setStep("menu")} style={{background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.5)",fontSize:22}}>←</button>
        <div><div style={{fontFamily:"'Bebas Neue'",fontSize:24,color:"#fff"}}>Jugadores registrados</div><div style={{fontSize:12,color:"rgba(255,255,255,0.35)"}}>{USERS_INIT.length} en el sistema</div></div>
      </div>
      <GBlock title={`Jugadores · ${USERS_INIT.length} registrados`}>
        {USERS_INIT.map((u,i)=>(
          <GRow key={u.id} last={i===USERS_INIT.length-1}>
            <Av j={u} size={32}/>
            <div style={{flex:1,marginLeft:10}}>
              <div style={{fontWeight:600,fontSize:14,display:"flex",alignItems:"center",gap:6}}>
                {u.nombre}
                {u.isAdmin&&<span style={{fontSize:9,padding:"1px 7px",borderRadius:4,background:"rgba(201,168,76,0.12)",color:"#c9a84c",border:"1px solid rgba(201,168,76,0.2)",fontWeight:600}}>Admin</span>}
              </div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>{u.apodo} · pass: {u.pass}</div>
            </div>
            <div style={{width:8,height:8,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 6px #22c55e"}}/>
          </GRow>
        ))}
      </GBlock>
    </div>
  );

  return null;
}

/* ─────────────────────────────────────────
   APP ROOT CON ESTADO GLOBAL + PERSISTENCIA
───────────────────────────────────────── */
export default function App() {
  const [loggedUser, setLoggedUser] = useState(null);
  const [tab, setTab] = useState(0);
  const [showAdmin, setShowAdmin] = useState(false);
  const [partido, setPartido] = useState(null);
  const [misVotos, setMisVotos] = useState({});
  const [premiosVotos, setPremiosVotos] = useState({});
  const [hall, setHall] = useState(HALL_INIT);
  const [cargando, setCargando] = useState(false);
  const {show:toast, Toasts} = useToast();

  // Cargar datos persistidos al hacer login
  const handleLogin = async (user) => {
    setCargando(true);
    const p = await load("partido-actual", null);
    const v = await load(`votos-${user.id}-semana4`, {});
    const pv = await load(`premios-${user.id}`, {});
    const h = await load("hall-of-fame", HALL_INIT);
    setPartido(p);
    setMisVotos(v);
    setPremiosVotos(pv);
    setHall(h);
    setLoggedUser(user);
    setCargando(false);

    // Notificación de bienvenida
    setTimeout(() => {
      if (Object.keys(v).length === 0) {
        toast(`¡Hola ${user.nombre}! 🎯 No votaste esta semana aún`, "info");
      } else {
        toast(`Bienvenido de nuevo, ${user.nombre} 👋`, "success");
      }
    }, 600);
  };

  // Calcular horas restantes para el cierre (simulado: cierra el próximo jueves)
  const horasRestantes = () => {
    const now = new Date();
    const next = new Date();
    const dayOfWeek = now.getDay();
    const daysToThursday = (4 - dayOfWeek + 7) % 7 || 7;
    next.setDate(now.getDate() + daysToThursday);
    next.setHours(23,59,0,0);
    return Math.max(0, Math.floor((next-now)/3600000));
  };

  const handleVotosGuardados = (v) => setMisVotos(v);

  const handlePremioVoto = async (pi, oi) => {
    const updated = {...premiosVotos, [pi]:oi};
    setPremiosVotos(updated);
    await save(`premios-${loggedUser.id}`, updated);
    toast("Voto registrado 🎭","success");
  };

  const handlePartidoGuardado = (p) => setPartido(p);

  const handleLogout = () => {
    setLoggedUser(null);
    setTab(0);
    setShowAdmin(false);
    setPartido(null);
    setMisVotos({});
    setPremiosVotos({});
  };

  const votoPendiente = loggedUser && Object.keys(misVotos).length === 0;

  // Pantalla de carga
  if(cargando) return (
    <>
      <style>{CSS}</style>
      <div style={{minHeight:"100dvh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}>
        <div className="rotate-slow"><StarballSVG size={120} opacity={0.4}/></div>
        <div style={{fontFamily:"'Outfit'",fontWeight:600,fontSize:14,color:"rgba(255,255,255,0.4)"}}>Cargando...</div>
      </div>
    </>
  );

  if(!loggedUser) return (
    <>
      <style>{CSS}</style>
      <Toasts/>
      <div style={{maxWidth:520,margin:"0 auto"}}>
        <LoginScreen onLogin={handleLogin}/>
      </div>
    </>
  );

  const PAGES = [
    <PageInicio user={loggedUser} partido={partido} hall={hall} onVotar={()=>setTab(1)}/>,
    <PageVotar user={loggedUser} partido={partido} misVotos={misVotos} onVotosGuardados={handleVotosGuardados} toast={toast}/>,
    <PageTabla user={loggedUser}/>,
    <PageTop5/>,
    <PageCards/>,
    <PagePremios user={loggedUser} premiosVotos={premiosVotos} onPremioVoto={handlePremioVoto}/>,
  ];

  return (
    <>
      <style>{CSS}</style>
      <Toasts/>
      <div style={{maxWidth:520,margin:"0 auto",minHeight:"100dvh",position:"relative"}}>
        <Header user={loggedUser} onAdmin={()=>setShowAdmin(true)} onLogout={handleLogout}/>
        <div style={{padding:"14px 14px 82px",position:"relative",zIndex:1}}>
          {showAdmin
            ? <AdminPanel user={loggedUser} partido={partido} onPartidoGuardado={handlePartidoGuardado} onBack={()=>setShowAdmin(false)} toast={toast}/>
            : (
              <>
                {/* Banner de cierre si quedan menos de 24h */}
                {!showAdmin && tab!==1 && votoPendiente && (
                  <ClosingBanner horasRestantes={horasRestantes()} onVotar={()=>setTab(1)}/>
                )}
                {PAGES[tab]}
              </>
            )
          }
        </div>
        {!showAdmin&&<NavBottom active={tab} onChange={setTab} votoPendiente={votoPendiente}/>}
      </div>
    </>
  );
}
