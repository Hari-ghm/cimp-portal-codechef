// frontend/src/main.tsx
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import React from "react";


const redirectPath = sessionStorage.getItem("redirectPath");
if (redirectPath) {
  sessionStorage.removeItem("redirectPath");
  window.history.replaceState(null, "", redirectPath);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename="/cimp-portal-codechef/">
      {" "}
      {/* ✅ Important fix */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
