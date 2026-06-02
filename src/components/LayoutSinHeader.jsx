// src/layouts/LayoutSinHeader.jsx
import { Outlet } from "react-router-dom";

export default function LayoutSinHeader() {
  return (
    <div className="full-page">
      <Outlet />
    </div>
  );
}
