import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

function ManageConstructions() {
  const [constructions, setConstructions] = useState([]);

  useEffect(() => {
    fetchConstructions();
  }, []);

  const fetchConstructions = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/constructions`
      );

      setConstructions(res.data);

    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteConstruction = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/constructions/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Construction Deleted");
      fetchConstructions();

    } catch (error) {
      console.error("Error:", error);
      toast.error("Error deleting construction");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-4xl font-bold mb-10">
        Manage Constructions
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {constructions.map((construction) => (
          <div
            key={construction.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >

            <img
              src={construction.image}
              alt={construction.title}
              className="w-full h-60 object-cover"
            />

            <div className="p-5">

              <h2 className="text-2xl font-bold">
                {construction.title}
              </h2>

              <p className="text-gray-600 mt-2">
                {construction.project_type}
              </p>

              <p className="text-xl font-semibold mt-2">
                Budget: {construction.budget}
              </p>

              <div className="flex gap-3 mt-5">

                <Link
                  to={`/admin/edit-construction/${construction.id}`}
                  className="bg-blue-600 text-white px-5 py-2 rounded"
                >
                  Edit
                </Link>

                <button
                  onClick={() => deleteConstruction(construction.id)}
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

export default ManageConstructions;