<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Historial de Reservas</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Estado de carga -->
      <div v-if="isLoading" class="loading-container">
        <ion-spinner name="crescent"></ion-spinner>
        <p>Cargando historial...</p>
      </div>

      <!-- Sin reservas -->
      <div v-else-if="reservas.length === 0" class="empty-state">
        <ion-icon :icon="calendarOutline" style="font-size: 60px; color: var(--ion-color-medium);"></ion-icon>
        <h3>Sin reservas</h3>
        <p>Aún no tienes reservas registradas.</p>
        <ion-button router-link="/tabs/reservar" color="primary" expand="block">
          Hacer una reserva
        </ion-button>
      </div>

      <!-- Lista de reservas -->
      <div v-else>
        <ion-card
          v-for="reserva in reservas"
          :key="reserva.id"
          class="reserva-card"
        >
          <ion-card-header>
            <div class="card-header-row">
              <ion-card-title>{{ formatearFecha(reserva.fecha_entrada) }}</ion-card-title>
              <ion-badge :color="colorEstado(reserva.estado)">
                {{ reserva.estado.toUpperCase() }}
              </ion-badge>
            </div>
            <ion-card-subtitle v-if="reserva.hora_inicio_clase">
              Clase: {{ reserva.hora_inicio_clase }} – {{ reserva.hora_fin_clase }}
            </ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <p v-if="reserva.valor_total != null">
              <strong>Valor:</strong> ${{ reserva.valor_total.toLocaleString("es-CO") }}
            </p>
            <!-- Botón cancelar solo para reservas activas -->
            <ion-button
              v-if="reserva.estado === 'activa'"
              size="small"
              color="danger"
              fill="outline"
              @click="cancelar(reserva.id!)"
              :disabled="cancelando === reserva.id"
            >
              <ion-spinner v-if="cancelando === reserva.id" name="crescent" slot="start"></ion-spinner>
              Cancelar
            </ion-button>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useDashboard } from "@/composables/useDashboard";
import { calendarOutline } from "ionicons/icons";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonBadge,
  IonButton,
  IonSpinner,
  IonIcon,
  toastController,
} from "@ionic/vue";

const { reservas, isLoading, cargarDatos, cancelarReserva } = useDashboard();
const cancelando = ref<string | null>(null);

const formatearFecha = (fecha: string) => {
  return new Date(fecha).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const colorEstado = (estado: string): string => {
  switch (estado) {
    case "activa": return "success";
    case "completada": return "primary";
    case "cancelada": return "danger";
    default: return "medium";
  }
};

const cancelar = async (id: string) => {
  cancelando.value = id;
  try {
    await cancelarReserva(id);
    const toast = await toastController.create({
      message: "Reserva cancelada correctamente",
      duration: 2000,
      color: "success",
    });
    toast.present();
  } catch {
    const toast = await toastController.create({
      message: "No se pudo cancelar la reserva",
      duration: 2000,
      color: "danger",
    });
    toast.present();
  } finally {
    cancelando.value = null;
  }
};

onMounted(() => {
  cargarDatos();
});
</script>

<style scoped>
.loading-container {
  text-align: center;
  padding: 40px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--ion-color-medium);
}

.empty-state h3 {
  margin: 16px 0 8px;
  font-size: 1.2rem;
}

.reserva-card {
  margin-bottom: 12px;
}

.card-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
