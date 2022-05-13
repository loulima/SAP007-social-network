import { userLogout } from '../lib/auth.js';
import { getPosts } from '../lib/firestore.js';
import { postComponent } from '../components/posts.js';
import { createPost } from '../lib/firestore.js';

export const showPosts = async (sectionPost) => {
  sectionPost.innerHTML = '';
  const postsArray = await getPosts();
  postsArray.forEach((postObj) => {
    const postElement = postComponent(postObj);
    sectionPost.prepend(postElement);
  });
};

export default async function feed() {
  const feedContainer = document.createElement("section");
  feedContainer.classList.add("feed-content");

  feedContainer.innerHTML = `
  <div class="new-post">
    <button class="logout-btn" id="btn-logout"><a href="#login">Sair</a></button>
    <input id="title-recipe" class="recipe-input" placeholder="Nome da receita" required></input>
    <textarea id="recipe-content" class="post-content" placeholder="Postar nova receita" maxlength="250" required>
    </textarea>
    <span id="error-message" class="error-writepost"></span>
    <button class="post-btn" id="new-post-btn">Postar</button>
    <section class="show-posts" id="showPosts">
    </section>
  </div>
    `;

  const sectionPost = feedContainer.querySelector("#showPosts");
  const titleContent = feedContainer.querySelector('#title-recipe');
  const recipeContent = feedContainer.querySelector('#recipe-content');
  const btnPost = feedContainer.querySelector('#new-post-btn');
  const errorMessage = feedContainer.querySelector('#error-message');
  const logOut = feedContainer.querySelector('#btn-logout');

  logOut.addEventListener('click', (e) => {
    e.preventDefault();
    userLogout();
  });

  // feed.prepend(templatePostFeed(item));
  // message.value = '';

  btnPost.addEventListener('click', async (e) => {
    e.preventDefault();
    if (titleContent.value === '' || recipeContent.value === '') {
      errorMessage.innerHTML = 'Insira uma receita válida';
      btnPost.disabled = true;
    } else {
      const user = {
        email: localStorage.getItem('userEmail'),
        uid: localStorage.getItem('userId'),
      }
      await createPost(titleContent.value, recipeContent.value, user);
      showPosts(sectionPost);
      btnPost.disabled = false;
      titleContent.value = '';
      recipeContent.value = '';
      errorMessage.innerHTML = '';
    }
  })
  await showPosts(sectionPost);
  return feedContainer;
}