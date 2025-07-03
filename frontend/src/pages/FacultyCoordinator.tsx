import { FiLogOut } from "react-icons/fi";
import ClubCard from "../components/ClubCard";
import vit_logo from "../assets/vit_logo.png";
import cyscom_logo from "../assets/cyscom_logo.jpeg";
import codechef_logo from "../assets/codechef_logo.png"

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
        logo: cyscom_logo,
      },
      {
        clubName: "Cyscom",
        memberCount: 30,
        logo: codechef_logo,
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
