import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

function ManageGovernmentProjects() {
  const [governmentProjects, setGovernmentProjects] = useState([]);

  useEffect(() => {
    fetchGovernmentProjects();
  }, []);

  const fetchGovernmentProjects = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/government-projects`
      );

      setGovernmentProjects(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  const deleteGovernmentProject = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/government-projects/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("GovernmentProject Deleted");
      fetchGovernmentProjects();

    } catch (error) {
      console.log(error);
      toast.error("Error deleting government-project");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-4xl font-bold mb-10">
        Manage GovernmentProjects
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {governmentProjects.map((governmentProject) => (
          <div
            key={governmentProject.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >

            <img
              src={governmentProject.image}
              alt={governmentProject.title}
              className="w-full h-60 object-cover"
            />

            <div className="p-5">

              <h2 className="text-2xl font-bold">
                {governmentProject.title}
              </h2>

              <p className="text-gray-600 mt-2">
                {governmentProject.type}
              </p>

              <p className="text-xl font-semibold mt-2">
                ₹ {governmentProject.price}
              </p>

              <div className="flex gap-3 mt-5">

                <Link
                  to={`/admin/edit-government-project/${governmentProject.id}`}
                  className="bg-blue-600 text-white px-5 py-2 rounded"
                >
                  Edit
                </Link>

                <button
                  onClick={() => deleteGovernmentProject(governmentProject.id)}
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

export default ManageGovernmentProjects;