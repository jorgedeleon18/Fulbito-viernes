// ═══════════════════════════════════════════════════════════════════
// CREAR ADMINS · Fulbito Viernes
// Corré ESTO DESPUÉS de: (1) agregar_rol.sql  (2) borrar los usuarios de prueba
//
// USO (Windows CMD), parado en la carpeta del proyecto:
//   set SUPABASE_SECRET_KEY=sb_secret_TU_KEY_ACA
//   node crear-admins.js
// ═══════════════════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nkxixedgjtnmqcgmeutq.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SECRET_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error('\n❌ Falta la Secret key. Antes de correr, ejecutá:');
  console.error('   set SUPABASE_SECRET_KEY=sb_secret_TU_KEY_ACA\n');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// ─── LOS DOS ADMINS ───────────────────────────────────────────────────────────
const admins = [
  { nombre: 'Jorge', apellido: 'De Leon', apodo: 'Jorgi', email: 'jorgi77o@fulbito.com', password: 'Scocco32',
    rareza: 'oro', color: '#c9a84c', posicion: 'Mediocampista', pierna: 'Derecha', nivel: 'Avanzado',
    velocidad: 78, pase: 80, defensa: 72, tiro: 76, tecnica: 79, resistencia: 74, numero: '10' },
  { nombre: 'Juank', apellido: 'Molina', apodo: 'El Estratega', email: 'juank@fulbito.com', password: 'juank123',
    rareza: 'oro', color: '#2563eb', posicion: 'Defensor', pierna: 'Derecha', nivel: 'Avanzado',
    velocidad: 76, pase: 82, defensa: 80, tiro: 70, tecnica: 78, resistencia: 77, numero: '4' },
];

async function crear() {
  console.log('🚀 Creando admins...\n');
  for (const u of admins) {
    try {
      const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
        email: u.email, password: u.password, email_confirm: true,
      });
      if (authErr) { console.error(`❌ Auth ${u.nombre}: ${authErr.message}`); continue; }
      const uid = authData.user.id;
      console.log(`✅ Auth creado: ${u.nombre} (${uid})`);

      const { error: dbErr } = await supabase.from('jugadores').upsert({
        id: uid, nombre: u.nombre, apellido: u.apellido, apodo: u.apodo, email: u.email,
        is_admin: true, rol: 'admin', rareza: u.rareza, color: u.color, posicion: u.posicion,
        pierna: u.pierna, ciudad: 'Buenos Aires', nivel: u.nivel, numero: u.numero,
        velocidad: u.velocidad, pase: u.pase, defensa: u.defensa, tiro: u.tiro,
        tecnica: u.tecnica, resistencia: u.resistencia,
        pj: 0, mvps: 0, goles: 0, asist: 0, puntos_mes: 0, puntos_anio: 0,
      }, { onConflict: 'id' });

      if (dbErr) console.error(`⚠️  DB ${u.nombre}: ${dbErr.message}`);
      else console.log(`✅ Admin listo: ${u.nombre}`);
    } catch (err) {
      console.error(`💥 ${u.nombre}:`, err.message);
    }
  }
  console.log('\n🎉 ¡Listo! Login: jorgi77o / Scocco32  ·  juank / juank123');
}

crear();
