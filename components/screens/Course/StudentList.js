import React, { useState, useEffect } from "react"
import { FlatList, SafeAreaView, StatusBar, StyleSheet } from "react-native"
import { getStudentList } from "./util"
import Item from "../Item"

const StudentList = ({
  courseId,
  assignmentName,
  assignmentId,
  navigation,
}) => {
  const [selectedId, setSelectedId] = useState()
  const [studentData, setStudentData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const data = await getStudentList(courseId)
      setStudentData(data)
    }

    fetchData()
  }, [])

  const onNavigateAssignmentDetails = itemId => {
    setSelectedId(itemId)
    const selectedStudent = studentData.find(item => item.id === itemId)
    const assignmentAndStudent = {
      id: assignmentId,
      title: assignmentName,
      user: selectedStudent,
    }
    navigation.navigate("AssignmentDetailsNavigation", {
      screen: "AssignmentDetails",
      params: assignmentAndStudent,
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
        data={studentData}
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

export default StudentList
