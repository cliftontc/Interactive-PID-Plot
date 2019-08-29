import React from "react";
import ReactDOM from "react-dom";
import PidPlot from "./visualizations/PidPlot"
import "./styles.css";

function App() {
  return (
    <div className="App">
      <h1>Interactive PID Controller</h1>
      <h2>Start editing to see some magic happen!</h2>
      <PidPlot/>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
