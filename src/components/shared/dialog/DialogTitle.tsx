import { Dialog } from "@headlessui/react";

interface DialogTitleProps extends React.ComponentPropsWithoutRef<
  typeof Dialog.Title
> {
  children: React.ReactNode;
  className?: string;
}

export function DialogTitle({
  children,
  className,
  ...props
}: DialogTitleProps) {
  return (
    <Dialog.Title
      as="h4"
      className={`mb-4 ${className ? ` ${className}` : ""}`}
      {...props}
    >
      {children}
    </Dialog.Title>
  );
}
