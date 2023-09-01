import { db, FieldPath, storage } from "../../../firebase"
import { Platform } from "react-native"
import * as DocumentPicker from "expo-document-picker"
import { ref, uploadBytes } from "firebase/storage"

const getStudentCourses = async userId => {
  const userRef = db.collection("users").doc(userId)
  const userDoc = await userRef.get()

  const userData = userDoc.data()
  const courseIds = userData.courseIds
  const courses = []

  const coursesRef = await db.collection("courses")
  if (courseIds) {
    const coursesQuery = coursesRef.where(
      FieldPath.documentId(),
      "in",
      courseIds
    )
    const coursesSnapshot = await coursesQuery.get()

    coursesSnapshot.forEach(courseDoc => {
      const courseData = courseDoc.data()
      const course = {
        id: courseDoc.id,
        title: courseData.title,
      }

      courses.push(course)
    })
  }

  return courses
}

const getTeacherCourses = async userId => {
  const teacherCoursesRef = await db
    .collection("courses")
    .where("teacherId", "==", userId)
    .get()

  const teacherCourses = []
  teacherCoursesRef.forEach(doc => {
    const courseData = doc.data()

    const course = {
      id: doc.id,
      title: courseData.title,
    }
    teacherCourses.push(course)
  })

  return teacherCourses
}
const getAssignments = async courseId => {
  const assignmentRef = await db
    .collection("courses")
    .doc(courseId)
    .collection("assignments")
    .get()
  const assignments = []
  assignmentRef.forEach(doc => {
    const assingmentData = doc.data()

    const assignment = {
      id: doc.id,
      title: assingmentData.title,
      deadline: assingmentData.deadline,
    }
    assignments.push(assignment)
  })
  return assignments
}

const getAdminCourses = async () => {
  const adminCoursesRef = await db.collection("courses").get()

  const adminCourses = []
  adminCoursesRef.forEach(doc => {
    const courseData = doc.data()

    const course = {
      id: doc.id,
      title: courseData.title,
    }
    adminCourses.push(course)
  })

  return adminCourses
}

const uploadFile = async (fileRef, fileUpload, fileType = null) => {
  if (Platform.OS === "web") {
    await uploadBytes(fileRef, fileUpload)
  } else {
    await uploadBytes(fileRef, fileUpload, { contentType: fileType })
  }
}

const docPicker = async () => {
  let fileObject = {}
  try {
    const res = await DocumentPicker.getDocumentAsync({})

    if (Platform.OS === "web") {
      fileObject["fileToUpload"] = res.file
    } else {
      const { uri, type } = res
      const response = await fetch(uri)
      const blob = await response.blob()
      fileObject.typeFile = type
      fileObject["fileToUpload"] = blob
      // fileObject.fileToUpload = blob
    }
    fileObject.fileName = res.name
  } catch (err) {
    throw err
  }
  return fileObject
}

const getFileName = async downloadUrl => {
  // Extraer el nombre del archivo de la URL
  const decodedUrl = decodeURIComponent(downloadUrl)
  const fileNameWithQuery = decodedUrl.split("/").pop()

  // Eliminamos los parámetros de consulta para así el nombre del archivo
  const fileName = fileNameWithQuery.split("?")[0]

  return fileName
}
const getStudentList = async courseId => {
  const studentRef = await db
    .collection("courses")
    .doc(courseId)
    .collection("students")
    .get()
  const students = []
  studentRef.forEach(doc => {
    const studentData = doc.data()
    const student = {
      id: doc.id,
      name: studentData.studentName,
    }
    students.push(student)
  })
  return students
}

const getAssignmentDetails = async (assignmentId, courseId) => {
  try {
    const assignmentRef = await db
      .collection("courses")
      .doc(courseId)
      .collection("assignments")
      .doc(assignmentId)
      .get()
    if (assignmentRef) {
      const assignmentData = assignmentRef.data()
      return assignmentData
    } else {
      // El documento no existe
      return null
    }
  } catch (error) {
    // Manejo de errores
    console.error("Error fetching assignment:", error)
    return null
  }
}

const getGrade = async (courseId, assignmentUser, assignmentId) => {
  const assignmentRef = db
    .collection("courses")
    .doc(courseId)
    .collection("students")
    .doc(assignmentUser.id)
    .collection("assignments")
    .doc(assignmentId)

  const assignmentDoc = await assignmentRef.get()

  if (assignmentDoc.exists) {
    const existingGrades = assignmentDoc.data().grade
    if (existingGrades) {
      const gradeDescription = {
        grade: assignmentDoc.data().grade,
        observations: assignmentDoc.data().observations,
      }
      return gradeDescription
    } else {
      return null
    }
  } else {
    console.log("El documento no existe.")
    return null
  }
}

const checkFileUploaded = async (courseId, assignmentUser, assignmentId) => {
  const assignmentRef = db
    .collection("courses")
    .doc(courseId)
    .collection("students")
    .doc(assignmentUser.id)
    .collection("assignments")
    .doc(assignmentId)

  const assignmentDoc = await assignmentRef.get()

  if (assignmentDoc.exists) {
    const existingTaskDownloadUrl = assignmentDoc.data().taskDownloadUrl
    if (existingTaskDownloadUrl) {
      const fileUrl = assignmentDoc.data().taskDownloadUrl
      const fileName = await getFileName(fileUrl)
      const studentFile = { name: fileName, downloadUrl: fileUrl }
      return studentFile
    } else {
      return null
    }
  } else {
    console.log("El documento no existe.")
    return null
  }
}

export {
  getStudentCourses,
  getTeacherCourses,
  getAdminCourses,
  getAssignments,
  docPicker,
  uploadFile,
  getFileName,
  getStudentList,
  getAssignmentDetails,
  getGrade,
  checkFileUploaded,
}
