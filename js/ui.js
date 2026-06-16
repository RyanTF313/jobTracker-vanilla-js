const loginModal = document.getElementById("login-modal");
const loginForm = document.getElementById("login-form");
const logoutButton = document.getElementById("logout-button");
const welcomeMessage = document.getElementById("welcome-message");
const welcomeSection = document.getElementById("welcome-section");

const handleInitialLoad = (isLoggedIn, currentState) => {
  if (isLoggedIn) {
    welcomeSection.style.display = "block";
    welcomeMessage.textContent = `Welcome back, ${currentState.auth.user}!`;
    loginModal.style.display = "none";
  } else {
    welcomeSection.style.display = "none";
    loginModal.style.display = "block";
    logoutButton.style.display = "none";
  }

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = loginForm.elements["username"].value;
    currentState.auth.login(username);
    welcomeSection.style.display = "block";
    welcomeMessage.textContent = `Welcome, ${currentState.auth.user}!`;
    loginModal.style.display = "none";
  });

  logoutButton.addEventListener("click", () => {
    currentState.auth.logout();
    welcomeSection.style.display = "none";
    loginModal.style.display = "block";
    logoutButton.style.display = "none";
  });
};

export { handleInitialLoad };
