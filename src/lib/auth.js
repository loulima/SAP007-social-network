import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-auth.js';
import { auth } from '../configs/config.firebase.js';

const provider = new GoogleAuthProvider();

export function signinGoogle() {
  return signInWithPopup(auth, provider)
    .then((result) => result.user);
}

export function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => userCredential.user);
}

export const createUser = (email, password) => createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => userCredential.user);

export function userLogout() {
  signOut(auth).then(() => {
    window.history.pushState(null, '', '/login');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }).catch((error) => error);
}

export const user = auth.currentUser;

export function checkLogin(callback) {
  onAuthStateChanged(auth, (currentUser) => {
    callback(currentUser !== null);
  });
}
