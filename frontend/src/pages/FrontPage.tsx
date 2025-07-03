import vit_logo from "../assets/vit_logo.png";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#00ffe0] flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="flex -mt-60 mr-[3vw] py-14">
          <img src={vit_logo} alt="VIT Logo" className="w-44 h-44 mr-10" />

          <div className="flex flex-col">
            <h1 className="text-9xl font-bold leading-none tracking-wider">
              SWC
            </h1>
            <div className="flex text-xl mt-2 space-x-10 ">
              <h1>Student</h1>
              <h1>Welfare</h1>
              <h1>Council</h1>
            </div>
          </div>
        </div>

        <p className="text-4xl font-semibold mt-4 text-[#52e6d4]">
          Club Information Management Portal
        </p>

        <div className="mt-8">
          <button
            className="text-xl text-[#00ffe0] border border-[#00ffe0] rounded-full px-6 py-2 hover:bg-[#00ffe010] transition cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login / Signup
          </button>
        </div>
      </div>
    </div>
  );
}
