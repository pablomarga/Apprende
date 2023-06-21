import React from "react"
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer"
import { auth } from "../../../firebase"

const LogOut = ({ reset, ...props }) => {
  const onLogOut = async () => {
    props.navigation.closeDrawer()
    await auth.signOut()
    reset()
  }

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label="Log out" onPress={() => onLogOut()} />
    </DrawerContentScrollView>
  )
}

export default LogOut
