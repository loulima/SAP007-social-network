import { VALIDATION, ERROR_MESSAGES } from './Constants.js';

export function validateEmail(email) {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email é obrigatório' };
  }
  if (!VALIDATION.EMAIL_REGEX.test(email)) {
    return { isValid: false, error: ERROR_MESSAGES.AUTH.INVALID_EMAIL };
  }
  return { isValid: true, error: null };
}

export function validatePassword(password) {
  if (!password || password === '') {
    return { isValid: false, error: 'Senha é obrigatória' };
  }
  if (/\s/.test(password)) {
    return { isValid: false, error: 'Senha não pode conter espaços' };
  }
  if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    return { isValid: false, error: ERROR_MESSAGES.AUTH.WEAK_PASSWORD };
  }
  return { isValid: true, error: null };
}

export function validatePasswordConfirmation(password, confirmPassword) {
  if (!confirmPassword || confirmPassword.trim() === '') {
    return { isValid: false, error: 'Confirmação de senha é obrigatória' };
  }
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Senhas não coincidem' };
  }
  return { isValid: true, error: null };
}

export function validatePostTitle(title) {
  if (!title || title.trim() === '') {
    return { isValid: false, error: ERROR_MESSAGES.POST.EMPTY_TITLE };
  }
  if (title.trim().length < VALIDATION.POST_TITLE_MIN_LENGTH) {
    return { isValid: false, error: `Título deve ter pelo menos ${VALIDATION.POST_TITLE_MIN_LENGTH} caracteres` };
  }
  if (title.length > VALIDATION.POST_TITLE_MAX_LENGTH) {
    return { isValid: false, error: ERROR_MESSAGES.POST.TITLE_TOO_LONG };
  }
  return { isValid: true, error: null };
}

export function validatePostContent(content) {
  if (!content || content.trim() === '') {
    return { isValid: false, error: ERROR_MESSAGES.POST.EMPTY_CONTENT };
  }
  if (content.trim().length < VALIDATION.POST_CONTENT_MIN_LENGTH) {
    return { isValid: false, error: `Receita deve ter pelo menos ${VALIDATION.POST_CONTENT_MIN_LENGTH} caracteres` };
  }
  if (content.length > VALIDATION.POST_CONTENT_MAX_LENGTH) {
    return { isValid: false, error: ERROR_MESSAGES.POST.CONTENT_TOO_LONG };
  }
  return { isValid: true, error: null };
}

export function validateLoginData(data) {
  const errors = {};
  let isValid = true;

  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
    isValid = false;
  }

  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error;
    isValid = false;
  }

  return { isValid, errors };
}

export function validateRegisterData(data) {
  const errors = {};
  let isValid = true;

  if (!data.name || data.name.trim() === '') {
    errors.name = 'Nome é obrigatório';
    isValid = false;
  } else if (data.name.trim().length < 2) {
    errors.name = 'Nome deve ter pelo menos 2 caracteres';
    isValid = false;
  } else if (data.name.trim().length > 30) {
    errors.name = 'Nome deve ter no máximo 30 caracteres';
    isValid = false;
  }

  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
    isValid = false;
  }

  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error;
    isValid = false;
  }

  const confirmPasswordValidation = validatePasswordConfirmation(data.password, data.confirmPassword);
  if (!confirmPasswordValidation.isValid) {
    errors.confirmPassword = confirmPasswordValidation.error;
    isValid = false;
  }

  return { isValid, errors };
}

export function validatePostData(data) {
  const errors = {};
  let isValid = true;

  const titleValidation = validatePostTitle(data.title);
  if (!titleValidation.isValid) {
    errors.title = titleValidation.error;
    isValid = false;
  }

  const contentValidation = validatePostContent(data.content);
  if (!contentValidation.isValid) {
    errors.content = contentValidation.error;
    isValid = false;
  }

  return { isValid, errors };
}

export function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
