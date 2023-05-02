import firebase from "firebase/compat/app"
import { getStorage, ref } from "firebase/storage"
import "firebase/compat/auth"
import "firebase/compat/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBmxEV-865DWf97LEJ9fcdZbR2O6Ium0T4",
  authDomain: "apprende-5aa76.firebaseapp.com",
  projectId: "apprende-5aa76",
  storageBucket: "apprende-5aa76.appspot.com",
  messagingSenderId: "598663169080",
  appId: "1:598663169080:web:0eac2ca351861e755d52cd",
  measurementId: "G-3HHTP1GF3Q",
}

let app
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig)
} else {
  app = firebase.app()
}

const db = app.firestore()
const auth = firebase.auth()
const storage = getStorage()
const imagesRef = ref(storage, "images")

export { db, auth, storage, imagesRef }
