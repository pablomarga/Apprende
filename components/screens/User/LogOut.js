import React from "react"
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer"
import { DrawerActions, useNavigation } from "@react-navigation/native"
import { auth } from "../../../firebase"

const LogOut = props => {
  const navigation = useNavigation()

  const onLogOut = async () => {
    navigation.dispatch(DrawerActions.toggleDrawer())
    await auth.signOut()
  }

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label="Log out" onPress={() => onLogOut()} />
    </DrawerContentScrollView>
  )
}

export default LogOut
