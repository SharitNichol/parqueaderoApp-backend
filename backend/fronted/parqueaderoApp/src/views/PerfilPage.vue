<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Mi Perfil</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-card>
        <ion-card-header>
          <ion-card-title>{{ usuario?.nombre || "Usuario" }}</ion-card-title>
          <ion-card-subtitle>{{ usuario?.correo || "Sin email registrado" }}</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <p><strong>Nombre:</strong> {{ usuario?.nombre || "Sin nombre" }}</p>
          <p><strong>Email:</strong> {{ usuario?.correo || "Sin email" }}</p>
        </ion-card-content>
      </ion-card>

      <ion-button expand="block" color="danger" class="ion-margin-top" @click="cerrarSesion">
        <ion-icon slot="start" :icon="logOutOutline"></ion-icon>
        Cerrar sesión
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { logOutOutline } from "ionicons/icons";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonIcon,
} from "@ionic/vue";

const router = useRouter();
const { usuario, handleLogout } = useAuth();

// Corregido: redirigir al login después de cerrar sesión
const cerrarSesion = () => {
  handleLogout();
  router.replace("/login");
};
</script>
