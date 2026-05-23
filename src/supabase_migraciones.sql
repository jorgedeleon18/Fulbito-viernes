-- ═══════════════════════════════════════════════════════════════════
-- FULBITO VIERNES · SUPABASE SQL
-- Ejecutar en: supabase.com → SQL Editor del proyecto fulbito-viernes
-- ═══════════════════════════════════════════════════════════════════

-- ─── 1. COLUMNAS PENDIENTES ──────────────────────────────────────────
-- Agregar columnas que faltaban en la tabla jugadores
ALTER TABLE jugadores ADD COLUMN IF NOT EXISTS equipo_arg TEXT;
ALTER TABLE jugadores ADD COLUMN IF NOT EXISTS equipo_eu TEXT;
ALTER TABLE jugadores ADD COLUMN IF NOT EXISTS liga_eu TEXT;
ALTER TABLE jugadores ADD COLUMN IF NOT EXISTS celular TEXT;
ALTER TABLE jugadores ADD COLUMN IF NOT EXISTS numero TEXT DEFAULT '10';

-- También asegurarse que la tabla partidos tiene las columnas necesarias
ALTER TABLE partidos ADD COLUMN IF NOT EXISTS equipo_a UUID[] DEFAULT '{}';
ALTER TABLE partidos ADD COLUMN IF NOT EXISTS equipo_b UUID[] DEFAULT '{}';
ALTER TABLE partidos ADD COLUMN IF NOT EXISTS rechazados UUID[] DEFAULT '{}';
ALTER TABLE partidos ADD COLUMN IF NOT EXISTS votacion_activa BOOLEAN DEFAULT false;


-- ─── 2. BORRAR USUARIOS EXISTENTES ───────────────────────────────────
-- PASO 1: Borrar datos de la tabla jugadores (los registros de Supabase Auth
--         también se borran con el trigger, pero hay que hacerlo desde
--         el Dashboard → Authentication → Users, uno por uno, o con este approach)

-- Primero borramos las referencias en tablas que usan jugador_id
DELETE FROM votos;
DELETE FROM likes;
DELETE FROM comentarios;
DELETE FROM posts;
DELETE FROM jugadores;

-- Los usuarios de Supabase Auth (Auth → Users) debés borrarlos manualmente
-- desde el dashboard o usando la service_role key. 
-- Ve a: supabase.com → tu proyecto → Authentication → Users → seleccioná todos → Delete


-- ─── 3. INSERTAR NUEVOS JUGADORES ────────────────────────────────────
-- IMPORTANTE: Primero creá los usuarios desde Supabase Auth (Authentication → Users → Invite)
-- O mejor: dejá que se registren solos con el formulario de la app.
-- 
-- Si querés crearlos directamente, usá el script de Node.js de abajo (OPCIÓN B).
--
-- Una vez creados en Auth con sus UUIDs, insertá en jugadores:

-- ═══════════════════════════════════════════════════════════════════
-- OPCIÓN A: SQL directo (reemplazá los UUIDs con los reales de Auth)
-- ═══════════════════════════════════════════════════════════════════

-- TEMPLATE para cada jugador. Reemplazá UUID_AQUI con el id real de Auth.
-- 
-- INSERT INTO jugadores (id, nombre, apellido, apodo, email, is_admin, rareza, color,
--   posicion, pierna, ciudad, nivel, numero,
--   velocidad, pase, defensa, tiro, tecnica, resistencia,
--   pj, mvps, goles, asist, puntos_mes, puntos_anio)
-- VALUES (
--   'UUID_AQUI', 'Juan', 'Koliko', 'Juank', 'juank@fulbito.com', true, 'oro', '#F6D365',
--   'Mediocampista', 'Derecha', 'Buenos Aires', 'Avanzado', '10',
--   80, 82, 70, 78, 81, 75,
--   0, 0, 0, 0, 0, 0
-- );


-- ═══════════════════════════════════════════════════════════════════
-- OPCIÓN B (RECOMENDADA): Script Node.js para crear usuarios en Auth
-- Ejecutar desde tu máquina con: node crear-usuarios.js
-- ═══════════════════════════════════════════════════════════════════

/*
Guardá esto como crear-usuarios.js en la raíz del proyecto y ejecutalo con:
  node crear-usuarios.js

Necesitás la SERVICE_ROLE KEY (no la anon key).
Encontrala en: supabase.com → Settings → API → service_role
*/


-- ─── 4. POLÍTICA RLS PARA jugadores ──────────────────────────────────
-- Asegurarse de que los jugadores pueden leer todos y editar solo el suyo
-- (si ya las tenés configuradas, podés saltar esto)

-- Permite lectura pública de jugadores
DROP POLICY IF EXISTS "jugadores_select" ON jugadores;
CREATE POLICY "jugadores_select" ON jugadores
  FOR SELECT USING (true);

-- Permite a cada usuario editar su propio perfil
DROP POLICY IF EXISTS "jugadores_update_own" ON jugadores;
CREATE POLICY "jugadores_update_own" ON jugadores
  FOR UPDATE USING (auth.uid() = id);

-- Los admins pueden editar cualquier jugador
-- (esto requiere una función helper o chequeo de is_admin)
DROP POLICY IF EXISTS "jugadores_update_admin" ON jugadores;
CREATE POLICY "jugadores_update_admin" ON jugadores
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM jugadores WHERE id = auth.uid() AND is_admin = true)
  );


-- ─── 5. POLÍTICA RLS PARA partidos ───────────────────────────────────
DROP POLICY IF EXISTS "partidos_select" ON partidos;
CREATE POLICY "partidos_select" ON partidos
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "partidos_update_admin" ON partidos;
CREATE POLICY "partidos_update_admin" ON partidos
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM jugadores WHERE id = auth.uid() AND is_admin = true)
  );

DROP POLICY IF EXISTS "partidos_insert_admin" ON partidos;
CREATE POLICY "partidos_insert_admin" ON partidos
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM jugadores WHERE id = auth.uid() AND is_admin = true)
  );


-- ─── 6. POLÍTICA RLS PARA votos ──────────────────────────────────────
DROP POLICY IF EXISTS "votos_select" ON votos;
CREATE POLICY "votos_select" ON votos
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "votos_insert" ON votos;
CREATE POLICY "votos_insert" ON votos
  FOR INSERT WITH CHECK (auth.uid() = votante_id);

DROP POLICY IF EXISTS "votos_delete_own" ON votos;
CREATE POLICY "votos_delete_own" ON votos
  FOR DELETE USING (auth.uid() = votante_id);


-- ─── 7. TABLA VOTOS (si no existe) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS votos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  partido_id UUID REFERENCES partidos(id) ON DELETE CASCADE,
  votante_id UUID REFERENCES jugadores(id) ON DELETE CASCADE,
  votado_id UUID REFERENCES jugadores(id) ON DELETE CASCADE,
  monedas INTEGER NOT NULL CHECK (monedas >= 0 AND monedas <= 10),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT no_autovoto CHECK (votante_id != votado_id)
);

ALTER TABLE votos ENABLE ROW LEVEL SECURITY;
