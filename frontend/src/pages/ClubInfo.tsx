import { useParams } from "react-router-dom";
import { useState } from "react";
import vit_logo from "../assets/vit_logo.png";
import codechef_logo from "../assets/codechef_logo.png";

export default function ClubInfo() {
  const { clubName, role } = useParams();

  // Club Details Object
  const clubDetails = {
    president: "Aryan Singh",
    facultyCoordinator: "Dr. Meena Iyer",
    totalMembers: 42,
    createdOn: "2022-01-15", // Must be in YYYY-MM-DD for input[type=date]
    description: "Hi this is club",
  };

  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [memberFormData, setMemberFormData] = useState({
    name: "",
    regNo: "",
    doj: "",
  });

  const [editData, setEditData] = useState({
    president: clubDetails.president,
    facultyCoordinator: clubDetails.facultyCoordinator,
    createdOn: clubDetails.createdOn,
    description: clubDetails.description,
  });

  const presidents = ["Aryan Singh", "John Doe", "Priya Sharma"];
  const facultyCoordinators = [
    "Dr. Meena Iyer",
    "Prof. Rakesh Nair",
    "Dr. Kavita Rao",
  ];

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
        <span className="text-5xl font-bold pb-12 capitalize">{clubName}</span>
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
              {clubDetails.president}
            </p>
            <p>
              <span className="font-semibold text-amber-300">
                Faculty Coordinator:
              </span>{" "}
              {clubDetails.facultyCoordinator}
            </p>
            <p>
              <span className="font-semibold text-amber-300">
                Total Members:
              </span>{" "}
              {clubDetails.totalMembers}
            </p>
            <p>
              <span className="font-semibold text-amber-300">Created On:</span>{" "}
              {clubDetails.createdOn}
            </p>
          </div>
        </div>

        {/* Description Box */}
        <div className="bg-transparent border-4 border-amber-400 w-72 h-48 rounded-2xl shadow-lg ml-5 p-3 text-xl text-white">
          {clubDetails.description}
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
            <tr className="border-t border-[#00ffe0]">
              <td className="py-2 px-4">1</td>
              <td className="py-2 px-4">John Doe</td>
              <td className="py-2 px-4">45261</td>
              <td className="py-2 px-4">12 / 01 / 24</td>
              <td className="py-2 px-4">
                <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer">
                  Delete
                </button>
              </td>
            </tr>
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
              <input
                type="text"
                placeholder="Name"
                value={memberFormData.name}
                onChange={(e) =>
                  setMemberFormData({ ...memberFormData, name: e.target.value })
                }
                className="w-full p-2 rounded bg-[#1a1f2c] border border-gray-600"
              />
              <input
                type="text"
                placeholder="Reg. No"
                value={memberFormData.regNo}
                onChange={(e) =>
                  setMemberFormData({
                    ...memberFormData,
                    regNo: e.target.value,
                  })
                }
                className="w-full p-2 rounded bg-[#1a1f2c] border border-gray-600"
              />
              <input
                type="date"
                value={memberFormData.doj}
                onChange={(e) =>
                  setMemberFormData({
                    ...memberFormData,
                    doj: e.target.value,
                  })
                }
                className="w-full p-2 rounded bg-[#1a1f2c] border border-gray-600"
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
                onClick={() => {
                  console.log("Submitted member:", memberFormData);
                  // submit logic
                }}
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
                <option value="">Select President</option>
                {presidents.map((pres, idx) => (
                  <option key={idx} value={pres}>
                    {pres}
                  </option>
                ))}
              </select>

              {/* Faculty Coordinator Dropdown */}
              <select
                value={editData.facultyCoordinator}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    facultyCoordinator: e.target.value,
                  })
                }
                className="w-full p-2 rounded bg-[#1a1f2c] border border-gray-600"
              >
                <option value="">Select Faculty Coordinator</option>
                {facultyCoordinators.map((fac, idx) => (
                  <option key={idx} value={fac}>
                    {fac}
                  </option>
                ))}
              </select>

              {/* Created On (Date) */}
              <input
                type="date"
                value={editData.createdOn}
                onChange={(e) =>
                  setEditData({ ...editData, createdOn: e.target.value })
                }
                className="w-full p-2 rounded bg-[#1a1f2c] border border-gray-600"
              />

              {/* Description */}
              <textarea
                rows={3}
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                className="w-full p-2 rounded bg-[#1a1f2c] border border-gray-600"
                placeholder="Club Description"
              ></textarea>
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
                onClick={() => {
                  console.log("Updated club data:", editData);
                  // Optional: Submit to backend
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
