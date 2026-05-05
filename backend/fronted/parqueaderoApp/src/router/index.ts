import { createRouter, createWebHistory } from '@ionic/vue-router';

// Páginas
import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '../views/RegisterPage.vue';
import TabsPage from '../views/TabsPage.vue';

// Vistas dentro de Tabs
import DashboardPage from '../views/DashboardPage.vue';
import ReservarPage from '../views/ReservarPage.vue';
import QrPage from '../views/QrPage.vue';
import PerfilPage from '../views/PerfilPage.vue';
import HistorialPage from '../views/HistorialPage.vue';

const routes = [
  {
    path: '/',
    redirect: '/tabs/home'
  },

  {
    path: '/login',
    component: LoginPage
  },
  {
    path: '/registro',
    component: RegisterPage
  },

  {
    path: '/tabs', // 🔥 SIN SLASH AL FINAL
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/home' // 🔥 REDIRECT PRIMERO
      },
      {
        path: 'home',
        component: DashboardPage
      },
      {
        path: 'reservar',
        component: ReservarPage
      },
      {
        path: 'qr',
        component: QrPage
      },
      {
        path: 'historial',
        component: HistorialPage
      },
      {
        path: 'perfil',
        component: PerfilPage
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;