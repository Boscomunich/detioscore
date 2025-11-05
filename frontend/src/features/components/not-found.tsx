import { IconFolderCode } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function NotFound({
  title,
  message,
  refreshFn,
}: {
  title: string;
  message: string;
  refreshFn: () => void;
}) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconFolderCode />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{message}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={() => refreshFn()}>Refresh page</Button>
      </EmptyContent>
      {/* <Button
        variant="link"
        asChild
        className="text-muted-foreground"
        size="sm"
      >
        <a href="#">
          Learn More <ArrowUpRightIcon />
        </a>
      </Button> */}
    </Empty>
  );
}
