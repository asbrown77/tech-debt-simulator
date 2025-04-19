import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;

export const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
    <DialogPrimitive.Content
      ref={ref}
      {...props}
      className="fixed left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-6 shadow-md focus:outline-none"
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
DialogContent.displayName = "DialogContent";

export const DialogHeader = ({
    children,
    className,
    ...props
  }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={`mb-4 ${className ?? ''}`} {...props}>
      {children}
    </div>
  );
  
  export const DialogTitle = ({
    children,
    className,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className={`text-xl font-semibold ${className ?? ''}`} {...props}>
      {children}
    </h2>
  );
