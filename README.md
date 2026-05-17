# ⚽ El Fulbito de los Viernes
### Al-Koliko FC · Temporada 2025

> App para organizar y gamificar el partido de fútbol 5 del viernes entre amigos. Sistema de votación, figuritas coleccionables, feed social y ranking mensual/anual.

---

## 🔗 Links importantes

| Recurso | URL |
|---|---|
| App en producción | `fulbito-viernes.netlify.app` |
| Repositorio GitHub | `github.com/jorgedeleon18/Fulbito-viernes` |
| Rama principal | `main` |

---

## 👥 Administradores

Solo **Nico** y **Juank** tienen acceso al panel de administración.

| Usuario | Contraseña | Rol |
|---|---|---|
| Nico | nico123 | Admin |
| Juank | juank123 | Admin |
| Enzo | enzo123 | Jugador |
| Maxi | maxi123 | Jugador |
| Fede | fede123 | Jugador |
| Lean | lean123 | Jugador |
| Seba | seba123 | Jugador |
| Matías | matias123 | Jugador |
| Gonza | gonza123 | Jugador |
| Rulo | rulo123 | Jugador |
| Pipe | pipe123 | Jugador |

---

## 🎮 Cómo funciona la app

### Sistema de votación — Las monedas

1. El admin confirma los jugadores del viernes (hasta 10)
2. A partir del **sábado 00:00** se habilita la votación
3. Cada jugador que fue tiene **10 monedas** para repartir entre los que crea que merecen
4. No se puede votar a uno mismo
5. No es obligatorio repartir todas las monedas
6. La votación cierra cuando **todos votaron** o el **jueves 23:59hs** automáticamente

### Sistema de puntos — Cómo ganar

Al cerrar la votación se forma el **Top 5** con los jugadores más votados.
Cada votante suma puntos según a cuántos del Top 5 acertó:

| Posición acertada | Puntos |
|---|---|
| 1° más votado | +5 pts |
| 2° más votado | +4 pts |
| 3° más votado | +3 pts |
| 4° más votado | +2 pts |
| 5° más votado | +1 pt |
| Acertar los 5 | **15 pts máximo** |

> La clave es **adivinar quién va a estar en el Top 5**, no simplemente darle monedas a tu amigo.

### Tablas

- **Mensual**: se resetea cada mes. El que más puntos acumula **gana la casaca** a elección.
- **Anual**: acumula todo el año. Decreta al mejor del grupo en la temporada.

---

## 📱 Pantallas de la app

### 🏠 Inicio
- Banner del próximo partido con fecha, hora, cancha y ubicación
- Botones **Confirmar / No puedo** asistencia
- Avatares de los jugadores confirmados
- Alerta de votación pendiente con botón directo
- Tus stats personales del mes (puntos, PJ, media)
- Invitaciones a partidos extra

### 📊 Temporada
- Tabla de clasificación mensual y anual
- Columnas: posición, jugador, PJ, PTS, TOP1
- Vos aparecés resaltado en verde
- Click en cualquier jugador abre su perfil completo

### ⭐ 5 Ideal
- Cancha visual con los 5 más votados de la semana
- Ranking completo del mes con barras de progreso
- Click en cualquier jugador abre su figurita y stats

### 📱 Feed
- Red social del grupo
- Cualquier jugador registrado puede publicar
- Soporte para texto, foto y video (próximamente)
- Likes y comentarios
- Publicaciones en tiempo real

### 🎴 Cards
- Figuritas coleccionables estilo FIFA/Panini
- Generadas automáticamente con los datos de cada jugador
- Rareza: **Oro** (top jugadores), **Plata** (intermedios), **Bronce** (nuevos)
- Stats en la carta: Velocidad, Pase, Defensa, Tiro, Técnica, Resistencia
- Media general calculada automáticamente
- Click abre el perfil completo con 3 tabs: Stats / Figurita / Editar (solo admin)

---

## 🔐 Autenticación y registro

### Login
- Pantalla de bienvenida con opciones: iniciar sesión / registrarse
- Menú desplegable en el header con: Mi perfil / Panel admin / Cerrar sesión

### Registro de nuevos jugadores
Campos requeridos:
- Nombre y apellido
- Apodo futbolero
- Email
- Contraseña
- Fecha de nacimiento
- Posición principal (Arquero, Defensor, Lateral, Mediocampista, Volante, Extremo, Delantero)
- Pierna hábil (Derecha, Izquierda, Ambas)
- Barrio/Ciudad
- Nivel de juego (Principiante, Intermedio, Avanzado, Semiprofesional)

### Onboarding post-registro
Al registrarse, el jugador puede:
1. Sacar una selfie directamente con la cámara
2. Subir una foto desde galería
3. Omitir por ahora

La foto se usa para generar la figurita personalizada.

---

## 🎴 Sistema de figuritas

Cada jugador tiene una figurita generada automáticamente con:

- Iniciales del nombre (o foto si subió una)
- Número de camiseta
- Posición abreviada
- Rareza con degradado propio
- Stats: VEL / PAS / DEF / TIR / TEC / RES
- Media general
- Bandera 🇦🇷
- Club: Al-Koliko FC

**Rarezas:**
- 🥇 **Oro** — jugadores destacados, degradado dorado
- 🥈 **Plata** — jugadores intermedios, degradado plateado
- 🥉 **Bronce** — jugadores nuevos o con menos puntos, degradado bronce

> Las rarezas las asigna el admin desde el panel de edición de cada jugador.

---

## 👤 Perfil de jugador

Al hacer click en cualquier jugador se abre un modal con 3 tabs:

**📊 Stats**
- Avatar, nombre, apodo, posición, número, rareza
- Goles, asistencias, MVPs, partidos jugados
- Barras de atributos (Velocidad, Pase, Defensa, Tiro, Técnica, Resistencia)
- Ciudad, pierna, nivel, puntos del mes

**🎴 Figurita**
- Vista completa de la figurita SVG del jugador

**✏️ Editar** (solo admins)
- Nombre, apellido, apodo
- Número de camiseta
- Rareza
- Sliders para cada atributo (40–99)
- Subir foto de perfil

---

## ⚙️ Panel Admin

Accesible solo para Nico y Juank desde el menú del header.

**Configurar partido**
- Fecha y hora
- Seleccionar hasta 10 jugadores del viernes
- Armar Equipo A y Equipo B
- Confirmar → habilita la votación automáticamente

**Gestionar votación**
- Ver estado (quién votó, quién falta)
- Cerrar votación manualmente
- Revelar resultados

**Gestionar jugadores**
- Ver todos los usuarios registrados
- Ver contraseñas (solo admin)

---

## 🏗️ Stack técnico

| Tecnología | Uso |
|---|---|
| React 18 | Frontend |
| Vite | Bundler y dev server |
| localStorage | Persistencia de datos (temporal) |
| SVG puro | Generación de figuritas |
| Netlify | Deploy y hosting |
| GitHub | Control de versiones |

**Sin backend por ahora** — todo se guarda en el localStorage del navegador de cada usuario.

---

## 🗄️ Estructura de datos

### Usuario
```js
{
  id, nombre, apellido, apodo, email, pass,
  isAdmin, color, posicion, pierna, ciudad,
  nivel, fechaNac, foto,
  stats: { velocidad, pase, defensa, tiro, tecnica, resistencia },
  pj, wins, mvps, goles, asist,
  puntosMes, puntosAnio,
  rating, rareza, numero
}
```

### Partido
```js
{
  fecha, hora, cancha, ubicacion,
  jugadores: [ids],
  equipoA: [ids],
  equipoB: [ids],
  confirmados: [ids]
}
```

### Post del feed
```js
{
  id, userId, texto, hace,
  likes: [userIds],
  comentarios: [{ userId, texto }]
}
```

---

## 📁 Estructura del proyecto

```
Fulbito-viernes/
├── src/
│   ├── App.jsx        ← Toda la app (componentes + lógica)
│   └── main.jsx       ← Entry point React
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Cómo correr el proyecto

### Requisitos
- Node.js 18+ → [nodejs.org](https://nodejs.org)
- Git → [git-scm.com](https://git-scm.com)

### Primera vez
```bash
git clone https://github.com/jorgedeleon18/Fulbito-viernes.git
cd Fulbito-viernes
npm install
npm run dev
```

Abrí el navegador en **http://localhost:5173**

### Build para producción
```bash
npm run build
# Los archivos quedan en /dist
```

---

## 🔄 Flujo de trabajo Git

### Subir cambios
```bash
git add .
git commit -m "descripción del cambio"
git push origin main
```

### Traerse cambios del otro
```bash
git pull origin main
```

Netlify re-deploya automáticamente con cada push a `main`.

---

## 🗺️ Roadmap — Lo que viene

### Fase 2 — Backend real (Supabase)
- [ ] Base de datos compartida entre todos los usuarios
- [ ] Votos que se sincronizan en tiempo real
- [ ] Feed compartido entre dispositivos
- [ ] Autenticación segura
- [ ] Fotos guardadas en la nube

### Fase 3 — Figuritas con IA
- [ ] Integración con Remove.bg para recortar fondo
- [ ] Estilización de foto con OpenAI/Replicate
- [ ] Figurita con foto real del jugador procesada

### Fase 4 — Features sociales
- [ ] Notificaciones push
- [ ] Sistema de invitaciones a partidos
- [ ] Chat del grupo dentro de la app
- [ ] Historial completo de partidos
- [ ] MVP del partido votado en tiempo real

### Fase 5 — Mobile
- [ ] Convertir a APK con Capacitor
- [ ] Publicar en Play Store

---

## ⚠️ Limitación actual importante

Los datos se guardan en **localStorage** de cada navegador/dispositivo por separado. Esto significa:

- ✅ Funciona perfecto para testear el flujo completo
- ✅ Los datos persisten si recargás la página
- ❌ Nico y Juank NO ven los votos del otro en tiempo real
- ❌ El feed NO se comparte entre dispositivos
- ❌ Si borrás el caché del navegador, se pierden los datos

**Solución:** Migrar a Supabase (Fase 2 del roadmap).

---

*Hecho con ❤️ y ⚽ para el grupo del viernes — Al-Koliko FC 2025*
