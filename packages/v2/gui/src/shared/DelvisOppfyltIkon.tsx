export const DelvisOppfyltIkon = ({ className }: { className?: string }) => (
  <div
    className={`h-4 w-4 rounded-full -rotate-[135deg] border-solid border-[1px] border-ax-brand-blue-500 ${className}`}
    style={{
      background: 'linear-gradient(90deg, var(--ax-brand-blue-500) 50%, var(--ax-bg-default) 50%)',
    }}
  />
);
