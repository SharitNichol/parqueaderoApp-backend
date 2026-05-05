<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Registro</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-alert
        :is-open="showAlert"
        :header="alertHeader"
        :message="alertMessage"
        :buttons="['OK']"
        @didDismiss="showAlert = false"
      ></ion-alert>

      <div class="register-form">
        <h2>Crea tu cuenta</h2>

        <ion-item>
          <ion-label position="stacked">Nombre</ion-label>
          <ion-input
            v-model="nombre"
            placeholder="Tu nombre"
            :disabled="isSaving"
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Email</ion-label>
          <ion-input
            v-model="correo"
            type="email"
            placeholder="ejemplo@correo.com"
            :disabled="isSaving"
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Contraseña</ion-label>
          <ion-input
            v-model="password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            :disabled="isSaving"
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Confirmar contraseña</ion-label>
          <ion-input
            v-model="confirmPassword"
            type="password"
            placeholder="Repite tu contraseña"
            :disabled="isSaving"
          ></ion-input>
        </ion-item>

        <ion-button
          expand="block"
          color="primary"
          @click="registrarUsuario"
          :disabled="isSaving"
        >
          <ion-spinner v-if="isSaving" name="crescent"></ion-spinner>
          <span v-else>Registrar</span>
        </ion-button>

        <ion-text class="login-link">
          <p>¿Ya tienes cuenta? <router-link to="/login">Inicia sesión</router-link></p>
        </ion-text>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { registro } from '@/api/client';
import { VALIDATION_RULES, ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/constants';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonAlert,
  IonSpinner,
  IonText,
} from '@ionic/vue';

const router = useRouter();
const nombre = ref('');
const correo = ref('');
const password = ref('');
const confirmPassword = ref('');
const isSaving = ref(false);
const showAlert = ref(false);
const alertHeader = ref('');
const alertMessage = ref('');

const validarFormulario = (): boolean => {
  if (!nombre.value || !correo.value || !password.value || !confirmPassword.value) {
    alertMessage.value = ERROR_MESSAGES.REQUIRED_FIELD;
    return false;
  }

  if (!VALIDATION_RULES.EMAIL_REGEX.test(correo.value)) {
    alertMessage.value = ERROR_MESSAGES.INVALID_EMAIL;
    return false;
  }

  if (password.value.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    alertMessage.value = ERROR_MESSAGES.PASSWORD_TOO_SHORT;
    return false;
  }

  if (password.value !== confirmPassword.value) {
    alertMessage.value = 'Las contraseñas no coinciden.';
    return false;
  }

  return true;
};

const registrarUsuario = async () => {
  if (!validarFormulario()) {
    alertHeader.value = 'Datos inválidos';
    showAlert.value = true;
    return;
  }

  isSaving.value = true;
  alertHeader.value = '';
  alertMessage.value = '';

  try {
    const response = await registro(nombre.value, correo.value, password.value);
    if (!response) {
      alertHeader.value = 'Error';
      alertMessage.value = 'No se pudo registrar. Intenta de nuevo.';
      showAlert.value = true;
      return;
    }

    alertHeader.value = 'Registro completo';
    alertMessage.value = SUCCESS_MESSAGES.REGISTRO_SUCCESS;
    showAlert.value = true;
    router.push('/login');
  } catch (error) {
    alertHeader.value = 'Error de registro';
    alertMessage.value =
      error instanceof Error ? error.message : 'Error al conectar con el servidor.';
    showAlert.value = true;
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
.register-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

.register-form h2 {
  text-align: center;
  margin-bottom: 1rem;
}

.login-link {
  text-align: center;
  margin-top: 1rem;
}

.login-link a {
  color: var(--ion-color-primary);
  font-weight: bold;
  text-decoration: none;
}
</style>
