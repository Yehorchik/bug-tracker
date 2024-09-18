import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import routePaths from "./routePath";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Navigate to={routePaths.login} replace />} />
        <Route path={routePaths.login} element={<Login />} />
        <Route path={routePaths.register} element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
