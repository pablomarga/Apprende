import { combineReducers } from "redux"
import { user } from "./user"
import navigation from "./navigation"

const Reducers = combineReducers({
  userState: user,
  navigationState: navigation,
})

export default Reducers
