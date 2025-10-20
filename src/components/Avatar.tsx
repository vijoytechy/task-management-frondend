// Avatar component to display user initials
export function Avatar({ name, size = 40 }: { name?: string; size?: number }) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  const fontSize = Math.max(12, size / 2.5); 

  return (
    <div
      className="rounded-full bg-indigo-600 text-white grid place-items-center select-none"
      style={{
        width: size,
        height: size,
        fontSize,
      }}
    >
      {initials}
    </div>
  );
}
