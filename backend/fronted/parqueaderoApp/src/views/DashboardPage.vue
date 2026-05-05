<template>
  <ion-page>
    <!-- Header con usuario y perfil -->
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Dashboard UCC</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="abrirMenuUsuario">
            <ion-icon :icon="personCircle"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Pull to Refresh: Deslizar para actualizar -->
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <!-- Información del usuario y Estadísticas -->
      <div class="user-card">
        <ion-card class="welcome-card">
          <ion-card-header>
            <ion-card-subtitle>¡Hola de nuevo!</ion-card-subtitle>
            <ion-card-title>{{ usuario?.nombre || usuario?.correo }}</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="icon-circle primary">
                  <ion-icon :icon="bicycleOutline"></ion-icon>
                </div>
                <span class="stat-value">{{ totalMotos }}</span>
                <span class="stat-label">Motos</span>
              </div>
              <div class="stat-item">
                <div class="icon-circle secondary">
                  <ion-icon :icon="calendarOutline"></ion-icon>
                </div>
                <span class="stat-value">{{ reservasActivas.length }}</span>
                <span class="stat-label">Reservas</span>
              </div>
            </div>
          </ion-card-content>
        </ion-card>
      </div>

      <!-- ACCESO RÁPIDO AL QR (Solo si hay reserva activa) -->
      <div v-if="reservasActivas.length > 0" class="qr-shortcut-section">
        <ion-card color="tertiary" class="qr-card" @click="irA('/tabs/qr')">
          <ion-card-content>
            <div class="qr-content">
              <ion-icon :icon="qrCodeOutline" class="qr-icon"></ion-icon>
              <div class="qr-text">
                <h3>Tienes una reserva activa</h3>
                <p>Toca aquí para ver tu código QR de entrada</p>
              </div>
              <ion-icon :icon="chevronForwardOutline"></ion-icon>
            </div>
          </ion-card-content>
        </ion-card>
      </div>

      <!-- Estado de carga (Skeletons para mejor UX) -->
      <div v-if="isLoading">
        <div class="section">
          <ion-skeleton-text animated style="width: 40%; height: 20px; margin-bottom: 15px;"></ion-skeleton-text>
          <div class="button-grid">
            <ion-skeleton-text animated style="height: 45px; border-radius: 8px;"></ion-skeleton-text>
            <ion-skeleton-text animated style="height: 45px; border-radius: 8px;"></ion-skeleton-text>
            <ion-skeleton-text animated style="height: 45px; border-radius: 8px;"></ion-skeleton-text>
          </div>
        </div>
        <div class="section">
          <ion-skeleton-text animated style="width: 60%; height: 20px; margin-bottom: 15px;"></ion-skeleton-text>
          <ion-card style="margin: 0; height: 120px;"></ion-card>
        </div>
      </div>

      <!-- Contenido principal -->
      <div v-if="!isLoading">
        <!-- Sección de Acciones Rápidas -->
        <div class="section">
          <h2 class="section-title">Acciones Rápidas</h2>
          <div class="button-grid">
            <ion-button expand="block" color="success" class="action-btn" @click="mostrarModalRegistrar = true">
              <ion-icon slot="start" :icon="addCircle"></ion-icon>
              Registrar Moto
            </ion-button>
            <ion-button expand="block" color="primary" class="action-btn" @click="irA('/tabs/reservar')">
              <ion-icon slot="start" :icon="bookmarkOutline"></ion-icon>
              Reservar Cupo
            </ion-button>
            <ion-button expand="block" color="secondary" class="action-btn" @click="irA('/tabs/historial')">
              <ion-icon slot="start" :icon="eyeOutline"></ion-icon>
              Mi Historial
            </ion-button>
          </div>
        </div>

        <!-- Estado del Parqueadero -->
        <div class="section">
          <h2 class="section-title">Estado del Parqueadero UCC</h2>
          <div v-if="parqueaderos.length > 0" class="parqueaderos-list">
            <ion-card v-for="parq in parqueaderos" :key="parq.id" class="parqueadero-card">
              <ion-card-header>
                <div class="card-header-flex">
                  <div>
                    <ion-card-title>{{ parq.nombre }}</ion-card-title>
                    <ion-card-subtitle>{{ parq.ubicacion }}</ion-card-subtitle>
                  </div>
                  <ion-chip :color="parq.disponibles > 0 ? 'success' : 'danger'" outline>
                    {{ parq.disponibles > 0 ? 'Abierto' : 'Lleno' }}
                  </ion-chip>
                </div>
              </ion-card-header>
              <ion-card-content>
                <div class="cupos-info">
                  <p><strong>Cupos:</strong> {{ parq.disponibles }} / {{ parq.capacidad }}</p>
                  <p class="price-tag"><strong>${{ parq.tarifa_hora }}</strong>/hora</p>
                </div>
                <ion-progress-bar
                  :value="parq.disponibles / parq.capacidad"
                  :color="parq.disponibles > 10 ? 'success' : (parq.disponibles > 0 ? 'warning' : 'danger')"
                  class="custom-progress"
                ></ion-progress-bar>
              </ion-card-content>
            </ion-card>
          </div>
          <div v-else class="empty-state">
            <ion-icon :icon="alertCircleOutline" size="large"></ion-icon>
            <p>No hay información de cupos disponible.</p>
          </div>
        </div>

        <!-- Mis Motos (Mejorado con tarjetas visuales) -->
        <div class="section">
          <div class="section-header">
            <h2 class="section-title">Mis Motos</h2>
          </div>
          <div v-if="motos.length > 0" class="motos-grid">
            <ion-card v-for="moto in motos" :key="moto.id" class="moto-mini-card">
              <div class="moto-card-inner">
                <div class="moto-icon-bg">
                  <ion-icon :icon="bicycleOutline" color="primary"></ion-icon>
                </div>
                <div class="moto-details">
                  <h3>{{ moto.marca }} {{ moto.modelo }}</h3>
                  <p>Placa: <span>{{ moto.placa }}</span></p>
                </div>
              </div>
            </ion-card>
          </div>
          <div v-else class="empty-state">
            <p>Aún no has registrado tu moto.</p>
            <ion-button fill="clear" @click="mostrarModalRegistrar = true">Registrar ahora</ion-button>
          </div>
        </div>
      </div>

      <!-- Alertas de error -->
      <ion-alert
        :is-open="!!error"
        header="Atención"
        :message="error || ''"
        :buttons="['Entendido']"
        @didDismiss="error = null"
      ></ion-alert>
    </ion-content>

    <!-- Modal para Registrar Moto -->
    <ion-modal :is-open="mostrarModalRegistrar" @didDismiss="mostrarModalRegistrar = false">
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Nueva Motocicleta</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="mostrarModalRegistrar = false">
              <ion-icon :icon="closeOutline"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div class="form-container">
          <ion-item fill="outline" mode="md" class="ion-margin-bottom">
            <ion-label position="floating">Placa</ion-label>
            <ion-input v-model="nuevoVehiculo.placa" placeholder="ABC123" autocapitalize="characters"></ion-input>
          </ion-item>
          <ion-item fill="outline" mode="md" class="ion-margin-bottom">
            <ion-label position="floating">Marca</ion-label>
            <ion-input v-model="nuevoVehiculo.marca" placeholder="Ej: Yamaha, Honda"></ion-input>
          </ion-item>
          <ion-item fill="outline" mode="md" class="ion-margin-bottom">
            <ion-label position="floating">Modelo</ion-label>
            <ion-input v-model="nuevoVehiculo.modelo" placeholder="Ej: FZ25, CB500"></ion-input>
          </ion-item>
          <ion-item fill="outline" mode="md" class="ion-margin-bottom">
            <ion-label position="floating">Color</ion-label>
            <ion-input v-model="nuevoVehiculo.color" placeholder="Ej: Negro, Azul"></ion-input>
          </ion-item>
          <ion-item fill="outline" mode="md" class="ion-margin-bottom">
            <ion-label position="floating">Año</ion-label>
            <ion-input v-model="nuevoVehiculo.anio" type="number"></ion-input>
          </ion-item>

          <ion-button expand="block" color="success" class="ion-margin-top save-btn" @click="registrarMotoDirecto" :disabled="registrandoMoto">
            <ion-spinner v-if="registrandoMoto" name="crescent"></ion-spinner>
            <span v-else>Guardar Vehículo</span>
          </ion-button>
        </div>
      </ion-content>
    </ion-modal>

    <!-- Menú de usuario (Popover) -->
    <ion-popover :is-open="mostrarMenuUsuario" @didDismiss="mostrarMenuUsuario = false">
      <ion-content>
        <ion-list lines="none">
          <ion-item button @click="irA('/tabs/perfil')">
            <ion-icon slot="start" :icon="personCircleOutline"></ion-icon>
            <ion-label>Mi Perfil</ion-label>
          </ion-item>
          <ion-item button @click="cerrarSesion" color="danger">
            <ion-icon slot="start" :icon="logOutOutline"></ion-icon>
            <ion-label>Cerrar Sesión</ion-label>
          </ion-item>
        </ion-list>
      </ion-content>
    </ion-popover>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDashboard } from '@/composables/useDashboard';
import { useAuth } from '@/composables/useAuth';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, 
  IonButtons, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, 
  IonCardContent, IonSpinner, IonAlert, IonProgressBar, IonPopover, 
  IonList, IonItem, IonLabel, IonModal, IonInput, IonRefresher, 
  IonRefresherContent, IonSkeletonText, IonChip
} from '@ionic/vue';
import {
  personCircle, addCircle, bookmarkOutline, eyeOutline, 
  logOutOutline, bicycleOutline, calendarOutline, qrCodeOutline,
  chevronForwardOutline, alertCircleOutline, closeOutline, personCircleOutline
} from 'ionicons/icons';

const router = useRouter();
const { 
  usuario, motos, reservasActivas, parqueaderos, isLoading, error, 
  totalMotos, cargarDatos, registrarMoto 
} = useDashboard();
const { handleLogout } = useAuth();

const mostrarMenuUsuario = ref(false);
const mostrarModalRegistrar = ref(false);
const registrandoMoto = ref(false);

const nuevoVehiculo = ref({
  placa: '',
  marca: '',
  modelo: '',
  color: '',
  anio: new Date().getFullYear(),
});

onMounted(() => {
  cargarDatos();
});

const handleRefresh = async (event: any) => {
  await cargarDatos();
  event.target.complete();
};

const irA = (ruta: string) => {
  mostrarMenuUsuario.value = false;
  router.push(ruta);
};

const abrirMenuUsuario = (_ev: Event) => {
  mostrarMenuUsuario.value = true;
};

const cerrarSesion = () => {
  mostrarMenuUsuario.value = false;
  handleLogout();
  router.replace('/login');
};

const registrarMotoDirecto = async () => {
  if (!nuevoVehiculo.value.placa || !nuevoVehiculo.value.marca) {
    alert("Por favor ingresa al menos la placa y la marca.");
    return;
  }

  registrandoMoto.value = true;
  try {
    await registrarMoto({
      placa: nuevoVehiculo.value.placa.toUpperCase(),
      marca: nuevoVehiculo.value.marca,
      modelo: nuevoVehiculo.value.modelo,
      color: nuevoVehiculo.value.color,
      anio: Number(nuevoVehiculo.value.anio),
    });
    mostrarModalRegistrar.value = false;
    nuevoVehiculo.value = { placa: '', marca: '', modelo: '', color: '', anio: new Date().getFullYear() };
  } catch (err) {
    console.error(err);
  } finally {
    registrandoMoto.value = false;
  }
};
</script>

<style scoped>
/* Welcome Card */
.welcome-card {
  margin: 0 0 20px 0;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--ion-color-primary) 0%, #4c8dff 100%);
  color: white;
}
.welcome-card ion-card-title {
  color: white;
  font-size: 1.6rem;
  font-weight: 700;
}
.welcome-card ion-card-subtitle {
  color: rgba(255, 255, 255, 0.8);
}

/* Stats Grid */
.stats-grid {
  display: flex;
  justify-content: space-around;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 15px 5px;
  margin-top: 10px;
}
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}
.icon-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  font-size: 1.2rem;
}
.icon-circle.primary { background: rgba(255, 255, 255, 0.2); }
.icon-circle.secondary { background: rgba(255, 255, 255, 0.2); }

.stat-value {
  font-size: 1.4rem;
  font-weight: bold;
}
.stat-label {
  font-size: 0.75rem;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* QR Shortcut */
.qr-shortcut-section {
  margin-bottom: 20px;
}
.qr-card {
  margin: 0;
  border-radius: 12px;
  cursor: pointer;
}
.qr-content {
  display: flex;
  align-items: center;
  gap: 15px;
}
.qr-icon {
  font-size: 2.5rem;
}
.qr-text {
  flex: 1;
}
.qr-text h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}
.qr-text p {
  margin: 2px 0 0 0;
  font-size: 0.85rem;
  opacity: 0.9;
}

/* Sections */
.section {
  margin-top: 25px;
}
.section-title {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 15px;
  color: var(--ion-color-dark);
}

/* Button Grid */
.button-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.button-grid ion-button:first-child {
  grid-column: span 2;
}
.action-btn {
  --border-radius: 10px;
  height: 50px;
  margin: 0;
  font-weight: 600;
}

/* Parqueadero Card */
.parqueadero-card {
  margin: 0;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
.card-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.cupos-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.price-tag {
  color: var(--ion-color-primary);
  font-size: 1.1rem;
}
.custom-progress {
  height: 8px;
  border-radius: 4px;
}

/* Motos Grid */
.motos-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}
.moto-mini-card {
  margin: 0;
  border-radius: 10px;
  border: 1px solid #f0f0f0;
  box-shadow: none;
}
.moto-card-inner {
  display: flex;
  align-items: center;
  padding: 12px;
  gap: 15px;
}
.moto-icon-bg {
  width: 45px;
  height: 45px;
  background: #f0f7ff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}
.moto-details h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}
.moto-details p {
  margin: 2px 0 0 0;
  font-size: 0.85rem;
  color: var(--ion-color-medium);
}
.moto-details span {
  color: var(--ion-color-dark);
  font-weight: 600;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 30px 20px;
  color: var(--ion-color-medium);
  background: #f9f9f9;
  border-radius: 12px;
  border: 1px dashed #ddd;
}

/* Form */
.form-container {
  padding-top: 10px;
}
.save-btn {
  --border-radius: 10px;
  height: 50px;
  margin-top: 20px;
}
</style>


