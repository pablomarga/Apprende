import React, { useState, useEffect, useRef } from "react"
import {
  View,
  TextInput,
  Pressable,
  Text,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { ref, getDownloadURL } from "firebase/storage"
import { db } from "../../../firebase"
import { SafeAreaView } from "react-native-safe-area-context"
import CustomModal from "../CustomModal"
import AddAssignmentFile from "./AddAssignmentFile"
import { storage } from "../../../firebase"
import { uploadFile } from "./util"

const AddAssignment = ({ courseId }) => {
  const [assignmentTitle, setAssignmentTitle] = useState("")
  const [assignmentDescription, setAssignmentDescription] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [assignmentDate, setAssignmentDate] = useState("")
  const [formIsReady, setFormIsReady] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [assingmentCreated, setAssingmentCreated] = useState(false)
  const [fileUpload, setFileUpload] = useState(null)
  const [selectedFileName, setSelectedFileName] = useState(null)
  const [fileType, setFileType] = useState(null)

  const dateOptions = {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  }

  useEffect(() => {
    if (assignmentTitle && assignmentDate) {
      setFormIsReady(true)
    } else {
      setFormIsReady(false)
    }
  }, [assignmentTitle, assignmentDate])

  const receiveDataFromChild = dataFromChild => {
    const { fileToUpload, typeFile, fileName } = dataFromChild
    setFileUpload(fileToUpload)
    setSelectedFileName(fileName)
    setFileType(typeFile)
  }

  const addAssignment = async () => {
    if (formIsReady) {
      try {
        const assignmentId = await createAssignment()
        await handleUploadFile(assignmentId)
        setAssingmentCreated(true)
      } catch (error) {
        setErrorMessage("Error al agregar la entrega")
      }
    } else {
      setErrorMessage("Rellena todos los campos")
    }
  }

  const handleUploadFile = async assignmentId => {
    const fileRef = ref(
      storage,
      `courses/${courseId}/assignment/${assignmentId}/material/${selectedFileName}`
    )
    if (fileUpload) {
      await uploadFile(fileRef, fileUpload, fileType)
      const fileRefDownload = await getDownloadURL(fileRef)
      await db
        .collection("courses")
        .doc(courseId)
        .collection("assignments")
        .doc(assignmentId)
        .update({
          downloadUrl: fileRefDownload,
        })
    }
  }

  const createAssignment = async () => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" }
    const formattedDate = selectedDate.toLocaleDateString("es-ES", options)

    const assignmentRef = await db
      .collection("courses")
      .doc(courseId)
      .collection("assignments")
      .add({
        title: assignmentTitle,
        deadline: formattedDate,
        description: assignmentDescription,
      })

    const assignmentId = assignmentRef.id
    return assignmentId
  }

  const resetForm = () => {
    setAssignmentTitle("")
    setAssignmentDescription("")
    setAssignmentDate("")
    setErrorMessage("")
    setSelectedDate(new Date())
  }

  const toggleDatePicker = () => {
    setShowPicker(!showPicker)
  }

  const onChange = ({ type = "set" }, selectedDate) => {
    const currentDate = selectedDate

    if (type == "set") {
      if (Platform.OS === "android") {
        toggleDatePicker()
      }
      setSelectedDate(currentDate)
      setAssignmentDate(currentDate.toLocaleDateString("es-ES", dateOptions))
    } else {
      toggleDatePicker()
    }

    setSelectedDate(currentDate)
    setAssignmentDate(currentDate.toLocaleDateString("es-ES", dateOptions))
  }

  const onChangeDateWeb = selectedDate => {
    if (isNaN(new Date(selectedDate))) {
      console.error("Fecha no válida:", selectedDate)
      return
    }

    const currentDate = new Date(selectedDate)
    setSelectedDate(currentDate)
    setAssignmentDate(currentDate.toLocaleDateString("es-ES", dateOptions))
  }

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={10}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {assingmentCreated && (
            <CustomModal
              title={"Entrega creado satisfactoriamente"}
              message={"La entrega ha sido añadida correctamente"}
              onReset={resetForm}
            />
          )}
          <View style={styles.sectionStyle}>
            <Text style={styles.label}>Nombre del entrega*</Text>
            <TextInput
              style={styles.input}
              placeholder="Tema 1 ejercicios"
              value={assignmentTitle}
              onChangeText={setAssignmentTitle}
              placeholderTextColor="#11182744"
            />
          </View>
          <View style={styles.sectionStyle}>
            <Text style={styles.label}>Descripción de la entrega</Text>
            <TextInput
              style={styles.descriptionInput}
              value={assignmentDescription}
              onChangeText={setAssignmentDescription}
              multiline
              placeholderTextColor="#11182744"
            />
          </View>
          <View style={styles.sectionStyle}>
            <Text style={styles.label}>
              Añadir archivo opcional a la entrega
            </Text>
            <AddAssignmentFile
              courseId={courseId}
              sendDataToParent={receiveDataFromChild}
            />
          </View>

          <View style={styles.sectionStyle}>
            <Text style={styles.label}>Fecha de límite entrega*</Text>
            {Platform.OS === "web" ? (
              <input
                style={styles.webInput}
                type="date"
                value={selectedDate.toISOString().split("T")[0]}
                placeholder="tt"
                onChange={event => {
                  onChangeDateWeb(new Date(event.target.value))
                }}
              />
            ) : (
              <>
                {showPicker && (
                  <DateTimePicker
                    value={selectedDate || new Date()}
                    mode="date"
                    display="spinner"
                    onChange={onChange}
                  />
                )}
                <Pressable onPress={toggleDatePicker}>
                  <TextInput
                    style={styles.input}
                    placeholder="Jue 18 de mayo de 2025"
                    value={assignmentDate}
                    placeholderTextColor="#11182744"
                    editable={false}
                  />
                </Pressable>
              </>
            )}
          </View>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: formIsReady ? "#075985" : "#11182744" },
            ]}
            onPress={addAssignment}
          >
            <Text style={styles.buttonText}>Añadir entrega</Text>
          </TouchableOpacity>
          {!formIsReady ? (
            <Text style={styles.errorTextStyle}>{errorMessage}</Text>
          ) : null}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default AddAssignment

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
  descriptionInput: {
    backgroundColor: "transparent",
    height: 100,
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 20,
    color: "#111827cc",
    borderRadius: 50,
    borderWidth: 1.5,
    paddingHorizontal: 30,
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
  datePicker: {
    height: 120,
    marginTop: -10,
  },
  pickerButton: {
    paddingHorizontal: 20,
  },
  webInput: {
    backgroundColor: "transparent",
    height: 50,
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 20,
    color: "#111827cc",
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: "#111827cc",
    paddingHorizontal: 20,
    marginRight: 20,
  },
  errorTextStyle: {
    color: "red",
    textAlign: "center",
    fontSize: 14,
  },
})
