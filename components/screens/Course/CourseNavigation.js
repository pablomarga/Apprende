import React, { useState, useEffect } from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { CoursesList, AddCourse, CourseDetails } from "../index"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"


const Stack = createStackNavigator()

const CourseNavigation = ({ currentUser, navigation }) => {
  console.log(navigation)
  return (
    <Stack.Navigator
      initialRouteName="CoursesList"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="CoursesList">
        {() => (
          <CoursesList navigation={navigation} currentUser={currentUser} />
        )}
      </Stack.Screen>
      <Stack.Screen name="AddCourse" component={AddCourse} />
      <Stack.Screen
        name="CourseDetails"
        component={CourseDetails}
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
        }}
      />
    </Stack.Navigator>
  )
}

export default CourseNavigation
