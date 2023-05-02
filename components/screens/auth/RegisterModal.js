import React, { useState } from "react"
import { View, Text, Modal, TouchableOpacity } from "react-native"

const RegisterModal = () => {
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
            Verificación de email mandada
          </Text>
          <Text style={{ marginBottom: 20 }}>
            Se ha enviado un correo electrónico de verificación a su dirección
            de correo electrónico. Por favor, haga clic en el enlace para
            verificar su cuenta.
          </Text>
          <TouchableOpacity onPress={handleConfirm}>
            <Text style={{ color: "blue", textAlign: "right" }}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

export default RegisterModal
