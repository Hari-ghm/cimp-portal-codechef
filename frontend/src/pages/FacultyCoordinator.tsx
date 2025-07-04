import { FiLogOut } from "react-icons/fi";
import ClubCard from "../components/ClubCard";
import vit_logo from "../assets/vit_logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Club } from "../../types";

export default function FacultyCoordinator() {
  const location = useLocation();
  const empid = location.state?.empid;
  const navigate = useNavigate();

  const [clubs, setClubs] = useState<Club[]>([]);

  const fetchClubsForCoordinator = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/clubs/coordinatorClubs/${empid}`
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
      {/* Header */}
      <div className="w-full h-28 px-5 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <img src={vit_logo} className="w-20 h-20" />
          <div className="text-3xl font-bold tracking-wide text-teal-50 px-3">
            CIMP
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="text-[#00ffe0] hover:text-red-400 transition text-3xl"
          title="Sign Out"
        >
          <FiLogOut />
        </button>
      </div>

      {/* Title */}
      <div className="w-full p-5 flex items-center justify-center mb-6">
        <span className="text-2xl md:text-5xl font-bold md:-mt-10">
          FACULTY COORDINATOR DASHBOARD
        </span>
      </div>

      {/* Club Cards */}
      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 px-4 sm:px-8">
        {clubs.map((club) => (
          <ClubCard
            key={club.club_id}
            clubId={club.club_id}
            clubName={club.name}
            memberCount={club.total_members}
            role="faculty_coordinator"
          />
        ))}
      </div>
    </div>
  );
}
