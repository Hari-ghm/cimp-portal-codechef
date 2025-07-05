import { FiLogOut } from "react-icons/fi";
import ClubCard from "../components/ClubCard";
import vit_logo from "../assets/vit_logo.png";
import { useLocation, } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Club } from "../../types";

export default function President() {
  const location = useLocation();
  const regno = location.state?.regno;
  const [clubs, setClubs] = useState<Club[]>([]);

  const fetchClubsForPresident = async () => {
    try {
      const response = await fetch(
        `https://cimp-backend.onrender.com/api/clubs/presidentClubs/${regno}`
      );
      if (!response.ok) throw new Error("Failed to fetch clubs");
      const data = await response.json();
      setClubs(data);
    } catch (err) {
      console.error("Error fetching president clubs:", err);
    }
  };

  useEffect(() => {
    if (regno){
    fetchClubsForPresident();
    }
  }, [regno]);

  const handleLogout = () => {
    console.log("User signed out");
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#00ffe0] flex flex-col">
      {/* Header */}
      <div className="w-full flex flex-col md:flex-row justify-between items-center p-4 md:p-6">
        <div className="flex items-center mb-4 md:mb-0">
          <img src={vit_logo} className="w-16 h-16 md:w-20 md:h-20" />
          <div className="text-2xl md:text-3xl font-bold tracking-wide text-teal-50 px-3">
            CIMP
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="text-[#00ffe0] hover:text-red-400 transition text-2xl md:text-3xl"
          title="Sign Out"
        >
          <FiLogOut />
        </button>
      </div>

      {/* Title */}
      <div className="text-center py-6">
        <h1 className="text-2xl md:text-5xl font-bold md:-mt-10">PRESIDENT DASHBOARD</h1>
      </div>

      {/* Centered Cards */}
      <div className="flex flex-wrap justify-center gap-8 px-4 pb-10">
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
