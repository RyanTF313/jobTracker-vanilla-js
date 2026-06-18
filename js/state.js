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
      const parsed = JSON.parse(savedState);
      this.jobs = parsed.jobs || [];
      this.currentUser = parsed.currentUser || null;
    } else {
      this.saveState();
    }
  };

  clearState = () => {
    this.jobs = [];
    this.currentUser = null;
    this.auth = new Authentication();
  };
}
export default State;
