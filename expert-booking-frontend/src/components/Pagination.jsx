export default function Pagination({ page, totalPages, onPrev, onNext }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 16 }}>
      <button onClick={onPrev} disabled={page <= 1}>Prev</button>
      <span>Page {page} / {totalPages || 1}</span>
      <button onClick={onNext} disabled={page >= (totalPages || 1)}>Next</button>
    </div>
  );
}