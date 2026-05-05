<template>
  <ion-page>
    <ion-header><ion-toolbar color="primary"><ion-buttons slot="start"><ion-back-button default-href="/tabs/home"></ion-back-button></ion-buttons><ion-title>Reservar Cupo UCC</ion-title></ion-toolbar></ion-header>
    <ion-content class="ion-padding">
      <ion-list>
        <ion-item>
          <ion-label position="stacked">Día de la Clase</ion-label>
          <ion-datetime-button datetime="fechaReserva"></ion-datetime-button>
          <ion-modal :keep-contents-mounted="true"><ion-datetime id="fechaReserva" presentation="date" v-model="reserva.fecha_reserva"></ion-datetime></ion-modal>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Moto</ion-label>
          <ion-select v-model="reserva.moto_id" placeholder="Selecciona moto">
            <ion-select-option v-for="m in motos" :key="m.id" :value="m.id">{{ m.placa }}</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Zona</ion-label>
          <ion-select v-model="reserva.parqueadero_id" placeholder="Selecciona zona">
            <ion-select-option v-for="p in parqueaderos" :key="p.id" :value="p.id">{{ p.nombre }}</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Entrada a Clase</ion-label>
          <ion-datetime-button datetime="hI"></ion-datetime-button>
          <ion-modal :keep-contents-mounted="true"><ion-datetime id="hI" presentation="time" v-model="reserva.hora_inicio_clase"></ion-datetime></ion-modal>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Salida de Clase</ion-label>
          <ion-datetime-button datetime="hF"></ion-datetime-button>
          <ion-modal :keep-contents-mounted="true"><ion-datetime id="hF" presentation="time" v-model="reserva.hora_fin_clase"></ion-datetime></ion-modal>
        </ion-item>
      </ion-list>
      <ion-button expand="block" class="ion-margin-top" @click="confirmar">Confirmar Reserva</ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDashboard } from '@/composables/useDashboard';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonSelect, IonSelectOption, IonButton, IonBackButton, IonButtons, IonDatetime, IonDatetimeButton, IonModal, toastController } from '@ionic/vue';

const router = useRouter();
const { motos, parqueaderos, cargarDatos, crearReserva } = useDashboard();
const reserva = ref({ moto_id: '', parqueadero_id: '', fecha_reserva: new Date().toISOString(), hora_inicio_clase: '07:00', hora_fin_clase: '09:00' });

onMounted(cargarDatos);

const confirmar = async () => {
  if (!reserva.value.moto_id || !reserva.value.parqueadero_id) {
    const toast = await toastController.create({ message: 'Por favor completa todos los campos', duration: 2000, color: 'warning' });
    toast.present();
    return;
  }
  
  try {
    await crearReserva(
      reserva.value.parqueadero_id, 
      reserva.value.moto_id, 
      reserva.value.fecha_reserva, 
      reserva.value.hora_inicio_clase, 
      reserva.value.hora_fin_clase
    );
    
    const toast = await toastController.create({ message: 'Reserva Exitosa ✓', duration: 2000, color: 'success' });
    toast.present();
    
    // Navegar a QR después de 1 segundo
    setTimeout(() => {
      router.push('/tabs/qr');
    }, 1000);
  } catch (error) {
    const toast = await toastController.create({ message: 'Error al crear la reserva', duration: 2000, color: 'danger' });
    toast.present();
  }
};
</script>
