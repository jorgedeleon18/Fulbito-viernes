import { useState, useEffect, useRef } from 'react'

/* ─────────────────────────────────────────────
   DATOS INICIALES
───────────────────────────────────────────── */
const USERS_SEED = [
  { id: 1,  name: 'Nico',   pass: 'nico123',   role: 'admin',   initials: 'NI', color: '#3b1f8c', textColor: '#ce93d8', number: 10, pos: 'MED' },
  { id: 2,  name: 'Juank',  pass: 'juank123',  role: 'admin',   initials: 'JK', color: '#1d4e89', textColor: '#90caf9', number: 8,  pos: 'MED' },
  { id: 3,  name: 'Enzo',   pass: 'enzo123',   role: 'jugador', initials: 'EN', color: '#1a5c3a', textColor: '#80cbc4', number: 7,  pos: 'DEL' },
  { id: 4,  name: 'Maxi',   pass: 'maxi123',   role: 'jugador', initials: 'MA', color: '#2a1a3a', textColor: '#ce93d8', number: 5,  pos: 'DEF' },
  { id: 5,  name: 'Fede',   pass: 'fede123',   role: 'jugador', initials: 'FE', color: '#7a2020', textColor: '#ef9a9a', number: 9,  pos: 'DEL' },
  { id: 6,  name: 'Lean',   pass: 'lean123',   role: 'jugador', initials: 'LE', color: '#1a3a2a', textColor: '#00e676', number: 11, pos: 'DEL' },
  { id: 7,  name: 'Seba',   pass: 'seba123',   role: 'jugador', initials: 'SE', color: '#2a2a1a', textColor: '#ffd600', number: 1,  pos: 'GK'  },
  { id: 8,  name: 'Matías', pass: 'matias123', role: 'jugador', initials: 'MT', color: '#1a3040', textColor: '#40c4ff', number: 6,  pos: 'DEF' },
  { id: 9,  name: 'Gonza',  pass: 'gonza123',  role: 'jugador', initials: 'GO', color: '#2a1a10', textColor: '#ff7043', number: 4,  pos: 'DEF' },
  { id: 10, name: 'Rulo',   pass: 'rulo123',   role: 'jugador', initials: 'RU', color: '#2a2a10', textColor: '#ffd600', number: 3,  pos: 'DEF' },
  { id: 11, name: 'Pipe',   pass: 'pipe123',   role: 'jugador', initials: 'PI', color: '#102a20', textColor: '#69f0ae', number: 2,  pos: 'DEF' },
]

const MATCHES_SEED = [
  { id: 1, date: '09/05/2025', teams: 'Azul vs Verde', score: '3 — 5', place: 'Cancha La Estrella', players: [1,2,3,4,5,6,7,8,9,10], votingOpen: true,  votingClosed: false },
  { id: 2, date: '02/05/2025', teams: 'Rojo vs Azul',  score: '4 — 4', place: 'Cancha La Estrella', players: [1,2,3,4,5,6,7,8,9,10,11], votingOpen: false, votingClosed: true  },
  { id: 3, date: '25/04/2025', teams: 'Verde vs Rojo', score: '6 — 2', place: 'Cancha La Estrella', players: [1,2,3,4,5,6,7,8,9,10], votingOpen: false, votingClosed: true  },
  { id: 4, date: '18/04/2025', teams: 'Azul vs Verde', score: '3 — 3', place: 'Cancha La Estrella', players: [1,2,3,5,6,7,8,9,10,11], votingOpen: false, votingClosed: true  },
]

const MONTHLY_SEED = [
  { userId: 1,  pts: 52, pj: 4, top1: 3 },
  { userId: 2,  pts: 47, pj: 4, top1: 2 },
  { userId: 5,  pts: 38, pj: 3, top1: 1 },
  { userId: 6,  pts: 31, pj: 4, top1: 1 },
  { userId: 4,  pts: 28, pj: 3, top1: 0 },
  { userId: 3,  pts: 22, pj: 4, top1: 0 },
  { userId: 9,  pts: 18, pj: 2, top1: 0 },
  { userId: 7,  pts: 15, pj: 3, top1: 0 },
]

const ANNUAL_SEED = [
  { userId: 1,  pts: 210, pj: 18, casacas: 2 },
  { userId: 6,  pts: 187, pj: 17, casacas: 1 },
  { userId: 2,  pts: 175, pj: 18, casacas: 1 },
  { userId: 5,  pts: 142, pj: 15, casacas: 0 },
  { userId: 4,  pts: 118, pj: 14, casacas: 0 },
  { userId: 3,  pts: 105, pj: 14, casacas: 0 },
  { userId: 7,  pts: 98,  pj: 12, casacas: 0 },
  { userId: 10, pts: 87,  pj: 11, casacas: 0 },
]

const IDEAL5_SEED = [
  { userId: 1,  pts: 110, top5: 12 },
  { userId: 6,  pts: 98,  top5: 9  },
  { userId: 7,  pts: 87,  top5: 8  },
  { userId: 10, pts: 72,  top5: 5  },
  { userId: 9,  pts: 68,  top5: 4  },
  { userId: 2,  pts: 62,  top5: 6  },
  { userId: 3,  pts: 55,  top5: 4  },
  { userId: 5,  pts: 49,  top5: 3  },
]

const FEED_SEED = [
  { id: 1, userId: 3, text: 'Mañana a las 9 el que llegue tarde limpia el vestuario 😂 estamos o no estamos?', time: 'Hace 2 horas', likes: [1,4,5,6,7,9,10], comments: 3, mediaType: null },
  { id: 2, userId: 1, text: 'El golazo de Lean del otro día 🔥🔥 la rompió', time: 'Ayer 23:40', likes: [2,3,4,5,6,7,8,9,10,11], comments: 5, mediaType: 'video' },
  { id: 3, userId: 5, text: 'Che alguien tiene las botitas número 41? Se me rompieron las mías esta semana jajaja', time: 'Hace 2 días', likes: [2,3,6,10], comments: 8, mediaType: null },
]

const NEXT_MATCH = { date: 'VIERNES 16 MAYO', time: '21:00 hs', place: 'Cancha La Estrella', city: 'Berazategui', confirmed: [1,2,3,4,5,6,7,8,9,10] }

const POS_LABELS = { GK: 'ARQUERO', DEF: 'DEFENSOR', MED: 'MEDIOCAMPISTA', DEL: 'DELANTERO' }

/* ─────────────────────────────────────────────
   STORAGE HELPERS
───────────────────────────────────────────── */
function load(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback } catch { return fallback }
}
function save(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
}

/* ─────────────────────────────────────────────
   CSS GLOBAL
───────────────────────────────────────────── */
const globalCSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
@import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css');

*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
:root{
  --bg:#03061a;--bg2:#0d0f2a;--bg3:#131530;
  --card:#141630;--card2:#1a1d3a;
  --accent:#00e676;--accent2:#ffd600;
  --blue:#40c4ff;--red:#ff5252;--purple:#ce93d8;
  --text:#f0f0f0;--muted:#6a6a9a;--muted2:#9898b8;
  --border:rgba(255,255,255,0.07);--border2:rgba(255,255,255,0.12);
  --radius:14px;--radius-sm:10px;--radius-lg:20px;
}
html,body,#root{height:100%;width:100%;overflow:hidden;background:var(--bg)}
body{font-family:'DM Sans',sans-serif;color:var(--text);font-size:14px}

/* SCROLLBAR */
::-webkit-scrollbar{width:3px;height:3px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.15);border-radius:2px}

/* INPUTS */
input,textarea{background:rgba(255,255,255,0.07);border:1px solid var(--border2);border-radius:var(--radius-sm);color:var(--text);font-family:'DM Sans',sans-serif;font-size:14px;padding:10px 14px;outline:none;transition:border .2s}
input:focus,textarea:focus{border-color:var(--accent)}
input::placeholder,textarea::placeholder{color:var(--muted)}

/* BUTTONS */
button{cursor:pointer;font-family:'DM Sans',sans-serif;border:none;outline:none}
button:active{transform:scale(0.97)}

/* UTILITY */
.bebas{font-family:'Bebas Neue',sans-serif;letter-spacing:.5px}
.muted{color:var(--muted2)}
.accent{color:var(--accent)}
.accent2{color:var(--accent2)}

/* ANIMATIONS */
@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
.fade-in{animation:fadeIn .25s ease forwards}
.slide-up{animation:slideUp .3s ease forwards}

/* TOAST */
.toast{position:fixed;bottom:90px;left:50%;transform:translateX(-50%) translateY(10px);background:#fff;color:#000;border-radius:12px;padding:10px 20px;font-size:13px;font-weight:600;z-index:9999;transition:all .25s;pointer-events:none;white-space:nowrap}
.toast.show{transform:translateX(-50%) translateY(0);opacity:1}
.toast.hide{opacity:0;transform:translateX(-50%) translateY(10px)}

/* MODAL OVERLAY */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:500;display:flex;align-items:flex-end;justify-content:center;animation:fadeIn .2s ease}
.modal-sheet{background:var(--card);border-radius:24px 24px 0 0;padding:20px 20px 48px;width:100%;max-width:430px;animation:slideUp .3s ease;max-height:90vh;overflow-y:auto}
.modal-drag{width:40px;height:4px;background:rgba(255,255,255,0.2);border-radius:2px;margin:0 auto 18px}

/* BADGE */
.badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600}
.badge-green{background:rgba(0,230,118,0.15);color:var(--accent)}
.badge-yellow{background:rgba(255,214,0,0.15);color:var(--accent2)}
.badge-red{background:rgba(255,82,82,0.15);color:var(--red)}
.badge-blue{background:rgba(64,196,255,0.15);color:var(--blue)}
`

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */

function Avatar({ user, size = 36, style = {} }) {
  if (!user) return null
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: user.color, color: user.textColor,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: size * 0.36, flexShrink: 0,
      border: `2px solid ${user.color}88`, ...style
    }}>
      {user.initials}
    </div>
  )
}

function SectionTitle({ children, style = {} }) {
  return (
    <div className="bebas" style={{ fontSize: 20, padding: '16px 16px 6px', letterSpacing: 1, ...style }}>
      {children}
    </div>
  )
}

function Card({ children, style = {}, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: 'var(--card)', borderRadius: 'var(--radius)',
      border: '1px solid var(--border)', padding: '14px 16px',
      margin: '0 16px 12px', ...style,
      cursor: onClick ? 'pointer' : 'default'
    }}>
      {children}
    </div>
  )
}

/* ─────────────────────────────────────────────
   LOGIN SCREEN
───────────────────────────────────────────── */
function LoginScreen({ onLogin }) {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  function handleLogin() {
    setErr('')
    setLoading(true)
    setTimeout(() => {
      const found = USERS_SEED.find(u => u.name.toLowerCase() === user.toLowerCase() && u.pass === pass)
      if (found) { onLogin(found) }
      else { setErr('Usuario o contraseña incorrectos'); setLoading(false) }
    }, 500)
  }

  return (
    <div style={{
      height: '100vh', background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '0 24px', gap: 0
    }}>
      {/* Logo area */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>⚽</div>
        <div className="bebas" style={{ fontSize: 36, color: 'var(--accent)', letterSpacing: 2 }}>AL-KOLIKO FC</div>
        <div style={{ fontSize: 13, color: 'var(--muted2)', marginTop: 4 }}>Temporada 2025 · El Fulbito de los Viernes</div>
      </div>

      {/* Form */}
      <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          placeholder="Tu nombre de usuario"
          value={user}
          onChange={e => setUser(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          autoCapitalize="off"
          style={{ width: '100%' }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={pass}
          onChange={e => setPass(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          style={{ width: '100%' }}
        />
        {err && <div style={{ color: 'var(--red)', fontSize: 12, textAlign: 'center' }}>{err}</div>}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%', background: 'var(--accent)', color: '#000',
            borderRadius: 12, padding: '13px', fontWeight: 700,
            fontSize: 15, marginTop: 4, opacity: loading ? .7 : 1,
            transition: 'opacity .2s'
          }}
        >
          {loading ? 'Entrando...' : 'Entrar al vestuario'}
        </button>
      </div>

      <div style={{ marginTop: 32, color: 'var(--muted)', fontSize: 11, textAlign: 'center' }}>
        Hecho con ❤️ para los pibes del viernes
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   HOME PAGE
───────────────────────────────────────────── */
function HomePage({ currentUser, users, matches, showToast, openVote }) {
  const [confirmed, setConfirmed] = useState(
    load(`confirmed_${currentUser.id}`, NEXT_MATCH.confirmed.includes(currentUser.id))
  )

  function toggleConfirm(val) {
    setConfirmed(val)
    save(`confirmed_${currentUser.id}`, val)
    showToast(val ? '✅ Confirmado para el viernes!' : '❌ Avisado que no vas')
  }

  const pendingVotes = matches.filter(m => m.votingOpen && !load(`voted_${currentUser.id}_${m.id}`, false))
  const confirmedUsers = NEXT_MATCH.confirmed.map(id => users.find(u => u.id === id)).filter(Boolean)

  return (
    <div className="fade-in" style={{ paddingBottom: 16 }}>
      {/* Next match card */}
      <div style={{
        margin: '14px 16px',
        background: 'linear-gradient(135deg, #0f1a40 0%, #0a1530 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: 20,
        border: '1px solid rgba(64,196,255,0.2)',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', right: -8, bottom: -18, fontSize: 90, opacity: 0.06, pointerEvents: 'none' }}>⚽</div>

        <div style={{ fontSize: 11, color: 'var(--blue)', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
          Próximo partido
        </div>
        <div className="bebas" style={{ fontSize: 32, lineHeight: 1 }}>{NEXT_MATCH.date}</div>
        <div style={{ fontSize: 13, color: 'var(--muted2)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          <i className="ti ti-clock" style={{ fontSize: 15, verticalAlign: -2 }}></i>
          <span style={{ color: 'var(--text)' }}>{NEXT_MATCH.time}</span>
          <span>—</span>
          <span>{NEXT_MATCH.place}</span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--muted2)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
          <i className="ti ti-map-pin" style={{ fontSize: 15, verticalAlign: -2 }}></i>
          <span style={{ color: 'var(--text)' }}>{NEXT_MATCH.city}</span>
        </div>

        {/* Confirmed avatars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14 }}>
          <div style={{ display: 'flex' }}>
            {confirmedUsers.slice(0, 6).map((u, i) => (
              <Avatar key={u.id} user={u} size={30} style={{ marginLeft: i > 0 ? -8 : 0, border: '2px solid #0a1530' }} />
            ))}
            {confirmedUsers.length > 6 && (
              <div style={{
                width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
                border: '2px solid #0a1530', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 10, marginLeft: -8, color: 'var(--muted2)'
              }}>
                +{confirmedUsers.length - 6}
              </div>
            )}
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted2)' }}>{confirmedUsers.length} confirmados</div>
        </div>

        {/* Confirm buttons */}
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <button
            onClick={() => toggleConfirm(true)}
            style={{
              flex: 1, background: confirmed ? 'var(--accent)' : 'rgba(0,230,118,0.15)',
              color: confirmed ? '#000' : 'var(--accent)',
              border: `1px solid ${confirmed ? 'var(--accent)' : 'rgba(0,230,118,0.3)'}`,
              borderRadius: 10, padding: '10px', fontWeight: 700, fontSize: 14,
              transition: 'all .2s'
            }}
          >
            {confirmed ? '✓ Confirmado' : 'Voy ⚽'}
          </button>
          <button
            onClick={() => toggleConfirm(false)}
            style={{
              flex: 1, background: !confirmed ? 'rgba(255,82,82,0.2)' : 'rgba(255,82,82,0.08)',
              color: 'var(--red)',
              border: '1px solid rgba(255,82,82,0.25)',
              borderRadius: 10, padding: '10px', fontWeight: 600, fontSize: 14,
              transition: 'all .2s'
            }}
          >
            No puedo
          </button>
        </div>
      </div>

      {/* Pending section */}
      {pendingVotes.length > 0 && (
        <>
          <SectionTitle>Pendiente</SectionTitle>
          {pendingVotes.map(m => (
            <div key={m.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 16px', borderBottom: '1px solid var(--border)'
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: 'rgba(255,214,0,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <i className="ti ti-trophy" style={{ fontSize: 20, color: 'var(--accent2)' }}></i>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>Votación abierta — {m.date}</div>
                <div style={{ fontSize: 11, color: 'var(--muted2)', marginTop: 2 }}>
                  Repartí tus 10 monedas <span style={{ color: 'var(--accent2)' }}>• Cierra el jueves</span>
                </div>
              </div>
              <button
                onClick={() => openVote(m)}
                style={{
                  background: 'var(--accent2)', color: '#000',
                  borderRadius: 8, padding: '7px 14px',
                  fontSize: 12, fontWeight: 700
                }}
              >
                Votar
              </button>
            </div>
          ))}
        </>
      )}

      {/* Stats mini */}
      <SectionTitle>Tu mes</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '0 16px 16px' }}>
        {[
          { label: 'Puntos Mayo', val: MONTHLY_SEED.find(m => m.userId === currentUser.id)?.pts || 0, sub: () => { const r = MONTHLY_SEED.sort((a,b)=>b.pts-a.pts).findIndex(m=>m.userId===currentUser.id)+1; return `Posición ${r}°` }, valColor: 'var(--accent)' },
          { label: 'Partidos jugados', val: MONTHLY_SEED.find(m => m.userId === currentUser.id)?.pj || 0, sub: () => 'este mes', valColor: 'var(--accent2)' },
        ].map((s, i) => (
          <div key={i} style={{
            background: 'var(--card)', borderRadius: 'var(--radius)',
            padding: '14px', border: '1px solid var(--border)'
          }}>
            <div style={{ fontSize: 11, color: 'var(--muted2)', marginBottom: 4 }}>{s.label}</div>
            <div className="bebas" style={{ fontSize: 34, color: s.valColor, lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>{s.sub()}</div>
          </div>
        ))}
      </div>

      {/* Invitación demo */}
      <SectionTitle>Invitaciones</SectionTitle>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px', borderBottom: '1px solid var(--border)'
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: 'rgba(0,230,118,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          <i className="ti ti-user-plus" style={{ fontSize: 20, color: 'var(--accent)' }}></i>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 500 }}>Partido extra — Sábado 17/05</div>
          <div style={{ fontSize: 11, color: 'var(--muted2)', marginTop: 2 }}>De: Rulo · Cancha Los Nogales</div>
        </div>
        <button
          onClick={() => showToast('Invitación aceptada! 🎉')}
          style={{
            background: 'var(--accent)', color: '#000',
            borderRadius: 8, padding: '7px 14px',
            fontSize: 12, fontWeight: 700
          }}
        >
          Ver
        </button>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   VOTE MODAL
───────────────────────────────────────────── */
function VoteModal({ match, currentUser, users, onClose, showToast }) {
  const playersInMatch = (match.players || []).filter(id => id !== currentUser.id).map(id => users.find(u => u.id === id)).filter(Boolean)
  const [votes, setVotes] = useState({})
  const totalUsed = Object.values(votes).reduce((a, b) => a + b, 0)
  const coinsLeft = 10 - totalUsed

  function change(userId, delta) {
    const cur = votes[userId] || 0
    const next = cur + delta
    if (next < 0) return
    if (delta > 0 && coinsLeft <= 0) return
    setVotes(prev => ({ ...prev, [userId]: next }))
  }

  function submit() {
    save(`voted_${currentUser.id}_${match.id}`, true)
    showToast('Voto enviado! 🏆')
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-drag"></div>
        <div className="bebas" style={{ fontSize: 22, marginBottom: 4 }}>Votación — {match.date}</div>
        <div style={{ textAlign: 'center', margin: '12px 0 16px' }}>
          <div className="bebas" style={{ fontSize: 48, color: coinsLeft > 0 ? 'var(--accent2)' : 'var(--muted)', lineHeight: 1 }}>{coinsLeft}</div>
          <div style={{ fontSize: 12, color: 'var(--muted2)' }}>monedas disponibles</div>
        </div>
        {playersInMatch.map(u => (
          <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            <Avatar user={u} size={36} />
            <div style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{u.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button onClick={() => change(u.id, -1)} style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: 18 }}>−</button>
              <div className="bebas" style={{ fontSize: 22, minWidth: 20, textAlign: 'center', color: (votes[u.id] || 0) > 0 ? 'var(--accent2)' : 'var(--muted)' }}>
                {votes[u.id] || 0}
              </div>
              <button onClick={() => change(u.id, 1)} style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: 18 }}>+</button>
            </div>
          </div>
        ))}
        <button
          onClick={submit}
          style={{
            width: '100%', marginTop: 16, background: 'var(--accent)',
            color: '#000', borderRadius: 12, padding: '13px',
            fontSize: 15, fontWeight: 700
          }}
        >
          Confirmar voto 🏆
        </button>
        <button onClick={onClose} style={{ width: '100%', marginTop: 8, background: 'rgba(255,255,255,0.05)', color: 'var(--text)', borderRadius: 12, padding: '11px', fontSize: 14 }}>Cancelar</button>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   SEASON PAGE
───────────────────────────────────────────── */
function SeasonPage({ currentUser, users, matches, showToast, openVote }) {
  const [tab, setTab] = useState('mensual')

  function getUser(id) { return users.find(u => u.id === id) }

  const rankColors = ['var(--accent2)', '#ccc', '#cd7f32']

  return (
    <div className="fade-in">
      {/* Inner tabs */}
      <div style={{ display: 'flex', gap: 8, padding: '14px 16px 0', overflowX: 'auto' }}>
        {['mensual', 'historial', 'anual'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '7px 18px', borderRadius: 20, fontSize: 13, fontWeight: 500,
              whiteSpace: 'nowrap',
              background: tab === t ? 'var(--accent)' : 'transparent',
              color: tab === t ? '#000' : 'var(--muted2)',
              border: tab === t ? 'none' : '1px solid var(--border2)',
              transition: 'all .2s'
            }}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* MENSUAL */}
      {tab === 'mensual' && (
        <div className="fade-in">
          <div style={{ padding: '12px 16px 4px', fontSize: 12, color: 'var(--muted2)' }}>Mayo 2025 — Tabla de puntos</div>
          <div style={{ margin: '0 16px', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--card2)' }}>
                  {['#', 'Jugador', 'PJ', 'Pts', 'Top1'].map(h => (
                    <th key={h} style={{ padding: '9px 10px', fontSize: 10, color: 'var(--muted2)', fontWeight: 600, textAlign: 'left', textTransform: 'uppercase', letterSpacing: .5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MONTHLY_SEED.sort((a, b) => b.pts - a.pts).map((row, i) => {
                  const u = getUser(row.userId)
                  if (!u) return null
                  return (
                    <tr key={row.userId} style={{ borderTop: '1px solid var(--border)' }}>
                      <td style={{ padding: '11px 10px', color: rankColors[i] || 'var(--muted2)', fontWeight: i < 3 ? 700 : 400, fontFamily: 'Bebas Neue', fontSize: 16 }}>{i + 1}</td>
                      <td style={{ padding: '11px 10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Avatar user={u} size={26} />
                          <span style={{ fontWeight: row.userId === currentUser.id ? 600 : 400, color: row.userId === currentUser.id ? 'var(--accent)' : 'var(--text)' }}>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '11px 10px', color: 'var(--muted2)' }}>{row.pj}</td>
                      <td style={{ padding: '11px 10px', fontWeight: 600, color: 'var(--accent)' }}>{row.pts}</td>
                      <td style={{ padding: '11px 10px', color: 'var(--muted2)' }}>{row.top1}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* HISTORIAL */}
      {tab === 'historial' && (
        <div className="fade-in">
          <div style={{ padding: '12px 16px 4px', fontSize: 12, color: 'var(--muted2)' }}>Últimos partidos</div>
          {matches.map(m => {
            const voted = load(`voted_${currentUser.id}_${m.id}`, false)
            const canVote = m.votingOpen && !voted
            return (
              <div key={m.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '13px 16px', borderBottom: '1px solid var(--border)'
              }}>
                <div style={{ fontSize: 10, color: 'var(--muted2)', width: 48, lineHeight: 1.4, flexShrink: 0 }}>
                  {m.date.slice(0, 5).replace('/', '\n')}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: 13 }}>{m.teams}</div>
                  <div style={{ fontFamily: 'Bebas Neue', fontSize: 18, color: 'var(--text)', marginTop: 1 }}>{m.score}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>{m.place}</div>
                </div>
                {m.votingOpen || m.votingClosed ? (
                  <button
                    onClick={() => canVote ? openVote(m) : null}
                    disabled={!canVote}
                    style={{
                      background: canVote ? 'transparent' : 'transparent',
                      border: `1px solid ${canVote ? 'var(--accent2)' : 'var(--muted)'}`,
                      color: canVote ? 'var(--accent2)' : 'var(--muted)',
                      borderRadius: 8, padding: '6px 12px',
                      fontSize: 11, fontWeight: 600,
                      opacity: canVote ? 1 : 0.5,
                      cursor: canVote ? 'pointer' : 'not-allowed'
                    }}
                  >
                    {voted ? 'Votado ✓' : canVote ? 'Votar' : 'Cerrado'}
                  </button>
                ) : null}
              </div>
            )
          })}
        </div>
      )}

      {/* ANUAL */}
      {tab === 'anual' && (
        <div className="fade-in">
          <div style={{ padding: '12px 16px 4px', fontSize: 12, color: 'var(--muted2)' }}>Temporada 2025 — Ranking general</div>
          <div style={{ margin: '0 16px', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--card2)' }}>
                  {['#', 'Jugador', 'PJ', 'Pts', 'Casacas'].map(h => (
                    <th key={h} style={{ padding: '9px 10px', fontSize: 10, color: 'var(--muted2)', fontWeight: 600, textAlign: 'left', textTransform: 'uppercase', letterSpacing: .5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ANNUAL_SEED.sort((a, b) => b.pts - a.pts).map((row, i) => {
                  const u = getUser(row.userId)
                  if (!u) return null
                  return (
                    <tr key={row.userId} style={{ borderTop: '1px solid var(--border)' }}>
                      <td style={{ padding: '11px 10px', color: rankColors[i] || 'var(--muted2)', fontWeight: i < 3 ? 700 : 400, fontFamily: 'Bebas Neue', fontSize: 16 }}>{i + 1}</td>
                      <td style={{ padding: '11px 10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Avatar user={u} size={26} />
                          <span style={{ fontWeight: row.userId === currentUser.id ? 600 : 400, color: row.userId === currentUser.id ? 'var(--accent)' : 'var(--text)' }}>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '11px 10px', color: 'var(--muted2)' }}>{row.pj}</td>
                      <td style={{ padding: '11px 10px', fontWeight: 600, color: 'var(--accent)' }}>{row.pts}</td>
                      <td style={{ padding: '11px 10px' }}>{row.casacas > 0 ? `${row.casacas} 👕` : <span style={{ color: 'var(--muted)' }}>—</span>}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────
   PLAYER CARD MODAL
───────────────────────────────────────────── */
function PlayerCardModal({ player, idealData, onClose }) {
  if (!player) return null
  const data = idealData.find(d => d.userId === player.id) || { pts: 0, top5: 0 }
  const annualData = ANNUAL_SEED.find(d => d.userId === player.id) || { pj: 0 }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-drag"></div>

        {/* Card */}
        <div style={{
          background: 'linear-gradient(135deg, #0c1a40, #08102a)',
          borderRadius: 20, padding: '24px 20px',
          textAlign: 'center',
          border: `1px solid ${player.textColor}44`,
          position: 'relative', overflow: 'hidden'
        }}>
          <div className="bebas" style={{ fontSize: 72, lineHeight: 1, color: 'rgba(255,255,255,0.06)', position: 'absolute', top: -8, left: 16 }}>
            {player.number}
          </div>
          <div className="bebas" style={{ fontSize: 72, lineHeight: 1, color: 'rgba(255,255,255,0.04)', position: 'absolute', right: -8, bottom: -8 }}>
            {player.initials}
          </div>

          <Avatar user={player} size={80} style={{ margin: '0 auto 12px', border: `3px solid ${player.textColor}` }} />
          <div className="bebas" style={{ fontSize: 30, letterSpacing: 1 }}>{player.name.toUpperCase()}</div>
          <div style={{ fontSize: 12, color: player.textColor, marginTop: 2, letterSpacing: 1 }}>{POS_LABELS[player.pos] || player.pos}</div>
          <div className="badge badge-blue" style={{ marginTop: 8 }}>#{player.number}</div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 18 }}>
            {[
              { val: data.pts, label: 'pts mes' },
              { val: annualData.pj, label: 'partidos' },
              { val: data.top5, label: 'top 5' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '10px 6px' }}>
                <div className="bebas" style={{ fontSize: 24, color: 'var(--accent)' }}>{s.val}</div>
                <div style={{ fontSize: 10, color: 'var(--muted2)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={onClose} style={{ width: '100%', marginTop: 14, background: 'rgba(255,255,255,0.07)', color: 'var(--text)', borderRadius: 12, padding: '12px', fontSize: 14 }}>
          Cerrar
        </button>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   IDEAL 5 PAGE
───────────────────────────────────────────── */
function IdealPage({ users, showToast }) {
  const [selectedPlayer, setSelectedPlayer] = useState(null)

  const sorted = [...IDEAL5_SEED].sort((a, b) => b.pts - a.pts)
  const top5 = sorted.slice(0, 5)
  const getUser = id => users.find(u => u.id === id)

  // Layout: GK, 2 DEF/MED, 2 FWD/MED
  const positions = [
    [top5[2]],           // GK slot — 3rd
    [top5[3], top5[4]],  // DEF row
    [top5[0], top5[1]],  // FWD row — top 2
  ]

  function PlayerNode({ entry, isTop }) {
    const u = getUser(entry.userId)
    if (!u) return null
    return (
      <div
        onClick={() => setSelectedPlayer(u)}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, width: 70, cursor: 'pointer' }}
      >
        <Avatar user={u} size={50} style={{
          border: `2.5px solid ${isTop ? 'var(--accent2)' : 'rgba(255,255,255,0.25)'}`,
          background: isTop ? 'rgba(255,214,0,0.15)' : u.color,
          transition: 'transform .15s'
        }} />
        <div style={{ fontSize: 10, fontWeight: 600, textAlign: 'center', whiteSpace: 'nowrap' }}>{u.name}</div>
        <div style={{ fontSize: 10, color: 'var(--accent2)' }}>{entry.pts} pts</div>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <SectionTitle>5 Ideal — Mayo</SectionTitle>

      {/* Pitch */}
      <div style={{
        margin: '0 16px',
        background: 'linear-gradient(180deg, #0f2a0f 0%, #163a16 50%, #0f2a0f 100%)',
        borderRadius: 20, padding: '20px 10px 24px',
        border: '2px solid rgba(255,255,255,0.07)',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Pitch lines SVG */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.1, pointerEvents: 'none' }} viewBox="0 0 360 280" xmlns="http://www.w3.org/2000/svg">
          <rect x="60" y="10" width="240" height="260" fill="none" stroke="white" strokeWidth="1.5"/>
          <circle cx="180" cy="140" r="42" fill="none" stroke="white" strokeWidth="1.5"/>
          <line x1="60" y1="140" x2="300" y2="140" stroke="white" strokeWidth="1.5"/>
          <rect x="130" y="10" width="100" height="32" fill="none" stroke="white" strokeWidth="1.5"/>
          <rect x="130" y="238" width="100" height="32" fill="none" stroke="white" strokeWidth="1.5"/>
          <circle cx="180" cy="10" r="3" fill="white"/>
          <circle cx="180" cy="270" r="3" fill="white"/>
        </svg>

        <div style={{ textAlign: 'center', marginBottom: 14 }}>
          <span className="bebas" style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', letterSpacing: 3 }}>MAYO 2025</span>
        </div>

        {positions.map((row, ri) => (
          <div key={ri} style={{ display: 'flex', justifyContent: 'center', gap: 16, margin: ri === 0 ? '0 0 20px' : ri === 1 ? '0 0 20px' : '0' }}>
            {row.map((entry, i) => (
              <PlayerNode key={entry.userId} entry={entry} isTop={entry === top5[0] || entry === top5[1]} />
            ))}
          </div>
        ))}

        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>
          Tocá un jugador para ver su card
        </div>
      </div>

      {/* Table */}
      <SectionTitle style={{ marginTop: 8 }}>Ranking del mes</SectionTitle>
      {sorted.map((entry, i) => {
        const u = getUser(entry.userId)
        if (!u) return null
        const pct = Math.round((entry.pts / sorted[0].pts) * 100)
        return (
          <div
            key={u.id}
            onClick={() => setSelectedPlayer(u)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 16px', borderBottom: '1px solid var(--border)',
              cursor: 'pointer', transition: 'background .15s'
            }}
          >
            <div className="bebas" style={{ fontSize: 18, width: 22, textAlign: 'center', color: ['var(--accent2)', '#ccc', '#cd7f32'][i] || 'var(--muted)' }}>{i + 1}</div>
            <Avatar user={u} size={36} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{u.name}</div>
              <div style={{ height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 2, marginTop: 5 }}>
                <div style={{ height: '100%', width: `${pct}%`, background: 'var(--accent)', borderRadius: 2, transition: 'width .4s' }}></div>
              </div>
            </div>
            <div className="bebas" style={{ fontSize: 20, color: 'var(--accent)' }}>{entry.pts}</div>
          </div>
        )
      })}

      {selectedPlayer && (
        <PlayerCardModal
          player={selectedPlayer}
          idealData={IDEAL5_SEED}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────
   FEED PAGE
───────────────────────────────────────────── */
function FeedPage({ currentUser, users, showToast }) {
  const [posts, setPosts] = useState(load('feed_posts', FEED_SEED))
  const [newText, setNewText] = useState('')
  const textareaRef = useRef(null)

  function getUser(id) { return users.find(u => u.id === id) }

  function addPost() {
    if (!newText.trim()) return
    const post = {
      id: Date.now(),
      userId: currentUser.id,
      text: newText.trim(),
      time: 'Ahora',
      likes: [],
      comments: 0,
      mediaType: null
    }
    const updated = [post, ...posts]
    setPosts(updated)
    save('feed_posts', updated)
    setNewText('')
    showToast('Publicado! 🎉')
  }

  function toggleLike(postId) {
    const updated = posts.map(p => {
      if (p.id !== postId) return p
      const liked = p.likes.includes(currentUser.id)
      return { ...p, likes: liked ? p.likes.filter(id => id !== currentUser.id) : [...p.likes, currentUser.id] }
    })
    setPosts(updated)
    save('feed_posts', updated)
  }

  return (
    <div className="fade-in" style={{ paddingBottom: 16 }}>
      {/* Compose */}
      <div style={{
        margin: '14px 16px',
        background: 'var(--card)',
        borderRadius: 'var(--radius)', padding: 14,
        border: '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <Avatar user={currentUser} size={34} />
          <textarea
            ref={textareaRef}
            placeholder="¿Qué onda pibes?"
            value={newText}
            onChange={e => setNewText(e.target.value)}
            rows={2}
            style={{ flex: 1, resize: 'none', fontSize: 14, lineHeight: 1.5 }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 10, gap: 6 }}>
          {[
            { icon: 'ti-video', color: 'var(--blue)', label: 'Video' },
            { icon: 'ti-photo', color: 'var(--accent)', label: 'Foto' },
            { icon: 'ti-mood-happy', color: 'var(--accent2)', label: 'GIF' },
          ].map(a => (
            <button
              key={a.icon}
              onClick={() => showToast(`${a.label} — próximamente 🚧`)}
              style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 8, padding: '7px 10px', color: a.color }}
            >
              <i className={`ti ${a.icon}`} style={{ fontSize: 18 }}></i>
            </button>
          ))}
          <button
            onClick={addPost}
            style={{
              marginLeft: 'auto', background: 'var(--accent)', color: '#000',
              borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 13
            }}
          >
            Publicar
          </button>
        </div>
      </div>

      {/* Posts */}
      {posts.map(post => {
        const author = getUser(post.userId)
        if (!author) return null
        const liked = post.likes.includes(currentUser.id)
        return (
          <div key={post.id} style={{
            margin: '0 16px 12px',
            background: 'var(--card)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px' }}>
              <Avatar user={author} size={36} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{author.name}</div>
                <div style={{ fontSize: 11, color: 'var(--muted2)' }}>{post.time}</div>
              </div>
              <div style={{ marginLeft: 'auto', color: 'var(--muted)', fontSize: 20 }}>
                <i className="ti ti-dots"></i>
              </div>
            </div>

            {/* Media placeholder */}
            {post.mediaType === 'video' && (
              <div style={{
                width: '100%', height: 180,
                background: 'linear-gradient(135deg, var(--card2), #0c1a40)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <i className="ti ti-player-play" style={{ fontSize: 48, color: 'rgba(255,255,255,0.15)' }}></i>
              </div>
            )}
            {post.mediaType === 'image' && (
              <div style={{
                width: '100%', height: 180,
                background: 'linear-gradient(135deg, #0f2a0f, var(--card2))',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <i className="ti ti-photo" style={{ fontSize: 48, color: 'rgba(255,255,255,0.15)' }}></i>
              </div>
            )}

            {/* Body */}
            <div style={{ padding: '0 14px 12px', fontSize: 14, lineHeight: 1.6 }}>{post.text}</div>

            {/* Footer */}
            <div style={{ display: 'flex', borderTop: '1px solid var(--border)' }}>
              {[
                {
                  icon: liked ? 'ti-heart-filled' : 'ti-heart',
                  label: post.likes.length,
                  color: liked ? 'var(--red)' : 'var(--muted2)',
                  action: () => toggleLike(post.id)
                },
                {
                  icon: 'ti-message',
                  label: post.comments,
                  color: 'var(--muted2)',
                  action: () => showToast('Comentarios — próximamente 🚧')
                },
                {
                  icon: 'ti-share',
                  label: 'Compartir',
                  color: 'var(--muted2)',
                  action: () => showToast('Compartido! 🔗')
                },
              ].map((a, i) => (
                <button
                  key={i}
                  onClick={a.action}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: 6, padding: '10px', color: a.color,
                    background: 'none', fontSize: 12, transition: 'color .15s'
                  }}
                >
                  <i className={`ti ${a.icon}`} style={{ fontSize: 17 }}></i>
                  {a.label !== undefined && <span>{a.label}</span>}
                </button>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ─────────────────────────────────────────────
   ADMIN PANEL (solo para admins)
───────────────────────────────────────────── */
function AdminPanel({ users, showToast, onClose }) {
  const [newName, setNewName] = useState('')
  const [newPos, setNewPos] = useState('MED')
  const [newNumber, setNewNumber] = useState('')

  function createPlayer() {
    if (!newName.trim()) { showToast('Ponele un nombre 😅'); return }
    showToast(`Jugador ${newName} creado! (demo)`)
    setNewName(''); setNewNumber('')
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-drag"></div>
        <div className="bebas" style={{ fontSize: 22, marginBottom: 16 }}>Panel Admin</div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: 'var(--muted2)', marginBottom: 6 }}>Crear nuevo jugador</div>
          <input placeholder="Nombre del jugador" value={newName} onChange={e => setNewName(e.target.value)} style={{ width: '100%', marginBottom: 8 }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <input placeholder="Nro" value={newNumber} onChange={e => setNewNumber(e.target.value)} style={{ width: 70 }} />
            <select value={newPos} onChange={e => setNewPos(e.target.value)} style={{
              flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid var(--border2)',
              borderRadius: 'var(--radius-sm)', color: 'var(--text)', padding: '10px 14px',
              fontFamily: 'DM Sans', fontSize: 14, outline: 'none'
            }}>
              <option value="GK">Arquero</option>
              <option value="DEF">Defensor</option>
              <option value="MED">Mediocampista</option>
              <option value="DEL">Delantero</option>
            </select>
          </div>
        </div>

        <button onClick={createPlayer} style={{ width: '100%', background: 'var(--accent)', color: '#000', borderRadius: 12, padding: '12px', fontWeight: 700, fontSize: 15, marginBottom: 8 }}>
          Crear jugador
        </button>

        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 12, color: 'var(--muted2)', marginBottom: 8 }}>Confirmar jugadores próximo partido</div>
          {users.map(u => (
            <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <Avatar user={u} size={30} />
              <span style={{ flex: 1, fontSize: 13 }}>{u.name}</span>
              <button
                onClick={() => showToast(`${u.name} confirmado! ✅`)}
                style={{ background: 'rgba(0,230,118,0.1)', color: 'var(--accent)', border: '1px solid rgba(0,230,118,0.2)', borderRadius: 8, padding: '5px 12px', fontSize: 11, fontWeight: 600 }}
              >
                Confirmar
              </button>
            </div>
          ))}
        </div>

        <button onClick={onClose} style={{ width: '100%', marginTop: 14, background: 'rgba(255,255,255,0.07)', color: 'var(--text)', borderRadius: 12, padding: '11px', fontSize: 14 }}>
          Cerrar
        </button>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────── */
export default function App() {
  const [currentUser, setCurrentUser] = useState(() => load('current_user', null))
  const [activePage, setActivePage] = useState('home')
  const [voteMatch, setVoteMatch] = useState(null)
  const [showAdmin, setShowAdmin] = useState(false)
  const [toast, setToast] = useState({ msg: '', visible: false })
  const toastTimer = useRef(null)

  const users = USERS_SEED
  const matches = MATCHES_SEED

  // Inject CSS
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = globalCSS
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  function showToast(msg) {
    clearTimeout(toastTimer.current)
    setToast({ msg, visible: true })
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 2500)
  }

  function handleLogin(user) {
    save('current_user', user)
    setCurrentUser(user)
  }

  function handleLogout() {
    save('current_user', null)
    setCurrentUser(null)
    setActivePage('home')
  }

  function openVote(match) {
    setVoteMatch(match)
  }

  if (!currentUser) return <LoginScreen onLogin={handleLogin} />

  const navItems = [
    { id: 'home',   icon: 'ti-home',           label: 'Inicio' },
    { id: 'season', icon: 'ti-trophy',          label: 'Temporada' },
    { id: 'ideal',  icon: 'ti-shirt',           label: '5 Ideal' },
    { id: 'feed',   icon: 'ti-message-circle',  label: 'Feed' },
  ]

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', maxWidth: 430, margin: '0 auto', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>

      {/* TOP BAR */}
      <div style={{
        background: 'var(--bg2)', padding: '12px 16px 10px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--border)', flexShrink: 0
      }}>
        <div>
          <div className="bebas" style={{ fontSize: 22, color: 'var(--accent)', letterSpacing: 1 }}>AL-KOLIKO FC</div>
          <div style={{ fontSize: 11, color: 'var(--muted2)', marginTop: 1 }}>Temporada 2025</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {currentUser.role === 'admin' && (
            <button
              onClick={() => setShowAdmin(true)}
              style={{
                background: 'rgba(255,214,0,0.12)', color: 'var(--accent2)',
                border: '1px solid rgba(255,214,0,0.2)',
                borderRadius: 8, padding: '6px 10px', fontSize: 11, fontWeight: 600
              }}
            >
              <i className="ti ti-settings" style={{ fontSize: 15 }}></i>
            </button>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <Avatar user={currentUser} size={34} onClick={handleLogout} style={{ cursor: 'pointer' }} />
            <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 2 }}>Salir</div>
          </div>
        </div>
      </div>

      {/* PAGE CONTENT */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        {activePage === 'home' && (
          <HomePage
            currentUser={currentUser} users={users} matches={matches}
            showToast={showToast} openVote={openVote}
          />
        )}
        {activePage === 'season' && (
          <SeasonPage
            currentUser={currentUser} users={users} matches={matches}
            showToast={showToast} openVote={openVote}
          />
        )}
        {activePage === 'ideal' && (
          <IdealPage users={users} showToast={showToast} />
        )}
        {activePage === 'feed' && (
          <FeedPage currentUser={currentUser} users={users} showToast={showToast} />
        )}
      </div>

      {/* BOTTOM NAV */}
      <nav style={{
        background: 'var(--bg2)', borderTop: '1px solid var(--border)',
        display: 'flex', flexShrink: 0
      }}>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            style={{
              flex: 1, padding: '10px 0 8px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              background: 'none', color: activePage === item.id ? 'var(--accent)' : 'var(--muted)',
              transition: 'color .2s', fontSize: 10, fontWeight: 500
            }}
          >
            <i className={`ti ${item.icon}`} style={{ fontSize: 22 }}></i>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* MODALS */}
      {voteMatch && (
        <VoteModal
          match={voteMatch} currentUser={currentUser} users={users}
          onClose={() => setVoteMatch(null)} showToast={showToast}
        />
      )}
      {showAdmin && (
        <AdminPanel users={users} showToast={showToast} onClose={() => setShowAdmin(false)} />
      )}

      {/* TOAST */}
      <div
        className={`toast ${toast.visible ? 'show' : 'hide'}`}
        style={{ opacity: toast.visible ? 1 : 0 }}
      >
        {toast.msg}
      </div>
    </div>
  )
}
