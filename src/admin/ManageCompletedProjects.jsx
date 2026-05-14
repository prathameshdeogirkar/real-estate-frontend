import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Trash2, Plus, ArrowLeft, Building2 } from "lucide-react";
import { motion } from "framer-motion";

function ManageCompletedProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/completed-projects");
      setProjects(res.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`http://localhost:5000/api/completed-projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Project Deleted Successfully");
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Error deleting project");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <Link 
              to="/admin" 
              className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-4 group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-600">
                <Building2 size={24} />
              </div>
              <h1 className="text-4xl font-serif font-bold text-gray-900">Manage Completed Projects</h1>
            </div>
          </div>

          <Link
            to="/admin/add-completed-project"
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-200"
          >
            <Plus size={18} /> Add New Project
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-12 text-center border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">No completed projects found. Start by adding one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full text-xs font-bold text-gray-700 shadow-sm">
                      {project.year}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-serif font-bold text-gray-900 mb-2">{project.title}</h2>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-6 font-light">
                    {project.description}
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all duration-300"
                    >
                      <Trash2 size={16} /> Delete Project
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageCompletedProjects;
