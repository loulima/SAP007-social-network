import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyBIU6ZhMszzUh8PI3-3d44c-zui3zYLBYw',
  authDomain: 'dev-cooks.firebaseapp.com',
  projectId: 'dev-cooks',
  storageBucket: 'dev-cooks.appspot.com',
  messagingSenderId: '192116692519',
  appId: '1:192116692519:web:a26c843ce7dbd4d8612002',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export { app };
