import { Home as HomeIcon } from "lucide-react";

function Loader() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-50 to-white">

      <div className="text-center">

        <div className="relative inline-flex items-center justify-center mb-8">

          <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>

          <HomeIcon className="absolute w-8 h-8 text-blue-600" />

        </div>

        <p className="text-gray-600 text-lg font-semibold">Loading properties...</p>
        <p className="text-gray-400 text-sm mt-2">Please wait a moment</p>

      </div>

    </div>
  );
}

export default Loader;