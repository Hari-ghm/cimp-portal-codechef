import { FiLogOut } from "react-icons/fi";
import ClubCard from "../components/ClubCard";
import vit_logo from "../assets/vit_logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Club } from "../../types";

export default function FacultyCoordinator() {
  const location = useLocation();
  const empid = location.state?.empid; // ✅ use empid
  const navigate = useNavigate();

  const [clubs, setClubs] = useState<Club[]>([]);

  const fetchClubsForCoordinator = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/clubs/coordinatorClubs/${empid}` // ✅ new endpoint
      );
      if (!response.ok) throw new Error("Failed to fetch clubs");
      const data = await response.json();
      setClubs(data);
    } catch (err) {
      console.error("Error fetching coordinator clubs:", err);
    }
  };

  useEffect(() => {
    if (empid) {
      fetchClubsForCoordinator();
    }
  }, [empid]);

  const handleLogout = () => {
    console.log("User signed out");
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#00ffe0]">
      <div className="min-w-screen h-28 p-5 flex justify-between items-center">
        <div className="flex items-center">
          <img src={vit_logo} className="w-20 h-20" />
          <div className="text-3xl font-bold tracking-wide text-teal-50 px-3">
            CIMP
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="text-[#00ffe0] hover:text-red-400 transition text-3xl mr-10"
          title="Sign Out"
        >
          <FiLogOut />
        </button>
      </div>

      <div className="min-w-screen h-10 p-5 flex items-center justify-center mb-10">
        <span className="text-5xl font-bold pb-12">
          FACULTY COORDINATOR DASHBOARD
        </span>
      </div>

      <div className="flex flex-wrap justify-center gap-8 px-10">
        {clubs.map((club) => (
          <ClubCard
            key={club.club_id}
            clubId={club.club_id}
            clubName={club.name}
            memberCount={club.total_members}
            role="faculty_coordinator" // ✅ correct role
          />
        ))}
      </div>
    </div>
  );
}
