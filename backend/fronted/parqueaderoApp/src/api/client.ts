/**
 * Configuración y utilidades de la API
 */

const apiHost = "http://localhost";
const apiPort = ":3000";


export const API_CONFIG = {
  baseURL: `${apiHost}${apiPort}`,
  timeout: 10000,
};

/**
 * Realiza una petición a la API con soporte de timeout
 */
export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
 ): Promise<ApiResponse<T>> {
  try {
    const url = `${API_CONFIG.baseURL}${endpoint}`;

    const defaultHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Agregar token si existe
    const token = localStorage.getItem("token");
    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`;
    }

    // Configurar AbortController para timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    let response: Response;
    try {
      response = await fetch(url, {
        ...options,
        headers: { ...defaultHeaders, ...(options.headers as Record<string, string>) },
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    // Intentar parsear como JSON; si falla, devolver el texto como error
    let data: T | undefined;
    let errorMsg: string | undefined;
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const json = await response.json();
      if (response.ok) {
        data = json as T;
      } else {
        errorMsg = json.error || json.mensaje || `Error ${response.status}`;
      }
    } else {
      const text = await response.text();
      if (!response.ok) {
        errorMsg = text || `Error ${response.status}`;
      }
    }

    return {
      data,
      error: errorMsg,
      status: response.status,
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      console.error("API Timeout:", endpoint);
      return {
        error: "La solicitud tardó demasiado. Verifica tu conexión.",
        status: 408,
      };
    }
    console.error("API Error:", error);
    return {
      error: error instanceof Error ? error.message : "Error desconocido",
      status: 500,
    };
  }
}

/**
 * Login de usuario
 */
export async function login(correo: string, password: string): Promise<LoginResponse | null> {
  const response = await apiCall<LoginResponse>("/usuarios/login", {
    method: "POST",
    body: JSON.stringify({ correo, password }),
  });

  if (response.status === 200 && response.data) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("usuario", JSON.stringify(response.data.usuario));
    return response.data;
  }

  return null;
}

/**
 * Registro de usuario
 */
export async function registro(
  nombre: string,
  correo: string,
  password: string
): Promise<RegistroResponse | null> {
  const response = await apiCall<RegistroResponse>("/usuarios/registro", {
    method: "POST",
    body: JSON.stringify({ nombre, correo, password }),
  });

  if (response.status === 201 && response.data) {
    return response.data;
  }

  return null;
}

/**
 * Logout de usuario
 */
export function logout(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
}

/**
 * Obtiene el usuario guardado en localStorage
 */
export function getUsuarioLocal(): Usuario | null {
  try {
    const usuario = localStorage.getItem("usuario");
    return usuario ? (JSON.parse(usuario) as Usuario) : null;
  } catch {
    // Si el JSON está corrupto, limpiar y retornar null
    localStorage.removeItem("usuario");
    return null;
  }
}

/**
 * Obtiene el token de autenticación
 */
export function getToken(): string | null {
  return localStorage.getItem("token");
}

/**
 * Verifica si hay sesión activa
 */
export function isAuthenticated(): boolean {
  return !!getToken();
}
