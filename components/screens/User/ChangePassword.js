// Introduce la contraseña que quieres establecer para tu cuenta.
// Debe tener al menos una longitud mínima de 6 caracteres.

import React, { useState } from "react"
import {
  View,
  StyleSheet,
  TextInput,
  Keyboard,
  Modal,
  Button,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Text,
} from "react-native"
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth"
import { auth } from "../../../firebase"

const ChangePassword = () => {
  auth
  const [isKeyboardVisible, setKeyboardVisible] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [newPasswordRepeat, setNewPasswordRepeat] = useState("")
  const [modalVisible, setModalVisible] = useState(false)
  const [errorText, setErrorText] = useState("")

  Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true))
  Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false))

  const handlePasswordChange = async () => {
    try {
      // Check if the new password meets the requirements
      if (newPassword.length < 6) {
        setErrorText("La contraseña tiene que tener al menos 6 caracteres")
        return
      }
      if (newPassword !== newPasswordRepeat) {
        setErrorText("Las contraseñas no coinciden")
        return
      }
      // Reauthenticate the user to confirm their identity
      const user = auth.currentUser
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      )
      try {
        await reauthenticateWithCredential(user, credential)
      } catch (error) {
        console.log(error)
      }

      // Update the user's password
      await user.updatePassword(newPassword)

      setModalVisible(true)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <KeyboardAvoidingView enabled>
          <View style={styles.sectionStyle}>
            <TextInput
              style={styles.input}
              secureTextEntry={true}
              placeholder="Contraseña actual"
              value={currentPassword}
              onChangeText={text => setCurrentPassword(text)}
            />
          </View>
          <View style={styles.sectionStyle}>
            <TextInput
              style={styles.input}
              secureTextEntry={true}
              placeholder="Nueva contraseña"
              value={newPassword}
              onChangeText={text => setNewPassword(text)}
            />
          </View>
          <View style={styles.sectionStyle}>
            <TextInput
              style={styles.input}
              secureTextEntry={true}
              placeholder="Introduce de nuevo la nueva contraseña"
              value={newPasswordRepeat}
              onChangeText={text => setNewPasswordRepeat(text)}
            />
          </View>
          <Modal
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible)
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <TouchableOpacity
                  onPress={() => setModalVisible(!modalVisible)}
                  style={{ alignSelf: "flex-end", padding: 10 }}
                >
                  <Text style={styles.modalText}>
                    Contraseña cambiada con éxito
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          {errorText != "" ? (
            <Text style={styles.errorTextStyle}> {errorText} </Text>
          ) : null}
          <View
            style={[
              styles.buttonContainer,
            ]}
          >
            <Button
              style={styles.modalView}
              title="Cambiar contraseña"
              onPress={handlePasswordChange}
            />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  )
}

export default ChangePassword

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  buttonContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
})
