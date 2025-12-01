import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";    

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">

       
      <Navbar />

      
      <div className="flex-1 p-8 overflow-y-auto">
        <Outlet />        
      </div>

    </div>
  );
};

export default AdminLayout;
