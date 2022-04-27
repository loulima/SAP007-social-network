import { userLogout } from "../lib/auth.js";

export function printNav() {
  const navContainer = document.createElement("nav");
  navContainer.classList.add("nav-menu");
  const navigationBar = ` 
    <a href="#writePost"><img src="assets/add.png" class="new-recipe-btn" id="icon-new-recipe"></a>
    <a href="#login"><img src="assets/logout.png" class="logout-icon" id="icon-logout"></a>
    `;
  navContainer.innerHTML = navigationBar;
  const logOut = navContainer.querySelector("#icon-logout");
  logOut.addEventListener("click", (e) => {
    e.preventDefault();
    userLogout();
  });
  return navContainer;
}

// const searchRecipe = navContainer.querySelector('#recipe-search');
//
// const newRecipe = navContainer.querySelector('#icon-new-recipe');

// logOut.addEventListener('click', (e) => {
//   e.preventDefault();
//   userLogout().then(() => {
//     window.location.hash = '';
//   });
// });

// searchRecipe.addEventListener('keyup', function(){
//   })

// newRecipe.addEventListener('click', (e) => {
//  e.preventDefault();
//  window.location.hash = '#writePost';
// });
