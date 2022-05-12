
import { likePost, dislikePost } from "../lib/firestore.js";
import { auth } from "../configs/config.firebase.js";
import { modalEditPost, modalDeletePost, } from "../components/modal.js";
import { getPosts } from "../lib/firestore.js";

export function postComponent(postObj) {
  const userId = auth.currentUser.uid;
  const isAuthor = postObj.user === userId;
  // const postId = postObj.id;

  const postsContainer = document.createElement("div");
  postsContainer.classList.add("new-post-writePost");

  const templatePost = `
    <div class= "post-container">
      <p>${postObj.date}</p>
        <ul class="posts">
          <li> <b id="title-${postObj.id}"> Titulo: </b> ${postObj.title}
            <p> <b class=""> Autor(a): </b> ${postObj.author}</p> 
            <b id="recipe-${postObj.recipe}">Receita:</b>
            <p>  </p>
            ${postObj.recipe}  
          </li>
        </ul>
    </div>

    <div class='post-interations'>
    
      <div class='like-container'>
        <button id='cookie-btn' class='button-like'>
          <img class='like-icon like' src='./assets/cookie.png'>
          <p class='likes-number'><span id='numLikes-${postObj.id}' class='num-likes'>${postObj.likes.length}</span></p>
       </button>
      </div>
      
      ${isAuthor ? `
        <button class='interact-btn' id='pencil-btn'><img class='edit-pencil' src='./assets/pencil.png'>Editar</button>
        <button class='interact-btn' id="trash-btn"><img class='delete-trash' src='./assets/trash.png'>Apagar</button> 
        <span id="edit-post"></span>
        <span id="delete-post"></span>
      ` : ""}
    </div>

</div>
    `;
  postsContainer.innerHTML = templatePost;

  /// MODAIS DE DELETAR E EDITAR

  if (isAuthor) {
    const editPost = postsContainer.querySelector("#pencil-btn");
    editPost.addEventListener("click", (e) => {
      e.preventDefault();
      postsContainer.appendChild(modalEditPost(postObj, postsContainer));
    });

    const deletePost = postsContainer.querySelector("#trash-btn");
    deletePost.addEventListener("click", (e) => {
      e.preventDefault();
      postsContainer.appendChild(modalDeletePost(postObj, postsContainer));
    });
  }

  ///FUNÇÃO LIKE
  const likeButton = postsContainer.querySelector("#cookie-btn");
  const countLikes = postsContainer.querySelector(`#numLikes-${postObj.id}`);
  const postLike = postObj.likes;
  let arrayLike = postLike.length;

  likeButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const postLike = postObj.likes;

    if (!postLike.includes(auth.currentUser.email)) {
      likePost(postObj.id, auth.currentUser.email);
      postLike.push(auth.currentUser.email);
      arrayLike += 1;
      countLikes.textContent = arrayLike;
    } else {
      const likeUser = postLike.indexOf(auth.currentUser.email);
      dislikePost(postObj.id, auth.currentUser.email);
      postLike.splice(likeUser, 1);
      arrayLike -= 1;
      countLikes.textContent = arrayLike;
    }
  });


  getPosts();
  return postsContainer;
}
