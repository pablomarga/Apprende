import React, { useEffect } from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { fetchUser } from "./redux/actions/index"
import { saveTabTitle } from "./redux/actions/tabTitle"
import Ionicons from "@expo/vector-icons/Ionicons"
import Loader from "./Loader"
import { CalendarScreen, AddCourse } from "./screens"
import CourseNavigation from "./screens/Course/CourseNavigation"
import { useRoute } from "@react-navigation/native"

const Main = ({ fetchUser, saveTabTitle, currentUser, navigation }) => {
  useEffect(() => {
    fetchUser()
  }, [])
  const Tab = createBottomTabNavigator()
  const route = useRoute()

  const handleTabPress = title => {
    const titleRedux = { name: title, route: route.name }
    saveTabTitle(titleRedux)
  }
  return currentUser != null ? (
    <Tab.Navigator
      initialRouteName="CourseNavigation"
      labeled={false}
      screenOptions={{ headerShown: false, unmountOnBlur: true }}
      activeColor="#f0edf6"
      inactiveColor="#3e2465"
    >
      <Tab.Screen
        name="Course"
        listeners={{
          tabPress: () => {
            handleTabPress("Cursos")
          },
        }}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ color, size = 26 }) => (
            <Ionicons name="school" color={color} size={size} />
          ),
        }}
      >
        {() => (
          <CourseNavigation
            navigation={navigation}
            currentUser={currentUser}
            saveTabTitle={saveTabTitle}
          />
        )}
      </Tab.Screen>
      {currentUser.isAdmin && (
        <Tab.Screen
          name="AddCourse"
          listeners={{
            tabPress: () => {
              handleTabPress("Añadir curso")
            },
          }}
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({ color, size = 26 }) => (
              <Ionicons name="add-circle" color={color} size={size} />
            ),
          }}
        >
          {() => <AddCourse currentUser={currentUser} />}
        </Tab.Screen>
      )}
      <Tab.Screen
        name="Calendar"
        listeners={{
          tabPress: () => {
            handleTabPress("Calendario")
          },
        }}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ color, size = 26 }) => (
            <Ionicons name="calendar" color={color} size={size} />
          ),
        }}
      >
        {() => <CalendarScreen currentUser={currentUser} />}
      </Tab.Screen>
    </Tab.Navigator>
  ) : (
    <Loader loading={currentUser != null} />
  )
}

const mapStateToProps = store => ({
  currentUser: store.userState.currentUser,
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ fetchUser, saveTabTitle }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)
