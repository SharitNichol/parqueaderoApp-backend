import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { isAuthenticated } from '@/api/client';

export function authGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const publicRoutes = ['/login', '/registro'];
  const isPublic = publicRoutes.includes(to.path);
  const loggedIn = isAuthenticated();

  // Si ya tiene sesión e intenta ir a login/registro → redirigir al dashboard
  if (isPublic && loggedIn) {
    next('/tabs/home');
    return;
  }

  // Si NO tiene sesión y va a una ruta protegida → redirigir al login
  if (!isPublic && !loggedIn) {
    next('/login');
    return;
  }

  next();
}
