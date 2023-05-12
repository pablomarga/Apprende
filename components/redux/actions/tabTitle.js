import { UPDATE_TITLE } from "../constants"

export const saveTabTitle = title => {
  return {
    type: UPDATE_TITLE,
    payload: title,
  }
}
