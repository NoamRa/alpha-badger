import * as React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./Components/App";
import "./styles.css";

function renderRoot(id: string) {
  const container = document.getElementById(id);
  if (container === null) {
    console.error(`Failed to find element with ID '${id}'`);
  } else {
    const root = createRoot(container);
    root.render(<App />);
  }
}

renderRoot("alpha-badger-app");
