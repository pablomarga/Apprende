import { USER_STATE_CHANGE, RESET_STATE } from "../constants";

const initialState = {
  currentUser: null,
};

export const user = (state = initialState, action) => {
  switch (action.type) {
    case USER_STATE_CHANGE:
      return { ...state, currentUser: action.currentUser };

    case RESET_STATE:
      return initialState;

    default:
      return state;
  }
};
