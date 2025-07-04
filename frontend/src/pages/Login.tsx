import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [role, setRole] = useState("admin");
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: any) => {
    e.preventDefault();

    try {
      const res = await fetch("https://cimp-backend.onrender.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      if (role === "admin") {
        navigate("/admin");
      } else if (role === "president") {
        navigate("/president", { state: { regno: userid } });
      } else if (role === "faculty") {
        navigate("/faculty-coordinator", { state: { empid: userid } });
      }

      setPassword("");
      setUserid("");
    } catch (err) {
      console.error("Login Error:", err);
      alert("Server error. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#00ffe0] flex items-center justify-center px-4">
      <div className="w-full max-w-[98vh] h-auto lg:h-[80vh] bg-transparent border-[#f0aa29] border-2 rounded-xl p-6 shadow-md flex flex-col items-center">
        <div className="text-3xl sm:text-4xl mb-10 mt-4 font-bold">LOGIN</div>

        {/* Role selector */}
        <div className="w-full max-w-[44vh] h-[6vh] bg-transparent border-[#00ffe0] border-2 rounded-xl p-1 shadow-md flex justify-between mb-6 text-sm sm:text-base">
          {["admin", "president", "faculty"].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 text-center rounded-xl ${
                role === r
                  ? "bg-[#00ffe0] text-black font-bold"
                  : "hover:bg-[#00ffe010]"
              }`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        {/* Login form */}
        <form
          onSubmit={handleLogin}
          className="flex flex-col space-y-4 w-full max-w-[60vh]"
        >
          <label className="text-left text-base sm:text-lg">
            {role === "president" ? "Registration Number" : "Employee ID"}
          </label>
          <input
            type="text"
            value={userid}
            onChange={(e) => setUserid(e.target.value)}
            placeholder={
              role === "president" ? "Enter Reg No." : "Enter Employee ID"
            }
            className="p-2 rounded bg-[#0d1117] border border-[#00ffe0] text-white"
            required
          />

          <label className="text-left text-base sm:text-lg">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            className="p-2 rounded bg-[#0d1117] border border-[#00ffe0] text-white"
            required
          />

          <button
            type="submit"
            className="mt-4 py-2 bg-[#00ffe0] text-black font-semibold rounded hover:bg-[#00ffe099] transition"
          >
            Login
          </button>
        </form>

        <div className="mt-8 text-sm sm:text-base text-left w-full max-w-[60vh]">
          Don't have an account??
        </div>
      </div>
    </div>
  );
}
