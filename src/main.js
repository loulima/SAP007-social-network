
import login from './pages/login.js';
import register from './pages/register.js';
import feed from './pages/feed.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-auth.js';
import { auth } from '../configs/config.firebase.js';

const mainContent = document.querySelector('#root');

const init = async () => {
  mainContent.innerHTML = '';
  onAuthStateChanged(auth, async (user)  => {
    const hash = window.location.hash;
    if (hash != '#login' && hash != '#register' && user == null) {
      window.location.hash = '#login';
      mainContent.appendChild(login());
      return
    }
    switch (window.location.hash) {
      case '#login':
        mainContent.appendChild(login());
        break;
      case '#register':
        mainContent.appendChild(register());
        break;
      case '#feed':
        mainContent.appendChild(await feed());
        break;
      default:
        mainContent.appendChild(login());
    }
  });
};
const eventHandler= async () => await init();
window.addEventListener('hashchange', eventHandler);
window.addEventListener('load', eventHandler);

await init()

// export const renderPage = () => {
//   const mainContent = document.getElementById('root');
//   const routes = {
//     '/': login,
//     "/login": login,
//     '/feed': feed,
//     '/register': register,
//   };
//   mainContent.innerHTML = '';
//   mainContent.appendChild(routes[window.location.pathname]());

//   window.addEventListener("popstate", renderPage);
//   window.addEventListener('load', renderPage);
// };
