import React, { useEffect } from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { fetchUser } from "./redux/actions/index"
import { saveTabTitle } from "./redux/actions/tabTitle"
import Ionicons from "@expo/vector-icons/Ionicons"
import Loader from "./Loader"
import { CalendarScreen, NotificationScreen, AddCourse } from "./screens"
import CourseNavigation from "./screens/Course/CourseNavigation"

const Main = ({ fetchUser, saveTabTitle, currentUser, navigation }) => {
  useEffect(() => {
    fetchUser()
  }, [])
  const Tab = createBottomTabNavigator()

  const handleTabPress = title => {
    saveTabTitle(title)
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
          <CourseNavigation navigation={navigation} currentUser={currentUser} />
        )}
      </Tab.Screen>
      {(currentUser.isTeacher || currentUser.isAdmin) && (
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
        component={CalendarScreen}
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
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationScreen}
        listeners={{
          tabPress: () => {
            handleTabPress("Notificaciones")
          },
        }}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ color, size = 26 }) => (
            <Ionicons name="notifications" color={color} size={size} />
          ),
        }}
      />
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
