import { auth, db } from "../../../firebase"

const getUsersByEmail = async email => {
  try {
    const querySnapshot = await db
      .collection("users")
      .where("email", "==", email)
      .get()

    const users = []
    querySnapshot.forEach(doc => {
      users.push(doc.data())
    })

    return users
  } catch (error) {
    console.log("Error getting users:", error)
    return []
  }
}
const registerUser = async userData => {
  const { email, password } = userData
  const userAlreadyRegister = await getUsersByEmail(email)
  try {
    if (userAlreadyRegister.length !== 0) {
      throw new Error("Usuario ya registrado")
    }

    await auth.createUserWithEmailAndPassword(email, password)
    await auth.currentUser.sendEmailVerification({
      handleCodeInApp: true,
      url: "https://apprende-5aa76.firebaseapp.com",
    })
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
  try {
    const { name, email, isAdmin, isTeacher } = userData
    db.collection("users").doc(auth.currentUser.uid).set({
      name,
      email,
      isAdmin: isAdmin,
      isTeacher: isTeacher,
    })
  } catch (error) {
    console.log("Error guardando usuario", error)
  }
}

export { registerUser }
