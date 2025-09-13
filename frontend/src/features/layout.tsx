import { Outlet } from "react-router";
import Navbar from "./components/navbar";
import BottomTabs from "./components/bottom-tabs";

export default function AppLayout() {
  return (
    <div>
      <Navbar />
      <div className="pt-36">
        <Outlet />
      </div>
      <BottomTabs />
    </div>
  );
}
