import { editPost, deletePost } from '../lib/firestore.js';

export function modalEditPost(postObj, postContainer) {
  const modalContainer = document.createElement('div');
  modalContainer.classList.add('modal-container');
  const template = `
  <div id="edit-modal" class="modal-content">
    <input class="title-edition" id="title-edit" type="text" placeholder="Título">${postObj.title}
    <textarea class="recipe-edition" id="recipe-edit" type="text" placeholder="Receita" wrap="hard">${postObj.recipe}</textarea>
    
    <button class="btn-update" id="cancel-update-btn" >Cancelar</button>
    <button class="btn-update" id="update-btn" >Atualizar</button>
    
    <span id="error-msg" class="error-message"></span>
  </div>
    `;
  modalContainer.innerHTML = template;

  const editModal = modalContainer.querySelector('#edit-modal');
  const saveEdit = modalContainer.querySelector('#update-btn');
  const cancelEdit = modalContainer.querySelector('#cancel-update-btn');
  const errorMessage = modalContainer.querySelector('#error-msg');
  const newTitle = modalContainer.querySelector('#title-edit');
  const newRecipe = modalContainer.querySelector('#recipe-edit');
  const postTitle = postContainer.querySelector(`#title-${postObj.id}`);
  const postRecipe = postContainer.querySelector(`#recipe-${postObj.id}`);

  saveEdit.addEventListener('click', () => {
    if (newTitle.value === '' || newRecipe.value === '') {
      errorMessage.innerHTML = 'Ocorreu um erro, tente novamente.';
    } else {
      editPost(postObj.id, newTitle.value, newRecipe.value).then(() => {
        postTitle.innerHTML = `Título:${newTitle.value}`;
        postRecipe.innerHTML = `Receita:${newRecipe.value}`;
        modalContainer.remove();
      });
    }
  });

  cancelEdit.addEventListener('click', () => {
    modalContainer.remove();
  });

  window.addEventListener('click', (e) => {
    if (e.target === editModal) {
      modalContainer.remove();
    }
  });
  return modalContainer;
}

export function modalDeletePost(postObj, postContainer) {
  const modalContainer = document.createElement('div');
  modalContainer.classList.add('modal-container');
  const template = `
  <div id="delete-content" class="modal-content">
      <p class="delete-message">Tem certeza que quer excluir essa receita?</p>

      <button class="delete-btn" id="yes-btn" type="submit">Excluir</button>
      <button class="cancel-delete-btn" id="no-btn" type="submit">Cancelar</button>
  </div>
  `;
  modalContainer.innerHTML = template;

  const deleteModal = modalContainer.querySelector('#delete-modal');
  const confirmBtn = modalContainer.querySelector('#yes-btn');
  const declineBtn = modalContainer.querySelector('#no-btn');

  confirmBtn.addEventListener('click', (e) => {
    e.preventDefault();
    deletePost(postObj.id).then(() => {
      postContainer.remove();
    });
  });

  declineBtn.addEventListener('click', (e) => {
    e.preventDefault();
    modalContainer.remove();
  });

  window.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
      modalContainer.remove();
    }
  });

  return modalContainer;
}
