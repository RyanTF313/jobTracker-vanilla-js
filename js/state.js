class State {
    constructor() {
        this.jobs = [];
        this.currentUser = null;
    }

    saveState = () => {
        localStorage.setItem("jobTrackerState", JSON.stringify(this))
    }

    loadState = () => {
        const savedState = localStorage.getItem("jobTrackerState")
        return savedState ? JSON.parse(savedState) : new State()
    }

    clearState = () => {
        const savedState = localStorage.getItem("jobTrackerState")
        
        if (savedState) {
            localStorage.removeItem("jobTrackerState")
        }
    }
}
export default State