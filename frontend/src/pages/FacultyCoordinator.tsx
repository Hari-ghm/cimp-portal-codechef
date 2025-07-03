import { FiLogOut } from "react-icons/fi";
import ClubCard from "../components/ClubCard";
import vit_logo from "../assets/vit_logo.png";

export default function FacultyCoordinator() {
    const handleLogout = () => {
      // perform logout logic here
      console.log("User signed out");
    };

    const handleViewModify = (clubName: string) => {
      console.log("View/Modify clicked for", clubName);
      // navigate or open modal etc.
    };

    const clubs = [
      {
        clubName: "Code chef",
        memberCount: 42,
        logo: "data:image/png;base64,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",
      },
      {
        clubName: "Cyscom",
        memberCount: 30,
        logo: "https://media.licdn.com/dms/image/v2/C560BAQHxcM6K7-zmng/company-logo_200_200/company-logo_200_200/0/1661604666240/cyscomvit_logo?e=1756944000&v=beta&t=AvTdutghML68zjWjnQWBXmpgo5iVJ5zWnoDtf2EWpss",
      },
    ];

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
        <span className="text-5xl font-bold pb-12">FACULTY COORDINATOR DASHBOARD</span>
      </div>

      <div className="flex flex-wrap justify-center gap-8 px-10">
              {clubs.map((club) => (
                <ClubCard
                  key={club.clubName}
                  logo={club.logo}
                  clubName={club.clubName}
                  memberCount={club.memberCount}
                  role="faculty_coordinator"
                  onClick={() => handleViewModify(club.clubName)}

                />
              ))}
        </div>
      
    </div>
  );
}
