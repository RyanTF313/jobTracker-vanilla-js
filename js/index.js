// console.log("Hey we are up and running!");
import State from "./state.js";
import { handleInitialLoad } from "./ui.js";
const currentState = new State();
currentState.loadState();
const auth = currentState.auth;
let isLoggedIn = false;

isLoggedIn = auth.isLoggedInUser();
// console.log({ currentState, isLoggedIn });
handleInitialLoad(isLoggedIn, currentState);

// Should I create an App class?

// currentState.clearState(); // remove from local storage for now because we initialize it on load anyway but will remove this in the future.
