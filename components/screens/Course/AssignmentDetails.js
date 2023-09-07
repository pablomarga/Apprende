import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
  TextInput,
} from "react-native"
import { uploadFile, docPicker } from "./util"
import {
  getAssignmentDetails,
  getFileName,
  checkFileUploaded,
  getGrade,
} from "./util"
import { storage, db } from "../../../firebase"
import { ref, getDownloadURL } from "firebase/storage"
import { Button, Card, Title, Paragraph } from "react-native-paper"
import Loader from "../../Loader"
import CustomModal from "../CustomModal"

const AssignmentDetails = ({
  assignmentId,
  courseId,
  currentUser,
  assignmentUser,
}) => {
  const [fileName, setFileName] = useState(null)
  const [assignmentData, setAssignmentData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [fileUpload, setFileUpload] = useState(null)
  const [selectedFileName, setSelectedFileName] = useState(null)
  const [fileType, setFileType] = useState(null)
  const [existingStudentFile, setExistingStudentFile] = useState(null)
  const [fileUploadedCorrectly, setFileUploadedCorrectly] = useState(false)
  const [isTeacher, setIsTeacher] = useState(false)
  const [grade, setGrade] = useState("-")
  const [observations, setObservations] = useState("")
  const [gradeUploadCorrectly, setGradeUploadCorrectly] = useState(false)

  const [uploadText, setUploadText] = useState("Añadir documento a la entrega")

  useEffect(() => {
    const fetchData = async () => {
      setIsTeacher(assignmentUser.id != currentUser.uid)
      const data = await getAssignmentDetails(assignmentId, courseId)
      const file = data.downloadUrl ? await getFileName(data.downloadUrl) : null
      const gradeObservation = await getGrade(
        courseId,
        assignmentUser,
        assignmentId
      )
      data.grade != "" ? setGrade(gradeObservation.grade) : "-"
      data.observations != ""
        ? setObservations(gradeObservation.observations)
        : ""
      const studentFile = await checkFileUploaded(
        courseId,
        assignmentUser,
        assignmentId
      )
      setExistingStudentFile(studentFile)
      studentFile != null && setUploadText("Modificar documento")
      setAssignmentData(data)
      setFileName(file)
      setIsLoading(false)
    }
    fetchData()
  }, [fileUploadedCorrectly, gradeUploadCorrectly])

  const onReset = () => {
    setFileUpload(null)
    setSelectedFileName(null)
    setFileType(null)
    setUploadText("Añadir documento a la entrega")
    setFileUploadedCorrectly(false)
    setGradeUploadCorrectly(false)
  }

  const handleDownload = () => {
    if (fileName) {
      Linking.openURL(assignmentData.downloadUrl)
    }
  }
  const handleDownloadStudentFile = () => {
    if (existingStudentFile) {
      Linking.openURL(existingStudentFile.downloadUrl)
    }
  }

  const handleUpload = async () => {
    const fileRef = ref(
      storage,
      `courses/${courseId}/assignment/${assignmentId}/studentFile/${assignmentUser.id}/${selectedFileName}`
    )
    if (fileUpload) {
      await uploadFile(fileRef, fileUpload, fileType)
      const fileRefDownload = await getDownloadURL(fileRef)
      if (existingStudentFile != null) {
        await db
          .collection("courses")
          .doc(courseId)
          .collection("students")
          .doc(assignmentUser.id)
          .collection("assignments")
          .doc(assignmentId)
          .update({
            taskDownloadUrl: fileRefDownload,
          })
      } else {
        await db
          .collection("courses")
          .doc(courseId)
          .collection("students")
          .doc(assignmentUser.id)
          .collection("assignments")
          .doc(assignmentId)
          .set(
            {
              taskDownloadUrl: fileRefDownload,
              grade: "",
              observations: "",
            },
            { merge: true } // Usar merge para no reemplazar todo el documento
          )
      }
      setFileUploadedCorrectly(true)
    }
  }

  const handlePicker = async () => {
    const fileObject = await docPicker()
    const { fileToUpload, typeFile, fileName } = fileObject
    setFileUpload(fileToUpload)
    setSelectedFileName(fileName)
    setFileType(typeFile)
    setUploadText("Modificar documento")
  }

  const handleGradeSubmit = async () => {
    await db
      .collection("courses")
      .doc(courseId)
      .collection("students")
      .doc(assignmentUser.id)
      .collection("assignments")
      .doc(assignmentId)
      .update({
        grade: grade,
        observations: observations,
      })
    setGradeUploadCorrectly(true)
  }

  // Transformamos la fecha para adaptarla a la comparación
  const deadlineDate = assignmentData.deadline
    ? new Date(assignmentData.deadline.split("/").reverse().join("-"))
    : null
  const isPastDeadline = deadlineDate && deadlineDate < new Date()

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          {isLoading ? (
            <Loader />
          ) : (
            <>
              <Title style={styles.title}>{assignmentData.title}</Title>
              {fileUploadedCorrectly && (
                <CustomModal
                  title={"Archivo subido correctamente"}
                  message={"El archivo ha sido añadido correctamente"}
                  onReset={onReset}
                />
              )}
              {gradeUploadCorrectly && (
                <CustomModal
                  title={"Nota añadida satisfactoriamente"}
                  message={"La nota fue correctamente añadida"}
                  onReset={onReset}
                />
              )}
              <Paragraph style={{ marginBottom: 10 }}>
                {assignmentData.description}
              </Paragraph>
              {fileName && (
                <Button
                  style={{ marginBottom: 10 }}
                  mode="outlined"
                  onPress={handleDownload}
                >
                  Material: {fileName}
                </Button>
              )}
            </>
          )}
          {isPastDeadline ? (
            <Text style={styles.deadlineText}>
              El plazo de entrega ha pasado.
            </Text>
          ) : (
            <>
              {existingStudentFile != null && (
                <Button
                  style={{ marginBottom: 10 }}
                  mode="outlined"
                  onPress={handleDownloadStudentFile}
                >
                  Archivo de alumno: {existingStudentFile.name}
                </Button>
              )}
              {!isTeacher && (
                <TouchableOpacity onPress={handlePicker} style={styles.button}>
                  <Text style={styles.buttonText}>{uploadText}</Text>
                </TouchableOpacity>
              )}
              {selectedFileName && (
                <View>
                  <Text>{selectedFileName}</Text>
                  <TouchableOpacity
                    onPress={handleUpload}
                    style={styles.uploadButton}
                  >
                    <Text style={styles.buttonText}>Subir</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={onReset}
                    style={styles.cancelButton}
                  >
                    <Text style={styles.buttonText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Campo de entrada de nota */}

              <View style={styles.gradeContainer}>
                <Title style={styles.observationLabel}>Nota (1-10)</Title>
                {isTeacher ? (
                  <TextInput
                    style={styles.gradeInput}
                    value={grade}
                    onChangeText={setGrade}
                    keyboardType="numeric"
                    maxLength={2}
                  />
                ) : (
                  <Text>{grade}</Text>
                )}
              </View>

              {/* Campo de observaciones */}

              <View style={styles.observationContainer}>
                <Title style={styles.observationLabel}>Observaciones</Title>
                {isTeacher ? (
                  <TextInput
                    style={styles.observationInput}
                    value={observations}
                    onChangeText={setObservations}
                    multiline
                  />
                ) : (
                  <Text style={styles.observationInput}>{observations}</Text>
                )}
              </View>
              {isTeacher && (
                <TouchableOpacity
                  onPress={handleGradeSubmit}
                  style={styles.gradeSubmitButton}
                >
                  <Text style={styles.buttonText}>Enviar</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </Card.Content>
      </Card>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  card: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: "#28A745",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  title: {
    marginBottom: 10,
    textAlign: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  fileName: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  deadlineText: {
    marginBottom: 10,
    color: "red",
    fontWeight: "bold",
    marginTop: 15,
  },
  gradeContainer: {
    marginTop: 20,
  },
  gradeLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  gradeInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    fontSize: 16,
  },
  observationInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    fontSize: 16,
    height: 100,
  },

  gradeSubmitButton: {
    backgroundColor: "#007BFF",
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
})

export default AssignmentDetails
