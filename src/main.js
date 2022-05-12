
import login from './pages/login.js';
import register from './pages/register.js';
import feed from './pages/feed.js';
import { checkLogin } from './lib/auth.js';

const mainContent = document.querySelector('#root');

const init = async () => {
  window.addEventListener('hashchange', async () => {
    mainContent.innerHTML = '';
    switch (window.location.hash) {
      case '':
        checkLogin(async (logado) => {
          if (logado) {
            mainContent.appendChild(await feed());
          } else {
            mainContent.appendChild(login());
          }
        })
        break;
      case '#login':
        checkLogin(async (logado) => {
          if (logado) {
            mainContent.appendChild(await feed());
          } else {
            mainContent.appendChild(login());
          }
        })
        break;
      case '#feed':
        checkLogin(async (logado) => {
          if (logado) {
            mainContent.appendChild(await feed());
          } else {
            mainContent.appendChild(login());
          }
        })
        break;
      case '#register':
        checkLogin(async (logado) => {
          if (logado) {
            mainContent.appendChild(await feed());
          } else {
            mainContent.appendChild(register());
          }
        })
        break;
      default:
        mainContent.appendChild(login()); 
    }
  });
};

window.addEventListener('load', async () => {
  checkLogin(async (logado) => {
    if (logado) {
      mainContent.appendChild(await feed());
    } else {
      mainContent.appendChild(login());
    }
  })
  await init();
});

// export const renderPage = () => {
//   const mainContent = document.getElementById('root');
//   const routes = {
//     '/': login,
//     "/login": login,
//     '/feed': feed,
//     '/cadastro': register,
//   };
//   mainContent.innerHTML = '';
//   mainContent.appendChild(routes[window.location.pathname]());

//   window.addEventListener("popstate", renderPage);
//   window.addEventListener('load', renderPage);
// };
