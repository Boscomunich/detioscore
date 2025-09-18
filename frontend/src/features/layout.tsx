import { Outlet } from "react-router";
import Navbar from "./components/navbar";
import BottomTabs from "./components/bottom-tabs";

export default function AppLayout() {
  return (
    <div>
      <Navbar />
      <div className="pt-20 md:pt-36 pb-20 md:pb-0">
        <Outlet />
      </div>
      <BottomTabs />
    </div>
  );
}
