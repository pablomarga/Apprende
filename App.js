// import "react-native-gesture-handler"
import React, { Component } from "react"
import { Provider } from "react-redux"
import { StyleSheet } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { LoginScreen, RegisterScreen } from "./components/screens/auth"
import MainScreen from "./components/Main"
import { createStore, applyMiddleware } from "redux"
import rootReducer from "./components/redux/reducers"
import { composeWithDevTools } from "redux-devtools-extension"
import thunk from "redux-thunk"
import { auth } from "./firebase"
import Loader from "./components/Loader"

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
)
const Stack = createStackNavigator()
export class App extends Component {
  constructor() {
    super()
    this.state = {
      loggedIn: false,
      loaded: false,
    }
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (!user) {
        this.setState({
          loggedIn: false,
          loaded: true,
        })
      } else {
        user.emailVerified
          ? this.setState({
              loggedIn: true,
              loaded: true,
            })
          : this.setState({
              loggedIn: false,
              loaded: true,
            })
      }
    })
  }
  render() {
    const { loggedIn, loaded } = this.state
    if (!loaded) {
      return <Loader loading={loaded} />
    }
    return !loggedIn ? (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            navigation={this.props.navigation}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            navigation={this.props.navigation}
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    ) : (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen
              name="Cursos"
              component={MainScreen}
              options={{ title: "Cursos" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
})
