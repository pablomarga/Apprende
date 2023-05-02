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
import React, { useState, createRef } from "react"
import { auth, db } from "../../../firebase"
import { fetchLogo } from "../util"
import Loader from "../../Loader"
import RegisterModal from "./RegisterModal"

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordRepeat, setPasswordRepeat] = useState("")
  const [logo, setLogo] = useState("")
  const [loading, setLoading] = useState(false)
  const [isValid, setIsValid] = useState(true)
  const [hasRegistered, setHasRegistered] = useState(false)

  const emailInputRef = createRef()
  const nameInputRef = createRef()
  const passwordInputRef = createRef()
  const passwordRepeatInputRef = createRef()

  const registerUser = async () => {
    try {
      await auth.createUserWithEmailAndPassword(email, password)
      await auth.currentUser.sendEmailVerification({
        handleCodeInApp: true,
        url: "https://apprende-5aa76.firebaseapp.com",
      })
      setHasRegistered(true)
    } catch (error) {
      console.log(error)
    }
    try {
      db.collection("users").doc(auth.currentUser.uid).set({
        name,
        email,
        image: "default",
        isAdmin: false,
        isTeacher: false,
      })
    } catch (error) {
      console.log("Error guardando usuario", error)
    }
  }
  const onRegister = () => {
    setLoading(true)
    if (name.lenght == 0 || email.length == 0 || password.length == 0) {
      setIsValid({
        bool: true,
        boolSnack: true,
        message: "Por favor rellena todo",
      })
      setLoading(false)

      return
    }
    if (password != passwordRepeat) {
      setIsValid({
        bool: true,
        boolSnack: true,
        message: "Las contraseñas no coinciden",
      })
      setLoading(false)

      return
    }
    if (password.length < 6) {
      setIsValid({
        bool: true,
        boolSnack: true,
        message: "La contraseña debe tener al menos 6 caracteres",
      })
      setLoading(false)
      return
    }

    db.collection("users")
      .where("email", "==", email)
      .get()
      .then(async snapshot => {
        if (!snapshot.exist) {
          try {
            await registerUser()
            setLoading(false)
          } catch (error) {
            setLoading(false)
            console.log(error)
            setIsValid({
              bool: true,
              boolSnack: true,
              message: "Email no valido",
            })
          }
        }
      })
      .catch(() => {
        setLoading(false)
        setIsValid({
          bool: true,
          boolSnack: true,
          message: "Something went wrong",
        })
      })
  }
  fetchLogo().then(val => {
    setLogo(val)
  })

  return (
    <View style={{ flex: 1, backgroundColor: "#307ecc" }}>
      <Loader loading={loading} />
      {hasRegistered && <RegisterModal />}
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          justifyContent: "center",
          alignContent: "center",
        }}
      >
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
        <KeyboardAvoidingView enabled>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={name => setName(name)}
              underlineColorAndroid="#f000"
              placeholder="Nombre"
              placeholderTextColor="#8b9cb5"
              keyboardType="email-address"
              ref={nameInputRef}
              returnKeyType="next"
              onSubmitEditing={() =>
                emailInputRef.current && emailInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={email => setEmail(email)}
              underlineColorAndroid="#f000"
              placeholder="Email"
              placeholderTextColor="#8b9cb5"
              keyboardType="email-address"
              ref={emailInputRef}
              returnKeyType="next"
              onSubmitEditing={() =>
                passwordInputRef.current && passwordInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>

          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={UserPassword => setPassword(UserPassword)}
              placeholder="Contraseña"
              placeholderTextColor="#8b9cb5"
              keyboardType="default"
              ref={passwordInputRef}
              onSubmitEditing={() =>
                passwordRepeatInputRef.current &&
                passwordRepeatInputRef.current.focus()
              }
              blurOnSubmit={false}
              secureTextEntry={true}
              underlineColorAndroid="#f000"
              returnKeyType="next"
            />
          </View>

          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={UserPassword => setPasswordRepeat(UserPassword)}
              placeholder="Repite la contraseña"
              placeholderTextColor="#8b9cb5"
              keyboardType="default"
              ref={passwordRepeatInputRef}
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={false}
              secureTextEntry={true}
              underlineColorAndroid="#f000"
              returnKeyType="next"
            />
          </View>
          {isValid ? (
            <Text style={styles.errorTextStyle}> {isValid.message} </Text>
          ) : null}
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={() => onRegister()}
          >
            <Text style={styles.buttonTextStyle}>REGISTER</Text>
          </TouchableOpacity>
          <Text
            style={styles.loginTextStyle}
            onPress={() => navigation.navigate("Login")}
          >
            ¿Ya tienes una cuenta? Iniciar sesión
          </Text>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  )
}

export default RegisterScreen
const styles = StyleSheet.create({
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
    marginBottom: 20,
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
  errorTextStyle: {
    color: "red",
    textAlign: "center",
    fontSize: 14,
  },
  loginTextStyle: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
    alignSelf: "center",
    padding: 10,
  },
  successTextStyle: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    padding: 30,
  },
})