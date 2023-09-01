import firebase from "firebase/compat/app"
import { getStorage, ref } from "firebase/storage"
import "firebase/compat/auth"
import "firebase/compat/firestore"
import {
  API_KEY,
  AUTH_DOMAIN,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID,
  MEASUREMENT_ID,
} from "@env"

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID,
}

let app
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig)
} else {
  app = firebase.app()
}

const db = app.firestore()
const FieldValue = firebase.firestore.FieldValue
const FieldPath = firebase.firestore.FieldPath
const auth = firebase.auth()
const storage = getStorage()
const imagesRef = ref(storage, "images")
const coursesRef = ref(storage, "courses/")


export { db, auth, storage, imagesRef, coursesRef, FieldValue, FieldPath }
