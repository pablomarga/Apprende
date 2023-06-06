import React, { useState, useEffect } from "react"
import { View, Text } from "react-native"

const CourseDetails = ({ currentUser, saveTabTitle, courseName, courseId }) => {
  const [events, setEvents] = useState({})

  useEffect(() => {
    saveTabTitle(courseName)
  }, [])

  //   const userRef = db.collection("users").doc(currentUser.uid)
  //   userRef.get().then(doc => {
  //     if (doc.exists) {
  //       const userData = doc.data()
  //       const courseIds = userData.courses || []
  //       const coursesRef = db.collection("courses")
  //       coursesRef
  //         .where("id", "in", courseIds)
  //         .get()
  //         .then(querySnapshot => {
  //           const courseData = querySnapshot.docs.map(doc => doc.data())
  //           setCourses(courseData)
  //         })

  //       const eventsRef = db.collection("events")
  //       eventsRef
  //         .where("courseId", "in", courseIds)
  //         .get()
  //         .then(querySnapshot => {
  //           const eventData = querySnapshot.docs.map(doc => doc.data())
  //           setEvents(eventData)
  //         })
  //     } else {
  //       // user not found
  //     }
  //   })
  // }, [])

  // const markedDates = {}
  // events.forEach(event => {
  //   const course = courses.find(course => course.id === event.courseId)
  //   if (course) {
  //     const markedDate = event.date.toDate().toISOString().substring(0, 10)
  //     if (!markedDates[markedDate]) {
  //       markedDates[markedDate] = {
  //         marked: true,
  //         dotColor: "blue",
  //         events: [],
  //       }
  //     }
  //     markedDates[markedDate].events.push({
  //       courseId: event.courseId,
  //       courseName: course.name,
  //       eventDescription: event.description,
  //     })
  //   }
  // })

 
  return (
    <Text>
      Course ID: {courseId}, Course Name: {courseName}
    </Text>
  )
}

export default CourseDetails
