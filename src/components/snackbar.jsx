import React, { useState, forwardRef, useImperativeHandle } from "react";
import "./snackbar.css";

const Snackbar = forwardRef((props, ref) => {
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [message, setMessage] = useState("")
  const [type, setType] = useState(false)

  useImperativeHandle(ref, () => ({
    show(message, type, length) {
        setType(type)
        setMessage(message)
      setShowSnackbar(true);
      setTimeout(() => {
        setShowSnackbar(false);
      }, length);
    },
  }));
  return (
    <div
      className="snackbar"
      id={showSnackbar ? "show" : "hide"}
      style={{
        backgroundColor: type ? "#00F593" : "#FF0033",
        color: type ? "black" : "white",
      }}
    >
      <div className="symbol">
        {type ? <h1>&#x2713;</h1> : <h1>&#x2613;</h1>}
      </div>
      <div className="message">{message}</div>
    </div>
  );
});

export default Snackbar;