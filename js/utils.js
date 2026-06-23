class Authentication {
  constructor() {
    this.isLoggedIn = false;
    this.user = null;
  }

  isLoggedInUser = () => {
    const hasUserLoggedIn =
      sessionStorage.getItem("isLoggedIn") === "true" &&
      sessionStorage.getItem("currentUser") !== null;

    if (hasUserLoggedIn) {
      this.isLoggedIn = true;
      this.user = sessionStorage.getItem("currentUser");
    }

    return hasUserLoggedIn;
  };

  login = (username) => {
    sessionStorage.setItem("currentUser", username);
    sessionStorage.setItem("isLoggedIn", "true");
    this.isLoggedIn = true;
    this.user = username;
  };

  logout = () => {
    sessionStorage.removeItem("currentUser");
    sessionStorage.setItem("isLoggedIn", "false");
    this.isLoggedIn = false;
    this.user = null;
  };
}

class Job {
  constructor(position, company, status, notes, salary, owner) {
    this.position = position;
    this.company = company;
    this.status = status;
    this.notes = notes;
    this.salary = salary;
    this.id = crypto.randomUUID();
    this.owner = owner;
  }

  updateJob = (updates) => {
    Object.assign(this, updates);
  };
}

export { Authentication, Job };
