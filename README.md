<<<<<<< HEAD
# Fulbito-viernes
=======
# ⚽ Fulbito de los Viernes
## Al-Koliko FC · Temporada 2025

---

## 🚀 Cómo correr el proyecto

### Requisitos
- Node.js 18+ instalado (https://nodejs.org)

### Pasos

```bash
# 1. Entrar a la carpeta
cd fulbito-viernes

# 2. Instalar dependencias (solo la primera vez)
npm install

# 3. Correr en modo desarrollo
npm run dev
```

Abrí el navegador en **http://localhost:5173**

### Para producción (deploy)
```bash
npm run build
# Los archivos quedan en /dist — subir esa carpeta a Vercel, Netlify, etc.
```

---

## 👤 Usuarios de prueba

| Usuario | Contraseña | Rol   |
|---------|-----------|-------|
| Nico    | nico123   | Admin |
| Juank   | juank123  | Admin |
| Enzo    | enzo123   | Jugador |
| Maxi    | maxi123   | Jugador |
| Fede    | fede123   | Jugador |
| Lean    | lean123   | Jugador |
| Seba    | seba123   | Jugador |
| Matías  | matias123 | Jugador |
| Gonza   | gonza123  | Jugador |
| Rulo    | rulo123   | Jugador |
| Pipe    | pipe123   | Jugador |

---

## 🎮 Cómo funciona

### Sistema de votación
1. El admin confirma los jugadores del viernes
2. El sábado 00:00 se habilita la votación
3. Cada jugador tiene **10 monedas** para repartir como quiera
4. La votación cierra cuando todos votaron o el **jueves 23:59**
5. Se forma el **Top 5** con los más votados

### Sistema de puntos
- Acertar al **1° más votado** → +5 pts
- Acertar al **2° más votado** → +4 pts
- Acertar al **3° más votado** → +3 pts
- Acertar al **4° más votado** → +2 pts
- Acertar al **5° más votado** → +1 pt
- Acertar todos → **15 pts máximo** 🏆

### Tablas
- **Mensual**: acumula puntos del mes, el mejor gana la casaca
- **Anual**: ranking de toda la temporada

---

## 🏗️ Stack técnico

- **React 18** + Vite
- **Sin backend** — persistencia con localStorage/window.storage
- Listo para escalar a backend real (Supabase recomendado)
- Preparado para convertir a APK con Capacitor

---

## 📁 Estructura

```
fulbito-viernes/
├── src/
│   ├── App.jsx       ← Toda la app
│   └── main.jsx      ← Entry point
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

*Hecho con ❤️ y ⚽ para el grupo del viernes*
>>>>>>> 50dc21bbe9170b275ebf1cf171f848274611208b
