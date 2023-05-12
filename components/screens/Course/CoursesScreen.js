import React from "react"
import { View, Text } from "react-native"
import { auth } from "../../../firebase"

const Courses = () => {
  const onLogOut = async () => {
    await auth.signOut()
    console.log("LOG OUT")
    navigation.navigate("Login")
    console.log("AFTER NAVIGATION")
  }
  return (
    <View>
      <Text>Courses</Text>
      <Text onPress={onLogOut}>Log out</Text>
    </View>
  )
}

export default Courses
