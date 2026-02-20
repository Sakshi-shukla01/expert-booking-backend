import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { createBooking } from "../api/bookings";

function isEmail(x) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x);
}

export default function BookingForm() {
  const { expertId } = useParams();
  const nav = useNavigate();
  const loc = useLocation();

  const expert = loc.state?.expert;
  const selected = loc.state?.selected;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    notes: ""
  });

  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const payload = useMemo(() => {
    if (!selected) return null;
    return {
      expertId,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      date: selected.date,
      timeSlot: selected.timeSlot,
      notes: form.notes.trim()
    };
  }, [expertId, form, selected]);

  if (!selected) {
    return (
      <div className="container">
        <div className="panel">
          <div className="toast toastErr">
            No slot selected. Please go back to the expert page and choose a slot.
          </div>

          <div style={{ marginTop: 12 }}>
            <button className="btn btnPrimary" onClick={() => nav(`/experts/${expertId}`)}>
              Back to Expert
            </button>
          </div>
        </div>
      </div>
    );
  }

  const validate = () => {
    if (form.name.trim().length < 2) return "Name must be at least 2 characters";
    if (!isEmail(form.email.trim())) return "Enter a valid email";
    if (form.phone.trim().length < 8) return "Phone must be at least 8 digits";
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");

    const v = validate();
    if (v) return setErr(v);

    try {
      setSubmitting(true);
      const res = await createBooking(payload);
      setMsg(res.message || "Booking created");

      setTimeout(() => {
        nav(`/my-bookings?email=${encodeURIComponent(form.email.trim())}`);
      }, 700);
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <button className="btn btnGhost" onClick={() => nav(-1)}>
        ← Back
      </button>

      <h1 className="h1">Book Session</h1>

      {/* Summary */}
      <div className="panel" style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div className="cardTitle">{expert?.name || "Expert"}</div>
            <div style={{ marginTop: 6 }}>
              <span className="badge badgePurple">
                {expert?.category || "Category"}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <span className="badge">
              📅 {selected.date}
            </span>
            <span className="badge badgeGreen">
              ⏰ {selected.timeSlot}
            </span>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="panel">
        <h2 className="h2">Your details</h2>

        <form onSubmit={onSubmit} className="grid">
          <div className="row">
            <div className="grow">
              <label className="muted">Name</label>
              <input
                className="input"
                placeholder="Enter your name"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              />
            </div>

            <div className="grow">
              <label className="muted">Email</label>
              <input
                className="input"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              />
            </div>
          </div>

          <div className="row">
            <div className="grow">
              <label className="muted">Phone</label>
              <input
                className="input"
                placeholder="Enter phone number"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="muted">Notes (optional)</label>
            <textarea
              className="textarea"
              placeholder="Write your requirements (optional)"
              value={form.notes}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
            />
          </div>

          {/* Messages */}
          {err && <div className="toast toastErr">{err}</div>}
          {msg && <div className="toast toastOk">{msg}</div>}

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}>
            <button
              type="button"
              className="btn"
              onClick={() => nav(`/experts/${expertId}`)}
              disabled={submitting}
            >
              Change Slot
            </button>

            <button className="btn btnPrimary" disabled={submitting}>
              {submitting ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}