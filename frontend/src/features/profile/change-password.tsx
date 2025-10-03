import { useState } from "react";
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
import { toast } from "sonner";

export function ChangePasswordDialog() {
  const [previousPassword, setPreviousPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    await authClient.changePassword(
      {
        newPassword,
        currentPassword: previousPassword,
        revokeOtherSessions: true,
      },
      {
        onRequest: () => setIsLoading(true),
        onSuccess: () => {
          setIsLoading(false);
          toast.success("Your password has been changed successfully!");
          setPreviousPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
        onError: (ctx) => {
          setIsLoading(false);
          toast.error(ctx.error.message || "Failed to change password");
        },
      }
    );
  }

  return (
    <Dialog>
      <form onSubmit={handleChangePassword}>
        <DialogTrigger asChild className="cursor-pointer">
          <div className="text-base font-semibold">Change password</div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Update your account password. Make sure to choose a strong one.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="previous-password">Previous Password</Label>
              <Input
                id="previous-password"
                type="text"
                value={previousPassword}
                onChange={(e) => setPreviousPassword(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="text"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center">
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                  Saving...
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
