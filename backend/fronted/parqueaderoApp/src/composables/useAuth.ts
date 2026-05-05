import { ref } from 'vue';
import { login as apiLogin, logout as apiLogout, getUsuarioLocal } from '@/api/client';

// Estado reactivo compartido
const usuario = ref<Usuario | null>(getUsuarioLocal());
const isLoading = ref(false);

// Cargar usuario desde localStorage (al iniciar app)
const loadUser = () => {
  usuario.value = getUsuarioLocal();
};

// LOGIN — usa api/client para mantener un único contrato de sesión
const handleLogin = async (correo: string, password: string): Promise<boolean> => {
  isLoading.value = true;
  try {
    const response = await apiLogin(correo, password);
    if (response && response.usuario) {
      usuario.value = response.usuario as unknown as Usuario;
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error login:', error);
    return false;
  } finally {
    isLoading.value = false;
  }
};

// LOGOUT
const handleLogout = () => {
  usuario.value = null;
  apiLogout(); // limpia token y usuario de localStorage
};

// OBTENER USUARIO ACTUAL
const getUsuario = () => {
  return usuario.value;
};

export function useAuth() {
  return {
    usuario,
    isLoading,
    handleLogin,
    handleLogout,
    getUsuario,
    loadUser,
  };
}
