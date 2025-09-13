import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLocation, useNavigate } from "react-router";

export function LoginDialog({ open }: { open: boolean }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Seems you are currently logged out?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Login to access all features on Detioscore
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => navigate("/")}>
            Keep viewing livescore
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              navigate("/signin", {
                state: { pathname },
              })
            }
          >
            Login
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
