import React from "react";
import ReactDOM from "react-dom";

const rootEl = document.getElementById("app-site");

// Create a reusable render method that we can call more than once
const render = () => {
  // Dynamically import our main App component, and render it
  const MainApp = require("./MainApp").default;
  ReactDOM.render(<MainApp />, rootEl);
};

render();
