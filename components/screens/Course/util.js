import { db, FieldPath } from "../../../firebase"

const getStudentCourses = async userId => {
  const userRef = db.collection("users").doc(userId)
  const userDoc = await userRef.get()

  const userData = userDoc.data()
  const courseIds = userData.courseIds

  const coursesRef = await db.collection("courses")
  const coursesQuery = coursesRef.where(FieldPath.documentId(), "in", courseIds)
  const coursesSnapshot = await coursesQuery.get()
  const courses = []

  coursesSnapshot.forEach(courseDoc => {
    const courseData = courseDoc.data()
    console.log("\nCourse data de UTil", courseData)
    const course = {
      id: courseDoc.id,
      title: courseData.title,
    }

    courses.push(course)
  })

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
    console.log("\nCourse data de UTil Profesor", courseData)

    const course = {
      id: doc.id,
      title: courseData.title,
    }
    teacherCourses.push(course)
  })

  return teacherCourses
}

const getCourseDetails = async courseId => {}
const createAssignmentForCourse = async (courseId, assignmentDetails) => {
  // Obtener todos los documentos de la colección principal "Students"
  try {
    const studentsSnapshot = await db.collection("students").get()

    studentsSnapshot.forEach(async studentDoc => {
      const studentId = studentDoc.id

      try {
        // Agregar un nuevo Assignment en la subcolección "Assignments" para el estudiante actual
        const assignmentRef = await db
          .collection("students")
          .doc(studentId)
          .collection("assignments")
          .add({
            // Datos del nuevo Assignment
            // Puedes agregar más campos aquí según tus necesidades
            title: "Título del Assignment",
            description: "Descripción del Assignment",
            calification: null,
            // Otros campos...
          })

        console.log(
          `Nuevo Assignment agregado para el estudiante con ID: ${studentId}`
        )
      } catch (error) {
        console.error(
          `Error al agregar el Assignment para el estudiante con ID: ${studentId}`,
          error
        )
      }
    })
  } catch (error) {
    console.error(
      'Error al obtener los documentos de la colección "Students"',
      error
    )
  }
}

// const addCalificationToAssignMent = async assignmentId => {

// }

export { getStudentCourses, getTeacherCourses }
