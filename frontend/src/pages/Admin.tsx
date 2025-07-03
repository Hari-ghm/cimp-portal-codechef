import { FiLogOut } from "react-icons/fi";
import vit_logo from "../assets/vit_logo.png";

export default function Admin() {
    const handleLogout = () => {
      // perform logout logic here
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
        <span className="text-5xl font-bold pb-12">ADMIN DASHBOARD</span>
      </div>
      <div className="flex items-end justify-end mb-5 pr-32">
        <button className="bg-[#00ffe0] text-black font-semibold px-6 py-2 rounded hover:bg-[#00ffe099] transition">
          Create Club
        </button>
      </div>

      <div className="flex justify-center">
        <table className="w-11/12 text-center text-white border border-[#00ffe0]">
          <thead className="bg-[#00ffe0] text-black">
            <tr>
              <th className="py-2 px-4 border border-[#0d1117]">S. No</th>
              <th className="py-2 px-4 border border-[#0d1117]">Club Name</th>
              <th className="py-2 px-4 border border-[#0d1117]">President</th>
              <th className="py-2 px-4 border border-[#0d1117]">
                Faculty Coordinator
              </th>
              <th className="py-2 px-4 border border-[#0d1117]">
                No. of Students
              </th>
              <th className="py-2 px-4 border border-[#0d1117] ">
                View / Modify
              </th>
              <th className="py-2 px-4 border border-[#0d1117]">Delete</th>
            </tr>
          </thead>
          <tbody>
            {/* Example row */}
            <tr className="border-t border-[#00ffe0]">
              <td className="py-2 px-4">1</td>
              <td className="py-2 px-4">CodeChef</td>
              <td className="py-2 px-4">John Doe</td>
              <td className="py-2 px-4">Dr. Smith</td>
              <td className="py-2 px-4">42</td>
              <td className="py-2 px-4">
                <button className="bg-amber-400 text-black px-3 py-1 rounded cursor-pointer">
                  View / Modify
                </button>
              </td>
              <td className="py-2 px-4">
                <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
