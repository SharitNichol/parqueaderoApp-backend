/// <reference types="vite/client" />

// ============ Declaraciones de Módulos Vue ============
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;
  export default component;
}

// ============ Variables de Entorno ============
declare module "vite" {
  interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_API_PORT: string;
    readonly VITE_APP_TITLE: string;
    readonly VITE_APP_VERSION: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

// ============ Tipos de Usuario ============
interface Usuario {
  id: string;           // campo normalizado desde _id por el backend (formatDoc)
  _id?: string;         // opcional, por compatibilidad
  correo: string;
  nombre?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ============ Tipos de Autenticación ============
interface LoginRequest {
  correo: string;
  password: string;
}
interface LoginResponse {
  usuario: Usuario;
  token: string;        // el backend devuelve un token en /usuarios/login
  mensaje?: string;
  error?: string;
}
interface RegistroRequest {
  nombre: string;
  correo: string;
  password: string;
}
interface RegistroResponse {
  usuario: Usuario;
  mensaje: string;
}
// ============ Tipos de API ============
interface ApiResponse<T> {
  data?: T;
  error?: string;
  mensaje?: string;
  status: number;
}
interface ApiError {
  error: string;
  status: number;
}

// ============ Tipos de BD - Moto ============
interface Moto {
  id?: string;
  usuario_id: string;
  placa: string;
  marca: string;
  modelo: string;
  color: string;
  anio: number;
  createdAt?: string;
  updatedAt?: string;
}
// ============ Tipos de BD - Reserva ============
interface Reserva {
  id?: string;
  usuario_id: string;
  parqueadero_id: string;
  moto_id: string;
  fecha_entrada: string;
  hora_inicio_clase?: string;
  hora_fin_clase?: string;
  fecha_salida?: string;
  estado: "activa" | "completada" | "cancelada";
  valor_total?: number;
  createdAt?: string;
  updatedAt?: string;
}
// ============ Tipos de BD - Parqueadero ============
interface Parqueadero {
  id?: string;
  nombre: string;
  ubicacion: string;
  capacidad: number;
  disponibles: number;
  tarifa_hora: number;
  estado: "activo" | "inactivo";
  createdAt?: string;
  updatedAt?: string;
}
// ============ Tipos de Estado Global ============
interface AppState {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
// ============ Variables Globales ============
declare global {
  interface Window {
    API_URL: string;
  }
}
