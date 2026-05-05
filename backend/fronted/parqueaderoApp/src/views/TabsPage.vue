<template>
  <ion-page>
    <ion-tabs>

      <!-- Aquí se cargan las páginas -->
      <ion-router-outlet></ion-router-outlet>

      <!-- Barra inferior -->
      <ion-tab-bar slot="bottom">

        <ion-tab-button tab="home" href="/tabs/home">
          <ion-icon :icon="homeOutline" />
          <ion-label>Inicio</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="reservar" href="/tabs/reservar">
          <ion-icon :icon="calendarOutline" />
          <ion-label>Reservar</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="qr" href="/tabs/qr">
          <ion-icon :icon="qrCodeOutline" />
          <ion-label>QR</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="historial" href="/tabs/historial">
          <ion-icon :icon="timeOutline" />
          <ion-label>Historial</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="perfil" href="/tabs/perfil">
          <ion-icon :icon="personOutline" />
          <ion-label>Perfil</ion-label>
        </ion-tab-button>

      </ion-tab-bar>

    </ion-tabs>
  </ion-page>
</template>

<script setup>
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonPage
} from '@ionic/vue';

import {
  homeOutline,
  calendarOutline,
  qrCodeOutline,
  personOutline,
  timeOutline
} from 'ionicons/icons';
</script>