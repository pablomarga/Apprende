import React, { useState, useEffect } from "react"
import {
  View,
  TextInput,
  Pressable,
  Text,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { db, FieldValue } from "../../../firebase"
import { SafeAreaView } from "react-native-safe-area-context"
import CustomModal from "../CustomModal"

const AddCourse = ({ currentUser }) => {
  const [courseTitle, setCourseTitle] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [courseDate, setCourseDate] = useState("")
  const [teacherMail, setTeacherMail] = useState("")
  const [userIsTeacher, setUserTeacher] = useState(false)
  const [studentsMail, setStudentsMail] = useState("")
  const [formIsReady, setFormIsReady] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [courseCreated, setCourseCreated] = useState(false)

  const dateOptions = {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  }

  useEffect(() => {
    currentUser.isTeacher ? setTeacherMail(currentUser.email) : null
    if (courseTitle && teacherMail && studentsMail && courseDate) {
      setFormIsReady(true)
    } else {
      setFormIsReady(false)
    }
    setUserTeacher(currentUser.isTeacher)
  }, [courseTitle, teacherMail, studentsMail, courseDate, userIsTeacher])
  const addCourse = async () => {
    if (formIsReady) {
      try {
        const professorId = await getProfessorId(teacherMail)

        if (!professorId) {
          console.error("El usuario actual no es un profesor válido")
          return
        }

        const courseId = await createCourse(professorId)
        await addStudentsToCourse(courseId)
        setCourseCreated(true)

        resetForm()
      } catch (error) {
        setErrorMessage("Error al agregar el curso")
      }
    } else {
      setErrorMessage("Rellena todos los campos")
    }
  }

  const getProfessorId = async teacherMail => {
    const profesorRef = await db
      .collection("users")
      .where("email", "==", teacherMail)
      .where("isTeacher", "==", true)
      .limit(1)
      .get()

    if (profesorRef.empty) {
      return null
    }
    return profesorRef.docs[0].id
  }

  const createCourse = async professorId => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" }
    const formattedDate = selectedDate.toLocaleDateString("es-ES", options)

    const cursoRef = await db.collection("courses").add({
      title: courseTitle,
      initDate: formattedDate,
      teacherId: professorId,
    })

    const courseId = cursoRef.id

    // Crear la subcolección "forum" en el curso recién creado
    await db.collection("courses").doc(courseId).collection("forum").add({})

    return courseId
  }

  const addStudentsToCourse = async courseId => {
    const studentsEmailArray = studentsMail
      .split(",")
      .map(email => email.trim())

    for (const studentEmail of studentsEmailArray) {
      const studentRef = await db
        .collection("users")
        .where("email", "==", studentEmail)
        .limit(1)
        .get()

      if (studentRef.empty) {
        Alert.alert(`El estudiante con email ${studentEmail} no existe`)
        continue
      }
      const studentId = studentRef.docs[0].id
      await db
        .collection("users")
        .doc(studentId)
        .update({
          courseIds: FieldValue.arrayUnion(courseId),
        })
      const studentData = studentRef.docs[0].data()
      await db
        .collection("courses")
        .doc(courseId)
        .collection("students")
        .doc(studentId)
        .set({
          studentId: studentId,
          studentName: studentData.name,
        })

      await db
        .collection("courses")
        .doc(courseId)
        .collection("students")
        .doc(studentId)
        .collection("assignments")
        .add({})
    }
  }

  const resetForm = () => {
    setCourseTitle("")
    setCourseDate("")
    setTeacherMail("")
    setStudentsMail("")
    setErrorMessage("")
  }

  const toggleDatePicker = () => {
    setShowPicker(!showPicker)
  }

  const onChange = ({ type = "set" }, selectedDate) => {
    const currentDate = selectedDate

    if (type == "set") {
      if (Platform.OS === "android") {
        toggleDatePicker()
      }
      setSelectedDate(currentDate)
      setCourseDate(currentDate.toLocaleDateString("es-ES", dateOptions))
    } else {
      toggleDatePicker()
    }

    setSelectedDate(currentDate)
    setCourseDate(currentDate.toLocaleDateString("es-ES", dateOptions))
  }
  const onChangeDateWeb = selectedDate => {
    const currentDate = new Date(selectedDate)
    setSelectedDate(currentDate)
    setCourseDate(currentDate.toLocaleDateString("es-ES", dateOptions))
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={10}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {courseCreated && (
            <CustomModal
              title={"Curso creado satisfactoriamente"}
              message={
                "El curso y los alumnos fueron añadidas de forma correcta"
              }
            />
          )}
          <View style={styles.sectionStyle}>
            <Text style={styles.label}>Nombre del curso</Text>
            <TextInput
              style={styles.input}
              placeholder="ISE II Trinity"
              value={courseTitle}
              onChangeText={setCourseTitle}
              placeholderTextColor="#11182744"
            />
          </View>
          {!userIsTeacher && (
            <View style={styles.sectionStyle}>
              <Text style={styles.label}>Email del profesor</Text>
              <TextInput
                style={styles.input}
                placeholder="johndoe@gmail.com"
                value={teacherMail}
                autoCapitalize="none"
                onChangeText={setTeacherMail}
                placeholderTextColor="#11182744"
              />
            </View>
          )}
          <View style={styles.sectionStyle}>
            <Text style={styles.label}>Email de los alumnos</Text>
            <TextInput
              style={styles.input}
              placeholder="mario@gmail.com, marta@gmail.com "
              value={studentsMail}
              onChangeText={setStudentsMail}
              autoCapitalize="none"
              placeholderTextColor="#11182744"
            />
          </View>
          <View style={styles.sectionStyle}>
            <Text style={styles.label}>Comienzo del curso</Text>
            {Platform.OS === "web" ? (
              <input
                style={styles.webInput}
                type="date"
                value={selectedDate.toISOString().split("T")[0]}
                placeholder="tt"
                onChange={event => {
                  onChangeDateWeb(new Date(event.target.value))
                }}
              />
            ) : (
              <>
                {showPicker && (
                  <DateTimePicker
                    value={selectedDate || new Date()}
                    mode="date"
                    display="spinner"
                    onChange={onChange}
                  />
                )}
                <Pressable onPress={toggleDatePicker}>
                  <TextInput
                    style={styles.input}
                    placeholder="Jue 18 de mayo de 2025"
                    value={courseDate}
                    placeholderTextColor="#11182744"
                    editable={false}
                  />
                </Pressable>
              </>
            )}
          </View>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: formIsReady ? "#075985" : "#11182744" },
            ]}
            onPress={addCourse}
          >
            <Text style={styles.buttonText}>Añadir curso</Text>
          </TouchableOpacity>
          {!formIsReady ? (
            <Text style={styles.errorTextStyle}>{errorMessage}</Text>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default AddCourse

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f9fafb",
    alignContent: "center",
  },
  contentContainer: {
    justifyContent: "center",
    alignContent: "center",
  },
  sectionStyle: {
    marginLeft: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 10.2,
    color: "#111827cc",
  },
  input: {
    backgroundColor: "transparent",
    height: 50,
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 20,
    color: "#111827cc",
    borderRadius: 50,
    borderWidth: 1.5,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#075985",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#075985",
    height: 40,
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    paddingVertical: 10,
    fontSize: 16,
  },
  datePicker: {
    height: 120,
    marginTop: -10,
  },
  pickerButton: {
    paddingHorizontal: 20,
  },
  webInput: {
    backgroundColor: "transparent",
    height: 50,
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 20,
    color: "#111827cc",
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: "#111827cc",
    paddingHorizontal: 20,
  },
  errorTextStyle: {
    color: "red",
    textAlign: "center",
    fontSize: 14,
  },
})
