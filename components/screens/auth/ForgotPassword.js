import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native"
import React, { useState } from "react"
import { auth } from "../../../firebase"
import { fetchLogo } from "../util"
import Loader from "../../Loader"

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("")
  const [logo, setLogo] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorText, setErrorText] = useState("")
  const [successText, setSuccessText] = useState("")

  const handleForgotPassword = async () => {
    setErrorText("")
    setSuccessText("")
    if (!email) {
      setErrorText("Por favor introduzca el email")
      return
    }
    try {
      setLoading(true)
      await auth.sendPasswordResetEmail(email)
      setLoading(false)
      setSuccessText("Email enviado correctamente")
    } catch (error) {
      setLoading(false)
      setErrorText("No existe un usuario con ese email")
      console.log(error)
    }
  }
  fetchLogo().then(val => {
    setLogo(val)
  })

  const onNavigateLogin = () => {
    setErrorText("")
    navigation.navigate("Login")
  }

  return (
    <View style={styles.mainBody}>
      <Loader loading={loading} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <View>
          <KeyboardAvoidingView enabled>
            <View style={{ alignItems: "center" }}>
              <Image
                source={logo ? { uri: logo } : null}
                style={{
                  width: "50%",
                  height: 100,
                  resizeMode: "contain",
                  margin: 30,
                }}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={UserEmail => setEmail(UserEmail)}
                placeholder="Introduce tu email"
                placeholderTextColor="#8b9cb5"
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={Keyboard.dismiss}
                underlineColorAndroid="#f000"
              />
            </View>
            {errorText != "" ? (
              <Text style={styles.errorTextStyle}> {errorText} </Text>
            ) : null}
            {successText != "" ? (
              <Text style={styles.successTextStyle}> {successText} </Text>
            ) : null}
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handleForgotPassword}
            >
              <Text style={styles.buttonTextStyle}>Enviar enlace</Text>
            </TouchableOpacity>
            <Text
              style={styles.registerTextStyle}
              onPress={() => onNavigateLogin()}
            >
              Volver al login
            </Text>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  )
}

export default ForgotPasswordScreen

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#307ecc",
    alignContent: "center",
  },
  SectionStyle: {
    flexDirection: "row",
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: "#7DE24E",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#7DE24E",
    height: 40,
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: "white",
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#dadae8",
  },
  registerTextStyle: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
    alignSelf: "center",
    padding: 10,
  },
  errorTextStyle: {
    color: "red",
    textAlign: "center",
    fontSize: 14,
  },
  successTextStyle: {
    color: "green",
    textAlign: "center",
    fontSize: 14,
  }
})
