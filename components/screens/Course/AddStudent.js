import React, { useState, useEffect } from "react"
import {
  View,
  TextInput,
  Text,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native"
import { db, FieldValue } from "../../../firebase"
import { SafeAreaView } from "react-native-safe-area-context"
import CustomModal from "../CustomModal"

const AddStudent = ({ courseId }) => {
  const [studentsMail, setStudentsMail] = useState("")
  const [formIsReady, setFormIsReady] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [studentAdded, setStudentAdded] = useState(false)

  useEffect(() => {
    if (studentsMail) {
      setFormIsReady(true)
    } else {
      setFormIsReady(false)
    }
  }, [studentsMail])

  const resetForm = () => {
    setStudentsMail("")
  }

  const addStudentsToCourse = async () => {
    if (formIsReady) {
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
          Alert.alert(
            `El estudiante con email ${studentEmail} no existe y por tanto no será añadido`
          )
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
      setStudentAdded(true)
    } else {
      setErrorMessage("Introduce un email")
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={10}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {studentAdded && (
            <CustomModal
              title={"Alumno/s añadido satisfactoriamente"}
              message={"Los alumnos fueron añadidos de forma correcta"}
              onReset={resetForm}
            />
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
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: formIsReady ? "#075985" : "#11182744" },
            ]}
            onPress={addStudentsToCourse}
          >
            <Text style={styles.buttonText}>Añadir alumno</Text>
          </TouchableOpacity>

          <Text style={styles.errorTextStyle}>{errorMessage}</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default AddStudent

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
    marginRight: 20,
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
  errorTextStyle: {
    color: "red",
    textAlign: "center",
    fontSize: 14,
  },
})
