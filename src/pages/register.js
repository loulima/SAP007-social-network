/* eslint-disable no-alert */
import { createUser } from '../lib/auth.js';

export default () => {
  const register = document.createElement('div');
  register.classList.add('login-container');
  register.innerHTML = `
      <form class="login-form">
          <input class="text-input" type="text" id="user-name" placeholder="Nome" required>
  
          <input class="text-input" type="email" id="register-email" placeholder="Email" required>
    
          <input class="text-input" type="password" id="register-password" placeholder="Senha" required>
    
          <input class="text-input" type="password" id="register-password" placeholder="Confirme sua senha"required>
          
          <button class="btn-login" type="submit" id="register-button"><a href="#feed">Cadastrar</a></button>
          <p class="login-text">Já tem uma conta?<a href="#login"> Faça login</a></p>
      </form>
    `;

  const registerEmail = register.querySelector('#register-email');
  const registerPassword = register.querySelector('#register-password');
  const buttonRegister = register.querySelector('#register-button');

  buttonRegister.addEventListener('click', (e) => {
    e.preventDefault();
    createUser(registerEmail.value, registerPassword.value)
      .then(() => {
        window.location.hash = '#feed';
      })
      .catch((error) => {
        const errorMessage = error.message;
        alert('Algum erro ocorreu, tente novamente mais tarde');
        return errorMessage;
      });
  });
  return register;
};
