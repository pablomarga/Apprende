import React from "react"
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { CourseDetails, AssignmentScreen, CoursesList } from "../index"
import { connect } from "react-redux"
import { useRoute } from "@react-navigation/native"
import { bindActionCreators } from "redux"
import { saveTabTitle } from "../../redux/actions/tabTitle"

const Stack = createStackNavigator()
const Tab = createMaterialTopTabNavigator()

const CourseDetailsNavigation = ({ currentUser, navigation, saveTabTitle }) => {
  const route = useRoute()

  const { id: courseId, title: courseName } = route.params

  return (
    <Tab.Navigator initialRouteName="CourseDetails">
      <Tab.Screen name="CourseDetails">
        {() => (
          <CourseDetails
            currentUser={currentUser}
            saveTabTitle={saveTabTitle}
            courseName={courseName}
            courseId={courseId}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Assignments" component={AssignmentScreen} />
    </Tab.Navigator>
  )
}
const CourseNavigation = ({ currentUser, navigation, saveTabTitle }) => {
  return (
    <Stack.Navigator
      initialRouteName="CoursesList"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="CoursesList">
        {() => (
          <CoursesList
            navigation={navigation}
            currentUser={currentUser}
            saveTabTitle={saveTabTitle}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="CourseDetailsNavigation">
        {() => (
          <CourseDetailsNavigation
            navigation={navigation}
            currentUser={currentUser}
            saveTabTitle={saveTabTitle}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  )
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ saveTabTitle }, dispatch)
}
export default connect(null, mapDispatchToProps)(CourseNavigation)
