import { authApiClient } from "@/api-config";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/user";
import { useMutation } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { toast } from "sonner";

export function DeleteUserDialog({ user }: { user: User }) {
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await authApiClient.delete(`/admin/${user._id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("User has been delated successfully!");
    },
    onError: (error) => {
      toast.error("Something went wrong while deleting user data");
      console.error(error);
    },
  });
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="bg-red-700">Delete User</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            You are about to perform a dangerouse action
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action will delete user and related user data completely from
            database
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel action</AlertDialogCancel>
          <AlertDialogAction onClick={() => mutation.mutate()}>
            {mutation.isPending ? (
              <div className="flex items-center gap-2">
                <Loader className="w-4 h-4 animate-spin" />
                deleting...
              </div>
            ) : (
              "Complete action"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
