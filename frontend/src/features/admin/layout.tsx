import { Outlet, useNavigate } from "react-router";
import { Sidebar } from "./components/sidebar";
import AdminNav from "./components/navbar";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { LoginDialog } from "../auth/popup";

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  console.log(user);

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      setOpen(true);
      //@ts-expect-error user role exist
    } else if (user?.role !== "admin") {
      navigate(-1);
    } else {
      setOpen(false);
    }
  }, [session, isPending, user, navigate]);
  return (
    <div>
      <AdminNav />
      <div className="fixed hidden md:block left-0 w-64 top-0 h-full">
        <Sidebar />
      </div>
      <div className="w-[90%] mx-auto md:pl-64 mb-10 mt-10 lg:mt-0">
        <Outlet />
      </div>
      <LoginDialog open={open} />
    </div>
  );
}
