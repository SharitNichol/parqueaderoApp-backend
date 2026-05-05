<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Acceso Campus UCC</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding ion-text-center">
      <!-- Caso 1: Cargando datos -->
      <div v-if="isLoading" class="ion-padding">
        <ion-spinner name="crescent"></ion-spinner>
        <p>Verificando tu reserva...</p>
      </div>

      <!-- Caso 2: No hay reserva para hoy -->
      <div v-else-if="!reservaHoy" class="no-access">
        <ion-icon :icon="lockClosedOutline" color="danger" style="font-size: 80px;"></ion-icon>
        <h2>Acceso Restringido</h2>
        <p>No encontramos una reserva activa para hoy en la Sede Avenida 39.</p>
        <ion-button expand="block" router-link="/tabs/reservar" color="primary" class="ion-margin-top">
          Reservar Cupo Ahora
        </ion-button>
      </div>

      <!-- Caso 3: Reserva encontrada -> Mostrar QR -->
      <div v-else class="access-granted">
        <ion-card>
          <ion-card-header>
            <ion-badge color="success">RESERVA ACTIVA</ion-badge>
            <ion-card-title class="ion-margin-top">Pase de Ingreso</ion-card-title>
            <ion-card-subtitle>Acceso Campus UCC</ion-card-subtitle>
          </ion-card-header>
          
          <ion-card-content>
            <div class="qr-wrapper">
              <canvas ref="qrCanvas"></canvas>
            </div>
            
            <div class="info-box">
              <p><strong>Estudiante:</strong> {{ usuario?.nombre }}</p>
              <p v-if="reservaHoy.hora_inicio_clase"><strong>Clase:</strong> {{ reservaHoy.hora_inicio_clase }} - {{ reservaHoy.hora_fin_clase }}</p>
              <p><strong>Fecha:</strong> {{ formatearFecha(reservaHoy.fecha_entrada) }}</p>
            </div>
            
            <p class="footer-text">Escanea este código en la entrada del campus</p>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useDashboard } from '@/composables/useDashboard';
import { lockClosedOutline } from 'ionicons/icons';
import QRCode from 'qrcode';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, 
  IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, 
  IonCardContent, IonBadge, IonSpinner 
} from '@ionic/vue';

const { reservasActivas, cargarDatos, usuario, isLoading } = useDashboard();
const qrCanvas = ref<HTMLCanvasElement | null>(null);

// Función para formatear fecha
const formatearFecha = (fecha: string) => {
  return new Date(fecha).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Lógica para detectar reserva de HOY (ajustada para mayor precisión)
const reservaHoy = computed(() => {
  const hoy = new Date().toLocaleDateString('en-CA'); // Formato YYYY-MM-DD
  return reservasActivas.value.find(r => {
    const fechaReserva = new Date(r.fecha_entrada).toLocaleDateString('en-CA');
    return fechaReserva === hoy;
  });
});

const generarQR = async () => {
  if (reservaHoy.value && qrCanvas.value) {
    const payload = JSON.stringify({
      id_reserva: reservaHoy.value.id,
      estudiante: usuario.value?.nombre,
      entrada: reservaHoy.value.hora_inicio_clase,
      salida: reservaHoy.value.hora_fin_clase,
      sede: "UCC-AV39"
    });

    try {
      await QRCode.toCanvas(qrCanvas.value, payload, {
        width: 240,
        margin: 2,
        color: { dark: '#003366', light: '#ffffff' }
      });
    } catch (err) {
      console.error("Error QR:", err);
    }
  }
};

onMounted(async () => {
  await cargarDatos();
  setTimeout(generarQR, 300); // Pequeño delay para asegurar que el canvas exista
});

// Si los datos cambian, regeneramos
watch(reservaHoy, () => {
  setTimeout(generarQR, 300);
});
</script>

<style scoped>
.qr-wrapper {
  display: flex;
  justify-content: center;
  background: white;
  padding: 15px;
  border-radius: 12px;
  margin: 10px 0;
}
.no-access {
  margin-top: 60px;
  padding: 20px;
}
.info-box {
  background: #f4f4f4;
  padding: 12px;
  border-radius: 8px;
  margin: 15px 0;
  text-align: left;
}
.info-box p { margin: 4px 0; font-size: 0.95rem; }
.footer-text { font-size: 0.85rem; color: #666; }
</style>
