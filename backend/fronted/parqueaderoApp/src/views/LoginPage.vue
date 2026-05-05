<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Mensaje de error -->
      <ion-alert
        :is-open="showError"
        header="Error"
        :message="errorMessage"
        :buttons="['OK']"
        @didDismiss="showError = false"
      ></ion-alert>

      <!-- Formulario -->
      <div class="login-form">
        <h2>Bienvenido</h2>

        <ion-item>
          <ion-label position="stacked">Email</ion-label>
          <ion-input
            v-model="email"
            type="email"
            placeholder="tu@email.com"
            :disabled="isLoading"
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Contraseña</ion-label>
          <ion-input
            v-model="password"
            type="password"
            placeholder="Tu contraseña"
            :disabled="isLoading"
            @keyup.enter="onLogin"
          ></ion-input>
        </ion-item>

        <!-- Botón de login -->
        <ion-button
          expand="block"
          color="primary"
          @click="onLogin"
          :disabled="isLoading || !email || !password"
        >
          <ion-spinner v-if="isLoading" name="crescent"></ion-spinner>
          <span v-else>Ingresar</span>
        </ion-button>

        <!-- Enlace de registro -->
        <ion-text class="register-link">
          <p>¿No tienes cuenta? <router-link to="/registro">Regístrate</router-link></p>
        </ion-text>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { VALIDATION_RULES, ERROR_MESSAGES } from '@/constants';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonAlert,
  IonSpinner,
  IonText,
} from '@ionic/vue';

const router = useRouter();
const { handleLogin, isLoading } = useAuth();

const email = ref('');
const password = ref('');
const showError = ref(false);
const errorMessage = ref('');

const validateForm = (): boolean => {
  if (!email.value || !password.value) {
    errorMessage.value = ERROR_MESSAGES.REQUIRED_FIELD;
    showError.value = true;
    return false;
  }

  if (!VALIDATION_RULES.EMAIL_REGEX.test(email.value)) {
    errorMessage.value = ERROR_MESSAGES.INVALID_EMAIL;
    showError.value = true;
    return false;
  }

  if (password.value.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    errorMessage.value = ERROR_MESSAGES.PASSWORD_TOO_SHORT;
    showError.value = true;
    return false;
  }

  return true;
};

const onLogin = async () => {
  if (!validateForm()) return;

  const success = await handleLogin(email.value, password.value);

  if (success) {
    router.push('/tabs/home');
  } else {
    errorMessage.value = ERROR_MESSAGES.LOGIN_FAILED;
    showError.value = true;
  }
};
</script>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2rem;
}

.login-form h2 {
  text-align: center;
  margin-bottom: 1rem;
}

ion-item {
  margin-bottom: 0.5rem;
}

.register-link {
  text-align: center;
  margin-top: 1rem;
}

.register-link a {
  color: var(--ion-color-primary);
  text-decoration: none;
  font-weight: 600;
}
</style>