// Each dot jumps when the previous one reaches the top, so the jump runs from left to right.
// The first jump waits 350ms, until the bubble shows up.
const DOT_DELAYS = ["0.35s", "0.59s", "0.83s"];

// Shown in place of the assistant answer until its first token arrives
export default function ThinkingDots() {
  return (
    <div className="flex justify-start pl-4">
      <div
        role="status"
        aria-label="AI is thinking"
        className="flex items-center gap-1 rounded-lg bg-chat-assistant px-3 py-3 animate-thinking-appear"
      >
        {DOT_DELAYS.map((delay) => (
          <span
            key={delay}
            className="size-1.5 rounded-full bg-text-muted animate-thinking-dot"
            style={{ animationDelay: delay }}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}
