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

export const createPost = async (textTitle, textPost, userData) => {
  try {
    const docRef = await addDoc(collection(db, 'posts'), {
      title: textTitle,
      recipe: textPost,
      author: userData.email,
      date: new Date().toLocaleString('pt-br'),
      likes: [],
      user: userData.uid,
    });
    return docRef.id;
  } catch (e) {
    return e;
  }
};

export async function getPosts() {
  const arrPost = [];
  const sortingPosts = query(collection(db, 'posts'), orderBy('date', 'asc'));
  const querySnapshot = await getDocs(sortingPosts);
  querySnapshot.forEach((document) => {
    const postObj = document.data();
    postObj.id = document.id;
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
    await updateDoc(postId, { likes: arrayUnion(userEmail) });
  } catch (e) {
    return e;
  }
}

export async function dislikePost(id, userEmail) {
  try {
    const postId = doc(db, 'posts', id);
    return await updateDoc(postId, { likes: arrayRemove(userEmail) });
  } catch (e) {
    return e;
  }
}

export const editPost = async (id, title, recipe) => {
  const post = doc(db, 'posts', id);
  await updateDoc(post, { title, recipe });
  return post;
};
