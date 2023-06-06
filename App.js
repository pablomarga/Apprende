import "react-native-gesture-handler"
import React, { useState, useEffect } from "react"
import { Provider, connect } from "react-redux"
import {
  NavigationContainer,
  DrawerActions,
  useNavigation,
} from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { createDrawerNavigator } from "@react-navigation/drawer"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { configureStore } from "@reduxjs/toolkit"
import {
  LoginScreen,
  RegisterScreen,
  ForgotPasswordScreen,
} from "./components/screens/auth"
import MainScreen from "./components/Main"
import {
  ChangePassword,
  CalificationsScreen,
  LogOut,
} from "./components/screens/User"
import { auth } from "./firebase"
import Loader from "./components/Loader"
import rootReducer from "./components/redux/reducers"

const store = configureStore({ reducer: rootReducer })

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()

const App = ({ title }) => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const navigation = useNavigation()

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.toggleDrawer())
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) {
        setLoggedIn(false)
        setLoaded(true)
      } else {
        setLoggedIn(user.emailVerified)
        setLoaded(true)
      }
    })
    return unsubscribe
  }, [])

  if (!loaded) {
    return <Loader loading={loaded} />
  }

  return !loggedIn ? (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }} >
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
      />
    </Stack.Navigator>
  ) : (
    <Drawer.Navigator
      useLegacyImplementation
      drawerContent={props => <LogOut {...props} />}
      initialRouteName="Main"
      screenOptions={{
        headerLeft: () => null,
        headerRight: ({ color, size = 26 }) => (
          <MaterialCommunityIcons
            name="account"
            color={color}
            style={{ marginRight: 20 }}
            size={size}
            onPress={() => openDrawer()}
          />
        ),
        drawerPosition: "right",
      }}
    >
      <Drawer.Screen
        name="Main"
        component={MainScreen}
        options={{
          title: title,
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="Califications"
        component={CalificationsScreen}
        options={{
          headerShown: true,
          headerLeft: ({ color, size = 26 }) => (
            <MaterialCommunityIcons
              name="arrow-left"
              color={color}
              style={{ marginLeft: 15 }}
              size={size}
              onPress={() => navigation.goBack()}
            />
          ),
          title: "Calificaciones",
        }}
      />
      <Drawer.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{
          headerShown: true,
          headerLeft: ({ color, size = 26 }) => (
            <MaterialCommunityIcons
              name="arrow-left"
              color={color}
              style={{ marginLeft: 15 }}
              size={size}
              onPress={() => navigation.goBack()}
            />
          ),
          title: "Cambiar contraseña",
        }}
      />
    </Drawer.Navigator>
  )
}

const mapStateToProps = state => {
  return {
    title: state.navigationState.title,
  }
}
const ConnectedApp = connect(mapStateToProps)(App)

const Root = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <ConnectedApp />
      </NavigationContainer>
    </Provider>
  )
}
export default Root
