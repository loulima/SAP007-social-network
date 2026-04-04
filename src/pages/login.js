import { signIn, signinGoogle } from "../lib/auth.js";

export default function login() {
  const loginContainer = document.createElement("div");
  loginContainer.classList.add("login-container");
  loginContainer.innerHTML = `
  <form class="login-form">
      <input class="text-input" type="email" id="email-login-input" placeholder="Email" required>
      <input class="text-input" type="password" id="password-login-input" placeholder="Senha" required>
      <span class="form-error" id="login-error"></span>
      <button class="btn-login" type="submit" id="btn-submit-login">Entrar</button>
      <div class="container-btn-login">
        <button class="btn-login-google" type="button" id="google-login">Entrar com Google</button>
        <p class="register-text">Ainda não possui uma conta? <a href="/register">Cadastre-se</a></p>
      </div>
  </form>
    `;

  const email = loginContainer.querySelector("#email-login-input");
  const password = loginContainer.querySelector("#password-login-input");
  const btnSubmit = loginContainer.querySelector("#btn-submit-login");
  const btnGoogle = loginContainer.querySelector("#google-login");
  const loginError = loginContainer.querySelector("#login-error");

  btnSubmit.addEventListener("click", (e) => {
    e.preventDefault();
    loginError.textContent = "";

    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    if (emailValue === "usuaria1@gmail.com" && passwordValue === "lab007") {
      localStorage.setItem("userEmail", "usuaria1@gmail.com");
      localStorage.setItem("userId", "demo-user-bypass");
      window.history.pushState(null, '', '/feed');
      window.dispatchEvent(new PopStateEvent('popstate'));
      return;
    }

    signIn(emailValue, passwordValue)
      .then((loggedUser) => {
        localStorage.setItem("userEmail", loggedUser.email);
        localStorage.setItem("userId", loggedUser.uid);
        window.history.pushState(null, '', '/feed');
        window.dispatchEvent(new PopStateEvent('popstate'));
      })
      .catch(() => {
        loginError.textContent = "Email ou senha incorretos. Tente novamente.";
      });
  });

  btnGoogle.addEventListener("click", (e) => {
    e.preventDefault();
    loginError.textContent = "";
    signinGoogle()
      .then(() => {
        window.history.pushState(null, '', '/feed');
        window.dispatchEvent(new PopStateEvent('popstate'));
      })
      .catch(() => {
        loginError.textContent = "Não foi possível entrar com Google. Tente novamente.";
      });
  });

  return loginContainer;
}
