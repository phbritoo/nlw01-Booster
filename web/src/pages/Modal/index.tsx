import React from "react";
import "./styles.css";
import check from "../../assets/check.svg";

const Modal = () => {
  return (
    <div id="modal" className="hide">
      <img src={check} alt="check" />
      <h1>Cadastro concluído!</h1>
    </div>
  );
};

export default Modal;
