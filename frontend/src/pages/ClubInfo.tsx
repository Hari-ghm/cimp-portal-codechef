import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import vit_logo from "../assets/vit_logo.png";
import codechef_logo from "../assets/codechef_logo.png";
import type { Club, Faculty, Student,ClubMember } from "../../types";

export default function ClubInfo() {
  const { club_id, role } = useParams();
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);


  const [club, setClub] = useState<Club | null>(null);

  const fetchClub = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/clubs/getparticularclub/${club_id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch club");
      }
      const data = await response.json();
      setClub(data);
    } catch (err) {
      console.error("Failed to fetch club:", err);
    }
  };

  useEffect(() => {
    fetchClub();
  }, [club_id]);
  
  const [memberFormData, setMemberFormData] = useState({
    name: "",
    regNo: "",
  });

  const [editData, setEditData] = useState({
    president: club?.president_name,
    facultyCoordinator: club?.faculty_coordinator_empid,
    description: club?.description,
  });

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
    }, []
  );

   const [members, setMembers] = useState<ClubMember[]>([]);
   const fetchMembers = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/clubs/members/${club_id}`
        );
        if (!response.ok) throw new Error("Failed to fetch members");
        const data = await response.json();
        setMembers(data);
      } catch (err) {
        console.error("Error fetching members:", err);
      }
    };

    useEffect(() => {
      fetchMembers();
    }, [club_id]
  );

  const handleAddMemberSubmit = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/clubs/addmember",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            regno: memberFormData.regNo,
            club_id: club_id, 
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to add member");

      const data = await response.json();
      console.log("Member added:", data);

      setShowMemberModal(false);
      setMemberFormData({ name: "", regNo: "" });

       fetchMembers();
    } catch (err) {
      console.error("Error adding member:", err);
    }
  };
  
  const handleDeleteMember = async (regno: string) => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/clubs/deletemember",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ regno, club_id }), // club_id should come from state or props
        }
      );

      if (!response.ok) throw new Error("Failed to delete member");

      const data = await response.json();
      window.alert("Deleted member successfully");

      
       fetchMembers();
    } catch (err) {
      console.error("Error deleting member:", err);
    }
  };
  
  const handleEditSubmit = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/clubs/editClub",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            club_id: club_id,
            newPresident: editData.president,
            newCoordinator: editData.facultyCoordinator,
            newDescription: editData.description,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update club");

      const data = await response.json();

      if (
        data.passwords &&
        (data.passwords.president || data.passwords.coordinator)
      ) {
        setUpdatedPasswords(data.passwords); // Trigger modal
      }

      console.log("Club updated successfully:", data);

      fetchClub();
      fetchMembers();
    } catch (err) {
      console.error("Error updating club:", err);
    }
  };
  
  
  const [updatedPasswords, setUpdatedPasswords] = useState<{
    president?: string;
    coordinator?: string;
  } | null>(null);
  

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#00ffe0]">
      {/* Header */}
      <div className="w-full h-28 p-5 flex justify-between items-center">
        <div className="flex items-center">
          <img src={vit_logo} className="w-20 h-20" />
          <div className="text-3xl font-bold tracking-wide text-teal-50 px-3">
            CIMP
          </div>
        </div>
      </div>

      {/* Club Name */}
      <div className="w-full h-10 p-5 flex items-center justify-center -mt-4">
        <span className="text-5xl font-bold pb-12 capitalize">
          {club?.name}
        </span>
      </div>

      {/* Club Info Card */}
      <div className="flex justify-center mb-8">
        {/* Main Info */}
        <div className="bg-transparent border-4 border-amber-400 w-full max-w-xl h-48 rounded-2xl shadow-lg flex items-center px-6">
          <div className="flex-shrink-0">
            <img
              src={codechef_logo}
              className="w-32 h-32 rounded-full object-cover border-4 border-white"
              alt="Club Logo"
            />
          </div>
          <div className="ml-10 text-left text-white space-y-2 text-lg">
            <p>
              <span className="font-semibold text-amber-300">President:</span>{" "}
              {club?.president_name}
            </p>
            <p>
              <span className="font-semibold text-amber-300">
                Faculty Coordinator:
              </span>{" "}
              {club?.coordinator_name}
            </p>
            <p>
              <span className="font-semibold text-amber-300">
                Total Members:
              </span>{" "}
              {club?.total_members}
            </p>
            <p>
              <span className="font-semibold text-amber-300">Created On:</span>{" "}
              {club?.created_on
                ? club.created_on.slice(0, 10).split("-").reverse().join("-")
                : ""}
            </p>
          </div>
        </div>

        {/* Description Box */}
        <div className="bg-transparent border-4 border-amber-400 w-72 h-48 rounded-2xl shadow-lg ml-5 p-3 text-xl text-white">
          {club?.description}
        </div>
      </div>

      <div className="flex justify-end max-w-6xl w-full mx-auto mb-4">
        {role === "admin" && (
          <button
            onClick={() => setShowEditModal(true)}
            className="bg-cyan-400 text-black font-semibold px-6 py-2 rounded-lg hover:bg-cyan-300 transition duration-200 mr-5"
          >
            Edit Club Details
          </button>
        )}

        {(role === "admin" || role === "president") && (
          <button
            onClick={() => setShowMemberModal(true)}
            className="bg-cyan-400 text-black font-semibold px-6 py-2 rounded-lg hover:bg-cyan-300 transition duration-200"
          >
            + Add Member
          </button>
        )}
      </div>

      {/* Members Table */}
      <div className="flex justify-center">
        <table className="w-11/12 max-w-6xl text-center text-white border border-[#00ffe0]">
          <thead className="bg-[#00ffe0] text-black">
            <tr>
              <th className="py-2 px-4 border border-[#0d1117]">S. No</th>
              <th className="py-2 px-4 border border-[#0d1117]">Member Name</th>
              <th className="py-2 px-4 border border-[#0d1117]">Reg No</th>
              <th className="py-2 px-4 border border-[#0d1117]">D.O.J</th>
              <th className="py-2 px-4 border border-[#0d1117]">Delete</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr key={member.regno} className="border-t border-[#00ffe0]">
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">{member.name}</td>
                <td className="py-2 px-4">{member.regno}</td>
                <td className="py-2 px-4">
                  {member?.joined_on
                    ? member.joined_on
                        .slice(0, 10)
                        .split("-")
                        .reverse()
                        .join("-")
                    : ""}
                </td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleDeleteMember(member.regno)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Member Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-[#0d1117] border border-cyan-400 p-8 rounded-xl w-full max-w-md shadow-xl text-white">
            <h2 className="text-2xl font-bold text-cyan-400 mb-6 text-center">
              Add Member
            </h2>

            <div className="space-y-4">
              <select
                value={memberFormData.name}
                onChange={(e) => {
                  const selectedName = e.target.value;
                  const selectedStudent = students.find(
                    (s) => s.name === selectedName
                  );
                  setMemberFormData({
                    name: selectedName,
                    regNo: selectedStudent?.regno || "",
                  });
                }}
                className="w-full p-2 rounded bg-[#1a1f2c] border border-gray-600"
              >
                <option value="">Select Name</option>
                {students.map((student, index) => (
                  <option key={index} value={student.name}>
                    {student.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Reg. No"
                value={memberFormData.regNo}
                disabled
                className="w-full p-2 rounded bg-[#1a1f2c] border border-gray-600 opacity-70 cursor-not-allowed"
              />
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                onClick={() => setShowMemberModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-cyan-400 hover:bg-cyan-500 text-black px-4 py-2 rounded"
                onClick={handleAddMemberSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Club Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-[#0d1117] border border-cyan-400 p-8 rounded-xl w-full max-w-lg shadow-xl text-white">
            <h2 className="text-2xl font-bold text-cyan-400 mb-6 text-center">
              Edit Club Details
            </h2>

            <div className="space-y-4">
              {/* President Dropdown */}
              <select
                value={editData.president}
                onChange={(e) =>
                  setEditData({ ...editData, president: e.target.value })
                }
                className="w-full p-2 rounded bg-[#1a1f2c] border border-gray-600"
              >
                <option value="">{club?.president_name}</option>
                {students.map((student) => (
                  <option key={student.regno} value={student.regno}>
                    {student.name}
                  </option>
                ))}
              </select>

              {/* Faculty Coordinator Dropdown */}
              <select
                value={editData.facultyCoordinator}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    facultyCoordinator: Number(e.target.value),
                  })
                }
                className="w-full p-2 rounded bg-[#1a1f2c] border border-gray-600"
              >
                <option value="">{club?.coordinator_name}</option>
                {faculties.map((faculty) => (
                  <option key={faculty.empid} value={faculty.empid}>
                    {faculty.name}
                  </option>
                ))}
              </select>

              {/* Description */}
              <textarea
                rows={3}
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                className="w-full p-2 rounded bg-[#1a1f2c] border border-gray-600"
                placeholder="Club Description"
              >
                {club?.description}
              </textarea>
            </div>

            {/* Modal Action Buttons */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-cyan-400 hover:bg-cyan-500 text-black px-4 py-2 rounded"
                onClick={handleEditSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {updatedPasswords && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-black">
            <h2 className="text-xl font-bold mb-4 text-center">
              New Credentials
            </h2>

            {updatedPasswords.president && (
              <div className="mb-2">
                <strong>President Password:</strong>{" "}
                {updatedPasswords.president}
              </div>
            )}

            {updatedPasswords.coordinator && (
              <div className="mb-2">
                <strong>Coordinator Password:</strong>{" "}
                {updatedPasswords.coordinator}
              </div>
            )}

            <div className="text-sm text-red-500 mt-4">
              Please copy these passwords safely. You won't see them again.
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setUpdatedPasswords(null)}
                className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600"
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
