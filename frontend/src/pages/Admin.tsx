import { FiLogOut } from "react-icons/fi";
import { Link } from "react-router-dom";
import vit_logo from "../assets/vit_logo.png";
import { useState, useEffect } from "react";
import type { Club,Student,Faculty} from "../../types";

export default function Admin() {

  const handleLogout = () => {
    console.log("User signed out");
  };

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    name: "",
    president: "",
    facultyCoordinator: "",
    description: "",
  });

  const [clubs, setClubs] = useState<Club[]>([]);
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/clubs");
        if (!response.ok) {
          throw new Error("Failed to fetch clubs");
        }
        const data = await response.json();
        setClubs(data);
      } catch (err) {
        console.error("Failed to fetch clubs:", err);
      }
    };

    fetchClubs();
  }, []);

  const [students, setStudents] = useState<Student[]>([]);
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/clubs/getstudents");
        if (!response.ok) {
          throw new Error("Failed to fetch clubs");
        }
        const data = await response.json();
        setStudents(data)
      } catch (err) {
        console.error("Failed to fetch clubs:", err);
      }
    };

    fetchStudents();
  }, []);

  const [faculties, setFaculties] = useState<Faculty[]>([]);
  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/clubs/getfaculties"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch clubs");
        }
        const data = await response.json();
        setFaculties(data);
      } catch (err) {
        console.error("Failed to fetch clubs:", err);
      }
    };

    fetchFaculties();
  }, []);
  

  const [generatedPasswords, setGeneratedPasswords] = useState<{
    president: string;
    coordinator: string;
  } | null>(null);
  
  async function handleSubmit(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> {
    event.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:3001/api/clubs/createClub",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: createFormData.name,
            president: createFormData.president,
            faculty_coordinator: createFormData.facultyCoordinator,
            description: createFormData.description,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create club");
      }

      const data = await response.json();
      const newClub = data.club;

      setGeneratedPasswords(data.passwords); // <-- show the popup
      setClubs((prev) => [...prev, newClub]);
      setShowCreateModal(false);
      setCreateFormData({
        name: "",
        president: "",
        facultyCoordinator: "",
        description: "",
      });
    } catch (err) {
      console.error("Error creating club:", err);
    }
  }
  

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#00ffe0]">
      {/* Header */}
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

      {/* Title */}
      <div className="min-w-screen h-10 p-5 flex items-center justify-center mb-10">
        <span className="text-5xl font-bold pb-12">ADMIN DASHBOARD</span>
      </div>

      {/* Create Button */}
      <div className="flex items-end justify-end mb-5 pr-32">
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-[#00ffe0] text-black font-semibold px-6 py-2 rounded hover:bg-[#00ffe099] transition"
        >
          Create Club
        </button>
      </div>

      {/* Club Table */}
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
              <th className="py-2 px-4 border border-[#0d1117]">
                View / Modify
              </th>
              <th className="py-2 px-4 border border-[#0d1117]">Delete Club</th>
            </tr>
          </thead>
          <tbody>
            {clubs.map((club, index) => (
              <tr key={club.clubid} className="border-t border-[#00ffe0]">
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">{club.name}</td>
                <td className="py-2 px-4">{club.president_name}</td>
                <td className="py-2 px-4">{club.coordinator_name}</td>
                <td className="py-2 px-4">{club.total_members}</td>
                <td className="py-2 px-4">
                  <Link
                    to={`/club/${encodeURIComponent(club.name)}/admin`}
                    className="px-4 py-2 border border-[#00ffe0] rounded-full hover:bg-[#00ffe010] transition text-sm text-center"
                  >
                    Manage
                  </Link>
                </td>
                <td className="py-2 px-4">
                  <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-[#0d1117] border border-cyan-400 p-8 rounded-xl w-full max-w-lg shadow-xl text-white">
            <h2 className="text-2xl font-bold text-cyan-400 mb-6 text-center">
              Create Club
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Club Name"
                value={createFormData.name}
                onChange={(e) =>
                  setCreateFormData({ ...createFormData, name: e.target.value })
                }
                className="w-full p-2 rounded bg-[#1a1f2c] border border-gray-600"
              />

              <select
                value={createFormData.president}
                onChange={(e) =>
                  setCreateFormData({
                    ...createFormData,
                    president: e.target.value,
                  })
                }
                className="w-full p-2 rounded bg-[#1a1f2c] border border-gray-600"
              >
                <option value="">Select President</option>
                {students.map((student) => (
                  <option key={student.regno} value={student.regno}>
                    {student.name}
                  </option>
                ))}
              </select>

              <select
                value={createFormData.facultyCoordinator}
                onChange={(e) =>
                  setCreateFormData({
                    ...createFormData,
                    facultyCoordinator: e.target.value,
                  })
                }
                className="w-full p-2 rounded bg-[#1a1f2c] border border-gray-600"
              >
                <option value="">Select Faculty Coordinator</option>
                {faculties.map((faculty) => (
                  <option key={faculty.empid} value={faculty.empid}>
                    {faculty.name}
                  </option>
                ))}
              </select>

              <textarea
                placeholder="Club Description"
                value={createFormData.description}
                onChange={(e) =>
                  setCreateFormData({
                    ...createFormData,
                    description: e.target.value,
                  })
                }
                rows={3}
                className="w-full p-2 rounded bg-[#1a1f2c] border border-gray-600"
              ></textarea>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-cyan-400 hover:bg-cyan-500 text-black px-4 py-2 rounded"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {generatedPasswords && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg text-black max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4 text-center">
              Passwords Generated
            </h2>
            <p>
              <strong>President Password:</strong>{" "}
              {generatedPasswords.president}
            </p>
            <p>
              <strong>Coordinator Password:</strong>{" "}
              {generatedPasswords.coordinator}
            </p>
            <p className="text-red-600 font-semibold mt-2">
              Please copy these passwords now.
            </p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => setGeneratedPasswords(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )} 
    </div>
  );
}
