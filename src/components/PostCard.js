import { handleToggleLike, handleUpdatePost, handleDeletePost } from '../controllers/PostController.js';

export function createPostCard(post, onUpdate) {
  const postContainer = document.createElement('div');
  postContainer.classList.add('new-post-writePost');
  postContainer.dataset.postId = post.id;

  postContainer.innerHTML = `
    <div class='like-container'>
      <button id='like-btn-${post.id}' class='button-like'>
        <img class='like-icon like' src='./assets/cookie.png'>
        <p class='likes-number'>
          <span id='likes-count-${post.id}' class='num-likes'>${post.likesCount}</span>
        </p>
      </button>
    </div>

    <div class="post-container">
      <ul class="posts">
        <li>
          <h3 class="post-title" id="title-${post.id}">${post.title}</h3>
          <h4 class="post-itens">Autor(a):</h4>
          <p>${post.authorDisplayName}</p>
          <h4 class="post-itens">Receita:</h4>
          <p id="recipe-${post.id}">${post.recipe}</p>
          <p class="post-itens"><strong>Data:</strong> ${post.date}</p>
        </li>
      </ul>
    </div>

    <div class='post-interations'>
      ${post.canEdit ? `
        <button class='interact-btn edit-btn' data-post-id='${post.id}'>
          <img class='edit-pencil' src='./assets/pencil.png'>Editar
        </button>
        <button class='interact-btn delete-btn' data-post-id='${post.id}'>
          <img class='delete-trash' src='./assets/trash.png'>Apagar
        </button>
      ` : ''}
    </div>
  `;

  setupPostCardEvents(postContainer, post, onUpdate);
  return postContainer;
}

function setupPostCardEvents(container, post, onUpdate) {
  const likeBtn = container.querySelector(`#like-btn-${post.id}`);
  if (likeBtn) {
    likeBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      await handleLikeClick(post, container, onUpdate);
    });
  }

  const editBtn = container.querySelector('.edit-btn');
  if (editBtn) {
    editBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showEditModal(post, container, onUpdate);
    });
  }

  const deleteBtn = container.querySelector('.delete-btn');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showDeleteModal(post, container, onUpdate);
    });
  }
}

async function handleLikeClick(post, container, onUpdate) {
  const result = await handleToggleLike(post);
  if (result.success) {
    const likesCount = container.querySelector(`#likes-count-${post.id}`);
    const currentCount = parseInt(likesCount.textContent);
    const newCount = result.liked ? currentCount + 1 : currentCount - 1;
    likesCount.textContent = newCount;
    post.likesCount = newCount;
    post.isLikedByUser = result.liked;
    if (onUpdate) onUpdate();
  }
}

function showEditModal(post, container, onUpdate) {
  const modal = createEditModal(post, async (updatedData) => {
    const result = await handleUpdatePost(post.id, updatedData);
    if (result.success) {
      const titleElement = container.querySelector(`#title-${post.id}`);
      const recipeElement = container.querySelector(`#recipe-${post.id}`);
      titleElement.textContent = updatedData.title;
      recipeElement.textContent = updatedData.content;
      post.title = updatedData.title;
      post.recipe = updatedData.content;
      if (onUpdate) onUpdate();
    }
    modal.remove();
  });
  document.body.appendChild(modal);
}

function showDeleteModal(post, container, onUpdate) {
  const modal = createDeleteModal(post, async () => {
    const result = await handleDeletePost(post.id);
    if (result.success) {
      container.remove();
      if (onUpdate) onUpdate();
    }
    modal.remove();
  });
  document.body.appendChild(modal);
}

function createEditModal(post, onSave) {
  const modal = document.createElement('div');
  modal.classList.add('modal-container');

  modal.innerHTML = `
    <div class="modal-content">
      <h3>Editar Receita</h3>
      <input type="text" id="edit-title" class="title-edition" placeholder="Título da receita" value="${post.title}">
      <textarea id="edit-recipe" class="recipe-edition" placeholder="Receita" rows="6">${post.recipe}</textarea>
      <div class="modal-buttons">
        <button class="btn-cancel">Cancelar</button>
        <button class="btn-save">Salvar</button>
      </div>
      <span class="error-message" id="edit-error"></span>
    </div>
  `;

  const cancelBtn = modal.querySelector('.btn-cancel');
  const saveBtn = modal.querySelector('.btn-save');
  const titleInput = modal.querySelector('#edit-title');
  const recipeInput = modal.querySelector('#edit-recipe');
  const errorSpan = modal.querySelector('#edit-error');

  cancelBtn.addEventListener('click', () => modal.remove());

  saveBtn.addEventListener('click', () => {
    const title = titleInput.value.trim();
    const content = recipeInput.value.trim();
    if (!title || !content) {
      errorSpan.textContent = 'Título e receita são obrigatórios';
      return;
    }
    onSave({ title, content });
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });

  return modal;
}

function createDeleteModal(post, onConfirm) {
  const modal = document.createElement('div');
  modal.classList.add('modal-container');

  modal.innerHTML = `
    <div class="modal-content">
      <h3>Confirmar Exclusão</h3>
      <p>Tem certeza que deseja excluir a receita "${post.title}"?</p>
      <div class="modal-buttons">
        <button class="btn-cancel">Cancelar</button>
        <button class="btn-confirm delete-btn">Excluir</button>
      </div>
    </div>
  `;

  const cancelBtn = modal.querySelector('.btn-cancel');
  const confirmBtn = modal.querySelector('.btn-confirm');

  cancelBtn.addEventListener('click', () => modal.remove());
  confirmBtn.addEventListener('click', onConfirm);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });

  return modal;
}
