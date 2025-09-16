import { useEffect, useState } from "react";
import { LoginDialog } from "../auth/popup";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

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
      <Button onClick={() => authClient.signOut()}>Signout</Button>
      <LoginDialog open={open} />
    </div>
  );
}
