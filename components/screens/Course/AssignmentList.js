import React, { useState, useEffect } from "react"
import { FlatList, SafeAreaView, StatusBar, StyleSheet } from "react-native"
import { getAssignments } from "./util"
import Item from "../Item"

const AssignmentList = ({ navigation, courseId, currentUser }) => {
  const [selectedId, setSelectedId] = useState()
  const [assignmentData, setAssignmentData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAssignments(courseId)
      setAssignmentData(data)
    }

    fetchData()
  }, [])

  const onNavigateAssignmentDetails = itemId => {
    setSelectedId(itemId)
    const selectedAssignment = assignmentData.find(item => item.id === itemId)
    const userWithId = {
      ...currentUser,
      id: currentUser.uid, // Agregar la nueva clave 'id' con el valor de 'uid'
    }

    // Eliminar la clave 'uid' del objeto si es necesario
    delete userWithId.uid
    const assingmentAndUser = {
      ...selectedAssignment,
      user: userWithId,
    }
    currentUser.isTeacher || currentUser.isAdmin
      ? navigation.navigate("AssignmentDetailsNavigation", {
          screen: "StudentList",
          params: assingmentAndUser,
        })
      : navigation.navigate("AssignmentDetailsNavigation", {
          params: assingmentAndUser,
        })
  }

  const renderItem = ({ item }) => {
    const backgroundColor = "#929494"
    const color = "black"

    return (
      <Item
        item={item}
        onPress={() => onNavigateAssignmentDetails(item.id)}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    )
  }
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={assignmentData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        extraData={selectedId}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
})

export default AssignmentList
