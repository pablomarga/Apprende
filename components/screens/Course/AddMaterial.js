import React, { useState } from "react"
import { ref } from "firebase/storage"
import { storage } from "../../../firebase"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { uploadFile, docPicker } from "./util"

const AddMaterial = ({ courseId, updateMaterials }) => {
  const [fileUpload, setFileUpload] = useState(null)
  const [selectedFileName, setSelectedFileName] = useState(null)
  const [fileType, setFileType] = useState(null)

  const onReset = () => {
    setFileUpload(null)
    setSelectedFileName(null)
  }

  const handleUpload = async () => {
    const fileRef = ref(
      storage,
      `courses/${courseId}/material/${selectedFileName}`
    )
    if (fileUpload) {
      await uploadFile(fileRef, fileUpload, fileType)
      updateMaterials()
      onReset()
    }
  }

  const handlePicker = async () => {
    const fileObject = await docPicker()
    const { fileToUpload, typeFile, fileName } = fileObject
    setFileUpload(fileToUpload)
    setSelectedFileName(fileName)
    setFileType(typeFile)
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePicker} style={styles.button}>
        <Text style={styles.buttonText}>Añadir material</Text>
      </TouchableOpacity>
      {selectedFileName && (
        <Text style={styles.fileName}>{selectedFileName}</Text>
      )}
      {selectedFileName && (
        <TouchableOpacity onPress={handleUpload} style={styles.uploadButton}>
          <Text style={styles.buttonText}>Subir</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginTop: 5,
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#ccc",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
  fileName: {
    marginTop: 10,
    marginRight: 10,
    maxWidth: 185,
  },
  uploadButton: {
    backgroundColor: "blue",
    paddingVertical: 10,
    borderRadius: 30,
    paddingHorizontal: 15,
  },
})

export default AddMaterial
