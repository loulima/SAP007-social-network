import {
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
import { db } from '../config/firebase.config.js';
import { emit } from '../utils/EventEmitter.js';
import { EVENTS, ERROR_MESSAGES } from '../utils/Constants.js';

export async function createPost(postData, userData) {
  try {
    const docRef = await addDoc(collection(db, 'posts'), {
      title: postData.title,
      recipe: postData.content || postData.recipe,
      author: userData.email,
      authorUid: userData.uid,
      date: new Date().toLocaleString('pt-br'),
      likes: [],
      user: userData.uid,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    emit(EVENTS.POST.CREATED, { id: docRef.id, ...postData });
    return docRef.id;
  } catch (_error) {
    emit(EVENTS.POST.LOAD_ERROR, _error);
    throw new Error(ERROR_MESSAGES.POST.CREATE_ERROR);
  }
}

export async function getAllPosts() {
  try {
    const sortingPosts = query(collection(db, 'posts'), orderBy('date', 'asc'));
    const querySnapshot = await getDocs(sortingPosts);
    const posts = [];
    querySnapshot.forEach((document) => {
      posts.push({ id: document.id, ...document.data() });
    });
    return posts;
  } catch (_error) {
    emit(EVENTS.POST.LOAD_ERROR, _error);
    throw new Error('Erro ao carregar posts');
  }
}

export async function updatePost(postId, updateData) {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, { ...updateData, updatedAt: new Date() });
    emit(EVENTS.POST.UPDATED, { id: postId, ...updateData });
  } catch (_error) {
    throw new Error(ERROR_MESSAGES.POST.UPDATE_ERROR);
  }
}

export async function deletePost(postId) {
  try {
    await deleteDoc(doc(db, 'posts', postId));
    emit(EVENTS.POST.DELETED, { id: postId });
  } catch (_error) {
    throw new Error(ERROR_MESSAGES.POST.DELETE_ERROR);
  }
}

export async function likePost(postId, userEmail) {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, { likes: arrayUnion(userEmail), updatedAt: new Date() });
    emit(EVENTS.POST.LIKED, { postId, userEmail });
  } catch (_error) {
    throw new Error(ERROR_MESSAGES.POST.LIKE_ERROR);
  }
}

export async function unlikePost(postId, userEmail) {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, { likes: arrayRemove(userEmail), updatedAt: new Date() });
    emit(EVENTS.POST.UNLIKED, { postId, userEmail });
  } catch (_error) {
    throw new Error(ERROR_MESSAGES.POST.LIKE_ERROR);
  }
}

export function hasUserLiked(post, userEmail) {
  return post.likes && post.likes.includes(userEmail);
}

export function getLikesCount(post) {
  return post.likes ? post.likes.length : 0;
}

export function isPostAuthor(post, userUid) {
  return post.authorUid === userUid || post.user === userUid;
}
