import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

function ManageInteriorWorks() {
  const [interiorWorks, setInteriorWorks] = useState([]);

  useEffect(() => {
    fetchInteriorWorks();
  }, []);

  const fetchInteriorWorks = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/interior-works`
      );

      setInteriorWorks(res.data);

    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteInteriorWork = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/interior-works/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("InteriorWork Deleted");
      fetchInteriorWorks();

    } catch (error) {
      console.error("Error:", error);
      toast.error("Error deleting interior-work");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-4xl font-bold mb-10">
        Manage InteriorWorks
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {interiorWorks.map((interiorWork) => (
          <div
            key={interiorWork.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >

            <img
              src={interiorWork.image}
              alt={interiorWork.title}
              className="w-full h-60 object-cover"
            />

            <div className="p-5">

              <h2 className="text-2xl font-bold">
                {interiorWork.title}
              </h2>

              <p className="text-gray-600 mt-2">
                {interiorWork.type}
              </p>

              <p className="text-xl font-semibold mt-2">
                ₹ {interiorWork.price}
              </p>

              <div className="flex gap-3 mt-5">

                <Link
                  to={`/admin/edit-interior-work/${interiorWork.id}`}
                  className="bg-blue-600 text-white px-5 py-2 rounded"
                >
                  Edit
                </Link>

                <button
                  onClick={() => deleteInteriorWork(interiorWork.id)}
                  className="bg-red-500 text-white px-5 py-2 rounded"
                >
                  Delete
                </button>

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default ManageInteriorWorks;