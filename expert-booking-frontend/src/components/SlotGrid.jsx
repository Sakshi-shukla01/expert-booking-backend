export default function SlotGrid({ date, slots, onSelect, selectedSlot }) {
  return (
    <div>
      <div className="cardTitle" style={{ marginBottom: 10 }}>
        {date}
      </div>

      {slots.length === 0 ? (
        <div className="muted">No slots available</div>
      ) : (
        <div className="slotWrap">
          {slots.map((t) => {
            const active =
              selectedSlot?.date === date && selectedSlot?.timeSlot === t;

            return (
              <button
                key={t}
                onClick={() => onSelect(date, t)}
                className={`slot ${active ? "slotActive" : ""}`}
                type="button"
              >
                {t}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}