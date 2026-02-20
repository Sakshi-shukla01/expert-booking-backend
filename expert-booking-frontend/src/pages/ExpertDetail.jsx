import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchExpertDetail } from "../api/experts";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import SlotGrid from "../components/SlotGrid";
import { socket } from "../socket/socket";

export default function ExpertDetail() {
  const { id } = useParams();
  const nav = useNavigate();

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [expert, setExpert] = useState(null);
  const [available, setAvailable] = useState(null);
  const [selected, setSelected] = useState(null);

  // Load expert + availability
  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        setLoading(true);
        setErr("");
        const res = await fetchExpertDetail(id);
        if (ignore) return;
        setExpert(res.expert);
        setAvailable(res.availableSlotsByDate);
      } catch (e) {
        if (!ignore)
          setErr(e?.response?.data?.message || "Failed to load expert");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [id]);

  // Real-time slot updates
  useEffect(() => {
    if (!id) return;

    socket.emit("joinExpert", id);

    const onSlotBooked = (data) => {
      if (data.expertId !== id) return;

      setAvailable((prev) => {
        if (!prev) return prev;
        const { date, timeSlot } = data;
        const updated = (prev[date] || []).filter((t) => t !== timeSlot);
        return { ...prev, [date]: updated };
      });

      setSelected((sel) => {
        if (!sel) return sel;
        if (sel.date === data.date && sel.timeSlot === data.timeSlot) return null;
        return sel;
      });
    };

    socket.on("slotBooked", onSlotBooked);

    return () => {
      socket.off("slotBooked", onSlotBooked);
      socket.emit("leaveExpert", id);
    };
  }, [id]);

  const dates = useMemo(() => (available ? Object.keys(available) : []), [available]);

  const goToBooking = () => {
    if (!selected) return;
    nav(`/book/${id}`, { state: { expert, selected } });
  };

  return (
    <div className="container">
      <button className="btn btnGhost" onClick={() => nav(-1)}>
        ← Back
      </button>

      {loading && (
        <div className="panel" style={{ marginTop: 12 }}>
          <Loader />
        </div>
      )}

      {err && (
        <div className="panel" style={{ marginTop: 12 }}>
          <ErrorState message={err} />
        </div>
      )}

      {!loading && !err && expert && (
        <>
          {/* Expert header */}
          <div className="panel" style={{ marginTop: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
              <div>
                <h1 className="h1" style={{ marginBottom: 6 }}>{expert.name}</h1>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <span className="badge badgePurple">{expert.category}</span>
                  <span className="badge">⭐ {expert.rating}</span>
                  <span className="badge">Exp: {expert.experienceYears} yrs</span>
                </div>

                {expert.bio && (
                  <div className="muted" style={{ marginTop: 10, lineHeight: 1.5 }}>
                    {expert.bio}
                  </div>
                )}
              </div>

              {/* Selected slot summary */}
              <div style={{ minWidth: 260 }}>
                <div className="card" style={{ padding: 12 }}>
                  <div className="cardTitle">Selection</div>
                  <div className="muted" style={{ marginTop: 6 }}>
                    Pick a date & time to continue
                  </div>

                  <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <span className="badge">
                      📅 {selected?.date || "—"}
                    </span>
                    <span className={`badge ${selected ? "badgeGreen" : ""}`}>
                      ⏰ {selected?.timeSlot || "—"}
                    </span>
                  </div>

                  <button
                    className="btn btnPrimary"
                    onClick={goToBooking}
                    disabled={!selected}
                    style={{ width: "100%", marginTop: 12 }}
                  >
                    Continue to Booking
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Slots */}
          <div style={{ marginTop: 14 }}>
            <h2 className="h2">Available Slots</h2>

            {dates.length === 0 ? (
              <div className="panel muted">No availability found</div>
            ) : (
              <div className="grid">
                {dates.map((date) => (
                  <div key={date} className="card">
                    <SlotGrid
                      date={date}
                      slots={available[date] || []}
                      selectedSlot={selected}
                      onSelect={(d, t) => setSelected({ date: d, timeSlot: t })}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}