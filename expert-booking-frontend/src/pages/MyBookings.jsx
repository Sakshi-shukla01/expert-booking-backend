import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchBookingsByEmail } from "../api/bookings";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";

export default function MyBookings() {
  const [params, setParams] = useSearchParams();
  const initialEmail = params.get("email") || "";

  const [email, setEmail] = useState(initialEmail);
  const [queryEmail, setQueryEmail] = useState(initialEmail);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!queryEmail) return;

    let ignore = false;

    (async () => {
      try {
        setLoading(true);
        setErr("");
        const res = await fetchBookingsByEmail(queryEmail);
        if (!ignore) setItems(res.items || []);
      } catch (e) {
        if (!ignore)
          setErr(e?.response?.data?.message || "Failed to load bookings");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [queryEmail]);

  const onSearch = () => {
    const e = email.trim();
    setParams(e ? { email: e } : {});
    setQueryEmail(e);
  };

  const statusBadge = (status) => {
    if (status === "Confirmed") return "badge badgeGreen";
    if (status === "Completed") return "badge badgePurple";
    return "badge"; // Pending
  };

  return (
    <div className="container">
      <h1 className="h1">My Bookings</h1>

      {/* Search */}
      <div className="panel row" style={{ marginBottom: 14 }}>
        <div className="grow">
          <input
            className="input"
            placeholder="Enter your email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button className="btn btnPrimary" onClick={onSearch}>
          Search
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="panel">
          <Loader />
        </div>
      )}

      {/* Error */}
      {err && (
        <div className="panel">
          <ErrorState message={err} />
        </div>
      )}

      {/* Empty */}
      {!loading && !err && queryEmail && items.length === 0 && (
        <div className="panel muted">
          No bookings found for <b>{queryEmail}</b>
        </div>
      )}

      {/* Bookings List */}
      {!loading && !err && items.length > 0 && (
        <div className="grid">
          {items.map((b) => (
            <div key={b._id} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                
                <div>
                  <div className="cardTitle">
                    {b.expertId?.name || "Expert"}
                  </div>

                  <div style={{ marginTop: 6 }}>
                    <span className="badge badgePurple">
                      {b.expertId?.category || "Category"}
                    </span>
                  </div>

                  <div className="muted" style={{ marginTop: 8 }}>
                    📅 {b.date} &nbsp; ⏰ {b.timeSlot}
                  </div>

                  {b.notes && (
                    <div className="muted" style={{ marginTop: 6 }}>
                      Notes: {b.notes}
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                  <span className={statusBadge(b.status)}>
                    {b.status}
                  </span>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}