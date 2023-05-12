// reducer.js
import { UPDATE_TITLE } from "../constants"

const initialState = {
  title: "Cursos", // Initial tab title is empty
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_TITLE:
      return {
        ...state,
        title: action.payload, // Update the tab title with the payload
      }
    default:
      return state
  }
}

export default reducer
