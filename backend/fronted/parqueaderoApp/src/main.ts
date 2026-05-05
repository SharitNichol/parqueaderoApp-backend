import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { authGuard } from './router/guards';
import { useAuth } from './composables/useAuth';
import { IonicVue } from '@ionic/vue';

/* CSS de Ionic */
import '@ionic/vue/css/core.css';
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';
import './theme/variables.css';

// Registrar el guard de autenticación
router.beforeEach(authGuard);

const app = createApp(App)
  .use(IonicVue)
  .use(router);

router.isReady().then(() => {
  // Cargar sesión antes de montar
  const { loadUser } = useAuth();
  loadUser();
  app.mount('#app');

  // Registrar Service Worker para PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').catch(() => {
      // Service Worker no disponible - la app seguirá funcionando en web
    });
  }
});
