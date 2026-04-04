import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-auth.js';
import login from './pages/login.js';
import register from './pages/register.js';
import feed from './pages/feed.js';
import { auth } from './configs/config.firebase.js';

const mainContent = document.querySelector('#root');

const init = async () => {
  mainContent.innerHTML = '';
  onAuthStateChanged(auth, async (currentUser) => {
    const path = window.location.pathname;
    if (path !== '/login' && path !== '/register' && currentUser == null) {
      window.history.pushState(null, '', '/login');
    }
    switch (window.location.pathname) {
      case '/login':
        mainContent.appendChild(login());
        break;
      case '/register':
        mainContent.appendChild(register());
        break;
      case '/feed':
        mainContent.appendChild(await feed());
        break;
      default:
        mainContent.appendChild(login());
    }
  });
};

const eventHandler = async () => init();
window.addEventListener('popstate', eventHandler);
window.addEventListener('load', eventHandler);
