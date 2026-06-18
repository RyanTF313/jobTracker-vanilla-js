import { Job } from "./utils.js";
const loginModal = document.getElementById("login-modal");
const loginForm = document.getElementById("login-form");
const logoutButton = document.getElementById("logout-button");
const welcomeMessage = document.getElementById("welcome-message");
const welcomeSection = document.getElementById("welcome-section");
const boardSection = document.getElementById("job-board");
const boardBodySection = document.getElementById("job-board-body");
const addJobFormBtns = document.getElementsByClassName("btn table-column");
const jobForm = document.getElementById("create-job-modal");
const createJobBtn = document.getElementById("create-job-button");

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
    currentState.auth.logout();
    currentState.clearState();
    renderBoard(currentState);
  });

  addEventListenersToAddJobFormBtns(currentState);
};

const renderBoard = (currentState) => {
  boardBodySection.innerHTML = "";

  if (!currentState.auth.isloggedIn) {
    boardSection.style.display = "none";
    return;
  }

  boardBodySection.innerHTML = currentState.jobs.map((job) => createJobRow(job)).join("");
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
    const cellClass = i === columnNumMap[status] ? "card" : "";
    cell.className = cellClass;

    if (i === columnNumMap[status]) {
      cell.textContent = company;
      tableRow.appendChild(cell);
    } else {
      tableRow.appendChild(cell);
    }
  }

  return tableRow.outerHTML;
};

const addEventListenersToAddJobFormBtns = (currentState) => {
  Array.from(addJobFormBtns).forEach((btn) => {
    btn.removeEventListener("click", () => {}); // Remove any existing event listeners to prevent duplicates
    btn.addEventListener("click", () => {
      const column = btn.dataset.column;
      jobForm.style.display = "block";
      addEventListenerToCreateJobBtn(currentState, column);
    });
  });
};

const addEventListenerToCreateJobBtn = (currentState, column) => {
  const oldBtn = document.getElementById("create-job-button"); 
  const newBtn = oldBtn.cloneNode(true);
  oldBtn.replaceWith(newBtn);//remove old button with event listener to prevent duplicates
  newBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const currentJobForm = document.getElementById("create-job-form");
    const position = currentJobForm.elements["position"].value;
    const company = currentJobForm.elements["company"].value;
    const notes = currentJobForm.elements["notes"].value;
    const salary = currentJobForm.elements["salary"].value;

    const newJob = new Job(position, company, column, notes, salary);

    currentState.jobs.push(newJob);
    currentState.saveState();
    renderBoard(currentState);
    currentJobForm.reset();
    jobForm.style.display = "none";
  });
};

export { handleInitialLoad, renderBoard };
