import React from "react"
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { CourseDetails, AssignmentList, CoursesList } from "../index"
import { useRoute } from "@react-navigation/native"

const Stack = createStackNavigator()
const Tab = createMaterialTopTabNavigator()

const CourseDetailsNavigation = ({ currentUser, saveTabTitle }) => {
  const route = useRoute()

  const { id: courseId, title: courseName } = route.params
  return (
    <Tab.Navigator initialRouteName="CourseDetails">
      <Tab.Screen
        name="CourseDetails"
        options={{
          title: "Recursos",
        }}
      >
        {() => (
          <CourseDetails
            currentUser={currentUser}
            saveTabTitle={saveTabTitle}
            courseName={courseName}
            courseId={courseId}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="AssignmentNavigation"
        options={{
          title: "Entregas",
        }}
      >
        {() => (
          <AssignmentNavigation
          currentUser={currentUser}
          saveTabTitle={saveTabTitle}
          />
        )}
      </Tab.Screen>
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
            currentUser={currentUser}
            saveTabTitle={saveTabTitle}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  )
}

const AssignmentNavigation = ({ currentUser, saveTabTitle }) => {
  return (
    <Stack.Navigator
      initialRouteName="AssignmentList"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="AssignmentList"
        component={AssignmentList}
        options={{
          title: "Material",
        }}
      />
      <Stack.Screen name="AssignmentDetails">
        {() => (
          <AssignmentDetails
            currentUser={currentUser}
            saveTabTitle={saveTabTitle}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  )
}

export default CourseNavigation
