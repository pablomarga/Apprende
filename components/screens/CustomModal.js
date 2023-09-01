import React, { useState } from "react"
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native"

const CustomModal = ({ title, message, onReset }) => {
  const [isVisible, setIsVisible] = useState(true)

  const handleConfirm = () => {
    setIsVisible(false)
    onReset()
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => setIsVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          <TouchableOpacity onPress={handleConfirm}>
            <Text style={styles.modalButton}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    marginBottom: 20,
  },
  modalButton: {
    color: "blue",
    textAlign: "right",
  },
})

export default CustomModal
