import { handleLogin, handleGoogleLogin } from '../controllers/AuthController.js';

export function createLoginForm() {
  const container = document.createElement('div');
  container.classList.add('login-container');

  container.innerHTML = `
    <form class="login-form" id="login-form">
      <h2>Entrar no Dev Cooks</h2>

      <div class="form-group">
        <input class="text-input" type="email" id="email-input" placeholder="Email" required>
        <span class="error-message" id="email-error"></span>
      </div>

      <div class="form-group">
        <input class="text-input" type="password" id="password-input" placeholder="Senha" required>
        <span class="error-message" id="password-error"></span>
      </div>

      <button class="btn-login" type="submit" id="login-btn">Entrar</button>

      <div class="divider"><span>ou</span></div>

      <button class="btn-login-google" type="button" id="google-login-btn">
        <img src="./assets/google-icon.png" alt="Google" class="google-icon">
        Entrar com Google
      </button>

      <p class="register-text">Ainda não possui uma conta? <a href="/register">Cadastre-se</a></p>

      <div class="general-error" id="general-error"></div>
    </form>
  `;

  setupLoginFormEvents(container);
  return container;
}

function setupLoginFormEvents(container) {
  const form = container.querySelector('#login-form');
  const emailInput = container.querySelector('#email-input');
  const passwordInput = container.querySelector('#password-input');
  const googleBtn = container.querySelector('#google-login-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleFormSubmit(container);
  });

  googleBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    await handleGoogleLoginClick(container);
  });

  emailInput.addEventListener('input', () => clearFieldError('email', container));
  passwordInput.addEventListener('input', () => clearFieldError('password', container));
}

async function handleFormSubmit(container) {
  const emailInput = container.querySelector('#email-input');
  const passwordInput = container.querySelector('#password-input');
  const loginBtn = container.querySelector('#login-btn');

  clearAllErrors(container);
  loginBtn.disabled = true;
  loginBtn.textContent = 'Entrando...';

  try {
    const result = await handleLogin({
      email: emailInput.value,
      password: passwordInput.value
    });

    if (!result.success) {
      if (result.errors) {
        showFieldErrors(result.errors, container);
      } else if (result.error) {
        showGeneralError(result.error, container);
      }
    }
  } catch (_error) {
    showGeneralError('Erro inesperado. Tente novamente.', container);
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = 'Entrar';
  }
}

async function handleGoogleLoginClick(container) {
  const googleBtn = container.querySelector('#google-login-btn');

  clearAllErrors(container);
  googleBtn.disabled = true;
  googleBtn.textContent = 'Entrando com Google...';

  try {
    const result = await handleGoogleLogin();
    if (!result.success) {
      showGeneralError(result.error || 'Erro no login com Google', container);
    }
  } catch (_error) {
    showGeneralError('Erro inesperado. Tente novamente.', container);
  } finally {
    googleBtn.disabled = false;
    googleBtn.innerHTML = `
      <img src="./assets/google-icon.png" alt="Google" class="google-icon">
      Entrar com Google
    `;
  }
}

function showFieldErrors(errors, container) {
  Object.entries(errors).forEach(([field, message]) => {
    const errorElement = container.querySelector(`#${field}-error`);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
  });
}

function showGeneralError(message, container) {
  const errorElement = container.querySelector('#general-error');
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }
}

function clearFieldError(field, container) {
  const errorElement = container.querySelector(`#${field}-error`);
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.style.display = 'none';
  }
}

function clearAllErrors(container) {
  const errorElements = container.querySelectorAll('.error-message, .general-error');
  errorElements.forEach((element) => {
    element.textContent = '';
    element.style.display = 'none';
  });
}
