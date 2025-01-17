/* eslint-disable no-alert */
/* eslint-disable no-undef */
import { signIn, signinGoogle } from '../lib/auth.js';

export default function login() {
  const loginContainer = document.createElement('div');
  loginContainer.classList.add('login-container');
  loginContainer.innerHTML = `
  <form class="login-form">
      <input class="text-input" type="email" id="email-login-input" placeholder="Email" required>

      <input class="text-input" type="password" id="password-login-input" placeholder="Senha" required>

      <button class="btn-login" type="submit" id="btn-submit-login"><a href="#feed">Entrar</a></button>
      
      <div class="container-btn-login">
      <button class="btn-login-google" type="submit" id="google-login"><a herf=" ">Entrar com Google</a></button>
      <p class="register-text">Ainda não possui uma conta? <a href="#register">Cadastre-se</a></p>
      </div>

  </form>
    `;

  const email = loginContainer.querySelector('#email-login-input');
  const password = loginContainer.querySelector('#password-login-input');
  const btnSubmit = loginContainer.querySelector('#btn-submit-login');
  const btnGoogle = loginContainer.querySelector('#google-login');

  btnSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    signIn(email.value, password.value)
      .then((user) => {
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userId', user.uid);
        window.location.hash = '#feed';
      })
      .catch((error) => {
        const errorMessage = error.message;
        alert('Algo deu errado, tente novamente mais tarde.');
        return errorMessage;
      });
  });

  btnGoogle.addEventListener('click', (e) => {
    e.preventDefault();
    signinGoogle()
      .then(() => {
        window.location.hash = '#feed';
      })
      .catch((error) => {
        const credential = GoogleAuthProvider.credentialFromError(error);
        alert('Algo deu errado, tente novamente mais tarde.');
        return credential;
      });
  });

  return loginContainer;
}
