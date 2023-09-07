import React, { useState, useEffect, useCallback } from "react"
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Text,
} from "react-native"
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth"
import { auth } from "../../../firebase"
import { useFocusEffect } from "@react-navigation/native"

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [newPasswordRepeat, setNewPasswordRepeat] = useState("")
  const [passwordChanged, setPasswordChanged] = useState(false)
  const [formIsReady, setFormIsReady] = useState(false)
  const [errorText, setErrorText] = useState("")

  useEffect(() => {
    if (currentPassword && newPassword && newPasswordRepeat) {
      setFormIsReady(true)
    } else {
      setFormIsReady(false)
    }
  }, [currentPassword, newPassword, newPasswordRepeat])
  useFocusEffect(
    useCallback(() => {
      onReset()
    }, [])
  )
  const onReset = () => {
    setCurrentPassword("")
    setNewPassword("")
    setNewPasswordRepeat("")
    setPasswordChanged(false)
    setFormIsReady(false)
    setErrorText("")
  }
  const handlePasswordChange = async () => {
    if (formIsReady) {
      try {
        if (newPassword.length < 6) {
          setErrorText("La contraseña tiene que tener al menos 6 caracteres")
          return
        }
        if (newPassword !== newPasswordRepeat) {
          setErrorText("Las contraseñas no coinciden")
          return
        }
        const user = auth.currentUser
        const credential = EmailAuthProvider.credential(
          user.email,
          currentPassword
        )
        try {
          await reauthenticateWithCredential(user, credential)
        } catch (error) {
          setErrorText("Contraseña actual incorrecta")
        }

        await user.updatePassword(newPassword)

        setPasswordChanged(true)
      } catch (error) {
        console.log(error)
      }
    } else {
      setErrorText("Rellena todos los campos")
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {passwordChanged && (
            <CustomModal
              title={"Contraseña cambiada satisfactoriamente"}
              message={"La contraseña ha sido modificada correctamente"}
              onReset={onReset}
            />
          )}
          <View style={styles.sectionStyle}>
            <Text style={styles.label}>Contraseña actual</Text>
            <TextInput
              style={styles.input}
              secureTextEntry={true}
              value={currentPassword}
              onChangeText={text => setCurrentPassword(text)}
            />
          </View>

          <View style={styles.sectionStyle}>
            <Text style={styles.label}>Nueva contraseña</Text>
            <TextInput
              style={styles.input}
              secureTextEntry={true}
              value={newPassword}
              onChangeText={text => setNewPassword(text)}
            />
          </View>
          <View style={styles.sectionStyle}>
            <Text style={styles.label}>
              Introduce de nuevo la nueva contraseña
            </Text>
            <TextInput
              style={styles.input}
              secureTextEntry={true}
              value={newPasswordRepeat}
              onChangeText={text => setNewPasswordRepeat(text)}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: formIsReady ? "#075985" : "#11182744" },
            ]}
            onPress={handlePasswordChange}
          >
            <Text style={styles.buttonText}>Cambiar contraseña</Text>
          </TouchableOpacity>
          <Text style={styles.errorTextStyle}>{errorText}</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default ChangePassword

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
