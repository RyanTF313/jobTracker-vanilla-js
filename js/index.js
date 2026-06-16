console.log("Hey we are up and running!")
import State from "./state.js"
const currentState = new State()
console.log(currentState.loadState())
console.log("jobs: :", currentState.jobs)
currentState.clearState(); // remove from local storage for now because we initialize it on load anyway but will remove this in the future.