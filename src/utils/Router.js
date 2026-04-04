import { ROUTES, EVENTS } from './Constants.js';
import { emit } from './EventEmitter.js';

const routes = new Map();
let currentRoute = null;
const defaultRoute = ROUTES.DEFAULT;

export function initRouter() {
  window.addEventListener('popstate', handlePopState);
  window.addEventListener('load', handleLoad);

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (href && href.startsWith('/')) {
      e.preventDefault();
      navigateTo(href);
    }
  });
}

export function registerRoute(path, handler, options = {}) {
  routes.set(path, {
    handler,
    requiresAuth: options.requiresAuth || false,
    title: options.title || 'Dev Cooks'
  });
}

export function navigateTo(path) {
  window.history.pushState(null, '', path);
  loadRoute(path);
}

export function getCurrentRoute() {
  return window.location.pathname || defaultRoute;
}

function isAuthenticated() {
  const userEmail = localStorage.getItem('userEmail');
  const userId = localStorage.getItem('userId');
  return !!(userEmail && userId);
}

async function handlePopState() {
  await loadRoute(getCurrentRoute());
}

async function handleLoad() {
  await loadRoute(getCurrentRoute());
}

async function loadRoute(route) {
  try {
    if (!routes.has(route)) {
      navigateTo(defaultRoute);
      return;
    }

    const routeConfig = routes.get(route);

    if (routeConfig.requiresAuth && !isAuthenticated()) {
      navigateTo(ROUTES.LOGIN);
      return;
    }

    document.title = routeConfig.title;

    emit(EVENTS.NAVIGATION.ROUTE_CHANGED, { from: currentRoute, to: route });

    await routeConfig.handler();
    currentRoute = route;
  } catch (_error) {
    emit(EVENTS.UI.ERROR_SHOW, { message: 'Erro ao carregar página' });
  }
}
