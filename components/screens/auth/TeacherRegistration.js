import React, { useState, useCallback } from "react"
import {
  View,
  TextInput,
  Text,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native"
import { db } from "../../../firebase"
import { SafeAreaView } from "react-native-safe-area-context"
import CustomModal from "../CustomModal"
import { useFocusEffect } from "@react-navigation/native"

const TeacherRegistration = () => {
  const [email, setEmail] = useState("")
  const [teacherAdded, setTeacherAdded] = useState(false)
  const [formIsReady, setFormIsReady] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  useFocusEffect(
    useCallback(() => {
      setErrorMessage("")
      if (email) {
        setFormIsReady(true)
      } else {
        setFormIsReady(false)
      }
    }, [email])
  )

  const onReset = () => {
    setEmail("")
    setTeacherAdded(false)
    setFormIsReady(false)
    setErrorMessage("")
  }
  const handleSearch = async () => {
    try {
      const userQuery = await db
        .collection("users")
        .where("email", "==", email)
        .get()
      if (userQuery.size === 0) {
        userQuery.size === 0
        setErrorMessage(`No existe el usuario con email: ${email}.`)
      } else {
        const userDoc = userQuery.docs[0]
        const userData = userDoc.data()

        if (!userData.isTeacher) {
          await userDoc.ref.update({ isTeacher: true })
          setTeacherAdded(true)
        } else {
          setErrorMessage(`El usuario ya es un profesor.`)
        }
      }
    } catch (error) {
      console.error(error)
      setErrorMessage("Error al agregar el profesor")
    }
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
          {teacherAdded && (
            <CustomModal
              title={"Profesor añadido"}
              message={`El usuario con email: ${email} ahora es un profesor.`}
              onReset={onReset}
            />
          )}

          <View style={styles.sectionStyle}>
            <Text style={styles.label}>Email del usuario</Text>
            <TextInput
              style={styles.input}
              placeholder="mario@gmail.com "
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              placeholderTextColor="#11182744"
            />
          </View>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: formIsReady ? "#075985" : "#11182744" },
            ]}
            onPress={handleSearch}
          >
            <Text style={styles.buttonText}>Añadir profesor</Text>
          </TouchableOpacity>

          <Text style={styles.errorTextStyle}>{errorMessage}</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default TeacherRegistration

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f9fafb",
    alignContent: "center",
  },
  contentContainer: {
    justifyContent: "center",
    marginTop: 15,
    alignContent: "center",
  },
  sectionStyle: {
    marginLeft: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 12,
    marginLeft: 10,

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
    marginTop: 5,
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
