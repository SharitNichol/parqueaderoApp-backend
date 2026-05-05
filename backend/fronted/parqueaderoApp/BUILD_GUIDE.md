# Parqueadero UCC - Guía de Compilación

## ✅ Configuración Completa para Web y Móvil

Esta aplicación está completamente configurada para ejecutarse en:
- **Web (PC)**: Navegador web
- **Móvil (Android/iOS)**: App nativa con Capacitor

---

## 🚀 Desarrollo Local

### Requisitos
- Node.js 16+
- npm o yarn

### Iniciar desarrollo
```bash
npm run dev
```
Accede a `http://localhost:5173`

---

## 🔨 Compilación para Producción

### Web (PC)
```bash
npm run build
npm run preview
```

El build estará en la carpeta `dist/`

---

## 📱 Compilación para Móvil (iOS/Android)

### Requisitos Previos
- Instalar Capacitor:
```bash
npm install @capacitor/core @capacitor/cli
```

- Para iOS: Xcode instalado
- Para Android: Android Studio instalado

### Compilar para iOS
```bash
npm run build
ionic cap add ios
ionic cap sync ios
ionic cap open ios
```

### Compilar para Android
```bash
npm run build
ionic cap add android
ionic cap sync android
ionic cap open android
```

---

## 📋 Características de Respuesta

### Breakpoints configurados
- **Móviles**: < 576px
- **Tablets**: 577px - 768px
- **Desktop**: > 769px

### Características PWA (Progressive Web App)
✅ Manifest.json configurado
✅ Service Worker para offline
✅ Instalable en inicio de pantalla (móviles)
✅ Icono y nombre de aplicación personalizados

### Características de Capacitor
✅ Acceso a cámara
✅ Notificaciones push
✅ Almacenamiento local
✅ GPS y ubicación

---

## 📦 Distribución

### Web
- Despliega la carpeta `dist/` en tu servidor

### Móvil
- **iOS**: Usa Xcode para compilar y desplegar en App Store
- **Android**: Usa Android Studio para compilar y desplegar en Google Play

---

## 🔐 Variables de Entorno

Crear archivo `.env`:
```
VITE_API_URL=http://localhost
VITE_API_PORT=3000
```

Para producción:
```
VITE_API_URL=https://tu-backend.com
VITE_API_PORT=443
```

---

## ✨ Notas Finales

- La app detecta automáticamente la plataforma (web/móvil)
- El diseño es totalmente responsive
- Funciona offline gracias al Service Worker
- Compatible con navegadores antiguos (legacy plugin)
