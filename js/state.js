import { Authentication, Job } from "./utils.js";

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
      this.jobs = (parsed.jobs || []).map(job => Object.assign(new Job(), job) );
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

  updateJob = (jobId, updates) => {
    const jobIndex = this.jobs.findIndex((job) => job.id === jobId);
    if (jobIndex >= 0) {
        const job = this.jobs[jobIndex];
        job.updateJob(updates);
        this.saveState();
    }
  }
}
export default State;
