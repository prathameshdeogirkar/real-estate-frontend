import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

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

function App() {
  return (
    <BrowserRouter>
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
        <Route path="/admin/add-completed-project" element={<ProtectedRoute><AddCompletedProject /></ProtectedRoute>}/>
        <Route path="/admin/manage-completed-projects" element={<ProtectedRoute><ManageCompletedProjects /></ProtectedRoute>}/>
        <Route path="/admin/manage-inquiries" element={<ProtectedRoute><ManageInquiries /></ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;