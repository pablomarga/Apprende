import {
  USER_STATE_CHANGE,
  SEND_VERIFICATION_EMAIL_SUCCESS,
  VERIFY_EMAIL_SUCCESS,
} from "../constants"

const initialState = {
  currentUser: null,
  emailVerified: false,
}

export const user = (state = initialState, action) => {
  switch (action.type) {
    case USER_STATE_CHANGE:
      return { ...state, currentUser: action.currentUser }
    case SEND_VERIFICATION_EMAIL_SUCCESS:
      return {
        ...state,
        emailVerified: false,
      }
    case VERIFY_EMAIL_SUCCESS:
      return {
        ...state,
        emailVerified: true,
      }

    default:
      return state
  }
}
