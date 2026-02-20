export default function ErrorState({ message }) {
  return (
    <div style={{ padding: 16, color: "crimson" }}>
      {message || "Something went wrong"}
    </div>
  );
}