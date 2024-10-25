import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth, Driver } from "@/layouts";
import { UserProvider } from "./context/UserContext";
import { useState } from "react";

function App() {
  const [user,setUser]=useState("driver");

  return (
    <UserProvider>
      {user==="admin" &&  
    <Routes>
      <Route path="/dashboard/*" element={<Dashboard />} />
      {/* <Route path="/dashboard/ticket-booking/:id" element={<Dashboard />} /> */}
      <Route path="/auth/*" element={<Auth />} />
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
    </Routes>}
    {user==="driver" &&  
    <Routes>
      <Route path="/dashboard/*" element={<Driver/>} />
      
    </Routes>}
    {user==="conductor" &&  <Routes>
      <Route path="/dashboard/*" element={<h1>conductor</h1>} />
     
      
    </Routes>}
   
    </UserProvider>
  );
}

export default App;
