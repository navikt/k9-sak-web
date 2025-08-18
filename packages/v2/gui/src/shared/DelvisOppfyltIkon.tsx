export const DelvisOppfyltIkon = ({ className }: { className?: string }) => (
  <div
    className={`h-4 w-4 rounded-full -rotate-[135deg] border-solid border-[1px] border-ax-success-600 ${className}`}
    style={{
      background: 'linear-gradient(90deg, var(--ax-success-600) 50%, var(--ax-bg-default) 50%)',
    }}
  />
);
