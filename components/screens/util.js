import { ref, getDownloadURL } from "firebase/storage"
import { storage } from "../../firebase"

let appLogo
const fetchLogo = () => {
  const logoRef = ref(storage, "images/logo.png")
  // Get the download URL
  const test = getDownloadURL(logoRef)
    .then(url => {
      return url
    })
    .catch(error => {
      switch (error.code) {
        case "storage/object-not-found":
          // File doesn't exist
          break
        case "storage/unauthorized":
          // User doesn't have permission to access the object
          break
        case "storage/canceled":
          // User canceled the upload
          break
        case "storage/unknown":
          // Unknown error occurred, inspect the server response
          break
      }
    })
    return test 
}

fetchLogo().then(val => {
  appLogo= val
})
export { fetchLogo }
