import React, { useState } from "react"
import { View, Text, Modal, TouchableOpacity } from "react-native"

const CustomModal = ({ title, message }) => {
  const [isVisible, setIsVisible] = useState(true)

  const handleConfirm = () => {
    setIsVisible(false)
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => setIsVisible(false)}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <View style={{ backgroundColor: "white", padding: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
            {title}
          </Text>
          <Text style={{ marginBottom: 20 }}>{message}</Text>
          <TouchableOpacity onPress={handleConfirm}>
            <Text style={{ color: "blue", textAlign: "right" }}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

export default CustomModal
