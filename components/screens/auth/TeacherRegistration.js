import React, { useState } from "react"
import { View, TextInput, Button, Alert } from "react-native"
import { db } from "../../../firebase"

const TeacherRegistration = () => {
  const [email, setEmail] = useState("")

  const handleSearch = async () => {
    try {
      const userQuery = await db.collection("users").where("email", "==", email).get()
      if (userQuery.size === 0) {
        userQuery.size === 0
        Alert.alert(
          "Usuario no encontrado",
          `No existe el usuario con email: ${email}.`
        )
      } else {
        const userDoc = userQuery.docs[0]
        const userData = userDoc.data()

        // Check if the current user is already a teacher
        if (!userData.isTeacher) {
          // Update the user's isTeacher field to true
          await userDoc.ref.update({ isTeacher: true })
          Alert.alert(
            "Éxito",
            `El usuario con email: ${email} ha sido correctamente actualizado.`
          )
        } else {
          Alert.alert(`El usuario ya es un profesor.`)
        }
      }
    } catch (error) {
      console.error(error)
      Alert.alert("Error", "An error occurred while searching for the user.")
    }
  }

  return (
    <View>
      <TextInput
        placeholder="Introduce el email del usuario"
        value={email}
        onChangeText={setEmail}
      />
      <Button title="Search" onPress={handleSearch} />
    </View>
  )
}

export default TeacherRegistration
