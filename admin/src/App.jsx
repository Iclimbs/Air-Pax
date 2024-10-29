import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth, Driver } from "@/layouts";
import { UserProvider } from "./context/UserContext";
import { useState } from "react";
import Conductor from "./layouts/conductor";
import SelectSeat from "./pages/dashboard/selectSeat";

function App() {
  const [userRole, setUserRole] = useState("admin");

  const getRoutes = () => {
    switch (userRole) {
      case "admin":
        return (
          <>
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="/dashboard/tickets-booking/:id" element={<SelectSeat />} />
            <Route path="/auth/*" element={<Auth />} />
            <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
          </>
        );
      case "driver":
        return (
          <>
            <Route path="/driver/*" element={<Driver />} />
            <Route path="*" element={<Navigate to="/driver/home" replace />} />
          </>
        );
      case "conductor":
        return (
          <>
            <Route path="/conductor/*" element={<Conductor/>} />
            <Route path="*" element={<Navigate to="/conductor/home" replace />} />
          </>
        );
      default:
        return <Navigate to="/auth/login" replace />;
    }
  };

  return (
    <UserProvider>
      <Routes>{getRoutes()}</Routes>
    </UserProvider>
  );
}

export default App;
