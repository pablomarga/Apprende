import React, { useState, useEffect } from "react"
import { ref, getDownloadURL, listAll, deleteObject } from "firebase/storage"
import { storage } from "../../../firebase"
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
  FlatList,
} from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { useRoute } from "@react-navigation/native"
import AddMaterial from "./AddMaterial"
import Loader from "../../Loader"

const CourseMaterial = ({
  currentUser,
  saveTabTitle,
  courseName,
  courseId,
}) => {
  const [fileUrls, setFilesUrls] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [noMaterial, setNoMaterial] = useState(false)

  const fileListRef = ref(storage, `courses/${courseId}/material`)
  const route = useRoute()

  useEffect(() => {
    const title = { name: courseName, route: route.name }
    saveTabTitle(title)
    updateMaterials()
  }, [])

  const handleDelete = fileName => {
    const fileRef = ref(storage, `courses/${courseId}/material/${fileName}`)
    deleteObject(fileRef)
      .then(() => {
        updateMaterials()
      })
      .catch(error => {
        setErrorMessage("Error eliminando el material.")
        console.log(error)
      })
  }

  const updateMaterials = () => {
    setFilesUrls([])
    setNoMaterial(false)
    setIsLoading(true)

    listAll(fileListRef)
      .then(response => {
        if (response.items.length !== 0) {
          const files = response.items.map(item => {
            return getDownloadURL(item)
              .then(url => ({
                url,
                type: getFileType(item.name),
                name: item.name,
                createdAt: item.timeCreated, // Agrega la propiedad createdAt con la fecha de creación
              }))
              .catch(error => {
                console.log(error)
                throw new Error("Error recopilando el material.")
              })
          })

          Promise.all(files)
            .then(filesData => {
              // Ordena los archivos por fecha de creación en orden descendente (los más recientes primero)
              filesData.sort((a, b) => b.createdAt - a.createdAt)
              setFilesUrls(filesData)
              setIsLoading(false)
            })
            .catch(error => {
              setErrorMessage(error.message)
              setIsLoading(false)
            })
        } else {
          setNoMaterial(true)
          setIsLoading(false)
        }
      })
      .catch(error => {
        setErrorMessage("Error recopilando el material.")
        console.log(error)
      })
  }
  const getFileType = fileName => {
    const extension = fileName.split(".").pop().toLowerCase()

    if (extension === "pdf") {
      return "pdf"
    } else if (
      extension === "png" ||
      extension === "jpg" ||
      extension === "jpeg"
    ) {
      return "image"
    } else if (extension === "docx" || extension === "doc") {
      return "word"
    } else {
      return "file"
    }
  }



  const renderFileItem = ({ item, index }) => (
    <View style={styles.fileItemContainer}>
      <Text style={styles.fileNumber}>{index + 1}.</Text>
      <Icon name={getIconName(item.type)} size={30} color="black" />
      <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
        <Text style={styles.fileName}>{item.name}</Text>
      </TouchableOpacity>
      {(currentUser.isAdmin || currentUser.isTeacher) && (
        <TouchableOpacity onPress={() => handleDelete(item.name)}>
          <Icon style={styles.fileName} name="delete" size={30} color="black" />
        </TouchableOpacity>
      )}
    </View>
  )

  const getIconName = fileType => {
    switch (fileType) {
      case "pdf":
        return "picture-as-pdf"
      case "image":
        return "image"
      case "word":
        return "description"
      default:
        return "insert-drive-file"
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <Loader loading={isLoading} />
      ) : (
        <>
          {noMaterial && (
            <Text style={styles.message}>
              Aún no hay ningún material disponible
            </Text>
          )}
          {(currentUser.isTeacher || currentUser.isAdmin) && (
            <AddMaterial
              courseId={courseId}
              updateMaterials={updateMaterials}
            />
          )}
        </>
      )}
      <FlatList
        data={fileUrls}
        renderItem={renderFileItem}
        keyExtractor={(item, index) => index.toString()}
      />
      {errorMessage != null ? (
        <Text style={styles.errorTextStyle}>{errorMessage}</Text>
      ) : null}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  contentContainer: {
    alignItems: "flex-start", // Alinear al comienzo izquierdo
  },
  message: {
    fontSize: 20,
    marginTop: 5,
    marginLeft: 15,
    fontWeight: "bold",
    color: "#333",
  },
  fileItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  fileNumber: {
    marginRight: 10,
  },
  fileName: {
    marginLeft: 10,
  },
  errorTextStyle: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
})

export default CourseMaterial
