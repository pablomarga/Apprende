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

const Item = ({ item, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.item, { backgroundColor }]}
  >
    <Text style={[styles.title, { color: textColor }]}>{item.title}</Text>
  </TouchableOpacity>
)

const CoursesList = ({ navigation, currentUser }) => {
  const [selectedId, setSelectedId] = useState()
  const [courseData, setCourseData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const data = currentUser.isTeacher
        ? await getTeacherCourses(currentUser.uid)
        : await getStudentCourses(currentUser.uid)
      setCourseData(data)
    }

    fetchData()
  }, [currentUser])

  const onNavigateCourseDetails = itemId => {
    setSelectedId(itemId)
    const selectedCourse = courseData.find(item => item.id === itemId)
    navigation.navigate("CourseDetailsNavigation", selectedCourse)
  }
  const renderItem = ({ item }) => {
    const backgroundColor = "#929494"
    const color = "black"

    return (
      <Item
        item={item}
        onPress={() => onNavigateCourseDetails(item.id)}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={courseData}
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
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
})

export default CoursesList
