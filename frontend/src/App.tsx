import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import FrontPage from "./pages/FrontPage";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import President from "./pages/President";
import FacultyCoordinator from "./pages/FacultyCoordinator";
import ClubInfo from "./pages/ClubInfo";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/president" element={<President />} />
        <Route path="/faculty-coordinator" element={<FacultyCoordinator />} />
        <Route path="/club/:club_id/:role" element={<ClubInfo />} />
      </Routes>
    </Router>
  );
}

export default App;
