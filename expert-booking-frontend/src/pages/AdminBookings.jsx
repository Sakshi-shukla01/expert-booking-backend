import { useEffect, useMemo, useState } from "react";
import { fetchAllBookings, updateBookingStatus } from "../api/bookings";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";

const STATUSES = ["All", "Pending", "Confirmed", "Completed"];

export default function AdminBookings() {
  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  // Admin filters
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  const statusBadge = (status) => {
    if (status === "Confirmed") return "badge badgeGreen";
    if (status === "Completed") return "badge badgePurple";
    return "badge"; // Pending
  };

  const loadAll = async () => {
    try {
      setErr("");
      setMsg("");
      setLoading(true);
      const res = await fetchAllBookings();
      setItems(res.items || []);
      if ((res.items || []).length === 0) setMsg("No bookings found");
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  // ✅ auto load on page open
  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredItems = useMemo(() => {
    let list = [...items];

    // Filter by status
    if (statusFilter !== "All") {
      list = list.filter((b) => b.status === statusFilter);
    }

    // Search inside admin list (name/email/phone/expert)
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((b) => {
        const user = `${b.name || ""} ${b.email || ""} ${b.phone || ""}`.toLowerCase();
        const expert = `${b.expertId?.name || ""} ${b.expertId?.category || ""}`.toLowerCase();
        return user.includes(q) || expert.includes(q) || String(b._id).toLowerCase().includes(q);
      });
    }

    return list;
  }, [items, statusFilter, search]);

  const onChangeStatus = async (bookingId, newStatus) => {
    try {
      setErr("");
      setMsg("");
      setUpdatingId(bookingId);

      await updateBookingStatus(bookingId, newStatus);

      // update locally
      setItems((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
      );

      setMsg(`Status updated to ${newStatus}`);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="container">
      <h1 className="h1">Admin Panel</h1>

      {/* Controls */}
      <div className="panel row" style={{ marginBottom: 14 }}>
        <div className="grow">
          <input
            className="input"
            placeholder="Search by user / phone / email / expert / bookingId..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ minWidth: 220 }}>
          <select
            className="select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === "All" ? "All Status" : s}
              </option>
            ))}
          </select>
        </div>

        <button className="btn btnPrimary" onClick={loadAll} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
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

      {/* Message */}
      {msg && !err && (
        <div className="panel">
          <div className="toast toastOk">{msg}</div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !err && filteredItems.length === 0 && (
        <div className="panel muted">No bookings match your filters.</div>
      )}

      {/* List */}
      {!loading && !err && filteredItems.length > 0 && (
        <div className="grid">
          {filteredItems.map((b) => (
            <div key={b._id} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <div className="cardTitle">
                    {b.expertId?.name || "Expert"}{" "}
                    <span className="muted">({b.expertId?.category || "Category"})</span>
                  </div>

                  <div className="muted" style={{ marginTop: 8 }}>
                    📅 {b.date} &nbsp; ⏰ {b.timeSlot}
                  </div>

                  <div className="muted" style={{ marginTop: 6 }}>
                    👤 {b.name} • {b.email} • {b.phone}
                  </div>

                  <div className="muted" style={{ marginTop: 6 }}>
                    Booking ID: {b._id}
                  </div>

                  {b.notes && (
                    <div className="muted" style={{ marginTop: 6 }}>
                      Notes: {b.notes}
                    </div>
                  )}

                  <div style={{ marginTop: 10 }}>
                    <span className={statusBadge(b.status)}>{b.status}</span>
                  </div>
                </div>

                <div style={{ minWidth: 220 }}>
                  <div className="muted" style={{ marginBottom: 6 }}>
                    Update Status
                  </div>

                  <select
                    className="select"
                    value={b.status}
                    onChange={(e) => onChangeStatus(b._id, e.target.value)}
                    disabled={updatingId === b._id}
                  >
                    {["Pending", "Confirmed", "Completed"].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>

                  {updatingId === b._id && (
                    <div className="muted" style={{ marginTop: 8 }}>
                      Updating...
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="muted" style={{ marginTop: 16 }}>
        Admin page 
      </div>
    </div>
  );
}