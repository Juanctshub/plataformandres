# Plataforma Andrés Bello - Sistema de Automatización

Este proyecto es una plataforma web premium diseñada para la gestión administrativa y el control de asistencia estudiantil del **Colegio Andrés Bello**. 

Desarrollado como proyecto de 5to año, integra una arquitectura moderna basada en una API lógica y módulos de Inteligencia Artificial para el análisis predictivo de ausentismo.

## 🚀 Tecnologías
- **Frontend:** React + Vite (Diseño Premium con Glassmorphism)
- **Backend:** Node.js + Express
- **Base de Datos:** SQLite (Local) / Preparado para Vercel Postgres
- **IA:** Algoritmos de detección de patrones y alertas tempranas

## 🛠️ Estructura del Proyecto
- `/frontend`: Aplicación cliente (Interfaz de usuario).
- `/backend`: Servidor API y lógica de negocio.
- `andresbello.docx`: Documentación original del proyecto.

## 📦 Instalación Local
1. Clona el repositorio.
2. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
3. **Backend:**
   ```bash
   cd backend
   npm install
   node app.js
   ```

## 🌐 Despliegue en GitHub & Vercel
1. Sube el código a un repositorio de **GitHub**.
2. En **Vercel**, conecta tu repositorio.
3. **Configuración para el Frontend:**
   - Framework: Vite.
   - Root directory: `frontend`.
4. **Configuración para el Backend:**
   - Despliega la carpeta `backend` en una plataforma compatible con Node.js (Vercel Functions o Render).
   - Recuerda cambiar la conexión de base de datos a un servicio en la nube (ej. Supabase) para persistencia.

---
*Desarrollado con enfoque en Excelencia Educativa.*
