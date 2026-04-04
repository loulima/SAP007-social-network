import { userLogout } from '../lib/auth.js';
import { getPosts, createPost } from '../lib/firestore.js';
import { postComponent } from '../components/posts.js';

export const showPosts = async (sectionPost) => {
  sectionPost.innerHTML = '';
  const postsArray = await getPosts();
  postsArray.forEach((postObj) => {
    const postElement = postComponent(postObj);
    sectionPost.prepend(postElement);
  });
};

export default async function feed() {
  const feedContainer = document.createElement('section');
  feedContainer.classList.add('feed-content');

  feedContainer.innerHTML = `
  <div class="new-post">
    <h2 class="new-post-title">Compartilhar nova receita</h2>
    <input id="title-recipe" class="recipe-input" placeholder="Nome da receita" required></input>
    <textarea id="recipe-content" class="post-content" placeholder="Escreva sua receita aqui..." maxlength="250" required>
    </textarea>
    <span id="error-message" class="error-writepost"></span>
    <button class="post-btn" id="new-post-btn">Postar</button>
    <section class="show-posts" id="showPosts">
    </section>
  </div>
    `;

  const headerActions = document.getElementById('header-actions');
  if (headerActions) {
    headerActions.innerHTML = `<button class="logout-btn" id="btn-logout">Sair</button>`;
  }

  const sectionPost = feedContainer.querySelector('#showPosts');
  const titleContent = feedContainer.querySelector('#title-recipe');
  const recipeContent = feedContainer.querySelector('#recipe-content');
  const btnPost = feedContainer.querySelector('#new-post-btn');
  const errorMessage = feedContainer.querySelector('#error-message');
  const logOut = document.getElementById('btn-logout');

  if (logOut) {
    logOut.addEventListener('click', () => {
      const actions = document.getElementById('header-actions');
      if (actions) actions.innerHTML = '';
      userLogout();
    });
  }

  btnPost.addEventListener('click', async (e) => {
    e.preventDefault();
    if (titleContent.value === '' || recipeContent.value === '') {
      errorMessage.innerHTML = 'Insira uma receita válida';
      btnPost.disabled = true;
    } else {
      const userData = {
        email: localStorage.getItem('userEmail'),
        uid: localStorage.getItem('userId'),
      };
      await createPost(titleContent.value, recipeContent.value, userData);
      showPosts(sectionPost);
      btnPost.disabled = false;
      titleContent.value = '';
      recipeContent.value = '';
      errorMessage.innerHTML = '';
    }
  });
  await showPosts(sectionPost);
  return feedContainer;
}
