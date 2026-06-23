import { renderAnalytics } from "./analytics.js";

const loginModal = document.getElementById("login-modal");
const loginForm = document.getElementById("login-form");
const logoutButton = document.getElementById("logout-button");
const clearStorageButton = document.getElementById("clear-storage-button");
const welcomeMessage = document.getElementById("welcome-message");
const welcomeSection = document.getElementById("welcome-section");
const boardSection = document.getElementById("job-board");
const boardBodySection = document.getElementById("job-board-body");
const addJobFormBtns = document.getElementsByClassName("btn table-column");
const jobForm = document.getElementById("create-job-modal");
const jobSearchFormSection = document.getElementById("job-search-form-section");
const jobSearchForm = document.getElementById("job-search-form");
const jobSearchInput = document.getElementById("job-search");
const jobDetailsModal = document.getElementById("job-details-modal");
const jobEditForm = document.getElementById("job-edit-form");
const viewNav = document.getElementById("view-nav");
const analyticsSection = document.getElementById("analytics-section");
const viewTabs = document.querySelectorAll(".view-tab");

jobEditForm.addEventListener("submit", (e) => e.preventDefault());
loginModal.addEventListener("cancel", (e) => e.preventDefault());

let jobEditAbortController = null;

const COLUMN_STATUS_MAP = {
  wishlist: 1,
  applied: 2,
  interviewing: 3,
  offer: 4,
  rejected: 5,
};

const showBoardView = () => {
  viewTabs.forEach((t) =>
    t.classList.toggle("active", t.dataset.view === "board"),
  );
  jobSearchFormSection.style.display = "block";
  boardSection.style.display = "block";
  analyticsSection.style.display = "none";
};

const showAnalyticsView = (currentState) => {
  viewTabs.forEach((t) =>
    t.classList.toggle("active", t.dataset.view === "analytics"),
  );
  jobSearchFormSection.style.display = "none";
  boardSection.style.display = "none";
  analyticsSection.style.display = "block";
  renderAnalytics(currentState);
};

const handleInitialLoad = (isLoggedIn, incomingCurrentState) => {
  if (isLoggedIn) {
    welcomeSection.style.display = "block";
    welcomeMessage.textContent = `Welcome back, ${incomingCurrentState.auth.user}!`;
    logoutButton.style.display = "inline-block";
    viewNav.style.display = "flex";
    jobSearchFormSection.style.display = "block";
    renderBoard(incomingCurrentState);
  } else {
    welcomeSection.style.display = "none";
    loginModal.showModal();
    logoutButton.style.display = "none";
    viewNav.style.display = "none";
    boardSection.style.display = "none";
  }

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = loginForm.elements["username"].value;
    incomingCurrentState.auth.login(username);
    welcomeSection.style.display = "block";
    welcomeMessage.textContent = `Welcome, ${incomingCurrentState.auth.user}!`;
    loginModal.close();
    logoutButton.style.display = "inline-block";
    viewNav.style.display = "flex";
    incomingCurrentState.loadState();
    showBoardView();
    renderBoard(incomingCurrentState);
  });

  logoutButton.addEventListener("click", () => {
    welcomeSection.style.display = "none";
    loginModal.showModal();
    logoutButton.style.display = "none";
    viewNav.style.display = "none";
    analyticsSection.style.display = "none";
    incomingCurrentState.auth.logout();
    incomingCurrentState.clearState();
    renderBoard(incomingCurrentState);
  });

  clearStorageButton.addEventListener("click", () => {
    if (!confirm("This will permanently delete all your job data. Continue?")) return;
    incomingCurrentState.clearLocalStorage();
    renderBoard(incomingCurrentState);
  });

  addEventListenersToAddJobFormBtns(incomingCurrentState);
  addEventListenersToViewTabs(incomingCurrentState);
  addEventListenerToSearch(incomingCurrentState);
};

const renderBoard = (currentState) => {
  boardBodySection.innerHTML = "";

  if (!currentState.auth.isLoggedIn) {
    boardSection.style.display = "none";
    return;
  }

  const jobs = currentState.useFilteredJobs
    ? currentState.filteredJobs
    : currentState.getJobs();

  jobs.forEach((job) =>
    boardBodySection.appendChild(createJobRow(job, currentState)),
  );

  const allStatuses = [
    "wishlist",
    "applied",
    "interviewing",
    "offer",
    "rejected",
  ];
  const occupiedStatuses = new Set(jobs.map((j) => j.status));
  const emptyStatuses = allStatuses.filter((s) => !occupiedStatuses.has(s));
  if (emptyStatuses.length > 0) {
    boardBodySection.appendChild(
      createEmptyStateRow(emptyStatuses, allStatuses, currentState),
    );
  }

  boardSection.style.display = "block";
};

const createJobRow = (job, currentState) => {
  const { status, company, id } = job;
  const tableRow = document.createElement("tr");

  for (let i = 1; i <= 5; i++) {
    const cell = document.createElement("td");
    cell.className = i === COLUMN_STATUS_MAP[status] ? "card" : "";
    cell.setAttribute("draggable", "true");
    let statusToUpdate = null;

    cell.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", id);
    });
    cell.addEventListener("dragover", (e) => {
      e.preventDefault();
      const toColumn = e.currentTarget.getAttribute("data-column");
      statusToUpdate = Object.keys(COLUMN_STATUS_MAP).find(
        (key) => COLUMN_STATUS_MAP[key] === parseInt(toColumn),
      );
    });
    cell.addEventListener("drop", (e) => {
      if (!statusToUpdate) return;
      const jobId = e.dataTransfer.getData("text/plain");
      currentState.updateJob(jobId, { status: statusToUpdate });
      renderBoard(currentState);
    });

    if (i === COLUMN_STATUS_MAP[status]) {
      cell.textContent = company;
      cell.addEventListener("click", () => {
        jobDetailsModal.showModal();
        const { role, company, status, salary, notes } = jobEditForm.elements;
        role.value = job.position;
        company.value = job.company;
        status.value = job.status;
        salary.value = job.salary;
        notes.value = job.notes;
        addEventsToJobEditButtons(id, currentState);
      });
    } else {
      cell.setAttribute("data-column", i);
    }

    tableRow.appendChild(cell);
  }

  return tableRow;
};

const createEmptyStateRow = (emptyStatuses, allStatuses, currentState) => {
  const row = document.createElement("tr");

  allStatuses.forEach((status) => {
    const cell = document.createElement("td");
    cell.setAttribute("data-column", COLUMN_STATUS_MAP[status]);

    if (emptyStatuses.includes(status)) {
      const msg = document.createElement("p");
      msg.className = "empty-state";
      msg.textContent = "No jobs in this column yet!";
      cell.appendChild(msg);
    }

    cell.addEventListener("dragover", (e) => e.preventDefault());
    cell.addEventListener("drop", (e) => {
      const jobId = e.dataTransfer.getData("text/plain");
      currentState.updateJob(jobId, { status });
      renderBoard(currentState);
    });

    row.appendChild(cell);
  });

  return row;
};

const addEventListenersToAddJobFormBtns = (currentState) => {
  Array.from(addJobFormBtns).forEach((btn) => {
    btn.addEventListener("click", () => {
      const column = btn.dataset.column;
      jobForm.showModal();
      addEventListenerToCreateJobBtn(currentState, column);
    });
  });
};

const addEventListenerToCreateJobBtn = (currentState, column) => {
  const oldBtn = document.getElementById("create-job-button");
  const newBtn = oldBtn.cloneNode(true);
  oldBtn.replaceWith(newBtn);
  newBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const currentJobForm = document.getElementById("create-job-form");
    const position = currentJobForm.elements["position"].value;
    const company = currentJobForm.elements["company"].value;
    const notes = currentJobForm.elements["notes"].value;
    const salary = currentJobForm.elements["salary"].value;

    currentState.addJob(position, company, column, notes, salary);
    renderBoard(currentState);
    currentJobForm.reset();
    jobForm.close();
  });
};

const addEventListenerToSearch = (currentState) => {
  jobSearchForm.addEventListener("submit", (e) => e.preventDefault());
  jobSearchInput.addEventListener("search", (e) => {
    const searchFilter = e.target.value;
    currentState.setFilteredJobs(search(searchFilter, currentState), !!searchFilter);
    renderBoard(currentState);
  });
};

const search = (searchTerm, currentState) => {
  const term = searchTerm.toLowerCase();
  return currentState.getJobs().filter(
    (job) =>
      job.company.toLowerCase().includes(term) ||
      job.position.toLowerCase().includes(term),
  );
};

const addEventsToJobEditButtons = (jobToUpdateId, currentState) => {
  if (jobEditAbortController) jobEditAbortController.abort();
  jobEditAbortController = new AbortController();
  const { signal } = jobEditAbortController;

  const cancelButton = document.getElementById("job-cancel-button");
  const saveButton = document.getElementById("job-save-button");
  const removeButton = document.getElementById("job-remove-button");

  removeButton.addEventListener(
    "click",
    () => {
      if (!confirm("Are you sure you want to delete this job?")) return;
      currentState.removeJob(jobToUpdateId);
      jobDetailsModal.close();
      renderBoard(currentState);
    },
    { signal },
  );

  cancelButton.addEventListener(
    "click",
    () => {
      jobEditForm.reset();
      jobDetailsModal.close();
    },
    { signal },
  );

  saveButton.addEventListener(
    "click",
    () => {
      const { role, company, status, salary, notes } = jobEditForm.elements;
      currentState.updateJob(jobToUpdateId, {
        position: role.value,
        company: company.value,
        status: status.value,
        salary: salary.value,
        notes: notes.value,
      });
      jobDetailsModal.close();
      renderBoard(currentState);
    },
    { signal },
  );
};

const addEventListenersToViewTabs = (currentState) => {
  viewTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      if (tab.dataset.view === "analytics") {
        showAnalyticsView(currentState);
      } else {
        showBoardView();
      }
    });
  });
};

export { handleInitialLoad, renderBoard };
