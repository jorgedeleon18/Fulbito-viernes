import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";

// ─── CONSTANTES ─────────────────────────────────────────────────────────────
const EQUIPOS_ARG = [
  "River Plate","Boca Juniors","Racing Club","Independiente","San Lorenzo",
  "Huracán","Vélez Sársfield","Estudiantes","Gimnasia LP","Lanús",
  "Banfield","Arsenal","Belgrano","Talleres","Godoy Cruz",
  "Colón","Newell's","Rosario Central","Tigre","Defensa y Justicia",
  "Platense","Sarmiento","Central Córdoba","Barracas Central","Instituto",
  "Riestra","Atlético Tucumán","San Martín Tucumán","Aldosivi","Quilmes"
];

const LIGAS_EU = ["Premier League","La Liga","Serie A","Bundesliga","Ligue 1","Eredivisie","Primeira Liga"];

const EQUIPOS_EU = {
  "Premier League": ["Manchester City","Arsenal","Liverpool","Chelsea","Manchester United","Tottenham","Newcastle","Aston Villa","West Ham","Brighton"],
  "La Liga": ["Real Madrid","Barcelona","Atlético Madrid","Sevilla","Villarreal","Athletic Club","Real Sociedad","Valencia","Betis","Celta"],
  "Serie A": ["Inter","Juventus","Milan","Napoli","Roma","Lazio","Atalanta","Fiorentina","Torino","Bologna"],
  "Bundesliga": ["Bayern Munich","Borussia Dortmund","Bayer Leverkusen","RB Leipzig","Eintracht Frankfurt","Wolfsburg","Friburgo","Mönchengladbach"],
  "Ligue 1": ["PSG","Marseille","Lyon","Monaco","Lille","Nice","Rennes","Lens"],
  "Eredivisie": ["Ajax","PSV","Feyenoord","AZ Alkmaar","Utrecht","Twente"],
  "Primeira Liga": ["Benfica","Porto","Sporting CP","Braga","Guimarães","Vitória"]
};

// ─── SVG FIGURITA ────────────────────────────────────────────────────────────
function FiguritaSVG({ jugador, size = 200 }) {
  const { rareza = "bronce", nombre = "", apellido = "", posicion = "DEL",
    numero = "10", velocidad = 70, pase = 70, defensa = 60,
    tiro = 75, tecnica = 72, resistencia = 68, foto_url } = jugador || {};

  const stats = [velocidad, pase, defensa, tiro, tecnica, resistencia];
  const media = Math.round(stats.reduce((a, b) => a + b, 0) / stats.length);

  const gradients = {
    oro: ["#F6D365","#FDA085","#F6D365"],
    plata: ["#C0C0C0","#E8E8E8","#A8A8A8"],
    bronce: ["#CD7F32","#E8A87C","#B8621A"],
  };
  const g = gradients[rareza] || gradients.bronce;
  const abrev = posicion?.substring(0, 3).toUpperCase() || "DEL";
  const initiales = `${nombre?.[0] || ""}${apellido?.[0] || ""}`.toUpperCase();

  return (
    <svg viewBox="0 0 200 280" width={size} height={size * 1.4} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`grad-${jugador?.id || "x"}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={g[0]} />
          <stop offset="50%" stopColor={g[1]} />
          <stop offset="100%" stopColor={g[2]} />
        </linearGradient>
        <filter id="shadow"><feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.3"/></filter>
        <clipPath id={`clip-${jugador?.id || "x"}`}><rect x="25" y="60" width="150" height="110" rx="8"/></clipPath>
      </defs>
      {/* Card base */}
      <rect x="5" y="5" width="190" height="270" rx="14" fill={`url(#grad-${jugador?.id || "x"})`} filter="url(#shadow)"/>
      <rect x="10" y="10" width="180" height="260" rx="12" fill="rgba(0,0,0,0.18)"/>
      {/* Header: número + posición */}
      <text x="20" y="48" fontFamily="Arial Black" fontWeight="900" fontSize="28" fill="white" opacity="0.95">{numero}</text>
      <text x="160" y="35" fontFamily="Arial" fontWeight="700" fontSize="11" fill="white" textAnchor="middle">{abrev}</text>
      <text x="160" y="50" fontFamily="Arial" fontSize="12" fill="white" textAnchor="middle">🇦🇷</text>
      {/* Foto o iniciales */}
      <rect x="25" y="60" width="150" height="110" rx="8" fill="rgba(0,0,0,0.3)"/>
      {foto_url
        ? <image href={foto_url} x="25" y="60" width="150" height="110" clipPath={`url(#clip-${jugador?.id || "x"})`} preserveAspectRatio="xMidYMid slice"/>
        : <text x="100" y="127" fontFamily="Arial Black" fontSize="44" fill="white" textAnchor="middle" opacity="0.85">{initiales}</text>
      }
      {/* Media */}
      <rect x="70" y="178" width="60" height="24" rx="6" fill="rgba(0,0,0,0.5)"/>
      <text x="100" y="195" fontFamily="Arial Black" fontSize="16" fontWeight="900" fill="white" textAnchor="middle">{media}</text>
      {/* Nombre */}
      <text x="100" y="218" fontFamily="Arial Black" fontSize="13" fontWeight="900" fill="white" textAnchor="middle" letterSpacing="1">
        {(apellido || "").toUpperCase()}
      </text>
      {/* Stats */}
      {[["VEL",velocidad],["PAS",pase],["DEF",defensa],["TIR",tiro],["TEC",tecnica],["RES",resistencia]].map(([k,v],i) => {
        const col = i < 3 ? 0 : 1;
        const row = i % 3;
        const x = col === 0 ? 30 : 110;
        const y = 238 + row * 13;
        return (
          <g key={k}>
            <text x={x} y={y} fontFamily="Arial" fontWeight="700" fontSize="9" fill="rgba(255,255,255,0.8)">{k}</text>
            <text x={x+28} y={y} fontFamily="Arial Black" fontSize="9" fill="white" fontWeight="900">{v}</text>
          </g>
        );
      })}
      {/* Club */}
      <text x="100" y="277" fontFamily="Arial" fontSize="8" fill="rgba(255,255,255,0.7)" textAnchor="middle">Al-Koliko FC</text>
    </svg>
  );
}

// ─── CANCHA SVG (para 5 Ideal) ───────────────────────────────────────────────
function CanchaFormacion({ jugadores5 }) {
  const posiciones = [
    { x: 160, y: 260 }, // base
    { x: 80, y: 180 }, { x: 240, y: 180 }, // 2 medios
    { x: 80, y: 80 }, { x: 240, y: 80 },  // 2 delanteros
  ];
  return (
    <svg viewBox="0 0 320 320" width="100%" style={{ maxWidth: 340 }} xmlns="http://www.w3.org/2000/svg">
      {/* Cancha */}
      <rect width="320" height="320" rx="12" fill="#2d8a4e"/>
      <rect x="10" y="10" width="300" height="300" rx="10" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
      <line x1="10" y1="160" x2="310" y2="160" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
      <circle cx="160" cy="160" r="40" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
      <circle cx="160" cy="160" r="3" fill="rgba(255,255,255,0.6)"/>
      <rect x="110" y="10" width="100" height="45" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
      <rect x="110" y="265" width="100" height="45" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
      {posiciones.map((pos, i) => {
        const j = jugadores5[i];
        if (!j) return null;
        return (
          <g key={j.id || i} transform={`translate(${pos.x},${pos.y})`}>
            <circle r="24" fill={j.rareza === "oro" ? "#F6D365" : j.rareza === "plata" ? "#C0C0C0" : "#CD7F32"} opacity="0.95"/>
            {j.foto_url
              ? <image href={j.foto_url} x="-20" y="-20" width="40" height="40" clipPath="url(#circ)"/>
              : <text y="6" textAnchor="middle" fontFamily="Arial Black" fontSize="13" fill="white" fontWeight="900">
                  {(j.nombre?.[0]||"")+(j.apellido?.[0]||"")}
                </text>
            }
            <text y="36" textAnchor="middle" fontFamily="Arial Black" fontSize="9" fill="white" fontWeight="700">
              {j.apellido?.substring(0,8)?.toUpperCase() || ""}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── APP PRINCIPAL ───────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [jugadores, setJugadores] = useState([]);
  const [partido, setPartido] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [likes, setLikes] = useState([]);
  const [votos, setVotos] = useState([]);
  const [tab, setTab] = useState("inicio");
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState("login");

  // Modales y UI
  const [selectedJugador, setSelectedJugador] = useState(null);
  const [showEditPerfil, setShowEditPerfil] = useState(false);
  const [showVotacion, setShowVotacion] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showCardModal, setShowCardModal] = useState(null);
  const [tabTemporada, setTabTemporada] = useState("equipos");
  const [tabRanking, setTabRanking] = useState("mes");
  const [tab5Ideal, setTab5Ideal] = useState("mes");
  // ← MOVIDO AQUÍ: no puede estar después de un return condicional
  const [asistenciaRespondida, setAsistenciaRespondida] = useState(false);

  // ── AUTH ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) loadUserProfile(session.user.id);
      else setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) loadUserProfile(session.user.id);
      else { setUser(null); setLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function loadUserProfile(uid) {
    const { data } = await supabase.from("jugadores").select("*").eq("id", uid).single();
    if (data) setUser(data);
    setLoading(false);
  }

  useEffect(() => {
    if (!user) return;
    fetchAll();
  }, [user]);

  // Sincronizar asistenciaRespondida cuando carga el partido
  useEffect(() => {
    if (!partido || !user) return;
    const yaConfirmo = (partido.confirmados || []).includes(user.id);
    const yaRechazo = (partido.rechazados || []).includes(user.id);
    if (yaConfirmo || yaRechazo) setAsistenciaRespondida(true);
  }, [partido?.id]);

  async function fetchAll() {
    const [{ data: js }, { data: ps }, { data: cs }, { data: ls }, { data: pt }, { data: vs }] = await Promise.all([
      supabase.from("jugadores").select("*"),
      supabase.from("posts").select("*").order("created_at", { ascending: false }),
      supabase.from("comentarios").select("*"),
      supabase.from("likes").select("*"),
      supabase.from("partidos").select("*").order("created_at", { ascending: false }).limit(10),
      supabase.from("votos").select("*"),
    ]);
    if (js) setJugadores(js);
    if (ps) setPosts(ps);
    if (cs) setComentarios(cs);
    if (ls) setLikes(ls);
    if (pt) setPartido(pt[0] || null);
    if (vs) setVotos(vs);
  }

  // ── LOGIN / REGISTRO ──────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#0f172a" }}>
      <div style={{ color:"#4ade80", fontSize:18, fontFamily:"sans-serif" }}>⚽ Cargando...</div>
    </div>
  );

  if (!user) return <AuthScreen authMode={authMode} setAuthMode={setAuthMode} onLogin={loadUserProfile} jugadores={jugadores} />;

  const jugadorActual = jugadores.find(j => j.id === user.id) || user;
  const isAdmin = jugadorActual?.is_admin;

  // ── CONFIRMACIÓN ASISTENCIA ───────────────────────────────────────────────
  const confirmados = partido?.confirmados || [];
  const yoConfirme = confirmados.includes(user?.id || "");

  async function confirmarAsistencia(si) {
    if (!partido) return;
    let nuevosConfirmados = [...confirmados];
    let nuevosRechazados = [...(partido.rechazados || [])];
    if (si) {
      if (!nuevosConfirmados.includes(user.id)) nuevosConfirmados.push(user.id);
      nuevosRechazados = nuevosRechazados.filter(id => id !== user.id);
    } else {
      nuevosRechazados = [...new Set([...nuevosRechazados, user.id])];
      nuevosConfirmados = nuevosConfirmados.filter(id => id !== user.id);
    }
    await supabase.from("partidos").update({
      confirmados: nuevosConfirmados,
      rechazados: nuevosRechazados
    }).eq("id", partido.id);
    setPartido(prev => ({ ...prev, confirmados: nuevosConfirmados, rechazados: nuevosRechazados }));
    setAsistenciaRespondida(true);
  }

  // ── LOGOUT ────────────────────────────────────────────────────────────────
  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <div style={{ minHeight:"100vh", background:"#0f172a", color:"white", fontFamily:"'Segoe UI',sans-serif", maxWidth:480, margin:"0 auto", position:"relative" }}>
      <Header
        user={jugadorActual}
        isAdmin={isAdmin}
        onEditPerfil={() => setShowEditPerfil(true)}
        onLogout={handleLogout}
        onAdminPanel={() => setShowAdminPanel(true)}
      />

      {/* NAV TABS */}
      <nav style={{ display:"flex", background:"#1e293b", borderBottom:"2px solid #334155", position:"sticky", top:56, zIndex:10 }}>
        {[["inicio","🏠"],["temporada","📊"],["5ideal","⭐"],["feed","📱"],["cards","🎴"]].map(([key, icon]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            flex:1, padding:"10px 0", background:"none", border:"none", color: tab===key ? "#4ade80" : "#94a3b8",
            borderBottom: tab===key ? "2px solid #4ade80" : "2px solid transparent",
            fontWeight: tab===key ? 700 : 400, fontSize:11, cursor:"pointer",
            transition:"all 0.2s", display:"flex", flexDirection:"column", alignItems:"center", gap:2
          }}>
            <span style={{ fontSize:18 }}>{icon}</span>
            <span>{key === "5ideal" ? "5 Ideal" : key.charAt(0).toUpperCase()+key.slice(1)}</span>
          </button>
        ))}
      </nav>

      {/* CONTENIDO */}
      <div style={{ paddingBottom:20 }}>
        {tab === "inicio" && (
          <PantallaInicio
            partido={partido}
            jugadores={jugadores}
            user={user}
            jugadorActual={jugadorActual}
            yoConfirme={yoConfirme}
            asistenciaRespondida={asistenciaRespondida}
            onConfirmar={confirmarAsistencia}
            onVotar={() => { setTab("temporada"); setTabTemporada("equipos"); }}
            votos={votos}
          />
        )}
        {tab === "temporada" && (
          <PantallaTemporada
            jugadores={jugadores}
            user={user}
            partido={partido}
            votos={votos}
            onVotar={(p) => { setShowVotacion(p); }}
            tabTemporada={tabTemporada}
            setTabTemporada={setTabTemporada}
            tabRanking={tabRanking}
            setTabRanking={setTabRanking}
            onSelectJugador={setSelectedJugador}
          />
        )}
        {tab === "5ideal" && (
          <Pantalla5Ideal
            jugadores={jugadores}
            votos={votos}
            user={user}
            isAdmin={isAdmin}
            tab5Ideal={tab5Ideal}
            setTab5Ideal={setTab5Ideal}
            onCardClick={setShowCardModal}
          />
        )}
        {tab === "feed" && (
          <PantallaFeed
            posts={posts}
            setPosts={setPosts}
            jugadores={jugadores}
            comentarios={comentarios}
            setComentarios={setComentarios}
            likes={likes}
            setLikes={setLikes}
            user={user}
          />
        )}
        {tab === "cards" && (
          <PantallaCards
            jugadores={jugadores}
            isAdmin={isAdmin}
            onCardClick={setShowCardModal}
          />
        )}
      </div>

      {/* MODALES */}
      {showEditPerfil && (
        <ModalEditarPerfil
          user={jugadorActual}
          onClose={() => setShowEditPerfil(false)}
          onSave={async (datos) => {
            await supabase.from("jugadores").update(datos).eq("id", user.id);
            setUser(prev => ({ ...prev, ...datos }));
            setJugadores(prev => prev.map(j => j.id === user.id ? { ...j, ...datos } : j));
            setShowEditPerfil(false);
          }}
        />
      )}

      {showVotacion && (
        <ModalVotacion
          partido={showVotacion}
          jugadores={jugadores}
          user={user}
          votos={votos}
          onClose={() => setShowVotacion(false)}
          onVotar={async (misVotos) => {
            // Eliminar votos previos del usuario en este partido
            await supabase.from("votos").delete()
              .eq("partido_id", showVotacion.id)
              .eq("votante_id", user.id);
            // Insertar nuevos
            const rows = Object.entries(misVotos)
              .filter(([,m]) => m > 0)
              .map(([votado_id, monedas]) => ({
                partido_id: showVotacion.id,
                votante_id: user.id,
                votado_id,
                monedas
              }));
            if (rows.length > 0) await supabase.from("votos").insert(rows);
            const { data: vs } = await supabase.from("votos").select("*");
            if (vs) setVotos(vs);
            setShowVotacion(false);
          }}
        />
      )}

      {selectedJugador && (
        <ModalJugador
          jugador={selectedJugador}
          isAdmin={isAdmin}
          onClose={() => setSelectedJugador(null)}
          onSave={async (datos) => {
            await supabase.from("jugadores").update(datos).eq("id", selectedJugador.id);
            setJugadores(prev => prev.map(j => j.id === selectedJugador.id ? { ...j, ...datos } : j));
            setSelectedJugador(prev => ({ ...prev, ...datos }));
          }}
        />
      )}

      {showCardModal && (
        <ModalCardFullscreen
          jugador={showCardModal}
          isAdmin={isAdmin}
          onClose={() => setShowCardModal(null)}
          onSave={async (datos) => {
            await supabase.from("jugadores").update(datos).eq("id", showCardModal.id);
            setJugadores(prev => prev.map(j => j.id === showCardModal.id ? { ...j, ...datos } : j));
            setShowCardModal(prev => ({ ...prev, ...datos }));
          }}
        />
      )}

      {showAdminPanel && (
        <AdminPanel
          jugadores={jugadores}
          partido={partido}
          onClose={() => setShowAdminPanel(false)}
          onPartidoSave={async (datos) => {
            if (partido?.id) {
              await supabase.from("partidos").update(datos).eq("id", partido.id);
              setPartido(prev => ({ ...prev, ...datos }));
            } else {
              const { data } = await supabase.from("partidos").insert({ ...datos, confirmados: [] }).select().single();
              if (data) setPartido(data);
            }
            setShowAdminPanel(false);
          }}
        />
      )}
    </div>
  );
}

// ─── AUTH SCREEN ─────────────────────────────────────────────────────────────
function AuthScreen({ authMode, setAuthMode, onLogin }) {
  const [form, setForm] = useState({ email:"", password:"", nombre:"", apellido:"", apodo:"", fecha_nac:"", posicion:"Delantero", pierna:"Derecha", ciudad:"", nivel:"Intermedio" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true); setError("");
    const { data, error: err } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
    if (err) setError("Email o contraseña incorrectos");
    else if (data?.user) onLogin(data.user.id);
    setLoading(false);
  }

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true); setError("");
    const { data, error: err } = await supabase.auth.signUp({ email: form.email, password: form.password });
    if (err) { setError(err.message); setLoading(false); return; }
    if (data?.user) {
      await supabase.from("jugadores").insert({
        id: data.user.id,
        nombre: form.nombre, apellido: form.apellido, apodo: form.apodo,
        email: form.email, fecha_nac: form.fecha_nac,
        posicion: form.posicion, pierna: form.pierna, ciudad: form.ciudad,
        nivel: form.nivel, is_admin: false, rareza: "bronce",
        velocidad:65, pase:65, defensa:55, tiro:65, tecnica:63, resistencia:62,
        pj:0, mvps:0, goles:0, asist:0, puntos_mes:0, puntos_anio:0, numero:10, color:"#4ade80"
      });
      onLogin(data.user.id);
    }
    setLoading(false);
  }

  const inp = { background:"#1e293b", border:"1px solid #334155", borderRadius:8, padding:"10px 14px", color:"white", fontSize:14, width:"100%", boxSizing:"border-box" };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#0f172a 0%,#1e3a2f 100%)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:"rgba(30,41,59,0.95)", borderRadius:20, padding:32, width:"100%", maxWidth:380, boxShadow:"0 25px 50px rgba(0,0,0,0.5)" }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:48 }}>⚽</div>
          <div style={{ fontSize:22, fontWeight:900, color:"#4ade80", letterSpacing:1 }}>Al-Koliko FC</div>
          <div style={{ color:"#64748b", fontSize:13 }}>El Fulbito de los Viernes</div>
        </div>

        {error && <div style={{ background:"#ef444420", border:"1px solid #ef4444", borderRadius:8, padding:"8px 12px", marginBottom:16, color:"#fca5a5", fontSize:13 }}>{error}</div>}

        <form onSubmit={authMode === "login" ? handleLogin : handleRegister} style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <input style={inp} type="email" placeholder="Email" value={form.email} onChange={e => setForm(p=>({...p,email:e.target.value}))} required />
          <input style={inp} type="password" placeholder="Contraseña" value={form.password} onChange={e => setForm(p=>({...p,password:e.target.value}))} required />

          {authMode === "register" && <>
            <input style={inp} placeholder="Nombre" value={form.nombre} onChange={e => setForm(p=>({...p,nombre:e.target.value}))} required />
            <input style={inp} placeholder="Apellido" value={form.apellido} onChange={e => setForm(p=>({...p,apellido:e.target.value}))} required />
            <input style={inp} placeholder="Apodo futbolero" value={form.apodo} onChange={e => setForm(p=>({...p,apodo:e.target.value}))} />
            <input style={inp} type="date" placeholder="Fecha de nacimiento" value={form.fecha_nac} onChange={e => setForm(p=>({...p,fecha_nac:e.target.value}))} />
            <select style={inp} value={form.posicion} onChange={e => setForm(p=>({...p,posicion:e.target.value}))}>
              {["Arquero","Defensor","Lateral","Mediocampista","Volante","Extremo","Delantero"].map(p => <option key={p}>{p}</option>)}
            </select>
            <select style={inp} value={form.pierna} onChange={e => setForm(p=>({...p,pierna:e.target.value}))}>
              {["Derecha","Izquierda","Ambas"].map(p => <option key={p}>{p}</option>)}
            </select>
            <input style={inp} placeholder="Barrio / Ciudad" value={form.ciudad} onChange={e => setForm(p=>({...p,ciudad:e.target.value}))} />
            <select style={inp} value={form.nivel} onChange={e => setForm(p=>({...p,nivel:e.target.value}))}>
              {["Principiante","Intermedio","Avanzado","Semiprofesional"].map(p => <option key={p}>{p}</option>)}
            </select>
          </>}

          <button type="submit" disabled={loading} style={{ background:"#4ade80", color:"#0f172a", border:"none", borderRadius:10, padding:"13px", fontWeight:900, fontSize:15, cursor:"pointer", marginTop:4 }}>
            {loading ? "..." : authMode === "login" ? "Entrar ⚽" : "Registrarme"}
          </button>
        </form>

        <div style={{ textAlign:"center", marginTop:16, color:"#64748b", fontSize:13 }}>
          {authMode === "login" ? "¿No tenés cuenta?" : "¿Ya tenés cuenta?"}
          <button onClick={() => setAuthMode(authMode === "login" ? "register" : "login")} style={{ background:"none", border:"none", color:"#4ade80", cursor:"pointer", fontWeight:700, marginLeft:6 }}>
            {authMode === "login" ? "Registrate" : "Iniciá sesión"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── HEADER ──────────────────────────────────────────────────────────────────
function Header({ user, isAdmin, onEditPerfil, onLogout, onAdminPanel }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const initials = `${user?.nombre?.[0]||""}${user?.apellido?.[0]||""}`.toUpperCase();

  return (
    <header style={{ background:"#1e293b", padding:"0 16px", height:56, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:20, borderBottom:"1px solid #334155" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <span style={{ fontSize:24 }}>⚽</span>
        <div>
          <div style={{ fontWeight:900, fontSize:15, color:"#4ade80", lineHeight:1 }}>Al-Koliko FC</div>
          <div style={{ fontSize:10, color:"#64748b" }}>El Fulbito de los Viernes</div>
        </div>
      </div>
      <div style={{ position:"relative" }}>
        <button onClick={() => setMenuOpen(v => !v)} style={{
          width:38, height:38, borderRadius:"50%", background: user?.color || "#4ade80",
          border:"2px solid #334155", cursor:"pointer", display:"flex", alignItems:"center",
          justifyContent:"center", fontWeight:900, fontSize:14, color:"#0f172a"
        }}>
          {user?.foto_url ? <img src={user.foto_url} style={{ width:38,height:38,borderRadius:"50%",objectFit:"cover" }} /> : initials}
        </button>
        {menuOpen && (
          <div style={{ position:"absolute", right:0, top:44, background:"#1e293b", border:"1px solid #334155", borderRadius:12, minWidth:180, zIndex:100, boxShadow:"0 10px 30px rgba(0,0,0,0.4)", overflow:"hidden" }}>
            <div style={{ padding:"12px 16px", borderBottom:"1px solid #334155" }}>
              <div style={{ fontWeight:700, fontSize:14 }}>{user?.nombre} {user?.apellido}</div>
              <div style={{ color:"#64748b", fontSize:12 }}>{user?.apodo || ""}</div>
            </div>
            {[
              ["✏️ Editar perfil", onEditPerfil],
              ...(isAdmin ? [["⚙️ Panel admin", onAdminPanel]] : []),
              ["🚪 Cerrar sesión", onLogout],
            ].map(([label, fn]) => (
              <button key={label} onClick={() => { fn(); setMenuOpen(false); }} style={{
                width:"100%", padding:"12px 16px", background:"none", border:"none", color:"white",
                textAlign:"left", cursor:"pointer", fontSize:13, transition:"background 0.15s"
              }} onMouseEnter={e=>e.target.style.background="#334155"} onMouseLeave={e=>e.target.style.background="none"}>
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

// ─── PANTALLA INICIO ──────────────────────────────────────────────────────────
function PantallaInicio({ partido, jugadores, user, jugadorActual, yoConfirme, asistenciaRespondida, onConfirmar, onVotar, votos }) {
  const confirmados = partido?.confirmados || [];
  const confirmadosJugadores = jugadores.filter(j => confirmados.includes(j.id));

  // Votación pendiente: hay un partido, está habilitada la votación y el usuario aún no votó
  const votacionHabilitada = partido && partido.votacion_activa;
  const yoVote = votos.some(v => v.partido_id === partido?.id && v.votante_id === user.id);

  return (
    <div style={{ padding:16, display:"flex", flexDirection:"column", gap:16 }}>
      {/* BANNER PARTIDO */}
      {partido ? (
        <div style={{ background:"linear-gradient(135deg,#1e3a2f,#0f2d1f)", borderRadius:16, padding:20, border:"1px solid #2d6a4f" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <div style={{ color:"#4ade80", fontWeight:900, fontSize:18, marginBottom:4 }}>⚽ Próximo Partido</div>
              <div style={{ color:"white", fontWeight:700, fontSize:15 }}>{partido.fecha} · {partido.hora}hs</div>
              <div style={{ color:"#94a3b8", fontSize:13, marginTop:4 }}>{partido.cancha}</div>
            </div>
            <div style={{ background:"#4ade8020", border:"1px solid #4ade80", borderRadius:10, padding:"6px 12px", textAlign:"center" }}>
              <div style={{ color:"#4ade80", fontWeight:900, fontSize:20 }}>{confirmados.length}</div>
              <div style={{ color:"#4ade80", fontSize:10 }}>confirmados</div>
            </div>
          </div>

          {/* AVATARES CONFIRMADOS */}
          {confirmadosJugadores.length > 0 && (
            <div style={{ display:"flex", gap:6, marginTop:14, flexWrap:"wrap" }}>
              {confirmadosJugadores.map(j => (
                <div key={j.id} title={j.nombre} style={{
                  width:36, height:36, borderRadius:"50%", background: j.color || "#4ade80",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontWeight:900, fontSize:12, color:"#0f172a", border:"2px solid #2d6a4f"
                }}>
                  {j.foto_url ? <img src={j.foto_url} style={{ width:36,height:36,borderRadius:"50%",objectFit:"cover" }} /> : `${j.nombre?.[0]||""}${j.apellido?.[0]||""}`}
                </div>
              ))}
            </div>
          )}

          {/* CONFIRMAR ASISTENCIA */}
          {!asistenciaRespondida && (
            <div style={{ marginTop:16, background:"rgba(0,0,0,0.3)", borderRadius:12, padding:14 }}>
              <div style={{ color:"white", fontWeight:700, marginBottom:10, fontSize:14 }}>¿Llegás el viernes? 🤔</div>
              <div style={{ display:"flex", gap:10 }}>
                <button onClick={() => onConfirmar(true)} style={{ flex:1, background:"#4ade80", color:"#0f172a", border:"none", borderRadius:10, padding:11, fontWeight:900, cursor:"pointer", fontSize:14 }}>
                  ✅ ¡Voy!
                </button>
                <button onClick={() => onConfirmar(false)} style={{ flex:1, background:"#ef4444", color:"white", border:"none", borderRadius:10, padding:11, fontWeight:700, cursor:"pointer", fontSize:14 }}>
                  ❌ No puedo
                </button>
              </div>
            </div>
          )}
          {asistenciaRespondida && yoConfirme && (
            <div style={{ marginTop:12, background:"#4ade8020", borderRadius:10, padding:"8px 14px", color:"#4ade80", fontSize:13, fontWeight:700 }}>
              ✅ Confirmado — ¡nos vemos el viernes!
            </div>
          )}
          {asistenciaRespondida && !yoConfirme && (
            <div style={{ marginTop:12, background:"#ef444420", borderRadius:10, padding:"8px 14px", color:"#fca5a5", fontSize:13 }}>
              ❌ No confirmaste para este partido
            </div>
          )}
        </div>
      ) : (
        <div style={{ background:"#1e293b", borderRadius:16, padding:20, textAlign:"center", color:"#64748b" }}>
          <div style={{ fontSize:32 }}>📅</div>
          <div>No hay partido programado aún</div>
        </div>
      )}

      {/* ALERTA VOTACIÓN */}
      {votacionHabilitada && !yoVote && (
        <div style={{ background:"linear-gradient(135deg,#7c3aed,#5b21b6)", borderRadius:16, padding:16, display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ fontSize:28 }}>🪙</div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:900, fontSize:15 }}>¡Votación activa!</div>
            <div style={{ color:"rgba(255,255,255,0.8)", fontSize:12 }}>Tenés 10 monedas para repartir</div>
          </div>
          <button onClick={onVotar} style={{ background:"white", color:"#7c3aed", border:"none", borderRadius:10, padding:"9px 14px", fontWeight:900, cursor:"pointer", fontSize:13 }}>
            Votar →
          </button>
        </div>
      )}

      {/* CLUBS FAVORITOS */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <div style={{ background:"#1e293b", borderRadius:14, padding:14 }}>
          <div style={{ color:"#64748b", fontSize:11, marginBottom:6 }}>🇦🇷 Club argentino</div>
          <div style={{ fontWeight:700, fontSize:14 }}>{jugadorActual?.equipo_arg || "Sin definir"}</div>
        </div>
        <div style={{ background:"#1e293b", borderRadius:14, padding:14 }}>
          <div style={{ color:"#64748b", fontSize:11, marginBottom:6 }}>🌍 Club europeo</div>
          <div style={{ fontWeight:700, fontSize:14 }}>{jugadorActual?.equipo_eu || "Sin definir"}</div>
        </div>
      </div>

      {/* STATS PERSONALES */}
      <div style={{ background:"#1e293b", borderRadius:16, padding:16 }}>
        <div style={{ fontWeight:700, marginBottom:12, color:"#4ade80" }}>📊 Mis stats</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
          {[["PJ", jugadorActual?.pj||0],["Goles",jugadorActual?.goles||0],["Asist.",jugadorActual?.asist||0],["MVPs",jugadorActual?.mvps||0]].map(([k,v]) => (
            <div key={k} style={{ textAlign:"center" }}>
              <div style={{ fontWeight:900, fontSize:22, color:"#4ade80" }}>{v}</div>
              <div style={{ color:"#64748b", fontSize:11 }}>{k}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PANTALLA TEMPORADA ───────────────────────────────────────────────────────
function PantallaTemporada({ jugadores, user, partido, votos, onVotar, tabTemporada, setTabTemporada, tabRanking, setTabRanking, onSelectJugador }) {
  const sorted = [...jugadores].sort((a,b) => (b.puntos_mes||0) - (a.puntos_mes||0));

  return (
    <div style={{ padding:16 }}>
      {/* Tabs principales */}
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        {[["jugadores","👥 Jugadores"],["equipos","🏆 Equipos"]].map(([key,label]) => (
          <button key={key} onClick={() => setTabTemporada(key)} style={{
            flex:1, padding:"9px 0", borderRadius:10, border:"none",
            background: tabTemporada===key ? "#4ade80" : "#1e293b",
            color: tabTemporada===key ? "#0f172a" : "#94a3b8",
            fontWeight:700, cursor:"pointer", fontSize:13
          }}>{label}</button>
        ))}
      </div>

      {tabTemporada === "jugadores" && (
        <>
          {/* Subtabs Mes/Año */}
          <div style={{ display:"flex", gap:6, marginBottom:14 }}>
            {[["mes","Mes"],["anio","Año"]].map(([key,label]) => (
              <button key={key} onClick={() => setTabRanking(key)} style={{
                padding:"6px 18px", borderRadius:8, border:"none",
                background: tabRanking===key ? "#334155" : "transparent",
                color: tabRanking===key ? "white" : "#64748b",
                fontWeight:600, cursor:"pointer", fontSize:12
              }}>{label}</button>
            ))}
          </div>
          <div style={{ background:"#1e293b", borderRadius:14, overflow:"hidden" }}>
            <div style={{ display:"grid", gridTemplateColumns:"32px 1fr 40px 40px 40px", padding:"8px 14px", background:"#334155", fontSize:11, color:"#64748b", fontWeight:700 }}>
              <span>#</span><span>Jugador</span><span style={{textAlign:"center"}}>PJ</span><span style={{textAlign:"center"}}>PTS</span><span style={{textAlign:"center"}}>MVP</span>
            </div>
            {sorted.map((j, i) => (
              <div key={j.id} onClick={() => onSelectJugador(j)} style={{
                display:"grid", gridTemplateColumns:"32px 1fr 40px 40px 40px",
                padding:"11px 14px", borderBottom:"1px solid #334155",
                background: j.id===user.id ? "#1e3a2f" : "transparent", cursor:"pointer",
                transition:"background 0.15s"
              }} onMouseEnter={e=>e.currentTarget.style.background=j.id===user.id?"#1e4a2f":"#334155"} onMouseLeave={e=>e.currentTarget.style.background=j.id===user.id?"#1e3a2f":"transparent"}>
                <span style={{ color: i===0?"#F6D365":i===1?"#C0C0C0":i===2?"#CD7F32":"#64748b", fontWeight:700, fontSize:13 }}>{i+1}</span>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:28, height:28, borderRadius:"50%", background:j.color||"#4ade80", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:900, color:"#0f172a" }}>
                    {j.foto_url ? <img src={j.foto_url} style={{width:28,height:28,borderRadius:"50%",objectFit:"cover"}} /> : `${j.nombre?.[0]||""}${j.apellido?.[0]||""}`}
                  </div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:13 }}>{j.nombre} {j.apellido}</div>
                    <div style={{ color:"#64748b", fontSize:10 }}>{j.apodo}</div>
                  </div>
                  {j.id===user.id && <span style={{ background:"#4ade8030", color:"#4ade80", borderRadius:4, padding:"1px 5px", fontSize:9, fontWeight:700 }}>VOS</span>}
                </div>
                <span style={{ textAlign:"center", color:"#94a3b8", fontSize:13 }}>{j.pj||0}</span>
                <span style={{ textAlign:"center", fontWeight:700, color:"#4ade80", fontSize:13 }}>{tabRanking==="mes"?j.puntos_mes||0:j.puntos_anio||0}</span>
                <span style={{ textAlign:"center", fontSize:13 }}>{j.mvps||0}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {tabTemporada === "equipos" && (
        <TablaEquipos partido={partido} votos={votos} jugadores={jugadores} user={user} onVotar={onVotar} />
      )}
    </div>
  );
}

// ─── TABLA EQUIPOS CON VOTACIÓN ───────────────────────────────────────────────
function TablaEquipos({ partido, votos, jugadores, user, onVotar }) {
  if (!partido) return (
    <div style={{ textAlign:"center", color:"#64748b", padding:40 }}>
      <div style={{ fontSize:32 }}>📅</div>
      <div>No hay partidos registrados aún</div>
    </div>
  );

  const yoVote = votos.some(v => v.partido_id === partido.id && v.votante_id === user.id);
  const votacionHabilitada = partido.votacion_activa;

  // Calcular votos totales por jugador para este partido
  const votosPorJugador = {};
  votos.filter(v => v.partido_id === partido.id).forEach(v => {
    votosPorJugador[v.votado_id] = (votosPorJugador[v.votado_id] || 0) + v.monedas;
  });
  const top5 = Object.entries(votosPorJugador).sort((a,b)=>b[1]-a[1]).slice(0,5);

  const equipoA = jugadores.filter(j => (partido.equipo_a||[]).includes(j.id));
  const equipoB = jugadores.filter(j => (partido.equipo_b||[]).includes(j.id));

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      {/* Partido card */}
      <div style={{ background:"#1e293b", borderRadius:16, padding:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <div>
            <div style={{ fontWeight:900, fontSize:16 }}>{partido.fecha}</div>
            <div style={{ color:"#64748b", fontSize:12 }}>{partido.cancha} · {partido.hora}hs</div>
          </div>
          {votacionHabilitada && !yoVote && (
            <button onClick={() => onVotar(partido)} style={{
              background:"linear-gradient(135deg,#7c3aed,#5b21b6)",
              color:"white", border:"none", borderRadius:12, padding:"10px 18px",
              fontWeight:900, cursor:"pointer", fontSize:14
            }}>
              🪙 Votar
            </button>
          )}
          {yoVote && <span style={{ color:"#4ade80", fontWeight:700, fontSize:13 }}>✅ Votaste</span>}
        </div>

        {/* Equipos */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr", gap:8, alignItems:"center" }}>
          <div>
            <div style={{ color:"#4ade80", fontWeight:700, fontSize:12, marginBottom:6 }}>Equipo A</div>
            {equipoA.map(j => (
              <div key={j.id} style={{ display:"flex", alignItems:"center", gap:6, padding:"3px 0" }}>
                <div style={{ width:20, height:20, borderRadius:"50%", background:j.color||"#4ade80", fontSize:9, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center", color:"#0f172a" }}>
                  {j.nombre?.[0]}{j.apellido?.[0]}
                </div>
                <span style={{ fontSize:12 }}>{j.nombre} {j.apellido}</span>
                {votosPorJugador[j.id] && <span style={{ marginLeft:"auto", color:"#F6D365", fontSize:11, fontWeight:700 }}>🪙{votosPorJugador[j.id]}</span>}
              </div>
            ))}
          </div>
          <div style={{ color:"#64748b", fontWeight:900, fontSize:18 }}>vs</div>
          <div>
            <div style={{ color:"#3b82f6", fontWeight:700, fontSize:12, marginBottom:6 }}>Equipo B</div>
            {equipoB.map(j => (
              <div key={j.id} style={{ display:"flex", alignItems:"center", gap:6, padding:"3px 0" }}>
                <div style={{ width:20, height:20, borderRadius:"50%", background:j.color||"#3b82f6", fontSize:9, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center", color:"white" }}>
                  {j.nombre?.[0]}{j.apellido?.[0]}
                </div>
                <span style={{ fontSize:12 }}>{j.nombre} {j.apellido}</span>
                {votosPorJugador[j.id] && <span style={{ marginLeft:"auto", color:"#F6D365", fontSize:11, fontWeight:700 }}>🪙{votosPorJugador[j.id]}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top 5 si ya hay votos */}
      {top5.length > 0 && (
        <div style={{ background:"#1e293b", borderRadius:14, padding:16 }}>
          <div style={{ fontWeight:700, color:"#F6D365", marginBottom:12 }}>⭐ Top votados</div>
          {top5.map(([id, monedas], i) => {
            const j = jugadores.find(x => x.id === id);
            return (
              <div key={id} style={{ display:"flex", alignItems:"center", gap:10, padding:"6px 0", borderBottom:"1px solid #334155" }}>
                <span style={{ color:i===0?"#F6D365":i===1?"#C0C0C0":i===2?"#CD7F32":"#64748b", fontWeight:700, width:20, fontSize:14 }}>{i+1}°</span>
                <span style={{ flex:1, fontSize:13 }}>{j?.nombre} {j?.apellido}</span>
                <span style={{ color:"#F6D365", fontWeight:700, fontSize:13 }}>🪙 {monedas}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── PANTALLA 5 IDEAL ─────────────────────────────────────────────────────────
function Pantalla5Ideal({ jugadores, votos, user, isAdmin, tab5Ideal, setTab5Ideal, onCardClick }) {
  const sorted = [...jugadores].sort((a,b) => (b.puntos_mes||0) - (a.puntos_mes||0));
  const top5 = sorted.slice(0, 5);
  const max = sorted[0]?.puntos_mes || 1;

  return (
    <div style={{ padding:16 }}>
      <div style={{ display:"flex", gap:6, marginBottom:16 }}>
        {[["mes","Mes"],["anio","Año"]].map(([key,label]) => (
          <button key={key} onClick={() => setTab5Ideal(key)} style={{
            padding:"6px 18px", borderRadius:8, border:"none",
            background: tab5Ideal===key ? "#4ade80" : "#1e293b",
            color: tab5Ideal===key ? "#0f172a" : "#64748b",
            fontWeight:700, cursor:"pointer", fontSize:13
          }}>{label}</button>
        ))}
      </div>

      {/* Cancha */}
      <div style={{ background:"#1e293b", borderRadius:16, padding:16, marginBottom:16, display:"flex", justifyContent:"center" }}>
        <CanchaFormacion jugadores5={top5} />
      </div>

      {/* Ranking con cards */}
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {sorted.map((j, i) => {
          const pts = tab5Ideal==="mes" ? j.puntos_mes||0 : j.puntos_anio||0;
          const pct = max > 0 ? (pts/max)*100 : 0;
          return (
            <div key={j.id} onClick={() => onCardClick(j)} style={{
              background:"#1e293b", borderRadius:14, padding:14, cursor:"pointer",
              border: i<5 ? "1px solid #4ade8040" : "1px solid transparent",
              transition:"all 0.2s"
            }} onMouseEnter={e=>e.currentTarget.style.background="#2d3748"} onMouseLeave={e=>e.currentTarget.style.background="#1e293b"}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ color:i===0?"#F6D365":i===1?"#C0C0C0":i===2?"#CD7F32":"#64748b", fontWeight:900, fontSize:16, width:24 }}>{i+1}</span>
                <div style={{ width:40, height:56 }}>
                  <FiguritaSVG jugador={j} size={40} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:14 }}>{j.nombre} {j.apellido}</div>
                  <div style={{ color:"#64748b", fontSize:11 }}>{j.apodo}</div>
                  <div style={{ marginTop:6, background:"#334155", borderRadius:4, height:5 }}>
                    <div style={{ width:`${pct}%`, background: i===0?"#F6D365":i===1?"#C0C0C0":i===2?"#CD7F32":"#4ade80", height:5, borderRadius:4, transition:"width 0.5s" }}/>
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontWeight:900, fontSize:18, color:"#4ade80" }}>{pts}</div>
                  <div style={{ color:"#64748b", fontSize:10 }}>pts</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── PANTALLA FEED ────────────────────────────────────────────────────────────
function PantallaFeed({ posts, setPosts, jugadores, comentarios, setComentarios, likes, setLikes, user }) {
  const [newPost, setNewPost] = useState("");
  const [posting, setPosting] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});
  const [commentText, setCommentText] = useState({});

  async function publicar() {
    if (!newPost.trim()) return;
    setPosting(true);
    const { data } = await supabase.from("posts").insert({ jugador_id: user.id, texto: newPost }).select().single();
    if (data) setPosts(p => [data, ...p]);
    setNewPost("");
    setPosting(false);
  }

  async function toggleLike(postId) {
    const existente = likes.find(l => l.post_id === postId && l.jugador_id === user.id);
    if (existente) {
      await supabase.from("likes").delete().eq("id", existente.id);
      setLikes(ls => ls.filter(l => l.id !== existente.id));
    } else {
      const { data } = await supabase.from("likes").insert({ post_id: postId, jugador_id: user.id }).select().single();
      if (data) setLikes(ls => [...ls, data]);
    }
  }

  async function comentar(postId) {
    const txt = commentText[postId];
    if (!txt?.trim()) return;
    const { data } = await supabase.from("comentarios").insert({ post_id: postId, jugador_id: user.id, texto: txt }).select().single();
    if (data) setComentarios(cs => [...cs, data]);
    setCommentText(p => ({ ...p, [postId]: "" }));
  }

  return (
    <div style={{ padding:16, display:"flex", flexDirection:"column", gap:14 }}>
      {/* Caja publicar */}
      <div style={{ background:"#1e293b", borderRadius:14, padding:14 }}>
        <textarea value={newPost} onChange={e=>setNewPost(e.target.value)} placeholder="¿Qué querés compartir con el grupo? ⚽" rows={3} style={{
          width:"100%", background:"#334155", border:"none", borderRadius:10, padding:12, color:"white", fontSize:14, resize:"none", boxSizing:"border-box", fontFamily:"inherit"
        }}/>
        <button onClick={publicar} disabled={posting || !newPost.trim()} style={{
          marginTop:10, background:"#4ade80", color:"#0f172a", border:"none", borderRadius:10, padding:"9px 20px", fontWeight:900, cursor:"pointer", float:"right"
        }}>
          {posting ? "..." : "Publicar"}
        </button>
        <div style={{ clear:"both" }}/>
      </div>

      {/* Posts */}
      {posts.map(post => {
        const autor = jugadores.find(j => j.id === post.jugador_id);
        const postLikes = likes.filter(l => l.post_id === post.id);
        const meGusta = postLikes.some(l => l.jugador_id === user.id);
        const postComents = comentarios.filter(c => c.post_id === post.id);

        return (
          <div key={post.id} style={{ background:"#1e293b", borderRadius:14, padding:16 }}>
            <div style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:10 }}>
              <div style={{ width:36, height:36, borderRadius:"50%", background:autor?.color||"#4ade80", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:12, color:"#0f172a", flexShrink:0 }}>
                {autor?.foto_url ? <img src={autor.foto_url} style={{width:36,height:36,borderRadius:"50%",objectFit:"cover"}} /> : `${autor?.nombre?.[0]||""}${autor?.apellido?.[0]||""}`}
              </div>
              <div>
                <div style={{ fontWeight:700, fontSize:13 }}>{autor?.nombre} {autor?.apellido}</div>
                <div style={{ color:"#64748b", fontSize:11 }}>{new Date(post.created_at).toLocaleDateString("es-AR")}</div>
              </div>
            </div>
            <p style={{ margin:"0 0 12px", fontSize:14, lineHeight:1.5 }}>{post.texto}</p>
            <div style={{ display:"flex", gap:16 }}>
              <button onClick={() => toggleLike(post.id)} style={{ background:"none", border:"none", color: meGusta?"#ef4444":"#64748b", cursor:"pointer", fontSize:13, fontWeight:700, padding:0 }}>
                {meGusta?"❤️":"🤍"} {postLikes.length}
              </button>
              <button onClick={() => setExpandedComments(p=>({...p,[post.id]:!p[post.id]}))} style={{ background:"none", border:"none", color:"#64748b", cursor:"pointer", fontSize:13, padding:0 }}>
                💬 {postComents.length}
              </button>
            </div>
            {expandedComments[post.id] && (
              <div style={{ marginTop:12, borderTop:"1px solid #334155", paddingTop:12 }}>
                {postComents.map(c => {
                  const cAutor = jugadores.find(j => j.id === c.jugador_id);
                  return (
                    <div key={c.id} style={{ display:"flex", gap:8, marginBottom:8 }}>
                      <div style={{ width:26, height:26, borderRadius:"50%", background:cAutor?.color||"#4ade80", fontSize:9, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center", color:"#0f172a", flexShrink:0 }}>
                        {cAutor?.nombre?.[0]}{cAutor?.apellido?.[0]}
                      </div>
                      <div style={{ background:"#334155", borderRadius:8, padding:"6px 10px", flex:1 }}>
                        <span style={{ fontWeight:700, fontSize:11, color:"#4ade80" }}>{cAutor?.nombre} </span>
                        <span style={{ fontSize:13 }}>{c.texto}</span>
                      </div>
                    </div>
                  );
                })}
                <div style={{ display:"flex", gap:8, marginTop:8 }}>
                  <input value={commentText[post.id]||""} onChange={e=>setCommentText(p=>({...p,[post.id]:e.target.value}))}
                    placeholder="Escribí un comentario..." style={{ flex:1, background:"#334155", border:"none", borderRadius:8, padding:"8px 12px", color:"white", fontSize:13 }} />
                  <button onClick={() => comentar(post.id)} style={{ background:"#4ade80", color:"#0f172a", border:"none", borderRadius:8, padding:"8px 12px", fontWeight:700, cursor:"pointer" }}>→</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── PANTALLA CARDS ───────────────────────────────────────────────────────────
function PantallaCards({ jugadores, isAdmin, onCardClick }) {
  return (
    <div style={{ padding:16 }}>
      <div style={{ fontWeight:700, color:"#4ade80", marginBottom:14 }}>🎴 Figuritas · Al-Koliko FC</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:14 }}>
        {jugadores.map(j => (
          <div key={j.id} onClick={() => onCardClick(j)} style={{ cursor:"pointer", display:"flex", justifyContent:"center", transition:"transform 0.2s" }}
            onMouseEnter={e=>e.currentTarget.style.transform="scale(1.04)"}
            onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
            <FiguritaSVG jugador={j} size={140} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MODAL CARD FULLSCREEN (5 Ideal + Cards) ──────────────────────────────────
function ModalCardFullscreen({ jugador, isAdmin, onClose, onSave }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...jugador });

  function handleSave() {
    onSave(form);
    setEditing(false);
  }

  const inp = { background:"#334155", border:"1px solid #475569", borderRadius:8, padding:"9px 12px", color:"white", fontSize:14, width:"100%", boxSizing:"border-box" };

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#1e293b", borderRadius:20, padding:24, width:"100%", maxWidth:380, maxHeight:"90vh", overflowY:"auto", position:"relative" }}>
        <button onClick={onClose} style={{ position:"absolute", top:14, right:14, background:"#334155", border:"none", borderRadius:"50%", width:32, height:32, color:"white", cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>

        <div style={{ display:"flex", justifyContent:"center", marginBottom:16 }}>
          <FiguritaSVG jugador={editing ? form : jugador} size={160} />
        </div>

        {!editing && (
          <div>
            <div style={{ textAlign:"center", marginBottom:16 }}>
              <div style={{ fontWeight:900, fontSize:20 }}>{jugador.nombre} {jugador.apellido}</div>
              <div style={{ color:"#4ade80", fontWeight:700 }}>{jugador.apodo}</div>
              <div style={{ color:"#64748b", fontSize:13, marginTop:4 }}>{jugador.posicion} · #{jugador.numero}</div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:16 }}>
              {[["VEL",jugador.velocidad],["PAS",jugador.pase],["DEF",jugador.defensa],["TIR",jugador.tiro],["TEC",jugador.tecnica],["RES",jugador.resistencia]].map(([k,v])=>(
                <div key={k} style={{ background:"#334155", borderRadius:10, padding:"10px 0", textAlign:"center" }}>
                  <div style={{ fontWeight:900, fontSize:18, color:"#4ade80" }}>{v}</div>
                  <div style={{ color:"#64748b", fontSize:11 }}>{k}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:16 }}>
              {[["PJ",jugador.pj||0],["Goles",jugador.goles||0],["Asist",jugador.asist||0]].map(([k,v])=>(
                <div key={k} style={{ background:"#334155", borderRadius:10, padding:"10px 0", textAlign:"center" }}>
                  <div style={{ fontWeight:900, fontSize:16 }}>{v}</div>
                  <div style={{ color:"#64748b", fontSize:10 }}>{k}</div>
                </div>
              ))}
            </div>
            {isAdmin && (
              <button onClick={() => setEditing(true)} style={{ width:"100%", background:"#7c3aed", color:"white", border:"none", borderRadius:10, padding:11, fontWeight:700, cursor:"pointer", fontSize:14 }}>
                ✏️ Editar carta
              </button>
            )}
          </div>
        )}

        {editing && isAdmin && (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <div style={{ fontWeight:700, color:"#4ade80", marginBottom:4 }}>Editar carta</div>
            {[["apodo","Apodo"],["numero","Número"],["posicion","Posición"]].map(([k,label]) => (
              <div key={k}>
                <div style={{ color:"#94a3b8", fontSize:12, marginBottom:4 }}>{label}</div>
                <input style={inp} value={form[k]||""} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} />
              </div>
            ))}
            <div>
              <div style={{ color:"#94a3b8", fontSize:12, marginBottom:4 }}>Rareza</div>
              <select style={inp} value={form.rareza||"bronce"} onChange={e=>setForm(p=>({...p,rareza:e.target.value}))}>
                {["oro","plata","bronce"].map(r=><option key={r}>{r}</option>)}
              </select>
            </div>
            {["velocidad","pase","defensa","tiro","tecnica","resistencia"].map(stat => (
              <div key={stat}>
                <div style={{ display:"flex", justifyContent:"space-between", color:"#94a3b8", fontSize:12, marginBottom:4 }}>
                  <span>{stat.toUpperCase()}</span><span style={{ color:"#4ade80", fontWeight:700 }}>{form[stat]||65}</span>
                </div>
                <input type="range" min={40} max={99} value={form[stat]||65} onChange={e=>setForm(p=>({...p,[stat]:Number(e.target.value)}))} style={{ width:"100%", accentColor:"#4ade80" }}/>
              </div>
            ))}
            <div style={{ display:"flex", gap:10, marginTop:8 }}>
              <button onClick={() => setEditing(false)} style={{ flex:1, background:"#334155", color:"white", border:"none", borderRadius:10, padding:11, fontWeight:700, cursor:"pointer" }}>Cancelar</button>
              <button onClick={handleSave} style={{ flex:1, background:"#4ade80", color:"#0f172a", border:"none", borderRadius:10, padding:11, fontWeight:900, cursor:"pointer" }}>Guardar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MODAL VOTACIÓN ───────────────────────────────────────────────────────────
function ModalVotacion({ partido, jugadores, user, votos, onClose, onVotar }) {
  const jugadoresPartido = jugadores.filter(j =>
    [...(partido.equipo_a||[]), ...(partido.equipo_b||[])].includes(j.id)
  );

  const [monedas, setMonedas] = useState(() => {
    const m = {};
    jugadoresPartido.forEach(j => { m[j.id] = 0; });
    return m;
  });

  const totalUsado = Object.values(monedas).reduce((a,b) => a+b, 0);
  const TOTAL = 10;
  const restantes = TOTAL - totalUsado;

  function cambiar(id, delta) {
    setMonedas(prev => {
      const actual = prev[id] || 0;
      const nuevo = Math.max(0, actual + delta);
      if (delta > 0 && restantes <= 0) return prev;
      return { ...prev, [id]: nuevo };
    });
  }

  const equipoA = jugadoresPartido.filter(j => (partido.equipo_a||[]).includes(j.id));
  const equipoB = jugadoresPartido.filter(j => (partido.equipo_b||[]).includes(j.id));

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.9)", zIndex:300, display:"flex", flexDirection:"column" }}>
      <div style={{ background:"#1e293b", padding:"14px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:"1px solid #334155" }}>
        <div>
          <div style={{ fontWeight:900, fontSize:16 }}>🪙 Repartí tus monedas</div>
          <div style={{ color:"#64748b", fontSize:12 }}>{partido.fecha} · {partido.cancha}</div>
        </div>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontWeight:900, fontSize:28, color: restantes>0?"#F6D365":"#4ade80" }}>{restantes}</div>
          <div style={{ color:"#64748b", fontSize:10 }}>restantes</div>
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:16 }}>
        {/* Cancha visual */}
        <div style={{ background:"#1e3a2f", borderRadius:16, padding:16, marginBottom:16 }}>
          <svg viewBox="0 0 320 200" width="100%" xmlns="http://www.w3.org/2000/svg">
            <rect width="320" height="200" rx="10" fill="#2d8a4e"/>
            <line x1="160" y1="0" x2="160" y2="200" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
            <circle cx="160" cy="100" r="30" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
            {/* Jugadores Equipo A */}
            {equipoA.map((j,i) => {
              const posX = [40, 40, 80, 80, 60][i] || 60;
              const posY = [30, 170, 70, 130, 100][i] || 100;
              return (
                <g key={j.id}>
                  <circle cx={posX} cy={posY} r="16" fill="#22c55e" opacity="0.9"/>
                  <text x={posX} y={posY+4} textAnchor="middle" fontSize="9" fill="white" fontWeight="900">
                    {j.nombre?.[0]}{j.apellido?.[0]}
                  </text>
                </g>
              );
            })}
            {/* Jugadores Equipo B */}
            {equipoB.map((j,i) => {
              const posX = [280, 280, 240, 240, 260][i] || 260;
              const posY = [30, 170, 70, 130, 100][i] || 100;
              return (
                <g key={j.id}>
                  <circle cx={posX} cy={posY} r="16" fill="#3b82f6" opacity="0.9"/>
                  <text x={posX} y={posY+4} textAnchor="middle" fontSize="9" fill="white" fontWeight="900">
                    {j.nombre?.[0]}{j.apellido?.[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Tarjetas de votación */}
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {[["Equipo A 🟢", equipoA, "#22c55e"], ["Equipo B 🔵", equipoB, "#3b82f6"]].map(([titulo, equipo, color]) => (
            <div key={titulo}>
              <div style={{ fontWeight:700, color, marginBottom:8, fontSize:13 }}>{titulo}</div>
              {equipo.map(j => {
                const esYo = j.id === user.id;
                return (
                  <div key={j.id} style={{
                    background: esYo ? "#334155" : "#1e293b",
                    borderRadius:12, padding:"12px 14px", marginBottom:8,
                    border: esYo ? "1px dashed #475569" : "1px solid #334155",
                    opacity: esYo ? 0.5 : 1
                  }}>
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <div style={{ width:38, height:53 }}>
                        <FiguritaSVG jugador={j} size={38} />
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:700, fontSize:14 }}>{j.nombre} {j.apellido}</div>
                        <div style={{ color:"#64748b", fontSize:11 }}>{j.posicion} {esYo && "· No podés votarte"}</div>
                      </div>
                      {!esYo && (
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <button onClick={() => cambiar(j.id,-1)} disabled={!monedas[j.id]} style={{ width:32, height:32, borderRadius:"50%", background:"#334155", border:"none", color:"white", fontWeight:900, cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>−</button>
                          <div style={{ width:36, height:36, borderRadius:"50%", background: monedas[j.id]>0?"#F6D365":"#334155", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:16, color:"#0f172a", transition:"background 0.2s" }}>
                            {monedas[j.id]||0}
                          </div>
                          <button onClick={() => cambiar(j.id,1)} disabled={restantes<=0} style={{ width:32, height:32, borderRadius:"50%", background:"#334155", border:"none", color:"white", fontWeight:900, cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>+</button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Botones */}
      <div style={{ padding:16, background:"#1e293b", borderTop:"1px solid #334155", display:"flex", gap:10 }}>
        <button onClick={onClose} style={{ flex:1, background:"#334155", color:"white", border:"none", borderRadius:12, padding:13, fontWeight:700, cursor:"pointer" }}>Cancelar</button>
        <button onClick={() => onVotar(monedas)} style={{ flex:2, background:"linear-gradient(135deg,#F6D365,#FDA085)", color:"#0f172a", border:"none", borderRadius:12, padding:13, fontWeight:900, cursor:"pointer", fontSize:15 }}>
          🪙 Confirmar voto ({TOTAL-restantes}/{TOTAL} monedas)
        </button>
      </div>
    </div>
  );
}

// ─── MODAL EDITAR PERFIL ──────────────────────────────────────────────────────
function ModalEditarPerfil({ user, onClose, onSave }) {
  const [form, setForm] = useState({
    apodo: user.apodo || "",
    nombre_usuario: user.nombre_usuario || user.apodo || "",
    ciudad: user.ciudad || "",
    celular: user.celular || "",
    equipo_arg: user.equipo_arg || "",
    equipo_eu: user.equipo_eu || "",
    liga_eu: user.liga_eu || "",
  });
  const [newPass, setNewPass] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Si el usuario ya tiene una liga guardada, mostrar los equipos de esa liga
  const equiposEu = EQUIPOS_EU[form.liga_eu] || [];

  async function handleSave() {
    setSaving(true);
    const datos = { ...form };
    await onSave(datos);
    if (newPass.trim().length >= 6) {
      await supabase.auth.updateUser({ password: newPass });
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const inp = { background:"#334155", border:"1px solid #475569", borderRadius:8, padding:"10px 12px", color:"white", fontSize:14, width:"100%", boxSizing:"border-box" };
  const label = { color:"#94a3b8", fontSize:12, marginBottom:4, display:"block" };

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#1e293b", borderRadius:20, padding:24, width:"100%", maxWidth:400, maxHeight:"90vh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div style={{ fontWeight:900, fontSize:18, color:"#4ade80" }}>✏️ Editar perfil</div>
          <button onClick={onClose} style={{ background:"#334155", border:"none", borderRadius:"50%", width:32, height:32, color:"white", cursor:"pointer", fontSize:18 }}>×</button>
        </div>

        {/* Datos del usuario (solo lectura) */}
        <div style={{ background:"#334155", borderRadius:12, padding:"10px 14px", marginBottom:16, display:"flex", gap:12, alignItems:"center" }}>
          <div style={{ width:42, height:42, borderRadius:"50%", background: user.color||"#4ade80", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:15, color:"#0f172a", flexShrink:0 }}>
            {user.foto_url ? <img src={user.foto_url} style={{width:42,height:42,borderRadius:"50%",objectFit:"cover"}}/> : `${user.nombre?.[0]||""}${user.apellido?.[0]||""}`}
          </div>
          <div>
            <div style={{ fontWeight:700, fontSize:15 }}>{user.nombre} {user.apellido}</div>
            <div style={{ color:"#64748b", fontSize:11 }}>Nombre y apellido no se pueden editar</div>
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div>
            <span style={label}>👤 Nombre de usuario</span>
            <input style={inp} value={form.nombre_usuario} onChange={e=>setForm(p=>({...p,nombre_usuario:e.target.value}))} placeholder="Tu nombre de usuario" />
          </div>
          <div>
            <span style={label}>⚡ Apodo futbolero</span>
            <input style={inp} value={form.apodo} onChange={e=>setForm(p=>({...p,apodo:e.target.value}))} placeholder="Tu apodo en la cancha" />
          </div>
          <div>
            <span style={label}>🏠 Domicilio / Barrio</span>
            <input style={inp} value={form.ciudad} onChange={e=>setForm(p=>({...p,ciudad:e.target.value}))} placeholder="Tu barrio o ciudad" />
          </div>
          <div>
            <span style={label}>📱 Celular</span>
            <input style={inp} value={form.celular} onChange={e=>setForm(p=>({...p,celular:e.target.value}))} placeholder="+54 11 ..." type="tel" />
          </div>
          <div>
            <span style={label}>🇦🇷 Club argentino favorito</span>
            <select style={inp} value={form.equipo_arg} onChange={e=>setForm(p=>({...p,equipo_arg:e.target.value}))}>
              <option value="">— Seleccioná tu club —</option>
              {EQUIPOS_ARG.map(eq => <option key={eq} value={eq}>{eq}</option>)}
            </select>
            {form.equipo_arg && (
              <div style={{ marginTop:6, color:"#4ade80", fontSize:12, fontWeight:700 }}>✅ {form.equipo_arg}</div>
            )}
          </div>
          <div>
            <span style={label}>🌍 Liga europea</span>
            <select style={inp} value={form.liga_eu} onChange={e=>setForm(p=>({...p,liga_eu:e.target.value,equipo_eu:""}))}>
              <option value="">— Seleccioná liga —</option>
              {LIGAS_EU.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          {form.liga_eu && (
            <div>
              <span style={label}>🏟️ Club europeo favorito ({form.liga_eu})</span>
              <select style={inp} value={form.equipo_eu} onChange={e=>setForm(p=>({...p,equipo_eu:e.target.value}))}>
                <option value="">— Seleccioná club —</option>
                {equiposEu.map(eq => <option key={eq} value={eq}>{eq}</option>)}
              </select>
              {form.equipo_eu && (
                <div style={{ marginTop:6, color:"#4ade80", fontSize:12, fontWeight:700 }}>✅ {form.equipo_eu}</div>
              )}
            </div>
          )}
          <div style={{ borderTop:"1px solid #334155", paddingTop:14 }}>
            <span style={label}>🔐 Nueva contraseña (opcional, mín. 6 caracteres)</span>
            <input style={inp} value={newPass} onChange={e=>setNewPass(e.target.value)} placeholder="Dejá vacío para no cambiar" type="password" />
          </div>
        </div>

        <div style={{ display:"flex", gap:10, marginTop:20 }}>
          <button onClick={onClose} style={{ flex:1, background:"#334155", color:"white", border:"none", borderRadius:10, padding:12, fontWeight:700, cursor:"pointer" }}>Cancelar</button>
          <button onClick={handleSave} disabled={saving} style={{ flex:2, background: saved?"#16a34a":"#4ade80", color:"#0f172a", border:"none", borderRadius:10, padding:12, fontWeight:900, cursor:"pointer", transition:"background 0.3s" }}>
            {saving ? "Guardando..." : saved ? "✅ ¡Guardado!" : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MODAL JUGADOR ────────────────────────────────────────────────────────────
function ModalJugador({ jugador, isAdmin, onClose, onSave }) {
  const [tabModal, setTabModal] = useState("stats");
  const [form, setForm] = useState({ ...jugador });

  const inp = { background:"#334155", border:"1px solid #475569", borderRadius:8, padding:"9px 12px", color:"white", fontSize:14, width:"100%", boxSizing:"border-box" };

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#1e293b", borderRadius:20, padding:20, width:"100%", maxWidth:380, maxHeight:"90vh", overflowY:"auto", position:"relative" }}>
        <button onClick={onClose} style={{ position:"absolute", top:14, right:14, background:"#334155", border:"none", borderRadius:"50%", width:32, height:32, color:"white", cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>

        <div style={{ display:"flex", justifyContent:"center", marginBottom:12 }}>
          <FiguritaSVG jugador={jugador} size={120} />
        </div>
        <div style={{ textAlign:"center", marginBottom:14 }}>
          <div style={{ fontWeight:900, fontSize:18 }}>{jugador.nombre} {jugador.apellido}</div>
          <div style={{ color:"#4ade80", fontSize:14 }}>{jugador.apodo}</div>
        </div>

        <div style={{ display:"flex", gap:6, marginBottom:14 }}>
          {[["stats","📊 Stats"],["figurita","🎴 Figurita"],..( isAdmin?[["editar","✏️ Editar"]]:[])]
            .map(([k,l]) => (
              <button key={k} onClick={() => setTabModal(k)} style={{
                flex:1, padding:"7px 0", borderRadius:8, border:"none",
                background: tabModal===k ? "#4ade80" : "#334155",
                color: tabModal===k ? "#0f172a" : "#94a3b8",
                fontWeight:700, cursor:"pointer", fontSize:12
              }}>{l}</button>
          ))}
        </div>

        {tabModal === "stats" && (
          <div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:12 }}>
              {[["VEL",jugador.velocidad],["PAS",jugador.pase],["DEF",jugador.defensa],["TIR",jugador.tiro],["TEC",jugador.tecnica],["RES",jugador.resistencia]].map(([k,v])=>(
                <div key={k} style={{ background:"#334155", borderRadius:10, padding:"10px 0", textAlign:"center" }}>
                  <div style={{ fontWeight:900, fontSize:20, color:"#4ade80" }}>{v||"--"}</div>
                  <div style={{ color:"#64748b", fontSize:11 }}>{k}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
              {[["PJ",jugador.pj||0],["Goles",jugador.goles||0],["Asist",jugador.asist||0],["MVPs",jugador.mvps||0]].map(([k,v])=>(
                <div key={k} style={{ background:"#334155", borderRadius:10, padding:"10px 0", textAlign:"center" }}>
                  <div style={{ fontWeight:900, fontSize:18 }}>{v}</div>
                  <div style={{ color:"#64748b", fontSize:10 }}>{k}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tabModal === "figurita" && (
          <div style={{ display:"flex", justifyContent:"center" }}>
            <FiguritaSVG jugador={jugador} size={200} />
          </div>
        )}

        {tabModal === "editar" && isAdmin && (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {[["apodo","Apodo"],["numero","Número camiseta"]].map(([k,l]) => (
              <div key={k}>
                <div style={{ color:"#94a3b8", fontSize:12, marginBottom:4 }}>{l}</div>
                <input style={inp} value={form[k]||""} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} />
              </div>
            ))}
            <div>
              <div style={{ color:"#94a3b8", fontSize:12, marginBottom:4 }}>Rareza</div>
              <select style={inp} value={form.rareza||"bronce"} onChange={e=>setForm(p=>({...p,rareza:e.target.value}))}>
                {["oro","plata","bronce"].map(r=><option key={r}>{r}</option>)}
              </select>
            </div>
            {["velocidad","pase","defensa","tiro","tecnica","resistencia"].map(stat => (
              <div key={stat}>
                <div style={{ display:"flex", justifyContent:"space-between", color:"#94a3b8", fontSize:12, marginBottom:4 }}>
                  <span>{stat.toUpperCase()}</span><span style={{ color:"#4ade80", fontWeight:700 }}>{form[stat]||65}</span>
                </div>
                <input type="range" min={40} max={99} value={form[stat]||65} onChange={e=>setForm(p=>({...p,[stat]:Number(e.target.value)}))} style={{ width:"100%", accentColor:"#4ade80" }}/>
              </div>
            ))}
            <button onClick={() => onSave(form)} style={{ background:"#4ade80", color:"#0f172a", border:"none", borderRadius:10, padding:11, fontWeight:900, cursor:"pointer", marginTop:4 }}>
              Guardar cambios
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ADMIN PANEL ──────────────────────────────────────────────────────────────
function AdminPanel({ jugadores, partido, onClose, onPartidoSave }) {
  const [form, setForm] = useState({
    fecha: partido?.fecha || "",
    hora: partido?.hora || "",
    cancha: partido?.cancha || "",
    equipo_a: partido?.equipo_a || [],
    equipo_b: partido?.equipo_b || [],
    votacion_activa: partido?.votacion_activa || false,
  });

  const inp = { background:"#334155", border:"1px solid #475569", borderRadius:8, padding:"9px 12px", color:"white", fontSize:14, width:"100%", boxSizing:"border-box" };

  function toggleJugador(id, equipo) {
    setForm(prev => {
      const a = [...prev.equipo_a];
      const b = [...prev.equipo_b];
      if (equipo === "a") {
        if (a.includes(id)) return { ...prev, equipo_a: a.filter(x=>x!==id) };
        if (a.length < 5) return { ...prev, equipo_a: [...a, id] };
      } else {
        if (b.includes(id)) return { ...prev, equipo_b: b.filter(x=>x!==id) };
        if (b.length < 5) return { ...prev, equipo_b: [...b, id] };
      }
      return prev;
    });
  }

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#1e293b", borderRadius:20, padding:24, width:"100%", maxWidth:420, maxHeight:"92vh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div style={{ fontWeight:900, fontSize:18, color:"#4ade80" }}>⚙️ Panel Admin</div>
          <button onClick={onClose} style={{ background:"#334155", border:"none", borderRadius:"50%", width:32, height:32, color:"white", cursor:"pointer", fontSize:18 }}>×</button>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div>
            <div style={{ color:"#94a3b8", fontSize:12, marginBottom:4 }}>Fecha del partido</div>
            <input style={inp} type="date" value={form.fecha} onChange={e=>setForm(p=>({...p,fecha:e.target.value}))} />
          </div>
          <div>
            <div style={{ color:"#94a3b8", fontSize:12, marginBottom:4 }}>Hora</div>
            <input style={inp} type="time" value={form.hora} onChange={e=>setForm(p=>({...p,hora:e.target.value}))} />
          </div>
          <div>
            <div style={{ color:"#94a3b8", fontSize:12, marginBottom:4 }}>Cancha</div>
            <input style={inp} value={form.cancha} onChange={e=>setForm(p=>({...p,cancha:e.target.value}))} placeholder="Nombre de la cancha" />
          </div>

          {/* Armar equipos */}
          <div>
            <div style={{ fontWeight:700, color:"#4ade80", marginBottom:10 }}>🟢 Equipo A ({form.equipo_a.length}/5)</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {jugadores.map(j => (
                <button key={j.id} onClick={() => toggleJugador(j.id,"a")} style={{
                  padding:"5px 10px", borderRadius:8, border:"none", cursor:"pointer", fontSize:12, fontWeight:700,
                  background: form.equipo_a.includes(j.id) ? "#22c55e" : "#334155",
                  color: form.equipo_a.includes(j.id) ? "#0f172a" : "#94a3b8"
                }}>{j.nombre} {j.apellido?.[0]}.</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontWeight:700, color:"#3b82f6", marginBottom:10 }}>🔵 Equipo B ({form.equipo_b.length}/5)</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {jugadores.map(j => (
                <button key={j.id} onClick={() => toggleJugador(j.id,"b")} style={{
                  padding:"5px 10px", borderRadius:8, border:"none", cursor:"pointer", fontSize:12, fontWeight:700,
                  background: form.equipo_b.includes(j.id) ? "#3b82f6" : "#334155",
                  color: form.equipo_b.includes(j.id) ? "white" : "#94a3b8"
                }}>{j.nombre} {j.apellido?.[0]}.</button>
              ))}
            </div>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:12, background:"#334155", borderRadius:10, padding:"10px 14px" }}>
            <span style={{ flex:1, fontWeight:700, fontSize:14 }}>🪙 Votación activa</span>
            <button onClick={() => setForm(p=>({...p,votacion_activa:!p.votacion_activa}))} style={{
              width:44, height:24, borderRadius:12, border:"none", cursor:"pointer",
              background: form.votacion_activa ? "#4ade80" : "#475569", position:"relative", transition:"background 0.2s"
            }}>
              <div style={{ position:"absolute", top:2, left: form.votacion_activa?22:2, width:20, height:20, borderRadius:"50%", background:"white", transition:"left 0.2s" }}/>
            </button>
          </div>
        </div>

        <div style={{ display:"flex", gap:10, marginTop:20 }}>
          <button onClick={onClose} style={{ flex:1, background:"#334155", color:"white", border:"none", borderRadius:10, padding:12, fontWeight:700, cursor:"pointer" }}>Cancelar</button>
          <button onClick={() => onPartidoSave(form)} style={{ flex:2, background:"#4ade80", color:"#0f172a", border:"none", borderRadius:10, padding:12, fontWeight:900, cursor:"pointer" }}>
            Guardar partido
          </button>
        </div>
      </div>
    </div>
  );
}
