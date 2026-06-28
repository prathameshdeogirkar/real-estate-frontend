import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "react-hot-toast";
import axios from "axios";

// Intercept 401 errors globally to handle expired or invalid tokens
axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
axios.interceptors.response.use(
  response => response,
  error => {
    console.error("Axios error:", error);
    return Promise.reject(error);
  }
);
import Home from "./pages/Home";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";

import AdminDashboard from "./admin/AdminDashboard";
import AddProperty from "./admin/AddProperty";
import ManageProperties from "./admin/ManageProperties";
import EditProperty from "./admin/EditProperty";
import AddCompletedProject from "./admin/AddCompletedProject";
import ManageCompletedProjects from "./admin/ManageCompletedProjects";
import ManageInquiries from "./admin/ManageInquiries";
import AdminLogin from "./admin/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";

import Constructions from "./pages/Constructions";
import ConstructionDetails from "./pages/ConstructionDetails";
import AddConstruction from "./admin/AddConstruction";
import ManageConstructions from "./admin/ManageConstructions";
import EditConstruction from "./admin/EditConstruction";

import InteriorWorks from "./pages/InteriorWorks";
import InteriorWorkDetails from "./pages/InteriorWorkDetails";
import AddInteriorWork from "./admin/AddInteriorWork";
import ManageInteriorWorks from "./admin/ManageInteriorWorks";
import EditInteriorWork from "./admin/EditInteriorWork";

import GovernmentProjects from "./pages/GovernmentProjects";
import GovernmentProjectDetails from "./pages/GovernmentProjectDetails";
import AddGovernmentProject from "./admin/AddGovernmentProject";
import ManageGovernmentProjects from "./admin/ManageGovernmentProjects";
import EditGovernmentProject from "./admin/EditGovernmentProject";
import ManageReviews from "./admin/ManageReviews";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/property/:id" element={<PropertyDetails />} />

        <Route path="/admin-login" element={<AdminLogin />} />

        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/add-property" element={<ProtectedRoute><AddProperty /></ProtectedRoute>} />
        <Route path="/admin/manage-properties" element={<ProtectedRoute><ManageProperties /></ProtectedRoute>} />
        <Route path="/admin/edit-property/:id" element={<ProtectedRoute><EditProperty /></ProtectedRoute>}/>
        
        {/* Constructions */}
        <Route path="/construction" element={<Constructions />} />
        <Route path="/construction/:id" element={<ConstructionDetails />} />
        <Route path="/admin/add-construction" element={<ProtectedRoute><AddConstruction /></ProtectedRoute>} />
        <Route path="/admin/manage-constructions" element={<ProtectedRoute><ManageConstructions /></ProtectedRoute>} />
        <Route path="/admin/edit-construction/:id" element={<ProtectedRoute><EditConstruction /></ProtectedRoute>} />

        {/* Interior Works */}
        <Route path="/interior-work" element={<InteriorWorks />} />
        <Route path="/interior-work/:id" element={<InteriorWorkDetails />} />
        <Route path="/admin/add-interior-work" element={<ProtectedRoute><AddInteriorWork /></ProtectedRoute>} />
        <Route path="/admin/manage-interior-works" element={<ProtectedRoute><ManageInteriorWorks /></ProtectedRoute>} />
        <Route path="/admin/edit-interior-work/:id" element={<ProtectedRoute><EditInteriorWork /></ProtectedRoute>} />

        {/* Government Projects */}
        <Route path="/government-projects" element={<GovernmentProjects />} />
        <Route path="/government-projects/:id" element={<GovernmentProjectDetails />} />
        <Route path="/admin/add-government-project" element={<ProtectedRoute><AddGovernmentProject /></ProtectedRoute>} />
        <Route path="/admin/manage-government-projects" element={<ProtectedRoute><ManageGovernmentProjects /></ProtectedRoute>} />
        <Route path="/admin/edit-government-project/:id" element={<ProtectedRoute><EditGovernmentProject /></ProtectedRoute>} />

        <Route path="/admin/add-completed-project" element={<ProtectedRoute><AddCompletedProject /></ProtectedRoute>}/>
        <Route path="/admin/manage-completed-projects" element={<ProtectedRoute><ManageCompletedProjects /></ProtectedRoute>}/>
        <Route path="/admin/manage-inquiries" element={<ProtectedRoute><ManageInquiries /></ProtectedRoute>}/>
        <Route path="/admin/manage-reviews" element={<ProtectedRoute><ManageReviews /></ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;