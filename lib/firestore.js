/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable no-alert */
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
  doc,
} from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-firestore.js';

const db = getFirestore();

export const createPost = async (textTitle, textPost, user) => {
  try {
    const docRef = await addDoc(collection(db, 'posts'), {
      title: textTitle,
      recipe: textPost,
      author: user.email,
      date: new Date().toLocaleString('pt-br'),
      likes: [],
      user: user.uid,
    });
    return docRef.id;
  } catch (e) {
    alert('Erro ao adicionar post', e);
  }
};

export async function getPosts() {
  const arrPost = [];
  const sortingPosts = query(collection(db, 'posts'), orderBy('date', 'asc'));
  const querySnapshot = await getDocs(sortingPosts);
  querySnapshot.forEach((doc) => {
    const postObj = doc.data();
    postObj.id = doc.id;
    arrPost.push(postObj);
  });
  return arrPost;
}

export const deletePost = async (id) => {
  await deleteDoc(doc(db, 'posts', id));
};

export async function likePost(id, userEmail) {
  try {
    const postId = doc(db, 'posts', id);
    await updateDoc(postId, {
      likes: arrayUnion(userEmail),
    });
  } catch (e) {
    return e;
  }
}
export async function dislikePost(id, userEmail) {
  try {
    const postId = doc(db, 'posts', id);
    return await updateDoc(postId, {
      likes: arrayRemove(userEmail),
    });
  } catch (e) {
    return e;
  }
}

export const editPost = async (id, title, recipe) => {
  const post = doc(db, 'posts', id);
  await updateDoc(post, {
    title,
    recipe,
  });
  return post;
};
