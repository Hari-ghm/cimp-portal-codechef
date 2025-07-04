import vit_logo from "../assets/vit_logo.png";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#00ffe0] flex items-center justify-center px-4">
      <div className="flex flex-col items-center w-full">
        {/* Logo + SWC */}
        <div className="flex flex-col sm:flex-col lg:flex-row lg:-mt-60 lg:py-14 items-center justify-center">
          <img
            src={vit_logo}
            alt="VIT Logo"
            className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 mb-4 lg:mb-0 lg:mr-10"
          />

          <div className="flex flex-col items-center lg:items-start">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-bold leading-none tracking-wider">
              SWC
            </h1>
            <div className="flex text-base sm:text-lg md:text-xl mt-2 space-x-4 md:space-x-8 lg:space-x-10">
              <h1>Student</h1>
              <h1>Welfare</h1>
              <h1>Council</h1>
            </div>
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold mt-6 text-[#52e6d4] text-center">
          Club Information Management Portal
        </p>

        {/* Login Button */}
        <div className="mt-8">
          <button
            className="text-base sm:text-lg md:text-xl text-[#00ffe0] border border-[#00ffe0] rounded-full px-6 py-2 hover:bg-[#00ffe010] transition cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login / Signup
          </button>
        </div>
      </div>
    </div>
  );
}
