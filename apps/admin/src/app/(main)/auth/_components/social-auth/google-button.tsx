import { Button } from "@spht/ui/button";
import { cn } from "@spht/utils";
import { siGoogle } from "simple-icons";

import { SimpleIcon } from "@/components/simple-icon";

export function GoogleButton({ className, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button variant="secondary" className={cn(className)} {...props}>
      <SimpleIcon icon={siGoogle} className="size-4" />
      Continue with Google
    </Button>
  );
}
