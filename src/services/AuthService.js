import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-auth.js';
import { auth } from '../config/firebase.config.js';
import { emit } from '../utils/EventEmitter.js';
import { EVENTS, ERROR_MESSAGES } from '../utils/Constants.js';

const provider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    const currentUser = result.user;
    localStorage.setItem('userEmail', currentUser.email);
    localStorage.setItem('userId', currentUser.uid);
    emit(EVENTS.AUTH.LOGIN_SUCCESS, currentUser);
    return currentUser;
  } catch (error) {
    emit(EVENTS.AUTH.LOGIN_ERROR, error);
    throw new Error(getAuthErrorMessage(error));
  }
}

export async function loginWithEmail(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const currentUser = userCredential.user;
    localStorage.setItem('userEmail', currentUser.email);
    localStorage.setItem('userId', currentUser.uid);
    emit(EVENTS.AUTH.LOGIN_SUCCESS, currentUser);
    return currentUser;
  } catch (error) {
    emit(EVENTS.AUTH.LOGIN_ERROR, error);
    throw new Error(getAuthErrorMessage(error));
  }
}

export async function createAccount(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const currentUser = userCredential.user;
    localStorage.setItem('userEmail', currentUser.email);
    localStorage.setItem('userId', currentUser.uid);
    emit(EVENTS.AUTH.REGISTER_SUCCESS, currentUser);
    return currentUser;
  } catch (error) {
    emit(EVENTS.AUTH.REGISTER_ERROR, error);
    throw new Error(getAuthErrorMessage(error));
  }
}

export async function logout() {
  try {
    await signOut(auth);
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    emit(EVENTS.AUTH.LOGOUT);
  } catch (_error) {
    throw new Error('Erro ao fazer logout');
  }
}

export function getCurrentUser() {
  return auth.currentUser;
}

export function isAuthenticated() {
  return !!auth.currentUser;
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, (currentUser) => {
    emit(EVENTS.AUTH.AUTH_STATE_CHANGED, currentUser);
    callback(currentUser);
  });
}

function getAuthErrorMessage(error) {
  switch (error.code) {
    case 'auth/user-not-found':
      return ERROR_MESSAGES.AUTH.USER_NOT_FOUND;
    case 'auth/wrong-password':
      return ERROR_MESSAGES.AUTH.WRONG_PASSWORD;
    case 'auth/email-already-in-use':
      return ERROR_MESSAGES.AUTH.EMAIL_ALREADY_IN_USE;
    case 'auth/weak-password':
      return ERROR_MESSAGES.AUTH.WEAK_PASSWORD;
    case 'auth/invalid-email':
      return ERROR_MESSAGES.AUTH.INVALID_EMAIL;
    case 'auth/user-disabled':
      return 'Conta desabilitada. Entre em contato com o suporte.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Tente novamente mais tarde.';
    case 'auth/network-request-failed':
      return ERROR_MESSAGES.GENERIC.NETWORK_ERROR;
    default:
      return ERROR_MESSAGES.AUTH.GENERIC;
  }
}
