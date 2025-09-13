import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { LoginDialog } from "../auth/popup";

export default function League() {
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
    <div className="h-full w-full flex justify-center items-center">
      League goes here
      <LoginDialog open={open} />
    </div>
  );
}
