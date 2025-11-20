import { authApiClient } from "@/api-config";
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
import { Switch } from "@/components/ui/switch";
import type { User } from "@/types/user";
import { useMutation } from "@tanstack/react-query";
import { Loader, ShieldOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function SuspendDialog({ user }: { user: User }) {
  const [suspend, setSuspend] = useState(false);
  const [reason, setReason] = useState("");

  const mutation = useMutation({
    mutationFn: async (data: { suspended: boolean; reason: string }) => {
      const res = await authApiClient.patch(`/admin/${user._id}/suspend`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("User suspension updated successfully!");
    },
    onError: (error) => {
      toast.error("Something went wrong while updating the user.");
      console.error(error);
    },
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();

    mutation.mutate({
      suspended: suspend,
      reason,
    });
  };

  return (
    <Dialog>
      <form onSubmit={handleSubmit}>
        <DialogTrigger asChild className="cursor-pointer">
          <Button variant="outline" className="gap-2 bg-transparent">
            <ShieldOff className="h-4 w-4" />
            Suspend User
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Suspend User</DialogTitle>
            <DialogDescription>
              Change the user's suspension status and provide a reason.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-2">
            <div className="flex items-center justify-between border rounded-lg p-3">
              <Label htmlFor="suspend-switch" className="font-medium">
                Suspend User
              </Label>
              <Switch
                id="suspend-switch"
                checked={suspend}
                onCheckedChange={setSuspend}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="reason">Reason</Label>
              <Input
                id="reason"
                name="reason"
                placeholder="Enter suspension reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <div className="flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  Updating...
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
