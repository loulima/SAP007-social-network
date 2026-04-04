export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FEED: '/feed',
  DEFAULT: '/login'
};

export const ERROR_MESSAGES = {
  AUTH: {
    INVALID_EMAIL: 'Email inválido',
    WEAK_PASSWORD: 'Senha deve ter pelo menos 6 caracteres',
    EMAIL_ALREADY_IN_USE: 'Este email já está em uso',
    USER_NOT_FOUND: 'Usuário não encontrado',
    WRONG_PASSWORD: 'Senha incorreta',
    GENERIC: 'Erro de autenticação. Tente novamente.'
  },
  POST: {
    EMPTY_TITLE: 'Título da receita é obrigatório',
    EMPTY_CONTENT: 'Conteúdo da receita é obrigatório',
    TITLE_TOO_LONG: 'Título muito longo (máximo 100 caracteres)',
    CONTENT_TOO_LONG: 'Receita muito longa (máximo 500 caracteres)',
    CREATE_ERROR: 'Erro ao criar post. Tente novamente.',
    UPDATE_ERROR: 'Erro ao atualizar post. Tente novamente.',
    DELETE_ERROR: 'Erro ao deletar post. Tente novamente.',
    LIKE_ERROR: 'Erro ao curtir post. Tente novamente.'
  },
  GENERIC: {
    NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
    UNKNOWN_ERROR: 'Algo deu errado. Tente novamente mais tarde.'
  }
};

export const SUCCESS_MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: 'Login realizado com sucesso!',
    REGISTER_SUCCESS: 'Conta criada com sucesso!',
    LOGOUT_SUCCESS: 'Logout realizado com sucesso!'
  },
  POST: {
    CREATE_SUCCESS: 'Receita publicada com sucesso!',
    UPDATE_SUCCESS: 'Receita atualizada com sucesso!',
    DELETE_SUCCESS: 'Receita deletada com sucesso!'
  }
};

export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/,
  PASSWORD_MIN_LENGTH: 6,
  POST_TITLE_MAX_LENGTH: 100,
  POST_CONTENT_MAX_LENGTH: 500,
  POST_TITLE_MIN_LENGTH: 3,
  POST_CONTENT_MIN_LENGTH: 10
};

export const UI_CONFIG = {
  LOADING_DELAY: 300,
  ERROR_DISPLAY_TIME: 5000,
  SUCCESS_DISPLAY_TIME: 3000,
  MODAL_ANIMATION_TIME: 200
};

export const EVENTS = {
  AUTH: {
    LOGIN_SUCCESS: 'auth:login:success',
    LOGIN_ERROR: 'auth:login:error',
    LOGOUT: 'auth:logout',
    REGISTER_SUCCESS: 'auth:register:success',
    REGISTER_ERROR: 'auth:register:error',
    AUTH_STATE_CHANGED: 'auth:state:changed'
  },
  POST: {
    CREATED: 'post:created',
    UPDATED: 'post:updated',
    DELETED: 'post:deleted',
    LIKED: 'post:liked',
    UNLIKED: 'post:unliked',
    LOAD_ERROR: 'post:load:error'
  },
  UI: {
    LOADING_START: 'ui:loading:start',
    LOADING_END: 'ui:loading:end',
    ERROR_SHOW: 'ui:error:show',
    SUCCESS_SHOW: 'ui:success:show',
    MODAL_OPEN: 'ui:modal:open',
    MODAL_CLOSE: 'ui:modal:close'
  },
  NAVIGATION: {
    ROUTE_CHANGED: 'navigation:route:changed'
  }
};

export const FIREBASE_COLLECTIONS = {
  POSTS: 'posts',
  USERS: 'users'
};

export const STORAGE_KEYS = {
  USER_EMAIL: 'userEmail',
  USER_ID: 'userId',
  THEME: 'theme'
};
