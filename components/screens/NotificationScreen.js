import React from "react"
import { View, Text } from "react-native"
import { auth } from "../../firebase"

const Notifications = () => {
  const onLogOut = () => {
    auth.signOut()
  }
  return (
    <View>
      <Text>Notifications</Text>
      <Text onPress={onLogOut}>Log out</Text>
    </View>
  )
}

export default Notifications