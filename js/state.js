import { Authentication } from "./utils.js";

class State {
  constructor() {
    this.jobs = [];
    this.currentUser = null;
    this.auth = new Authentication();
  }

  saveState = () => {
    localStorage.setItem("jobTrackerState", JSON.stringify(this));
  };

  loadState = () => {
    const savedState = localStorage.getItem("jobTrackerState");
   
    if (savedState) {
      return localStorage.getItem("jobTrackerState");
    } else {
      localStorage.setItem("jobTrackerState", JSON.stringify(new State()));
      return localStorage.getItem("jobTrackerState");
    }
  };

  clearState = () => {
    const savedState = localStorage.getItem("jobTrackerState");

    if (savedState) {
      localStorage.removeItem("jobTrackerState");
    }
  };
}
export default State;
