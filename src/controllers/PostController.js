import * as PostService from '../services/PostService.js';
import { validatePostData } from '../utils/Validator.js';
import { emit } from '../utils/EventEmitter.js';
import { EVENTS, SUCCESS_MESSAGES } from '../utils/Constants.js';
import { getCurrentUserData } from './AuthController.js';

export async function handleCreatePost(postData) {
  try {
    const validation = validatePostData(postData);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }
    const userData = getCurrentUserData();
    if (!userData) {
      return { success: false, error: 'Usuário não autenticado' };
    }
    const postId = await PostService.createPost(postData, userData);
    emit(EVENTS.UI.SUCCESS_SHOW, { message: SUCCESS_MESSAGES.POST.CREATE_SUCCESS });
    return { success: true, postId };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function handleUpdatePost(postId, updateData) {
  try {
    const validation = validatePostData(updateData);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }
    await PostService.updatePost(postId, { title: updateData.title, recipe: updateData.content });
    emit(EVENTS.UI.SUCCESS_SHOW, { message: SUCCESS_MESSAGES.POST.UPDATE_SUCCESS });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function handleDeletePost(postId) {
  try {
    await PostService.deletePost(postId);
    emit(EVENTS.UI.SUCCESS_SHOW, { message: SUCCESS_MESSAGES.POST.DELETE_SUCCESS });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function handleToggleLike(post) {
  try {
    const userData = getCurrentUserData();
    if (!userData) {
      return { success: false, error: 'Usuário não autenticado' };
    }
    const hasLiked = PostService.hasUserLiked(post, userData.email);
    if (hasLiked) {
      await PostService.unlikePost(post.id, userData.email);
    } else {
      await PostService.likePost(post.id, userData.email);
    }
    return { success: true, liked: !hasLiked };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function handleGetAllPosts() {
  try {
    const posts = await PostService.getAllPosts();
    return { success: true, posts };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export function canUserEditPost(post) {
  const userData = getCurrentUserData();
  if (!userData) return false;
  return PostService.isPostAuthor(post, userData.uid);
}

export function formatPostForDisplay(post) {
  const userData = getCurrentUserData();
  return {
    ...post,
    likesCount: PostService.getLikesCount(post),
    isLikedByUser: userData ? PostService.hasUserLiked(post, userData.email) : false,
    canEdit: userData ? PostService.isPostAuthor(post, userData.uid) : false,
    authorDisplayName: post.authorDisplayName || post.author?.split('@')[0] || 'Usuário'
  };
}
