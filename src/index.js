import React, { Component } from "react";
import { createRoot } from "react-dom/client";
import "react-quill/dist/quill.snow.css";
import "./styles.css";
import App from "./App";
import "/node_modules/bootstrap/dist/css/bootstrap.min.css";

const root = createRoot(document.getElementById("root"));
root.render(<App />);
