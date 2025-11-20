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
import { Ban, Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function BanDialog({ user }: { user: User }) {
  const [banned, setBanned] = useState(false);
  const [reason, setReason] = useState("");

  const mutation = useMutation({
    mutationFn: async (data: { banned: boolean; reason: string }) => {
      const res = await authApiClient.patch(`/admin/${user._id}/ban`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("User ban status updated successfully!");
    },
    onError: (error) => {
      toast.error("Something went wrong while updating the ban status.");
      console.error(error);
    },
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    mutation.mutate({ banned, reason });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" className="gap-2">
          <Ban className="h-4 w-4" />
          Ban User
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Ban User</DialogTitle>
            <DialogDescription>
              Toggle the user's ban status and provide a reason.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-2">
            <div className="flex items-center justify-between border rounded-lg p-3">
              <Label htmlFor="ban-switch" className="font-medium">
                Ban User
              </Label>
              <Switch
                id="ban-switch"
                checked={banned}
                onCheckedChange={setBanned}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="reason">Reason</Label>
              <Input
                id="reason"
                name="reason"
                placeholder="Enter ban reason"
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
        </form>
      </DialogContent>
    </Dialog>
  );
}
