
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Mis Reservas UCC</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div v-if="isLoading" class="ion-text-center ion-padding">
        <ion-spinner name="crescent"></ion-spinner>
      </div>

      <div v-else-if="reservas.length === 0" class="empty-state">
        <ion-icon :icon="calendarOutline" size="large"></ion-icon>
        <p>No tienes historial de reservas.</p>
      </div>

      <ion-list v-else>
        <ion-item v-for="reserva in reservas" :key="reserva.id">
          <ion-label>
            <h2>{{ obtenerNombreParqueadero(reserva.parqueadero_id) }}</h2>
            <p><strong>Fecha:</strong> {{ formatearFecha(reserva.fecha_entrada) }}</p>
            <p><strong>Clase:</strong> {{ reserva.hora_inicio_clase }} - {{ reserva.hora_fin_clase }}</p>
            <ion-badge :color="reserva.estado === 'activa' ? 'success' : 'medium'">
              {{ reserva.estado.toUpperCase() }}
            </ion-badge>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useDashboard } from '@/composables/useDashboard';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, 
  IonItem, IonLabel, IonBadge, IonSpinner, IonIcon 
} from '@ionic/vue';
import { calendarOutline } from 'ionicons/icons';

const { reservas, isLoading, parqueaderos } = useDashboard();

const obtenerNombreParqueadero = (id: string) => {
  return parqueaderos.value.find(p => p.id === id)?.nombre || 'Parqueadero UCC';
};

const formatearFecha = (fecha: string) => {
  return new Date(fecha).toLocaleDateString('es-CO', { day: '2-digit', month: 'long' });
};
</script>