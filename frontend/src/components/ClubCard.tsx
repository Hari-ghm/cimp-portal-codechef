import { Link } from "react-router-dom";

interface ClubCardProps {
  logo: string;
  clubName: string;
  memberCount: number;
  role: string;
  onClick: () => void;
}

export default function ClubCard({
  logo,
  clubName,
  memberCount,
  role,
}: ClubCardProps) {
  return (
    <div className="w-64 bg-[#121821] border border-[#00ffe0] rounded-xl p-4 shadow-lg">
      <div className="flex flex-col items-center">
        <img
          src={logo}
          alt="Club Logo"
          className="w-24 h-24 rounded-full mb-4 border-2 border-[#00ffe0]"
        />
        <h2 className="text-xl font-semibold mb-2">{clubName}</h2>
        <div className="flex items-center gap-2 text-sm mb-4">
          <span className="text-[#00ffe0]">👥</span>
          <span>{memberCount} Members</span>
        </div>
        <Link
          to={`/club/${encodeURIComponent(clubName)}/${role}`}
          className="px-4 py-2 border border-[#00ffe0] rounded-full hover:bg-[#00ffe010] transition text-sm text-center"
        >
          {role === "president"
            ? "Manage"
            : role === "faculty_coordinator"
            ? "View"
            : "Open"}
        </Link>
      </div> 
    </div>
  );
}
