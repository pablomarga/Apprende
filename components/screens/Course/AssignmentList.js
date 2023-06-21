import React, { useState, useEffect } from "react"
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native"
import { getStudentCourses, getTeacherCourses } from "./util"
import { useRoute } from "@react-navigation/native"

const Item = ({ item, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.item, { backgroundColor }]}
  >
    <Text style={[styles.title, { color: textColor }]}>{item.title}</Text>
  </TouchableOpacity>
)

const AssignmentList = ({ currentUser, saveTabTitle }) => {
  // const [selectedId, setSelectedId] = useState()
  // const [assignmentData, setCourseData] = useState([])
  // const route = useRoute()

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const data = currentUser.isTeacher
  //       ? await getTeacherCourses(currentUser.uid)
  //       : await getStudentCourses(currentUser.uid)
  //     setCourseData(data)
  //   }

  //   const title = { name: "Cursos", route: route.name }
  //   saveTabTitle(title)
  //   fetchData()
  // }, [])

  // const onNavigateAssignmentDetails = itemId => {
  //   setSelectedId(itemId)
  //   const selectedAssignment = assignmentData.find(item => item.id === itemId)

  //   navigation.navigate("AssignmentDetails", selectedAssignment)
  // }
  // const renderItem = ({ item }) => {

  //   const backgroundColor = "#929494"
  //   const color = "black"

  //   return (
  //     <Item
  //       item={item}
  //       onPress={() => onNavigateAssignmentDetails(item.id)}
  //       backgroundColor={backgroundColor}
  //       textColor={color}
  //     />
  //   )
  // }
  return (
    <SafeAreaView style={styles.container}>
      {/* <FlatList
        data={assignmentData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        extraData={selectedId}
      /> */}
      <Text>aa</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
})

export default AssignmentList
