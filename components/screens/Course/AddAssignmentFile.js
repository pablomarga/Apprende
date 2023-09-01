import React, { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { docPicker } from "./util"

const AddAssignmentFile = ({ sendDataToParent }) => {
  const [selectedFileName, setSelectedFileName] = useState(null)

  const handlePicker = async () => {
    const fileObject = await docPicker()

    sendData(fileObject)
  }
  const sendData = fileData => {
    const { fileName } = fileData
    setSelectedFileName(fileName)
    sendDataToParent(fileData)
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePicker} style={styles.button}>
        <Text style={styles.buttonText}>Añadir material</Text>
      </TouchableOpacity>
      {selectedFileName && (
        <Text style={styles.fileName}>{selectedFileName}</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginTop: 5,
    marginLeft: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#ccc",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 15,
    paddingEnd: 10,
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
})

export default AddAssignmentFile
