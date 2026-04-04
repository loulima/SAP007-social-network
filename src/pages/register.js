import { createUser } from '../lib/auth.js';

export default () => {
  const register = document.createElement('div');
  register.classList.add('login-container');
  register.innerHTML = `
      <form class="login-form">
          <input class="text-input" type="text" id="user-name" placeholder="Nome" required>
          <input class="text-input" type="email" id="register-email" placeholder="Email" required>
          <input class="text-input" type="password" id="register-password" placeholder="Senha" required>
          <input class="text-input" type="password" id="register-password-confirm" placeholder="Confirme sua senha" required>
          <span class="form-error" id="register-error"></span>
          <button class="btn-login" type="submit" id="register-button">Cadastrar</button>
          <p class="login-text">Já tem uma conta?<a href="/login"> Faça login</a></p>
      </form>
    `;

  const registerEmail = register.querySelector('#register-email');
  const registerPassword = register.querySelector('#register-password');
  const buttonRegister = register.querySelector('#register-button');
  const registerError = register.querySelector('#register-error');

  buttonRegister.addEventListener('click', (e) => {
    e.preventDefault();
    registerError.textContent = '';
    createUser(registerEmail.value, registerPassword.value)
      .then(() => {
        window.history.pushState(null, '', '/feed');
        window.dispatchEvent(new PopStateEvent('popstate'));
      })
      .catch(() => {
        registerError.textContent = 'Algum erro ocorreu, tente novamente mais tarde.';
      });
  });
  return register;
};
