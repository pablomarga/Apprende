import { ref, getDownloadURL } from "firebase/storage"
import { storage, db } from "../../firebase"
import {
  getAdminCourses,
  getTeacherCourses,
  getStudentCourses,
} from "./Course/util"

let appLogo
const fetchLogo = () => {
  const logoRef = ref(storage, "images/logo.png")
  // Get the download URL
  const logoDownload = getDownloadURL(logoRef)
    .then(url => {
      return url
    })
    .catch(error => {
      switch (error.code) {
        case "storage/object-not-found":
          // File doesn't exist
          break
        case "storage/unauthorized":
          // User doesn't have permission to access the object
          break
        case "storage/canceled":
          // User canceled the upload
          break
        case "storage/unknown":
          // Unknown error occurred, inspect the server response
          break
      }
    })
  return logoDownload
}

fetchLogo().then(val => {
  appLogo = val
})

const fetchAssignmentsForCalendar = async currentUser => {
  // Consulta los cursos del usuario
  const userCourses = currentUser.isTeacher
    ? await getTeacherCourses(currentUser.uid)
    : currentUser.isAdmin
    ? await getAdminCourses()
    : await getStudentCourses(currentUser.uid)

  // Consulta las tareas de los cursos del usuario
  const assignmentsData = await Promise.all(
    userCourses.map(async course => {
      const assignmentsRef = await db
        .collection("courses")
        .doc(course.id)
        .collection("assignments")
        .get()

      const assignmentsInCourse = []

      assignmentsRef.forEach(doc => {
        const assignmentData = doc.data()
        const assignment = {
          id: doc.id,
          title: assignmentData.title,
          description: assignmentData.description,
          date: assignmentData.deadline.split("/").reverse().join("-"),
          course: course.title
        }

        assignmentsInCourse.push(assignment)
      })

      return assignmentsInCourse
    })
  )

  // Concatenamos todos las entregas en una sola lista para que se muestren correctamente
  const allAssignments = assignmentsData.flat()
  return allAssignments
}
export { fetchLogo, fetchAssignmentsForCalendar }
