import React from "react"
import { View, Text } from "react-native"
import { auth } from "../../firebase"

const Courses = () => {
  const onLogOut = () => {
    auth.signOut()
  }
  return (
    <View>
      <Text>Courses</Text>
      <Text onPress={onLogOut}>Log out</Text>
    </View>
  )
}

export default Courses
