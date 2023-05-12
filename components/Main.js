import React, { useEffect } from "react"
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { fetchUser } from "./redux/actions/index"
import { saveTabTitle } from "./redux/actions/tabTitle"
import { MaterialCommunityIcons } from "react-native-vector-icons/"
import { CoursesScreen, CalendarScreen } from "./screens"

const Main = ({ fetchUser, saveTabTitle }) => {
  useEffect(() => {
    fetchUser()
    console.log('useEffect 1')
  }, [])
  console.log('Primer log Main 1.5')
  const Tab = createMaterialBottomTabNavigator()
  console.log('2')
  const handleTabPress = title => {
    saveTabTitle(title)
    console.log('handleTabPress 3')
  }
  console.log('Antes del return 3.5')
  return (
    <Tab.Navigator
      initialRouteName="Course"
      labeled={false}
      activeColor="#f0edf6"
      inactiveColor="#3e2465"
    >
      <Tab.Screen
        name="Course"
        component={CoursesScreen}
        listeners={{
          tabPress: () => {
            console.log('tabPress 4')
            handleTabPress("Cursos")
          },
        }}
        options={{
          tabBarIcon: ({ color, size = 26 }) => (
            <MaterialCommunityIcons name="school" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        listeners={{
          tabPress: () => {
            console.log('tabPress Calendario 5')
            handleTabPress("Calendario")
          },
        }}
        options={{
          tabBarIcon: ({ color, size = 26 }) => (
            <MaterialCommunityIcons name="calendar" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

const mapStateToProps = store => ({
  currentUser: store.userState.currentUser,
})

const mapDispatchToProps = dispatch => {
  console.log('mapDispatchToProps 6')
  return bindActionCreators({ fetchUser, saveTabTitle }, dispatch)}

export default connect(mapStateToProps, mapDispatchToProps)(Main)
