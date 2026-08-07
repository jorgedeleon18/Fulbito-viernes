// ═══════════════════════════════════════════════════════════════════
// CREAR USUARIOS EN SUPABASE AUTH · Fulbito Viernes
//
// CÓMO USAR (Windows CMD), parado en la carpeta del proyecto:
//   set SUPABASE_SECRET_KEY=sb_secret_TU_KEY_ACA
//   node crear-usuarios.js
//
// La Secret key la sacás de: Supabase → Settings → API Keys → Secret keys
// (la que empieza con sb_secret_). NUNCA la escribas dentro de este archivo
// ni la subas a GitHub.
// ═══════════════════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nkxixedgjtnmqcgmeutq.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SECRET_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error('\n❌ Falta la Secret key.');
  console.error('   Antes de correr el script, ejecutá en la misma terminal:');
  console.error('   set SUPABASE_SECRET_KEY=sb_secret_TU_KEY_ACA\n');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// ─── LISTA DE USUARIOS ────────────────────────────────────────────────────────
const usuarios = [
  // ADMINS
  { nombre: 'Juan',    apellido: 'Cachete', apodo: 'Juank',   email: 'juank@fulbito.com',   password: 'juank123',   is_admin: true,
    rareza: 'oro',    color: '#F6D365', posicion: 'Mediocampista', pierna: 'Derecha',   nivel: 'Avanzado',
    velocidad: 80, pase: 82, defensa: 70, tiro: 78, tecnica: 81, resistencia: 75, numero: '10' },
  { nombre: 'Cachete', apellido: '',        apodo: 'Cachete', email: 'cachete@fulbito.com', password: 'cachete123', is_admin: true,
    rareza: 'oro',    color: '#FDA085', posicion: 'Delantero',     pierna: 'Derecha',   nivel: 'Avanzado',
    velocidad: 82, pase: 75, defensa: 65, tiro: 85, tecnica: 78, resistencia: 72, numero: '9' },
  // JUGADORES
  { nombre: 'Jony',    apellido: '',        apodo: 'Jony',    email: 'jony@fulbito.com',    password: 'jony123',    is_admin: false,
    rareza: 'plata',  color: '#C0C0C0', posicion: 'Extremo',       pierna: 'Izquierda', nivel: 'Avanzado',
    velocidad: 85, pase: 74, defensa: 60, tiro: 76, tecnica: 79, resistencia: 70, numero: '7' },
  { nombre: 'Bachata', apellido: '',        apodo: 'Bachata', email: 'bachata@fulbito.com', password: 'bachata123', is_admin: false,
    rareza: 'plata',  color: '#94a3b8', posicion: 'Defensor',      pierna: 'Derecha',   nivel: 'Intermedio',
    velocidad: 72, pase: 70, defensa: 82, tiro: 65, tecnica: 68, resistencia: 80, numero: '5' },
  { nombre: 'Lalo',    apellido: '',        apodo: 'Lalo',    email: 'lalo@fulbito.com',    password: 'lalo123',    is_admin: false,
    rareza: 'bronce', color: '#CD7F32', posicion: 'Mediocampista', pierna: 'Derecha',   nivel: 'Intermedio',
    velocidad: 75, pase: 76, defensa: 68, tiro: 72, tecnica: 74, resistencia: 73, numero: '8' },
  { nombre: 'Eze',     apellido: '',        apodo: 'Eze',     email: 'eze@fulbito.com',     password: 'eze123',     is_admin: false,
    rareza: 'plata',  color: '#60a5fa', posicion: 'Delantero',     pierna: 'Derecha',   nivel: 'Avanzado',
    velocidad: 83, pase: 72, defensa: 58, tiro: 84, tecnica: 77, resistencia: 68, numero: '11' },
  { nombre: 'Bocha',   apellido: '',        apodo: 'Bocha',   email: 'bocha@fulbito.com',   password: 'bocha123',   is_admin: false,
    rareza: 'bronce', color: '#a78bfa', posicion: 'Arquero',       pierna: 'Derecha',   nivel: 'Intermedio',
    velocidad: 65, pase: 62, defensa: 85, tiro: 60, tecnica: 65, resistencia: 78, numero: '1' },
  { nombre: 'Andy',    apellido: '',        apodo: 'Andy',    email: 'andy@fulbito.com',    password: 'andy123',    is_admin: false,
    rareza: 'bronce', color: '#34d399', posicion: 'Lateral',       pierna: 'Izquierda', nivel: 'Intermedio',
    velocidad: 79, pase: 73, defensa: 76, tiro: 68, tecnica: 71, resistencia: 77, numero: '3' },
  { nombre: 'Santi',   apellido: '',        apodo: 'Santi',   email: 'santi@fulbito.com',   password: 'santi123',   is_admin: false,
    rareza: 'bronce', color: '#f472b6', posicion: 'Volante',       pierna: 'Derecha',   nivel: 'Intermedio',
    velocidad: 76, pase: 78, defensa: 65, tiro: 70, tecnica: 75, resistencia: 72, numero: '6' },
  { nombre: 'Luchi',   apellido: '',        apodo: 'Luchi',   email: 'luchi@fulbito.com',   password: 'luchi123',   is_admin: false,
    rareza: 'bronce', color: '#fb923c', posicion: 'Defensor',      pierna: 'Derecha',   nivel: 'Principiante',
    velocidad: 68, pase: 65, defensa: 75, tiro: 63, tecnica: 64, resistencia: 74, numero: '4' },
  { nombre: 'Masi',    apellido: '',        apodo: 'Masi',    email: 'masi@fulbito.com',    password: 'masi123',    is_admin: false,
    rareza: 'bronce', color: '#e2e8f0', posicion: 'Mediocampista', pierna: 'Ambas',     nivel: 'Intermedio',
    velocidad: 74, pase: 79, defensa: 67, tiro: 71, tecnica: 76, resistencia: 70, numero: '14' },
  { nombre: 'Pocho',   apellido: '',        apodo: 'Pocho',   email: 'pocho@fulbito.com',   password: 'pocho123',   is_admin: false,
    rareza: 'bronce', color: '#fbbf24', posicion: 'Extremo',       pierna: 'Derecha',   nivel: 'Intermedio',
    velocidad: 81, pase: 70, defensa: 60, tiro: 73, tecnica: 72, resistencia: 69, numero: '17' },
];

// ─── FUNCIÓN PRINCIPAL ────────────────────────────────────────────────────────
async function crearUsuarios() {
  console.log('🚀 Iniciando creación de usuarios...\n');

  for (const u of usuarios) {
    try {
      // 1. Crear en Supabase Auth (el trigger crea la fila básica en jugadores)
      const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
        email: u.email,
        password: u.password,
        email_confirm: true,
      });

      if (authErr) {
        console.error(`❌ Error Auth para ${u.nombre}: ${authErr.message}`);
        continue;
      }

      const uid = authData.user.id;
      console.log(`✅ Auth creado: ${u.nombre} (${uid})`);

      // 2. Completar los datos del jugador con UPSERT (no rompe si el trigger ya lo creó)
      const { error: dbErr } = await supabase.from('jugadores').upsert({
        id: uid,
        nombre: u.nombre,
        apellido: u.apellido || '',
        apodo: u.apodo,
        email: u.email,
        is_admin: u.is_admin,
        rareza: u.rareza,
        color: u.color,
        posicion: u.posicion,
        pierna: u.pierna,
        ciudad: 'Buenos Aires',
        nivel: u.nivel,
        numero: u.numero,
        velocidad: u.velocidad,
        pase: u.pase,
        defensa: u.defensa,
        tiro: u.tiro,
        tecnica: u.tecnica,
        resistencia: u.resistencia,
        pj: 0, mvps: 0, goles: 0, asist: 0, puntos_mes: 0, puntos_anio: 0,
      }, { onConflict: 'id' });

      if (dbErr) {
        console.error(`⚠️  DB error para ${u.nombre}: ${dbErr.message}`);
      } else {
        console.log(`✅ Jugador completado: ${u.nombre} (${u.is_admin ? 'ADMIN' : 'jugador'})`);
      }

    } catch (err) {
      console.error(`💥 Error inesperado para ${u.nombre}:`, err.message);
    }
  }

  console.log('\n🎉 ¡Listo! Revisá los resultados arriba.');
  console.log('📌 Verificá en: Supabase → Authentication → Users, y Table Editor → jugadores');
}

crearUsuarios();
