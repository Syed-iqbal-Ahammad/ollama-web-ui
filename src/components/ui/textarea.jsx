import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    (<textarea
      className={cn(
        " resize-none outline-0  overflow-y-hidden  flex  w-full rounded-md  bg-transparent  px-2 py-2 text-sm  placeholder:text-muted-foreground   disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props} />)
  );
})
Textarea.displayName = "Textarea"

export { Textarea }
