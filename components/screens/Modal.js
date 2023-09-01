import React from "react";

const Modal = ({ assignment, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{assignment.title}</h2>
        <p>Entrega: {assignment.title}</p>
        <p>Curso: {assignment.course}</p>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default Modal;