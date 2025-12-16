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
import { useMutation } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { toast } from "sonner";

export function DeactivateDialog({ competitionId }: { competitionId: string }) {
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await authApiClient.patch(
        `/admin/competition/deactivate/${competitionId}`
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Competition deactivated successfully!");
    },
    onError: (error) => {
      toast.error("Something went wrong while deactivating the competition.");
      console.error(error);
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Deactivate Competition</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
        >
          <DialogHeader>
            <DialogTitle>Deactivate Competition</DialogTitle>
            <DialogDescription>
              Deactivating this competition is permanent. Once deactivated, its
              status will be set to inactive and all winner payouts will be
              automatically calculated and processed. Do you want to proceed?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <div className="flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  Deactivating...
                </div>
              ) : (
                "Confirm"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
