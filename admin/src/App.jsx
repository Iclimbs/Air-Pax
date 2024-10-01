import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <UserProvider>
    <Routes>
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
    </Routes>
    </UserProvider>
  );
}

export default App;
