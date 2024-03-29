import React, { useState, useEffect } from "react"
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
} from "react-native"
import { getStudentCourses, getTeacherCourses, getAdminCourses } from "./util"
import { useRoute } from "@react-navigation/native"
import Loader from "../../Loader"
import Item from "../Item"

const CoursesList = ({ navigation, currentUser, saveTabTitle }) => {
  const [selectedId, setSelectedId] = useState()
  const [courseData, setCourseData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const route = useRoute()
  const backgroundColor = "#929494"
  const color = "black"

  useEffect(() => {
    const fetchData = async () => {
      const data = currentUser.isTeacher
        ? await getTeacherCourses(currentUser.uid)
        : currentUser.isAdmin
        ? await getAdminCourses()
        : await getStudentCourses(currentUser.uid)
      setCourseData(data)
      setIsLoading(false)
    }

    const title = { name: "Cursos", route: route.name }
    saveTabTitle(title)
    fetchData()
  }, [])
  
  const onNavigateCourseDetails = itemId => {
    setSelectedId(itemId)
    const selectedCourse = courseData.find(item => item.id === itemId)
    navigation.navigate("CourseDetailsNavigation", selectedCourse)
  }

  const renderItem = ({ item }) => {
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
      {isLoading ? (
        <Loader loading={isLoading} />
      ) : courseData.length === 0 ? (
        <Text style={styles.message}>
          Aún no estás inscrito en ningún curso
        </Text>
      ) : (
        <FlatList
          data={courseData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          extraData={selectedId}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  message: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
})

export default CoursesList
