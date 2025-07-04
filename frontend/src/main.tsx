// frontend/src/main.tsx
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import React from "react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename="/cimp-portal-codechef/">
      {" "}
      {/* ✅ Important fix */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
