import { handleRegister } from '../controllers/AuthController.js';
import { validateEmail, validatePassword, validatePasswordConfirmation } from '../utils/Validator.js';

export function createRegisterForm() {
  const container = document.createElement('div');
  container.classList.add('login-container');

  container.innerHTML = `
    <form class="login-form" id="register-form">
      <h2>Criar Conta no Dev Cooks</h2>

      <div class="form-group">
        <input class="text-input" type="text" id="name-input" placeholder="Nome completo" maxlength="30" required>
        <span class="field-hint">Mínimo 2 caracteres, máximo 30</span>
        <span class="field-error" id="name-error"></span>
      </div>

      <div class="form-group">
        <input class="text-input" type="email" id="email-input" placeholder="Email" required>
        <span class="field-error" id="email-error"></span>
      </div>

      <div class="form-group">
        <input class="text-input" type="password" id="password-input" placeholder="Senha" required>
        <span class="field-hint">Mínimo 6 caracteres, sem espaços</span>
        <span class="field-error" id="password-error"></span>
      </div>

      <div class="form-group">
        <input class="text-input" type="password" id="confirm-password-input" placeholder="Confirme sua senha" required>
        <span class="field-error" id="confirmPassword-error"></span>
      </div>

      <button class="btn-login" type="submit" id="register-btn" disabled>Criar Conta</button>

      <p class="login-text">Já tem uma conta? <a href="/login">Faça login</a></p>

      <div class="general-error" id="general-error"></div>
    </form>
  `;

  setupRegisterFormEvents(container);
  return container;
}

function validateName(value) {
  const trimmed = value.trim();
  if (trimmed === '') return 'Nome é obrigatório';
  if (trimmed.length < 2) return 'Nome deve ter pelo menos 2 caracteres';
  if (trimmed.length > 30) return 'Nome deve ter no máximo 30 caracteres';
  return null;
}

function validateFieldOnBlur(input, errorId, validateFn, container) {
  const error = validateFn(input.value);
  showOrClearFieldError(errorId, error, input, container);
}

function showOrClearFieldError(errorId, errorMessage, input, container) {
  const errorEl = container.querySelector(`#${errorId}`);
  if (errorMessage) {
    errorEl.textContent = errorMessage;
    input.classList.add('input-invalid');
    input.classList.remove('input-valid');
  } else {
    errorEl.textContent = '';
    input.classList.remove('input-invalid');
    if (input.value.trim() !== '') input.classList.add('input-valid');
  }
}

function checkFormValidity(container) {
  const nameInput = container.querySelector('#name-input');
  const emailInput = container.querySelector('#email-input');
  const passwordInput = container.querySelector('#password-input');
  const confirmInput = container.querySelector('#confirm-password-input');
  const registerBtn = container.querySelector('#register-btn');

  const nameOk = validateName(nameInput.value) === null;
  const emailOk = validateEmail(emailInput.value).isValid;
  const passwordOk = validatePassword(passwordInput.value).isValid;
  const confirmOk = validatePasswordConfirmation(passwordInput.value, confirmInput.value).isValid;

  registerBtn.disabled = !(nameOk && emailOk && passwordOk && confirmOk);
}

function setupRegisterFormEvents(container) {
  const form = container.querySelector('#register-form');
  const nameInput = container.querySelector('#name-input');
  const emailInput = container.querySelector('#email-input');
  const passwordInput = container.querySelector('#password-input');
  const confirmPasswordInput = container.querySelector('#confirm-password-input');

  nameInput.addEventListener('blur', () => {
    validateFieldOnBlur(nameInput, 'name-error', validateName, container);
    checkFormValidity(container);
  });
  nameInput.addEventListener('input', () => {
    if (nameInput.classList.contains('input-invalid')) {
      validateFieldOnBlur(nameInput, 'name-error', validateName, container);
    }
    checkFormValidity(container);
  });

  emailInput.addEventListener('blur', () => {
    const error = validateEmail(emailInput.value).error;
    showOrClearFieldError('email-error', error, emailInput, container);
    checkFormValidity(container);
  });
  emailInput.addEventListener('input', () => {
    if (emailInput.classList.contains('input-invalid')) {
      const error = validateEmail(emailInput.value).error;
      showOrClearFieldError('email-error', error, emailInput, container);
    }
    checkFormValidity(container);
  });

  passwordInput.addEventListener('blur', () => {
    const error = validatePassword(passwordInput.value).error;
    showOrClearFieldError('password-error', error, passwordInput, container);
    if (confirmPasswordInput.value !== '') {
      const confirmError = validatePasswordConfirmation(passwordInput.value, confirmPasswordInput.value).error;
      showOrClearFieldError('confirmPassword-error', confirmError, confirmPasswordInput, container);
    }
    checkFormValidity(container);
  });
  passwordInput.addEventListener('input', () => {
    if (passwordInput.classList.contains('input-invalid')) {
      const error = validatePassword(passwordInput.value).error;
      showOrClearFieldError('password-error', error, passwordInput, container);
    }
    if (confirmPasswordInput.value !== '') {
      const confirmError = validatePasswordConfirmation(passwordInput.value, confirmPasswordInput.value).error;
      showOrClearFieldError('confirmPassword-error', confirmError, confirmPasswordInput, container);
    }
    checkFormValidity(container);
  });

  confirmPasswordInput.addEventListener('blur', () => {
    const error = validatePasswordConfirmation(passwordInput.value, confirmPasswordInput.value).error;
    showOrClearFieldError('confirmPassword-error', error, confirmPasswordInput, container);
    checkFormValidity(container);
  });
  confirmPasswordInput.addEventListener('input', () => {
    if (confirmPasswordInput.classList.contains('input-invalid') || confirmPasswordInput.value !== '') {
      const error = validatePasswordConfirmation(passwordInput.value, confirmPasswordInput.value).error;
      showOrClearFieldError('confirmPassword-error', error, confirmPasswordInput, container);
    }
    checkFormValidity(container);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleFormSubmit(container);
  });
}

async function handleFormSubmit(container) {
  const nameInput = container.querySelector('#name-input');
  const emailInput = container.querySelector('#email-input');
  const passwordInput = container.querySelector('#password-input');
  const confirmPasswordInput = container.querySelector('#confirm-password-input');
  const registerBtn = container.querySelector('#register-btn');

  registerBtn.disabled = true;
  registerBtn.textContent = 'Criando conta...';

  try {
    const result = await handleRegister({
      name: nameInput.value,
      email: emailInput.value,
      password: passwordInput.value,
      confirmPassword: confirmPasswordInput.value
    });

    if (!result.success) {
      if (result.errors) {
        Object.entries(result.errors).forEach(([field, message]) => {
          const input = container.querySelector(`#${field}-input`) || container.querySelector(`#${field.replace('confirmPassword', 'confirm-password')}-input`);
          showOrClearFieldError(`${field}-error`, message, input, container);
        });
      } else if (result.error) {
        const errorElement = container.querySelector('#general-error');
        errorElement.textContent = result.error;
        errorElement.style.display = 'block';
      }
      registerBtn.disabled = false;
      registerBtn.textContent = 'Criar Conta';
    }
  } catch (_error) {
    const errorElement = container.querySelector('#general-error');
    errorElement.textContent = 'Erro inesperado. Tente novamente.';
    errorElement.style.display = 'block';
    registerBtn.disabled = false;
    registerBtn.textContent = 'Criar Conta';
  }
}
