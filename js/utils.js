class Authentication {
  constructor() {
    this.isloggedIn = false;
    this.user = null;
  }

  isLoggedInUser = () => {
    const hasUserLoggedIn = sessionStorage.getItem("isLoggedIn") === "true" && sessionStorage.getItem("currentUser") !== null;
    
    if (hasUserLoggedIn) {
        this.isloggedIn = true;
        this.user = sessionStorage.getItem("currentUser");
    }

    return hasUserLoggedIn;
  }

  login = (username) => {
    sessionStorage.setItem("currentUser", username);
    sessionStorage.setItem("isLoggedIn", "true");
    this.isloggedIn = true;
    this.user = username;
    console.log(`Logging in user: ${username}`);
  };

  logout = () => {
    const currentUser = sessionStorage.getItem("currentUser");
    if (currentUser) {
      console.log(`Logging out user: ${currentUser}`);
    } else {
      return;
    }
    sessionStorage.removeItem("currentUser");
    sessionStorage.setItem("isLoggedIn", "false");
    this.isloggedIn = false;
    this.user = null;
  };
}

export { Authentication };
