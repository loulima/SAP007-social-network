import { initRouter, registerRoute, navigateTo } from './utils/Router.js';
import { on } from './utils/EventEmitter.js';
import { ROUTES, EVENTS } from './utils/Constants.js';
import { initAuthListener } from './controllers/AuthController.js';
import { handleGetAllPosts, formatPostForDisplay, handleCreatePost } from './controllers/PostController.js';
import { createLoginForm } from './components/LoginForm.js';
import { createRegisterForm } from './components/RegisterForm.js';
import { createPostCard } from './components/PostCard.js';

async function initApp() {
  initRouter();
  initAuthListener();
  setupGlobalEvents();
  registerRoutes();
}

function setupGlobalEvents() {
  on(EVENTS.UI.ERROR_SHOW, (data) => {
    showError(data.message);
  });

  on(EVENTS.UI.SUCCESS_SHOW, (_data) => {
  });
}

function registerRoutes() {
  registerRoute(ROUTES.LOGIN, loadLoginPage, { title: 'Dev Cooks - Login', requiresAuth: false });
  registerRoute(ROUTES.REGISTER, loadRegisterPage, { title: 'Dev Cooks - Cadastro', requiresAuth: false });
  registerRoute(ROUTES.FEED, loadFeedPage, { title: 'Dev Cooks - Feed', requiresAuth: true });
}

function clearHeaderActions() {
  const headerActions = document.getElementById('header-actions');
  if (headerActions) headerActions.innerHTML = '';
}

function loadLoginPage() {
  clearHeaderActions();
  const container = document.querySelector('#root');
  container.innerHTML = '';
  container.appendChild(createLoginForm());
}

function loadRegisterPage() {
  clearHeaderActions();
  const container = document.querySelector('#root');
  container.innerHTML = '';
  container.appendChild(createRegisterForm());
}

async function loadFeedPage() {
  const container = document.querySelector('#root');
  container.innerHTML = '';

  const feedContainer = document.createElement('section');
  feedContainer.classList.add('feed-content');

  feedContainer.innerHTML = `
    <div class="new-post">
      <h2 class="new-post-title">Compartilhar nova receita</h2>
      <input id="title-input" class="recipe-input" placeholder="Nome da receita" required>
      <textarea id="content-input" class="post-content" placeholder="Descreva sua receita..." maxlength="500" required rows="4"></textarea>
      <div class="post-actions">
        <span id="error-message" class="error-message"></span>
        <button class="post-btn" id="create-post-btn">Publicar Receita</button>
      </div>
      <div id="posts-container" class="posts-container">
        <div class="loading">Carregando receitas...</div>
      </div>
    </div>
  `;

  container.appendChild(feedContainer);

  const headerActions = document.getElementById('header-actions');
  if (headerActions) {
    headerActions.innerHTML = `<button class="logout-btn" id="btn-logout">Sair</button>`;
    headerActions.querySelector('#btn-logout').addEventListener('click', () => {
      headerActions.innerHTML = '';
      navigateTo('#login');
    });
  }

  setupFeedEvents(feedContainer);
  await loadPosts();
}

function setupFeedEvents(container) {

  const createBtn = container.querySelector('#create-post-btn');
  const titleInput = container.querySelector('#title-input');
  const contentInput = container.querySelector('#content-input');
  const errorMessage = container.querySelector('#error-message');

  createBtn.addEventListener('click', async () => {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    errorMessage.textContent = '';

    if (!title || !content) {
      errorMessage.textContent = 'Título e receita são obrigatórios';
      return;
    }

    createBtn.disabled = true;
    createBtn.textContent = 'Publicando...';

    try {
      const result = await handleCreatePost({ title, content });

      if (result.success) {
        titleInput.value = '';
        contentInput.value = '';
        await loadPosts();
      } else {
        if (result.errors) {
          const firstError = Object.values(result.errors)[0];
          errorMessage.textContent = firstError;
        } else {
          errorMessage.textContent = result.error || 'Erro ao criar post';
        }
      }
    } catch (_error) {
      errorMessage.textContent = 'Erro inesperado. Tente novamente.';
    } finally {
      createBtn.disabled = false;
      createBtn.textContent = 'Publicar Receita';
    }
  });
}

async function loadPosts() {
  const postsContainer = document.querySelector('#posts-container');

  try {
    postsContainer.innerHTML = '<div class="loading">Carregando receitas...</div>';

    const result = await handleGetAllPosts();

    if (result.success) {
      const { posts } = result;

      if (posts.length === 0) {
        postsContainer.innerHTML = '<div class="no-posts">Nenhuma receita encontrada. Seja o primeiro a compartilhar!</div>';
        return;
      }

      postsContainer.innerHTML = '';
      posts.reverse().forEach((post) => {
        const formattedPost = formatPostForDisplay(post);
        const postCard = createPostCard(formattedPost, loadPosts);
        postsContainer.appendChild(postCard);
      });
    } else {
      postsContainer.innerHTML = '<div class="error">Erro ao carregar receitas. Tente novamente.</div>';
    }
  } catch (_error) {
    postsContainer.innerHTML = '<div class="error">Erro ao carregar receitas. Tente novamente.</div>';
  }
}

function showError(message) {
  const existing = document.querySelector('.app-error-banner');
  if (existing) existing.remove();

  const banner = document.createElement('div');
  banner.className = 'app-error-banner';
  banner.textContent = message;
  document.querySelector('#root').prepend(banner);

  setTimeout(() => banner.remove(), 5000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
