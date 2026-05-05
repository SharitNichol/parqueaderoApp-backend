/**
 * Composable para el Dashboard - Carga datos del usuario y reservas
 */
import { ref, computed, onMounted } from 'vue';
import { apiCall } from '@/api/client';
import { getUsuarioLocal } from '@/api/client';

export function useDashboard() {
  const usuario = ref<Usuario | null>(getUsuarioLocal());
  const motos = ref<Moto[]>([]);
  const reservas = ref<Reserva[]>([]);
  const parqueaderos = ref<Parqueadero[]>([]);

  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Calcula reservas activas
  const reservasActivas = computed(() =>
    reservas.value.filter((r) => r.estado === 'activa')
  );

  // Calcula total de motos registradas
  const totalMotos = computed(() => motos.value.length);

  /**
   * Carga todas las motos del usuario desde la BD
   */
  const cargarMotos = async () => {
    try {
      const response = await apiCall<Moto[]>(`/motos?usuario_id=${usuario.value?.id}`, {
        method: 'GET',
      });

      if (response.status === 200 && response.data) {
        motos.value = response.data;
      } else {
        error.value = response.error || 'No se pudieron cargar las motos';
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar motos';
    }
  };

  /**
   * Carga todas las reservas del usuario desde la BD
   */
  const cargarReservas = async () => {
    try {
      const response = await apiCall<Reserva[]>(`/reservas?usuario_id=${usuario.value?.id}`, {
        method: 'GET',
      });

      if (response.status === 200 && response.data) {
        reservas.value = response.data;
      } else {
        error.value = response.error || 'No se pudieron cargar las reservas';
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar reservas';
    }
  };

  /**
   * Carga todos los parqueaderos disponibles desde la BD
   */
  const cargarParqueaderos = async () => {
    try {
      const response = await apiCall<Parqueadero[]>('/parqueaderos', {
        method: 'GET',
      });

      if (response.status === 200 && response.data) {
        parqueaderos.value = response.data;
      } else {
        error.value = response.error || 'No se pudieron cargar los parqueaderos';
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar parqueaderos';
    }
  };

  /**
   * Carga todos los datos del dashboard
   */
  const cargarDatos = async () => {
    if (!usuario.value?.id) return;

    isLoading.value = true;
    error.value = null;

    try {
      await Promise.all([cargarMotos(), cargarReservas(), cargarParqueaderos()]);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Registra una nueva moto en la BD
   */
  const registrarMoto = async (moto: Omit<Moto, 'id' | 'usuario_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await apiCall<Moto>('/motos', {
        method: 'POST',
        body: JSON.stringify({
          ...moto,
          usuario_id: usuario.value?.id,
        }),
      });

      if (response.status === 201 && response.data) {
        motos.value.push(response.data);
        return response.data;
      }

      throw new Error(response.error || 'Error al registrar moto');
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al registrar moto';
      throw err;
    }
  };

  /**
   * Crea una nueva reserva en la BD
   */
  const crearReserva = async (
    parqueadero_id: string,
    moto_id: string,
    fecha_reserva: string,
    hora_inicio_clase: string,
    hora_fin_clase: string
  ) => {
    try {
      const response = await apiCall<Reserva>('/reservas', {
        method: 'POST',
        body: JSON.stringify({
          usuario_id: usuario.value?.id,
          parqueadero_id,
          moto_id,
          fecha_entrada: fecha_reserva,
          hora_inicio_clase,
          hora_fin_clase,
          estado: 'activa',
        }),
      });

      if (response.status === 201 && response.data) {
        reservas.value.push(response.data);
        return response.data;
      }

      throw new Error(response.error || 'Error al crear reserva');
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al crear reserva';
      throw err;
    }
  };



  /**
   * Cancela una reserva existente
   */
  const cancelarReserva = async (reservaId: string) => {
    try {
      const response = await apiCall(`/reservas/${reservaId}/cancelar`, {
        method: 'PATCH',
      });

      if (response.status === 200) {
        const index = reservas.value.findIndex((r) => r.id === reservaId);
        if (index !== -1) {
          reservas.value[index].estado = 'cancelada';
        }
        return true;
      }

      throw new Error(response.error || 'Error al cancelar reserva');
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cancelar reserva';
      throw err;
    }
  };

  // Cargar datos al montar el composable
  onMounted(() => {
    cargarDatos();
  });

  return {
    usuario,
    motos,
    reservas,
    parqueaderos,
    isLoading,
    error,
    totalMotos,
    reservasActivas,
    cargarDatos,
    registrarMoto,
    crearReserva,
    cancelarReserva,
  };
}
