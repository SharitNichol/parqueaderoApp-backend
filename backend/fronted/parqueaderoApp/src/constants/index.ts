/**
 * Constantes de la aplicación
 */

export const APP_ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  HOME: '/home',
  REGISTRO: '/registro',
};

export const API_ENDPOINTS = {
  LOGIN: '/usuarios/login',
  REGISTRO: '/usuarios/registro',
  PARQUEADEROS: '/parqueaderos',
  RESERVAS: '/reservas',
};

export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  NOMBRE_MIN_LENGTH: 3,
};

export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Este campo es requerido',
  INVALID_EMAIL: 'Email inválido',
  PASSWORD_TOO_SHORT: `La contraseña debe tener al menos ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} caracteres`,
  LOGIN_FAILED: 'Email o contraseña inválidos',
  SERVER_ERROR: 'Error al conectar con el servidor',
  NETWORK_ERROR: 'Error de conexión',
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Bienvenido!',
  REGISTRO_SUCCESS: 'Registro exitoso. Puedes iniciar sesión',
  LOGOUT_SUCCESS: 'Sesión cerrada',
};

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USUARIO: 'usuario',
  PREFERENCES: 'preferences',
};
