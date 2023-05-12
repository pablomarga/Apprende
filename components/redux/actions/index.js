import { db, auth } from "../../../firebase"
import {
  USER_STATE_CHANGE,
  CLEAR_DATA,
  SEND_VERIFICATION_EMAIL_SUCCESS,
} from "../constants"

let unsubscribe = []

export function clearData() {
  return dispatch => {
    for (let i = unsubscribe; i < unsubscribe.length; i++) {
      unsubscribe[i]()
    }
    dispatch({ type: CLEAR_DATA })
  }
}

export function reload() {
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

const registerUser = async (email, password) => {
  return dispatch => {
    try {
      const userCredential = auth.createUserWithEmailAndPassword(
        email,
        password
      )
      dispatch(sendVerificationEmail(userCredential.user))
    } catch (error) {
      console.log(error)
    }
  }
}

const sendVerificationEmail = user => {
  return async dispatch => {
    try {
      await user.sendEmailVerification()
      dispatch({ type: SEND_VERIFICATION_EMAIL_SUCCESS })
    } catch (error) {
      console.log(error)
    }
  }
}

export { fetchUser, sendVerificationEmail, registerUser }
