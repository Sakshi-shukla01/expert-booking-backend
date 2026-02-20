import { useEffect, useState } from "react";
import { fetchExperts } from "../api/experts";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import Pagination from "../components/Pagination";
import ExpertCard from "../components/ExpertCard";

const CATEGORIES = ["", "Career", "Fitness", "Finance", "Mental Health"];

export default function ExpertsList() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        setLoading(true);
        setErr("");
        const res = await fetchExperts({ page, limit, search, category });
        if (!ignore) setData(res);
      } catch (e) {
        if (!ignore)
          setErr(e?.response?.data?.message || "Failed to load experts");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [page, limit, search, category]);

  return (
    <div className="container">
      <h1 className="h1">Experts</h1>

      {/* Filters */}
      <div className="panel row">
        <div className="grow">
          <input
            className="input"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>

        <div style={{ minWidth: 220 }}>
          <select
            className="select"
            value={category}
            onChange={(e) => {
              setPage(1);
              setCategory(e.target.value);
            }}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c || "All Categories"}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ height: 14 }} />

      {/* States */}
      {loading && (
        <div className="panel">
          <Loader />
        </div>
      )}

      {err && (
        <div className="panel">
          <ErrorState message={err} />
        </div>
      )}

      {/* Results */}
      {!loading && !err && data?.items?.length > 0 && (
        <div className="grid">
          {data.items.map((ex) => (
            <ExpertCard key={ex._id} expert={ex} />
          ))}
        </div>
      )}

      {!loading && !err && data?.items?.length === 0 && (
        <div className="panel muted">No experts found</div>
      )}

      {/* Pagination */}
      {!loading && !err && data && (
        <div style={{ marginTop: 14 }}>
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() =>
              setPage((p) => Math.min(data.totalPages || 1, p + 1))
            }
          />
        </div>
      )}
    </div>
  );
}