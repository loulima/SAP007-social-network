import * as AuthService from '../services/AuthService.js';
import { validateLoginData, validateRegisterData } from '../utils/Validator.js';
import { emit } from '../utils/EventEmitter.js';
import { EVENTS, SUCCESS_MESSAGES } from '../utils/Constants.js';
import { navigateTo } from '../utils/Router.js';

export async function handleLogin(loginData) {
  try {
    const validation = validateLoginData(loginData);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }
    const currentUser = await AuthService.loginWithEmail(loginData.email, loginData.password);
    emit(EVENTS.UI.SUCCESS_SHOW, { message: SUCCESS_MESSAGES.AUTH.LOGIN_SUCCESS });
    navigateTo('#feed');
    return { success: true, user: currentUser };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function handleGoogleLogin() {
  try {
    const currentUser = await AuthService.loginWithGoogle();
    emit(EVENTS.UI.SUCCESS_SHOW, { message: SUCCESS_MESSAGES.AUTH.LOGIN_SUCCESS });
    navigateTo('#feed');
    return { success: true, user: currentUser };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function handleRegister(registerData) {
  try {
    const validation = validateRegisterData(registerData);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }
    const currentUser = await AuthService.createAccount(registerData.email, registerData.password);
    emit(EVENTS.UI.SUCCESS_SHOW, { message: SUCCESS_MESSAGES.AUTH.REGISTER_SUCCESS });
    navigateTo('#feed');
    return { success: true, user: currentUser };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function handleLogout() {
  try {
    await AuthService.logout();
    emit(EVENTS.UI.SUCCESS_SHOW, { message: SUCCESS_MESSAGES.AUTH.LOGOUT_SUCCESS });
    navigateTo('#login');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export function isUserAuthenticated() {
  return AuthService.isAuthenticated();
}

export function getCurrentUserData() {
  const currentUser = AuthService.getCurrentUser();
  if (!currentUser) return null;
  return {
    uid: currentUser.uid,
    email: currentUser.email,
    displayName: currentUser.displayName,
    photoURL: currentUser.photoURL
  };
}

export function initAuthListener() {
  return AuthService.onAuthChange((currentUser) => {
    if (!currentUser) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        navigateTo('/login');
      }
    }
  });
}
