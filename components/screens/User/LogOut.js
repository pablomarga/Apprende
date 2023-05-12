import React from "react"
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer"
import { auth } from "../../../firebase"
import { useNavigation } from "@react-navigation/native"


const LogOut = props => {
  const navigation = useNavigation()

  const onLogOut = async () => {
    await auth.signOut()
    console.log('LOG OUT')
    navigation.navigate("Login")
    console.log('AFTER NAVIGATION')
  }

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label="Log out" onPress={() => onLogOut()} />
    </DrawerContentScrollView>
  )
}

export default LogOut
