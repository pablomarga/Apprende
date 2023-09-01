import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Platform,
} from "react-native"
import { fetchAssignmentsForCalendar } from "./util"
import { Calendar, LocaleConfig } from "react-native-calendars"
import Loader from "../Loader"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

LocaleConfig.locales["es"] = {
  monthNames: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],
  dayNames: [
    "Domingo",
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ],
  dayNamesShort: ["Dom.", "Lun.", "Mar.", "Mier.", "Jue.", "Vie.", "Sab."],
  today: "Hoy",
}
LocaleConfig.defaultLocale = "es"

const CalendarScreen = ({ currentUser }) => {
  const [assignments, setAssignments] = useState([])
  const [markedDates, setMarkedDates] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [isModalVisible, setModalVisible] = useState(false)

  const markEvents = events => {
    const marked = {}
    events.forEach(event => {
      const formattedDate = event.date
      marked[formattedDate] = {
        marked: true,
        selectedColor: "blue",
        title: event.title,
        course: event.course,
      }
    })
    return marked
  }

  // Creamos un componente flecha ya que no renderiza correctamente en web
  const ArrowComponent = ({ direction }) => {
    const iconColor = "black"
    const iconSize = 24

    return (
      <MaterialCommunityIcons
        name={direction === "left" ? "arrow-left" : "arrow-right"}
        color={iconColor}
        size={iconSize}
        style={{ marginLeft: 15 }}
      />
    )
  }
  const handleDayPress = day => {
    const selectedDate = day.dateString
    const selectedEvent = assignments.find(event => event.date === selectedDate)
    if (selectedEvent != null) {
      setSelectedAssignment(selectedEvent)
      setModalVisible(true)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const assignments = await fetchAssignmentsForCalendar(currentUser)
      setAssignments(assignments)
      setIsLoading(false)

      const marked = markEvents(assignments)
      setMarkedDates(marked)
    }

    fetchData()
  }, [])
  const closeModal = () => {
    setSelectedAssignment(null)
    setModalVisible(false)
  }

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Loader loading={isLoading} />
      ) : (
        <View>
          <Calendar
            markedDates={markedDates}
            onDayPress={day => handleDayPress(day)}
            renderArrow={direction => <ArrowComponent direction={direction} />}
          />
          <Modal
            visible={isModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={closeModal}
          >
            <TouchableWithoutFeedback onPress={closeModal}>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableWithoutFeedback>
                  <View style={{ backgroundColor: "white", padding: 20 }}>
                    {selectedAssignment && selectedAssignment.title != null && (
                      <View>
                        <Text>Entrega: {selectedAssignment.title}</Text>
                        <Text>Curso: {selectedAssignment.course}</Text>
                      </View>
                    )}
                    <TouchableOpacity
                      onPress={closeModal}
                      style={{ position: "absolute", top: 10, right: 10 }}
                    >
                      <Text>X</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignContent: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default CalendarScreen
