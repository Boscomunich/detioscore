import { useEffect, useState } from "react";
import { LoginDialog } from "../auth/popup";
import { authClient } from "@/lib/auth-client";

export default function Profile() {
  const [open, setOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [session, isPending]);

  return (
    <div className="h-full w-full flex justify-center items-center max-w-3xl px-4 border rounded-sm my-2 pb-6">
      Profile goes here
      <LoginDialog open={open} />
    </div>
  );
}
