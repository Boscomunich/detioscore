import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ChangeUsernameDialog() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = authClient.useSession();
  const user = session?.user;

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild className="cursor-pointer">
          <div className="text-base font-semibold py-4">Change username</div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="username-1">Username</Label>
              <Input
                onChange={(e) => setUsername(e.target.value)}
                id="username-1"
                name="username"
                defaultValue={user?.name}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              onClick={async () => {
                await authClient.updateUser(
                  {
                    name: username,
                  },
                  {
                    onRequest: () => setIsLoading(true),
                    onSuccess: async () => {
                      setIsLoading(false);
                      toast.success(
                        "your profile has been updated successfully!"
                      );
                    },
                    onError: (ctx) => {
                      setIsLoading(false);
                      toast.error(ctx.error.message);
                    },
                  }
                );
              }}
            >
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <Loader className="w-8 h-8 animate-spin text-white" />
                </div>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
