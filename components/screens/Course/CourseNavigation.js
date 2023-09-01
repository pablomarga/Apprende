import React from "react"
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import {
  CourseMaterial,
  AssignmentList,
  CoursesList,
  AddAssignment,
  AddStudent,
  StudentList,
  AssignmentDetails,
} from "../index"
import { useRoute } from "@react-navigation/native"

const Stack = createStackNavigator()
const Tab = createMaterialTopTabNavigator()

const CourseDetailsNavigation = ({ currentUser, saveTabTitle, navigation }) => {
  const route = useRoute()

  const { id: courseId, title: courseName } = route.params
  return (
    <Tab.Navigator initialRouteName="CourseMaterial">
      <Tab.Screen
        name="CourseMaterial"
        options={{
          title: "Recursos",
        }}
      >
        {() => (
          <CourseMaterial
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
            courseId={courseId}
            navigation={navigation}
            currentUser={currentUser}
            saveTabTitle={saveTabTitle}
          />
        )}
      </Tab.Screen>
      {(currentUser.isTeacher || currentUser.isAdmin) && (
        <Tab.Screen
          name="AddAssignment"
          options={{
            title: "Añadir entrega",
          }}
        >
          {() => <AddAssignment courseId={courseId} />}
        </Tab.Screen>
      )}
      {(currentUser.isTeacher || currentUser.isAdmin) && (
        <Tab.Screen
          name="AddStudent"
          options={{
            title: "Añadir alumno",
          }}
        >
          {() => <AddStudent courseId={courseId} />}
        </Tab.Screen>
      )}
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
            navigation={navigation}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  )
}

const AssignmentNavigation = ({ courseId, navigation, currentUser }) => {
  return (
    <Stack.Navigator
      initialRouteName="AssignmentList"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="AssignmentList"
        options={{
          title: "Entregas",
        }}
      >
        {() => (
          <AssignmentList
            courseId={courseId}
            navigation={navigation}
            currentUser={currentUser}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="AssignmentDetailsNavigation">
        {() => (
          <AssignmentDetailsNavigation
            courseId={courseId}
            currentUser={currentUser}
            navigation={navigation}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  )
}
const AssignmentDetailsNavigation = ({ courseId, currentUser, navigation }) => {
  const route = useRoute()
  const {
    id: assignmentId,
    title: assignmentName,
    user: assignmentUser,
  } = route.params.params

  return (
    <Stack.Navigator
      initialRouteName="AssignmentDetails"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="AssignmentDetails">
        {() => (
          <AssignmentDetails
            currentUser={currentUser}
            courseId={courseId}
            assignmentId={assignmentId}
            assignmentName={assignmentName}
            assignmentUser={assignmentUser}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="StudentList"
        options={{
          title: "Lista de estudiantes",
        }}
      >
        {() => (
          <StudentList
            currentUser={currentUser}
            courseId={courseId}
            navigation={navigation}
            assignmentId={assignmentId}
            assignmentName={assignmentName}
            assignmentUser={assignmentUser}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  )
}
export default CourseNavigation
