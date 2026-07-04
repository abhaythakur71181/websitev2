/**
 * The single motion system: fade + 8px rise on paint, pure CSS.
 * Server-rendered content is never hidden behind hydration — the animation
 * is progressive enhancement and disabled under prefers-reduced-motion
 * (see globals.css). Zero client JavaScript.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={className ? `reveal ${className}` : "reveal"}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
