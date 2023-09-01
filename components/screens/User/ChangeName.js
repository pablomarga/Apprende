// Introduce la contraseña que quieres establecer para tu cuenta.
// Debe tener al menos una longitud mínima de 6 caracteres.

import React, { useState, useEffect } from "react"
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  Text,
} from "react-native"
import CustomModal from "../CustomModal"
import { auth, db } from "../../../firebase"

const ChangeName = () => {
  const [newName, setNewName] = useState("")
  const [newNameRepeat, setNewNameRepeat] = useState("")
  const [nameChanged, setNameChanged] = useState(false)
  const [formIsReady, setFormIsReady] = useState(false)
  const [errorText, setErrorText] = useState("")

  useEffect(() => {
    if (newName && newNameRepeat) {
      setFormIsReady(true)
    } else {
      setFormIsReady(false)
    }
  }, [newName, newNameRepeat])

  const onClear = () => {
    setFormIsReady(false)
    setNewNameRepeat("")
    setNewName("")
    setErrorText("")
  }
  const changeName = async () => {
    try {
      db.collection("users").doc(auth.currentUser.uid).update({
        name: newName,
      })
    } catch (error) {
      setErrorText("Error cambiando el nombre al usuario")
    }
  }
  const handleNameChange = async () => {
    setErrorText("")
    if (formIsReady) {
      try {
        if (newName !== newNameRepeat) {
          setErrorText("Los nombres no coinciden")
          return
        }

        await changeName()

        setNameChanged(true)
      } catch (error) {
        console.log(error)
      }
    } else {
      setErrorText("Rellena todos los campos")
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{ flex: 1 }}

      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {nameChanged && (
            <CustomModal
              title={"Nombre cambiado satisfactoriamente"}
              message={"El nombre ha sido modificada correctamente"}
              onReset={onClear}
            />
          )}
          <View style={styles.sectionStyle}>
            <Text style={styles.label}>Nuevo nombre</Text>
            <TextInput
              style={styles.input}
              value={newName}
              onChangeText={text => setNewName(text)}
            />
          </View>
          <View style={styles.sectionStyle}>
            <Text style={styles.label}>Introduce de nuevo el nombre</Text>
            <TextInput
              style={styles.input}
              value={newNameRepeat}
              onChangeText={text => setNewNameRepeat(text)}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: formIsReady ? "#075985" : "#11182744" },
            ]}
            onPress={handleNameChange}
          >
            <Text style={styles.buttonText}>Cambiar nombre</Text>
          </TouchableOpacity>
          {/* {!formIsReady ? (
            <Text style={styles.errorTextStyle}>{errorText}</Text>
          ) : null} */}

          <Text style={styles.errorTextStyle}>{errorText}</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default ChangeName

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
