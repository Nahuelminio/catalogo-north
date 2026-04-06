// src/layouts/LayoutL.jsx
import { Outlet } from "react-router-dom";

export default function LayoutsL() {
  return (
    <div className="full-page">
      <Outlet />
    </div>
  );
}
