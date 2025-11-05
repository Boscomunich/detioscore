import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { LoginDialog } from "./auth/popup";

export default function AuthLayout() {
  const [open, setOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (isPending) return;

    //@ts-expect-error user country exist
    if (!isPending && session?.user?.country === "Unknown") {
      navigate("/select-country");
      return;
    }

    if (!session) {
      setOpen(true); // Show login dialog if not logged in
    } else {
      setOpen(false); // Hide login dialog if logged in
    }
  }, [session, isPending, navigate]);

  // If not logged in, show nothing (dialog will handle the auth)
  if (!session && !isPending) {
    return <LoginDialog open={open} />;
  }

  // If still loading, show nothing or a loader
  if (isPending) {
    return null;
  }

  // Only show the outlet if user is logged in
  return <Outlet />;
}
