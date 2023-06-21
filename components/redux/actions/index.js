import { db, auth } from "../../../firebase"
import { USER_STATE_CHANGE, RESET_STATE } from "../constants"

let unsubscribe = []

export function resetData() {
  return dispatch => {
    for (let i = unsubscribe; i < unsubscribe.length; i++) {
      unsubscribe[i]()
    }
    dispatch({ type: RESET_STATE })
  }
}

const reload = () => {
  return dispatch => {
    dispatch(clearData())
    dispatch(fetchUser())
  }
}

const fetchUser = () => {
  const userUid = auth.currentUser.uid
  return dispatch => {
    let listener = db
      .collection("users")
      .doc(userUid)
      .onSnapshot((snapshot, error) => {
        if (snapshot.exists) {
          dispatch({
            type: USER_STATE_CHANGE,
            currentUser: {
              uid: userUid,
              ...snapshot.data(),
            },
          })
        }
      })
    unsubscribe.push(listener)
  }
}
const saveTabTitle = title => {
  return {
    type: UPDATE_TITLE,
    payload: title,
  }
}
const reset = () => {
  return {
    type: RESET_STATE,
  }
}

export { fetchUser, saveTabTitle, reset }
