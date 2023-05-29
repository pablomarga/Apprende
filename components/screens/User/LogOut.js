import React from "react"
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer"
import { auth } from "../../../firebase"


const LogOut = props => {

  const onLogOut = async () => {
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
