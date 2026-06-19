import State from "./state.js";
import { handleInitialLoad } from "./ui.js";

const currentState = new State();
currentState.loadState();

const isLoggedIn = currentState.auth.isLoggedInUser();
handleInitialLoad(isLoggedIn, currentState);
