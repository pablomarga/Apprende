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
    const course = {
      id: doc.id,
      title: courseData.title,
    }
    teacherCourses.push(course)
  })

  return teacherCourses
}

export { getStudentCourses, getTeacherCourses }
