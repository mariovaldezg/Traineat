# Waco 70.3 Training App — Mario

App de tracking personal para Ironman 70.3 Waco, 4 octubre 2026.

## Features
- Dashboard con countdown, sesión de hoy y macros
- Plan completo 21 semanas navegable por fase y semana
- Log de sesiones con métricas (duración, distancia, FC, watts, RPE, mood)
- Integración Apple Watch via Shortcuts automática
- Tracking de macros y nutrición diaria
- Dashboard InBody con historial y comparación vs baseline
- Gráficas de progreso (volumen, FC, composición corporal, proteína)
- Compartir workouts en redes sociales

---

## Deploy paso a paso (30 minutos)

### 1. Crear cuenta Supabase (gratis)
1. Ve a https://supabase.com y crea cuenta
2. Crea nuevo proyecto → anota la URL y la `anon key` (Settings → API)
3. Ve al SQL Editor y pega todo el contenido de `supabase-schema.sql` → Run

### 2. Crear cuenta Vercel (gratis)
1. Ve a https://vercel.com y crea cuenta con GitHub

### 3. Subir código a GitHub
```bash
cd waco-app
git init
git add .
git commit -m "init: waco triathlon app"
# Crea un repo en github.com/new
git remote add origin https://github.com/TU-USUARIO/waco-app.git
git push -u origin main
```

### 4. Deploy en Vercel
1. En Vercel → "New Project" → importa tu repo de GitHub
2. En "Environment Variables" agrega:
   - `NEXT_PUBLIC_SUPABASE_URL` = tu URL de Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = tu anon key
3. Click "Deploy" → en 2 minutos tienes tu URL

### 5. Conectar Apple Watch (Shortcuts)
1. Abre **Atajos** en iPhone
2. Automatización → + → Entrenamiento → Al terminar
3. Agrega estas acciones en orden:
   - **Obtener detalles de Health** → selecciona: Duración del entrenamiento, Calorías activas, Frecuencia cardíaca promedio, Frecuencia cardíaca máxima, Distancia
   - **URL**: `https://TU-APP.vercel.app/api/healthkit`
   - **Obtener contenidos de URL**:
     - Método: POST
     - Cuerpo: JSON
     - Campos:
       ```
       duration_min → Duración del entrenamiento
       calories → Calorías activas  
       avg_hr → Frecuencia cardíaca promedio
       max_hr → Frecuencia cardíaca máxima
       distance_km → Distancia (en km)
       workout_type → Tipo de entrenamiento
       date → Fecha de inicio del entrenamiento
       ```
4. Activa la automatización → Listo. Cada workout se registra solo.

---

## Desarrollo local
```bash
cp .env.local.example .env.local
# Edita .env.local con tus keys de Supabase

npm install
npm run dev
# Abre http://localhost:3000
```

## Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL + API)
- Recharts (gráficas)
- date-fns
- Vercel (deploy)
