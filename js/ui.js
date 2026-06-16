const loginModal = document.getElementById("login-modal");
const loginForm = document.getElementById("login-form");
const logoutButton = document.getElementById("logout-button");
const welcomeMessage = document.getElementById("welcome-message");
const welcomeSection = document.getElementById("welcome-section");
const boardSection = document.getElementById("job-board");
const boardBodySection = document.getElementById("job-board-body");

const handleInitialLoad = (isLoggedIn, currentState) => {
  if (isLoggedIn) {
    welcomeSection.style.display = "block";
    welcomeMessage.textContent = `Welcome back, ${currentState.auth.user}!`;
    loginModal.style.display = "none";
    logoutButton.style.display = "inline-block";
    renderBoard(currentState);
  } else {
    welcomeSection.style.display = "none";
    loginModal.style.display = "block";
    logoutButton.style.display = "none";
    boardSection.style.display = "none";
  }

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = loginForm.elements["username"].value;
    currentState.auth.login(username);
    welcomeSection.style.display = "block";
    welcomeMessage.textContent = `Welcome, ${currentState.auth.user}!`;
    loginModal.style.display = "none";
    logoutButton.style.display = "inline-block";
    currentState.loadState();
    renderBoard(currentState);
  });

  logoutButton.addEventListener("click", () => {
      welcomeSection.style.display = "none";
      loginModal.style.display = "block";
      logoutButton.style.display = "none";
      boardSection.style.display = "none";
      currentState.clearState();
      currentState.auth.logout();
  });
};

const renderBoard = (currentState) => {
  const { jobs } = currentState;

  boardBodySection.innerHTML = "";

  if (!currentState.auth.isloggedIn) {
    boardBodySection.innerHTML = "";
    boardSection.style.display = "none";
  }

  boardBodySection.innerHTML = jobs.map((job) => createJobRow(job)).join("");
  boardSection.style.display = "block";
};

const createJobRow = (job) => {
  const { status, company } = job;
  const columnNumMap = {
    wishlist: 1,
    applied: 2,
    interviewing: 3,
    offer: 4,
    rejected: 5,
  };
  const tableRow = document.createElement("tr");

  for (let i = 1; i <= 5; i++) {
    const cell = document.createElement("td");

    if (i === columnNumMap[status]) {
      cell.textContent = company;
      tableRow.appendChild(cell);
    } else {
      tableRow.appendChild(cell);
    }
  }

  return tableRow.innerHTML;
};

export { handleInitialLoad, renderBoard };
